import { and, asc, eq, gte, lte } from 'drizzle-orm';

import type { AppDatabase } from '@/data/db/client';
import { sessionExercises, setLogs, workoutSessions } from '@/data/db/schema';
import { calculateSetVolume } from '@/domain/volume';
import type {
  IAnalyticsRepository,
  LoadHistoryPoint,
  PersonalRecord,
  WeeklyVolumePoint,
} from '@/domain/repositories';
import { toLocalDateKey } from '@/lib/dates';

export class AnalyticsRepository implements IAnalyticsRepository {
  constructor(private readonly db: AppDatabase) {}

  async getLoadHistory(
    exerciseId: string,
    fromIso?: string,
    toIso?: string,
  ): Promise<LoadHistoryPoint[]> {
    const conditions = [eq(sessionExercises.exerciseId, exerciseId)];

    if (fromIso) {
      conditions.push(gte(setLogs.completedAt, fromIso));
    }
    if (toIso) {
      conditions.push(lte(setLogs.completedAt, toIso));
    }

    const rows = await this.db
      .select({
        completedAt: setLogs.completedAt,
        loadKg: setLogs.loadKg,
        reps: setLogs.reps,
      })
      .from(setLogs)
      .innerJoin(sessionExercises, eq(setLogs.sessionExerciseId, sessionExercises.id))
      .innerJoin(workoutSessions, eq(sessionExercises.sessionId, workoutSessions.id))
      .where(and(eq(workoutSessions.status, 'completed'), ...conditions))
      .orderBy(asc(setLogs.completedAt));

    return rows.map((row) => ({
      completedAt: row.completedAt,
      loadKg: row.loadKg,
      reps: row.reps,
      volume: calculateSetVolume(row.reps, row.loadKg),
    }));
  }

  async getWeeklyVolume(fromIso: string, toIso: string): Promise<WeeklyVolumePoint[]> {
    const rows = await this.db
      .select({
        completedAt: setLogs.completedAt,
        reps: setLogs.reps,
        loadKg: setLogs.loadKg,
      })
      .from(setLogs)
      .innerJoin(sessionExercises, eq(setLogs.sessionExerciseId, sessionExercises.id))
      .innerJoin(workoutSessions, eq(sessionExercises.sessionId, workoutSessions.id))
      .where(
        and(
          eq(workoutSessions.status, 'completed'),
          gte(setLogs.completedAt, fromIso),
          lte(setLogs.completedAt, toIso),
        ),
      )
      .orderBy(asc(setLogs.completedAt));

    const weeklyTotals = new Map<string, number>();
    for (const row of rows) {
      const dateKey = toLocalDateKey(row.completedAt);
      const weekStart = getWeekStart(dateKey);
      const volume = calculateSetVolume(row.reps, row.loadKg);
      weeklyTotals.set(weekStart, (weeklyTotals.get(weekStart) ?? 0) + volume);
    }

    return Array.from(weeklyTotals.entries())
      .map(([weekStart, totalVolume]) => ({ weekStart, totalVolume }))
      .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  }

  async getPersonalRecords(exerciseId?: string): Promise<PersonalRecord[]> {
    const exerciseFilter = exerciseId
      ? eq(sessionExercises.exerciseId, exerciseId)
      : undefined;

    const rows = await this.db
      .select({
        exerciseId: sessionExercises.exerciseId,
        loadKg: setLogs.loadKg,
        reps: setLogs.reps,
        completedAt: setLogs.completedAt,
      })
      .from(setLogs)
      .innerJoin(sessionExercises, eq(setLogs.sessionExerciseId, sessionExercises.id))
      .innerJoin(workoutSessions, eq(sessionExercises.sessionId, workoutSessions.id))
      .where(
        and(
          eq(workoutSessions.status, 'completed'),
          exerciseFilter,
        ),
      );

    const byExercise = new Map<string, PersonalRecord>();

    for (const row of rows) {
      const volume = calculateSetVolume(row.reps, row.loadKg);
      const current = byExercise.get(row.exerciseId) ?? {
        exerciseId: row.exerciseId,
        bestLoadKg: 0,
        bestLoadAt: null,
        bestVolume: 0,
        bestVolumeAt: null,
      };

      if (row.loadKg > current.bestLoadKg) {
        current.bestLoadKg = row.loadKg;
        current.bestLoadAt = row.completedAt;
      }

      if (volume > current.bestVolume) {
        current.bestVolume = volume;
        current.bestVolumeAt = row.completedAt;
      }

      byExercise.set(row.exerciseId, current);
    }

    return Array.from(byExercise.values()).sort((a, b) =>
      a.exerciseId.localeCompare(b.exerciseId),
    );
  }
}

/** Monday-based week start for a YYYY-MM-DD date key. */
function getWeekStart(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + diff);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
