import { UpdatePlanUseCase } from '@/domain/use-cases/plans';
import type { IPlanRepository, ISessionRepository, WorkoutPlanWithExercises } from '@/domain/repositories';

describe('UpdatePlanUseCase — RN-03 history integrity', () => {
  it('updates plan without touching session repository', async () => {
    const originalPlan: WorkoutPlanWithExercises = {
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

    let updateCalled = false;
    const planRepository: IPlanRepository = {
      create: jest.fn(),
      update: jest.fn(async () => {
        updateCalled = true;
        return {
          ...originalPlan,
          name: 'Treino A v2',
          exercises: [
            {
              ...originalPlan.exercises[0],
              plannedSets: 4,
            },
          ],
        };
      }),
      archive: jest.fn(),
      duplicate: jest.fn(),
      listActive: jest.fn(),
      getWithExercises: jest.fn(),
    };

    const sessionRepository: ISessionRepository = {
      startFromPlan: jest.fn(),
      getActive: jest.fn(),
      getById: jest.fn(),
      logSet: jest.fn(),
      completeExercise: jest.fn(),
      completeSession: jest.fn(),
      listCompletedByDateRange: jest.fn(),
    };

    const useCase = new UpdatePlanUseCase(planRepository);
    const updated = await useCase.execute('plan-1', 'Treino A v2', [
      {
        exerciseId: 'seed-chest-01',
        sortOrder: 0,
        plannedSets: 4,
        repMin: 8,
        repMax: 12,
        restSeconds: 90,
      },
    ]);

    expect(updateCalled).toBe(true);
    expect(updated.name).toBe('Treino A v2');
    expect(sessionRepository.startFromPlan).not.toHaveBeenCalled();
    expect(sessionRepository.completeSession).not.toHaveBeenCalled();
  });
});
