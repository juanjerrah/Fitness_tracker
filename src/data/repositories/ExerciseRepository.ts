import { and, asc, eq, isNull, like, or } from 'drizzle-orm';

import type { AppDatabase } from '@/data/db/client';
import { exercises } from '@/data/db/schema';
import { mapExerciseRow } from '@/data/mappers';
import type { Exercise, MuscleGroup } from '@/domain/entities';
import type { IExerciseRepository } from '@/domain/repositories';
import { createId } from '@/lib/id';

export class ExerciseRepository implements IExerciseRepository {
  constructor(private readonly db: AppDatabase) {}

  async listByMuscleGroup(muscleGroup: MuscleGroup): Promise<Exercise[]> {
    const rows = await this.db
      .select()
      .from(exercises)
      .where(and(eq(exercises.muscleGroup, muscleGroup), isNull(exercises.deletedAt)))
      .orderBy(asc(exercises.nameKey), asc(exercises.customName));

    return rows.map(mapExerciseRow);
  }

  async search(query: string): Promise<Exercise[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      const rows = await this.db
        .select()
        .from(exercises)
        .where(isNull(exercises.deletedAt))
        .orderBy(asc(exercises.muscleGroup));
      return rows.map(mapExerciseRow);
    }

    const pattern = `%${normalized}%`;
    const rows = await this.db
      .select()
      .from(exercises)
      .where(
        and(
          isNull(exercises.deletedAt),
          or(like(exercises.customName, pattern), like(exercises.nameKey, pattern)),
        ),
      )
      .orderBy(asc(exercises.muscleGroup));

    return rows.map(mapExerciseRow);
  }

  async getById(id: string): Promise<Exercise | null> {
    const rows = await this.db
      .select()
      .from(exercises)
      .where(and(eq(exercises.id, id), isNull(exercises.deletedAt)))
      .limit(1);

    const row = rows[0];
    return row ? mapExerciseRow(row) : null;
  }

  async createCustom(input: { name: string; muscleGroup: MuscleGroup }): Promise<Exercise> {
    const name = input.name.trim();
    if (!name) {
      throw new Error('Exercise name is required');
    }

    const row = {
      id: createId(),
      muscleGroup: input.muscleGroup,
      nameKey: null,
      customName: name,
      isCustom: true,
      deletedAt: null,
      createdAt: new Date().toISOString(),
    };

    await this.db.insert(exercises).values(row);
    return mapExerciseRow(row);
  }

  async insertSeedIfEmpty(rows: Exercise[]): Promise<number> {
    const existing = await this.db.select({ id: exercises.id }).from(exercises).limit(1);
    if (existing.length > 0) {
      return 0;
    }

    if (rows.length === 0) {
      return 0;
    }

    await this.db.insert(exercises).values(
      rows.map((row) => ({
        id: row.id,
        muscleGroup: row.muscleGroup,
        nameKey: row.nameKey,
        customName: row.customName,
        isCustom: row.isCustom,
        deletedAt: row.deletedAt,
        createdAt: row.createdAt,
      })),
    );

    return rows.length;
  }
}
