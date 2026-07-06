import type { MuscleGroup } from './types';

export type Exercise = {
  id: string;
  muscleGroup: MuscleGroup;
  nameKey: string | null;
  customName: string | null;
  isCustom: boolean;
  deletedAt: string | null;
  createdAt: string;
};
