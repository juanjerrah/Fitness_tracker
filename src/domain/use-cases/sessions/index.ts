import type { Exercise } from '@/domain/entities';
import type { IExerciseRepository, IPlanRepository, ISessionRepository } from '@/domain/repositories';
import { ValidationError } from '@/domain/errors/ValidationError';
import { calculateSetVolume } from '@/domain/volume';
import type { UnitSystem } from '@/domain/entities/types';
import { toCanonicalLoadKg } from '@/lib/units';

function resolveExerciseName(exercise: Exercise): string {
  return exercise.isCustom ? (exercise.customName ?? exercise.id) : (exercise.nameKey ?? exercise.id);
}

export class StartSessionUseCase {
  constructor(
    private readonly planRepository: IPlanRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly exerciseRepository: IExerciseRepository,
  ) {}

  async execute(planId: string) {
    const plan = await this.planRepository.getWithExercises(planId);
    if (!plan) {
      throw new ValidationError('Plan not found');
    }
    if (plan.status === 'archived') {
      throw new ValidationError('Cannot start session from archived plan');
    }
    if (plan.exercises.length === 0) {
      throw new ValidationError('Plan has no exercises');
    }

    const exerciseNames = new Map<string, string>();
    for (const item of plan.exercises) {
      const exercise = await this.exerciseRepository.getById(item.exerciseId);
      if (!exercise) {
        throw new ValidationError(`Exercise not found: ${item.exerciseId}`);
      }
      exerciseNames.set(item.exerciseId, resolveExerciseName(exercise));
    }

    return this.sessionRepository.startFromPlan(plan, exerciseNames);
  }
}

export class GetActiveSessionUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  execute() {
    return this.sessionRepository.getActive();
  }
}

export type LogSetInput = {
  sessionExerciseId: string;
  setNumber: number;
  reps: number;
  load: number;
  unitSystem: UnitSystem;
};

export class LogSetUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(input: LogSetInput) {
    if (input.reps < 0) {
      throw new ValidationError('Reps must be >= 0');
    }
    if (input.load < 0) {
      throw new ValidationError('Load must be >= 0');
    }
    if (input.setNumber < 1) {
      throw new ValidationError('Set number must be >= 1');
    }

    const loadKg = toCanonicalLoadKg(input.load, input.unitSystem);
    const completedAt = new Date().toISOString();
    const setLog = await this.sessionRepository.logSet({
      sessionExerciseId: input.sessionExerciseId,
      setNumber: input.setNumber,
      reps: input.reps,
      loadKg,
      completedAt,
    });

    return {
      setLog,
      volume: calculateSetVolume(input.reps, loadKg),
      loadKg,
    };
  }
}

export class CompleteExerciseUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(sessionExerciseId: string) {
    await this.sessionRepository.completeExercise(sessionExerciseId);
  }
}

export class CompleteSessionUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(sessionId: string) {
    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new ValidationError('Session not found');
    }
    if (session.status === 'completed') {
      return session;
    }

    const pending = session.exercises.filter((exercise) => !exercise.isCompleted);
    if (pending.length > 0) {
      throw new ValidationError('All exercises must be completed before finishing the workout');
    }

    return this.sessionRepository.completeSession(sessionId, new Date().toISOString());
  }
}

export function canCompleteSession(session: {
  exercises: { isCompleted: boolean }[];
}): boolean {
  return session.exercises.every((exercise) => exercise.isCompleted);
}
