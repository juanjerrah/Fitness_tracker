import type { SessionStatus } from './types';

export type WorkoutSession = {
  id: string;
  planId: string;
  planNameSnapshot: string;
  status: SessionStatus;
  startedAt: string;
  completedAt: string | null;
};
