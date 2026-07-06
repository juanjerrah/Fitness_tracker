import type { Exercise } from '@/domain/entities';
import type { MuscleGroup } from '@/domain/entities/types';

import seedDefinitions from './exercises.json';

const SEED_CREATED_AT = '2026-01-01T00:00:00.000Z';

type SeedExerciseDefinition = {
  id: string;
  muscleGroup: MuscleGroup;
  nameKey: string;
};

export function buildSeedExercises(): Exercise[] {
  return (seedDefinitions as SeedExerciseDefinition[]).map((item) => ({
    id: item.id,
    muscleGroup: item.muscleGroup,
    nameKey: item.nameKey,
    customName: null,
    isCustom: false,
    deletedAt: null,
    createdAt: SEED_CREATED_AT,
  }));
}

export { seedDefinitions as seedExerciseDefinitions };
