import { asc, eq } from 'drizzle-orm';

import type { AppDatabase } from '@/data/db/client';
import { planExercises, workoutPlans } from '@/data/db/schema';
import type {
  IPlanRepository,
  PlanExerciseInput,
  WorkoutPlanWithExercises,
} from '@/domain/repositories';
import { createId } from '@/lib/id';

function mapPlanWithExercises(
  plan: typeof workoutPlans.$inferSelect,
  exerciseRows: (typeof planExercises.$inferSelect)[],
): WorkoutPlanWithExercises {
  return {
    id: plan.id,
    name: plan.name,
    status: plan.status as WorkoutPlanWithExercises['status'],
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
    exercises: exerciseRows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((row) => ({
        id: row.id,
        planId: row.planId,
        exerciseId: row.exerciseId,
        sortOrder: row.sortOrder,
        plannedSets: row.plannedSets,
        repMin: row.repMin,
        repMax: row.repMax,
        restSeconds: row.restSeconds,
      })),
  };
}

export class PlanRepository implements IPlanRepository {
  constructor(private readonly db: AppDatabase) {}

  private async loadPlan(planId: string): Promise<WorkoutPlanWithExercises | null> {
    const plans = await this.db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.id, planId))
      .limit(1);

    const plan = plans[0];
    if (!plan) {
      return null;
    }

    const exerciseRows = await this.db
      .select()
      .from(planExercises)
      .where(eq(planExercises.planId, planId))
      .orderBy(asc(planExercises.sortOrder));

    return mapPlanWithExercises(plan, exerciseRows);
  }

  async create(name: string, exercisesInput: PlanExerciseInput[]): Promise<WorkoutPlanWithExercises> {
    const now = new Date().toISOString();
    const planId = createId();
    const planRow = {
      id: planId,
      name: name.trim(),
      status: 'active' as const,
      createdAt: now,
      updatedAt: now,
    };

    const exerciseRows = exercisesInput.map((item) => ({
      id: createId(),
      planId,
      exerciseId: item.exerciseId,
      sortOrder: item.sortOrder,
      plannedSets: item.plannedSets,
      repMin: item.repMin,
      repMax: item.repMax,
      restSeconds: item.restSeconds,
    }));

    await this.db.transaction(async (tx) => {
      await tx.insert(workoutPlans).values(planRow);
      if (exerciseRows.length > 0) {
        await tx.insert(planExercises).values(exerciseRows);
      }
    });

    const loaded = await this.loadPlan(planId);
    if (!loaded) {
      throw new Error('Failed to create plan');
    }
    return loaded;
  }

  async update(
    planId: string,
    name: string,
    exercisesInput: PlanExerciseInput[],
  ): Promise<WorkoutPlanWithExercises> {
    const now = new Date().toISOString();
    const exerciseRows = exercisesInput.map((item) => ({
      id: createId(),
      planId,
      exerciseId: item.exerciseId,
      sortOrder: item.sortOrder,
      plannedSets: item.plannedSets,
      repMin: item.repMin,
      repMax: item.repMax,
      restSeconds: item.restSeconds,
    }));

    await this.db.transaction(async (tx) => {
      await tx
        .update(workoutPlans)
        .set({ name: name.trim(), updatedAt: now })
        .where(eq(workoutPlans.id, planId));

      await tx.delete(planExercises).where(eq(planExercises.planId, planId));

      if (exerciseRows.length > 0) {
        await tx.insert(planExercises).values(exerciseRows);
      }
    });

    const loaded = await this.loadPlan(planId);
    if (!loaded) {
      throw new Error('Plan not found after update');
    }
    return loaded;
  }

  async archive(planId: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db
      .update(workoutPlans)
      .set({ status: 'archived', updatedAt: now })
      .where(eq(workoutPlans.id, planId));
  }

  async duplicate(planId: string): Promise<WorkoutPlanWithExercises> {
    const source = await this.loadPlan(planId);
    if (!source) {
      throw new Error('Plan not found');
    }

    return this.create(`${source.name} (copy)`, source.exercises);
  }

  async listActive(): Promise<WorkoutPlanWithExercises[]> {
    const plans = await this.db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.status, 'active'))
      .orderBy(asc(workoutPlans.name));

    const result: WorkoutPlanWithExercises[] = [];
    for (const plan of plans) {
      const exerciseRows = await this.db
        .select()
        .from(planExercises)
        .where(eq(planExercises.planId, plan.id))
        .orderBy(asc(planExercises.sortOrder));
      result.push(mapPlanWithExercises(plan, exerciseRows));
    }
    return result;
  }

  async getWithExercises(planId: string): Promise<WorkoutPlanWithExercises | null> {
    return this.loadPlan(planId);
  }
}
