import { and, asc, eq, gte, isNotNull, lte } from 'drizzle-orm';

import type { AppDatabase } from '@/data/db/client';
import {
  sessionExercises,
  setLogs,
  workoutSessions,
} from '@/data/db/schema';
import type {
  ISessionRepository,
  SessionExerciseWithLogs,
  WorkoutPlanWithExercises,
  WorkoutSessionDetail,
} from '@/domain/repositories';
import { createId } from '@/lib/id';

async function loadSessionDetail(
  db: AppDatabase,
  sessionId: string,
): Promise<WorkoutSessionDetail | null> {
  const sessions = await db
    .select()
    .from(workoutSessions)
    .where(eq(workoutSessions.id, sessionId))
    .limit(1);

  const session = sessions[0];
  if (!session) {
    return null;
  }

  const exerciseRows = await db
    .select()
    .from(sessionExercises)
    .where(eq(sessionExercises.sessionId, sessionId))
    .orderBy(asc(sessionExercises.sortOrder));

  const exercises: SessionExerciseWithLogs[] = [];
  for (const exercise of exerciseRows) {
    const sets = await db
      .select()
      .from(setLogs)
      .where(eq(setLogs.sessionExerciseId, exercise.id))
      .orderBy(asc(setLogs.setNumber));

    exercises.push({
      id: exercise.id,
      sessionId: exercise.sessionId,
      exerciseId: exercise.exerciseId,
      exerciseNameSnapshot: exercise.exerciseNameSnapshot,
      sortOrder: exercise.sortOrder,
      plannedSets: exercise.plannedSets,
      repMin: exercise.repMin,
      repMax: exercise.repMax,
      restSeconds: exercise.restSeconds,
      isCompleted: exercise.isCompleted,
      sets: sets.map((set) => ({
        id: set.id,
        sessionExerciseId: set.sessionExerciseId,
        setNumber: set.setNumber,
        reps: set.reps,
        loadKg: set.loadKg,
        completedAt: set.completedAt,
      })),
    });
  }

  return {
    id: session.id,
    planId: session.planId,
    planNameSnapshot: session.planNameSnapshot,
    status: session.status as WorkoutSessionDetail['status'],
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    exercises,
  };
}

export class SessionRepository implements ISessionRepository {
  constructor(private readonly db: AppDatabase) {}

  async startFromPlan(
    plan: WorkoutPlanWithExercises,
    exerciseNames: Map<string, string>,
  ): Promise<WorkoutSessionDetail> {
    const active = await this.getActive();
    if (active) {
      throw new Error('An active session already exists');
    }

    const sessionId = createId();
    const startedAt = new Date().toISOString();

    const sessionRow = {
      id: sessionId,
      planId: plan.id,
      planNameSnapshot: plan.name,
      status: 'in_progress' as const,
      startedAt,
      completedAt: null,
    };

    const sessionExerciseRows = plan.exercises.map((item) => ({
      id: createId(),
      sessionId,
      exerciseId: item.exerciseId,
      exerciseNameSnapshot:
        exerciseNames.get(item.exerciseId) ?? item.exerciseId,
      sortOrder: item.sortOrder,
      plannedSets: item.plannedSets,
      repMin: item.repMin,
      repMax: item.repMax,
      restSeconds: item.restSeconds,
      isCompleted: false,
    }));

    await this.db.transaction(async (tx) => {
      await tx.insert(workoutSessions).values(sessionRow);
      if (sessionExerciseRows.length > 0) {
        await tx.insert(sessionExercises).values(sessionExerciseRows);
      }
    });

    const loaded = await loadSessionDetail(this.db, sessionId);
    if (!loaded) {
      throw new Error('Failed to start session');
    }
    return loaded;
  }

  async getActive(): Promise<WorkoutSessionDetail | null> {
    const sessions = await this.db
      .select()
      .from(workoutSessions)
      .where(eq(workoutSessions.status, 'in_progress'))
      .limit(1);

    const session = sessions[0];
    if (!session) {
      return null;
    }

    return loadSessionDetail(this.db, session.id);
  }

  async getById(sessionId: string): Promise<WorkoutSessionDetail | null> {
    return loadSessionDetail(this.db, sessionId);
  }

  async logSet(input: {
    sessionExerciseId: string;
    setNumber: number;
    reps: number;
    loadKg: number;
    completedAt: string;
  }): Promise<SessionExerciseWithLogs['sets'][number]> {
    const row = {
      id: createId(),
      sessionExerciseId: input.sessionExerciseId,
      setNumber: input.setNumber,
      reps: input.reps,
      loadKg: input.loadKg,
      completedAt: input.completedAt,
    };

    await this.db.insert(setLogs).values(row);
    return row;
  }

  async completeExercise(sessionExerciseId: string): Promise<void> {
    await this.db
      .update(sessionExercises)
      .set({ isCompleted: true })
      .where(eq(sessionExercises.id, sessionExerciseId));
  }

  async completeSession(sessionId: string, completedAt: string): Promise<WorkoutSessionDetail> {
    await this.db
      .update(workoutSessions)
      .set({ status: 'completed', completedAt })
      .where(eq(workoutSessions.id, sessionId));

    const loaded = await loadSessionDetail(this.db, sessionId);
    if (!loaded) {
      throw new Error('Session not found after completion');
    }
    return loaded;
  }

  async listCompletedByDateRange(
    fromIso: string,
    toIso: string,
  ): Promise<WorkoutSessionDetail[]> {
    const sessions = await this.db
      .select()
      .from(workoutSessions)
      .where(
        and(
          eq(workoutSessions.status, 'completed'),
          isNotNull(workoutSessions.completedAt),
          gte(workoutSessions.completedAt, fromIso),
          lte(workoutSessions.completedAt, toIso),
        ),
      )
      .orderBy(asc(workoutSessions.completedAt));

    const result: WorkoutSessionDetail[] = [];
    for (const session of sessions) {
      const detail = await loadSessionDetail(this.db, session.id);
      if (detail) {
        result.push(detail);
      }
    }
    return result;
  }
}
