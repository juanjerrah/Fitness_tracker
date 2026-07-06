export type SessionExercise = {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseNameSnapshot: string;
  sortOrder: number;
  plannedSets: number;
  repMin: number;
  repMax: number;
  restSeconds: number;
  isCompleted: boolean;
};
