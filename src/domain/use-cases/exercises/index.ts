import type { Exercise, MuscleGroup } from '@/domain/entities';
import type { IExerciseRepository } from '@/domain/repositories';
import { ValidationError } from '@/domain/errors/ValidationError';
import { MUSCLE_GROUPS } from '@/domain/entities/types';

export class ListExercisesByGroupUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  execute(muscleGroup: MuscleGroup): Promise<Exercise[]> {
    if (!MUSCLE_GROUPS.includes(muscleGroup)) {
      throw new ValidationError(`Invalid muscle group: ${muscleGroup}`);
    }
    return this.exerciseRepository.listByMuscleGroup(muscleGroup);
  }
}

export class SearchExercisesUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  execute(query: string): Promise<Exercise[]> {
    return this.exerciseRepository.search(query);
  }
}

export class CreateCustomExerciseUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  execute(input: { name: string; muscleGroup: MuscleGroup }): Promise<Exercise> {
    const name = input.name.trim();
    if (!name) {
      throw new ValidationError('Exercise name is required');
    }
    if (!MUSCLE_GROUPS.includes(input.muscleGroup)) {
      throw new ValidationError(`Invalid muscle group: ${input.muscleGroup}`);
    }
    return this.exerciseRepository.createCustom({ name, muscleGroup: input.muscleGroup });
  }
}

export class SeedExercisesOnFirstLaunchUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  execute(seedRows: Exercise[]): Promise<number> {
    return this.exerciseRepository.insertSeedIfEmpty(seedRows);
  }
}
