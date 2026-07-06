import type { PlanExerciseInput } from '@/domain/repositories';
import { ValidationError } from '@/domain/errors/ValidationError';

export function validatePlanExercises(exercises: PlanExerciseInput[]): void {
  if (exercises.length === 0) {
    throw new ValidationError('Plan must have at least one exercise');
  }

  for (const exercise of exercises) {
    if (exercise.plannedSets < 1) {
      throw new ValidationError('Planned sets must be >= 1');
    }
    if (exercise.repMin > exercise.repMax) {
      throw new ValidationError('repMin must be <= repMax');
    }
    if (exercise.restSeconds < 0) {
      throw new ValidationError('Rest seconds must be >= 0');
    }
  }
}
