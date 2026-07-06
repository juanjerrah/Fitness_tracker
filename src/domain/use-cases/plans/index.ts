import type { IPlanRepository, PlanExerciseInput } from '@/domain/repositories';
import { validatePlanExercises } from '@/domain/use-cases/plans/validatePlanExercises';

export class CreatePlanUseCase {
  constructor(private readonly planRepository: IPlanRepository) {}

  execute(name: string, exercises: PlanExerciseInput[]) {
    validatePlanExercises(exercises);
    return this.planRepository.create(name, exercises);
  }
}

export class UpdatePlanUseCase {
  constructor(private readonly planRepository: IPlanRepository) {}

  execute(planId: string, name: string, exercises: PlanExerciseInput[]) {
    validatePlanExercises(exercises);
    return this.planRepository.update(planId, name, exercises);
  }
}

export class ArchivePlanUseCase {
  constructor(private readonly planRepository: IPlanRepository) {}

  execute(planId: string) {
    return this.planRepository.archive(planId);
  }
}

export class DuplicatePlanUseCase {
  constructor(private readonly planRepository: IPlanRepository) {}

  execute(planId: string) {
    return this.planRepository.duplicate(planId);
  }
}

export class ListActivePlansUseCase {
  constructor(private readonly planRepository: IPlanRepository) {}

  execute() {
    return this.planRepository.listActive();
  }
}
