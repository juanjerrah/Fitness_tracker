import type { PlanStatus } from './types';

export type WorkoutPlan = {
  id: string;
  name: string;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
};
