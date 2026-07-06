import { validatePlanExercises } from '@/domain/use-cases/plans/validatePlanExercises';
import { ValidationError } from '@/domain/errors/ValidationError';
import { kgToLb, lbToKg, toCanonicalLoadKg } from '@/lib/units';

describe('validatePlanExercises', () => {
  it('rejects empty plan', () => {
    expect(() => validatePlanExercises([])).toThrow(ValidationError);
  });

  it('rejects repMin > repMax', () => {
    expect(() =>
      validatePlanExercises([
        {
          exerciseId: 'e1',
          sortOrder: 0,
          plannedSets: 3,
          repMin: 12,
          repMax: 8,
          restSeconds: 60,
        },
      ]),
    ).toThrow(ValidationError);
  });
});

describe('units', () => {
  it('converts kg and lb both ways', () => {
    expect(kgToLb(100)).toBeCloseTo(220.5, 1);
    expect(lbToKg(220)).toBeCloseTo(99.8, 1);
  });

  it('toCanonicalLoadKg keeps metric values', () => {
    expect(toCanonicalLoadKg(80, 'metric')).toBe(80);
  });
});
