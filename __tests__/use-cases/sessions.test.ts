import {
  CompleteSessionUseCase,
  LogSetUseCase,
  StartSessionUseCase,
  canCompleteSession,
} from '@/domain/use-cases/sessions';
import { ValidationError } from '@/domain/errors/ValidationError';
import type {
  IExerciseRepository,
  IPlanRepository,
  ISessionRepository,
  WorkoutPlanWithExercises,
  WorkoutSessionDetail,
} from '@/domain/repositories';

const samplePlan: WorkoutPlanWithExercises = {
  id: 'plan-1',
  name: 'Treino A',
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  exercises: [
    {
      id: 'pe-1',
      planId: 'plan-1',
      exerciseId: 'seed-chest-01',
      sortOrder: 0,
      plannedSets: 3,
      repMin: 8,
      repMax: 12,
      restSeconds: 90,
    },
  ],
};

describe('RN-01 — complete session only when all exercises done', () => {
  it('canCompleteSession returns false with pending exercises', () => {
    expect(
      canCompleteSession({
        exercises: [{ isCompleted: true }, { isCompleted: false }],
      }),
    ).toBe(false);
  });

  it('CompleteSessionUseCase rejects pending exercises', async () => {
    const session: WorkoutSessionDetail = {
      id: 'session-1',
      planId: 'plan-1',
      planNameSnapshot: 'Treino A',
      status: 'in_progress',
      startedAt: '2026-01-02T10:00:00.000Z',
      completedAt: null,
      exercises: [
        {
          id: 'se-1',
          sessionId: 'session-1',
          exerciseId: 'seed-chest-01',
          exerciseNameSnapshot: 'exercises.bench_press',
          sortOrder: 0,
          plannedSets: 3,
          repMin: 8,
          repMax: 12,
          restSeconds: 90,
          isCompleted: false,
          sets: [],
        },
      ],
    };

    const sessionRepository: ISessionRepository = {
      startFromPlan: jest.fn(),
      getActive: jest.fn(),
      getById: jest.fn(async () => session),
      logSet: jest.fn(),
      completeExercise: jest.fn(),
      completeSession: jest.fn(),
      listCompletedByDateRange: jest.fn(),
    };

    const useCase = new CompleteSessionUseCase(sessionRepository);
    await expect(useCase.execute('session-1')).rejects.toBeInstanceOf(ValidationError);
    expect(sessionRepository.completeSession).not.toHaveBeenCalled();
  });
});

describe('RN-03 — session snapshot from plan at start', () => {
  it('StartSessionUseCase copies plan exercises into session snapshot', async () => {
    const planRepository: IPlanRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      duplicate: jest.fn(),
      listActive: jest.fn(),
      getWithExercises: jest.fn(async () => samplePlan),
    };

    const exerciseRepository: IExerciseRepository = {
      listByMuscleGroup: jest.fn(),
      search: jest.fn(),
      getById: jest.fn(async () => ({
        id: 'seed-chest-01',
        muscleGroup: 'chest',
        nameKey: 'exercises.bench_press',
        customName: null,
        isCustom: false,
        deletedAt: null,
        createdAt: '2026-01-01T00:00:00.000Z',
      })),
      createCustom: jest.fn(),
      insertSeedIfEmpty: jest.fn(),
    };

    const sessionRepository: ISessionRepository = {
      startFromPlan: jest.fn(async (_plan, names) => ({
        id: 'session-1',
        planId: samplePlan.id,
        planNameSnapshot: samplePlan.name,
        status: 'in_progress',
        startedAt: '2026-01-02T10:00:00.000Z',
        completedAt: null,
        exercises: samplePlan.exercises.map((item) => ({
          id: 'se-1',
          sessionId: 'session-1',
          exerciseId: item.exerciseId,
          exerciseNameSnapshot: names.get(item.exerciseId) ?? item.exerciseId,
          sortOrder: item.sortOrder,
          plannedSets: item.plannedSets,
          repMin: item.repMin,
          repMax: item.repMax,
          restSeconds: item.restSeconds,
          isCompleted: false,
          sets: [],
        })),
      })),
      getActive: jest.fn(),
      getById: jest.fn(),
      logSet: jest.fn(),
      completeExercise: jest.fn(),
      completeSession: jest.fn(),
      listCompletedByDateRange: jest.fn(),
    };

    const useCase = new StartSessionUseCase(planRepository, sessionRepository, exerciseRepository);
    const session = await useCase.execute('plan-1');

    expect(session.planNameSnapshot).toBe('Treino A');
    expect(session.exercises[0].plannedSets).toBe(3);
    expect(session.exercises[0].exerciseNameSnapshot).toBe('exercises.bench_press');
    expect(sessionRepository.startFromPlan).toHaveBeenCalledWith(
      samplePlan,
      expect.any(Map),
    );
  });
});

describe('RN-05 — LogSetUseCase volume', () => {
  it('stores canonical kg and returns volume', async () => {
    const sessionRepository: ISessionRepository = {
      startFromPlan: jest.fn(),
      getActive: jest.fn(),
      getById: jest.fn(),
      logSet: jest.fn(async (input) => ({
        id: 'set-1',
        ...input,
      })),
      completeExercise: jest.fn(),
      completeSession: jest.fn(),
      listCompletedByDateRange: jest.fn(),
    };

    const useCase = new LogSetUseCase(sessionRepository);
    const result = await useCase.execute({
      sessionExerciseId: 'se-1',
      setNumber: 1,
      reps: 10,
      load: 100,
      unitSystem: 'metric',
    });

    expect(result.loadKg).toBe(100);
    expect(result.volume).toBe(1000);
    expect(sessionRepository.logSet).toHaveBeenCalledWith(
      expect.objectContaining({ loadKg: 100, reps: 10 }),
    );
  });

  it('converts lb input to kg', async () => {
    const sessionRepository: ISessionRepository = {
      startFromPlan: jest.fn(),
      getActive: jest.fn(),
      getById: jest.fn(),
      logSet: jest.fn(async (input) => ({
        id: 'set-1',
        ...input,
      })),
      completeExercise: jest.fn(),
      completeSession: jest.fn(),
      listCompletedByDateRange: jest.fn(),
    };

    const useCase = new LogSetUseCase(sessionRepository);
    const result = await useCase.execute({
      sessionExerciseId: 'se-1',
      setNumber: 1,
      reps: 5,
      load: 220,
      unitSystem: 'imperial',
    });

    expect(result.loadKg).toBeCloseTo(99.8, 1);
    expect(result.volume).toBeCloseTo(499, 0);
  });
});
