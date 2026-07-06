import type { Exercise, MuscleGroup, UserSettings } from '@/domain/entities';

export type ISettingsRepository = {
  get(): Promise<UserSettings | null>;
  upsert(settings: UserSettings): Promise<UserSettings>;
};

export type IExerciseRepository = {
  listByMuscleGroup(muscleGroup: MuscleGroup): Promise<Exercise[]>;
  search(query: string): Promise<Exercise[]>;
  getById(id: string): Promise<Exercise | null>;
  createCustom(input: { name: string; muscleGroup: MuscleGroup }): Promise<Exercise>;
  insertSeedIfEmpty(rows: Exercise[]): Promise<number>;
};

export type PlanExerciseInput = {
  exerciseId: string;
  sortOrder: number;
  plannedSets: number;
  repMin: number;
  repMax: number;
  restSeconds: number;
};

export type WorkoutPlanWithExercises = {
  id: string;
  name: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  exercises: (PlanExerciseInput & {
    id: string;
    planId: string;
  })[];
};

export type IPlanRepository = {
  create(name: string, exercises: PlanExerciseInput[]): Promise<WorkoutPlanWithExercises>;
  update(
    planId: string,
    name: string,
    exercises: PlanExerciseInput[],
  ): Promise<WorkoutPlanWithExercises>;
  archive(planId: string): Promise<void>;
  duplicate(planId: string): Promise<WorkoutPlanWithExercises>;
  listActive(): Promise<WorkoutPlanWithExercises[]>;
  getWithExercises(planId: string): Promise<WorkoutPlanWithExercises | null>;
};

export type SessionExerciseWithLogs = {
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
  sets: {
    id: string;
    sessionExerciseId: string;
    setNumber: number;
    reps: number;
    loadKg: number;
    completedAt: string;
  }[];
};

export type WorkoutSessionDetail = {
  id: string;
  planId: string;
  planNameSnapshot: string;
  status: 'in_progress' | 'completed';
  startedAt: string;
  completedAt: string | null;
  exercises: SessionExerciseWithLogs[];
};

export type ISessionRepository = {
  startFromPlan(plan: WorkoutPlanWithExercises, exerciseNames: Map<string, string>): Promise<WorkoutSessionDetail>;
  getActive(): Promise<WorkoutSessionDetail | null>;
  getById(sessionId: string): Promise<WorkoutSessionDetail | null>;
  logSet(input: {
    sessionExerciseId: string;
    setNumber: number;
    reps: number;
    loadKg: number;
    completedAt: string;
  }): Promise<SessionExerciseWithLogs['sets'][number]>;
  completeExercise(sessionExerciseId: string): Promise<void>;
  completeSession(sessionId: string, completedAt: string): Promise<WorkoutSessionDetail>;
  listCompletedByDateRange(fromIso: string, toIso: string): Promise<WorkoutSessionDetail[]>;
};

export type CalendarDay = {
  date: string;
  sessionCount: number;
};

export type SessionDaySummary = {
  id: string;
  planNameSnapshot: string;
  startedAt: string;
  completedAt: string;
  exerciseCount: number;
};

export type ICalendarRepository = {
  getDaysWithWorkouts(year: number, month: number): Promise<CalendarDay[]>;
  getSessionsByDate(dateKey: string): Promise<SessionDaySummary[]>;
};

export type LoadHistoryPoint = {
  completedAt: string;
  loadKg: number;
  reps: number;
  volume: number;
};

export type WeeklyVolumePoint = {
  weekStart: string;
  totalVolume: number;
};

export type PersonalRecord = {
  exerciseId: string;
  bestLoadKg: number;
  bestLoadAt: string | null;
  bestVolume: number;
  bestVolumeAt: string | null;
};

export type IAnalyticsRepository = {
  getLoadHistory(
    exerciseId: string,
    fromIso?: string,
    toIso?: string,
  ): Promise<LoadHistoryPoint[]>;
  getWeeklyVolume(fromIso: string, toIso: string): Promise<WeeklyVolumePoint[]>;
  getPersonalRecords(exerciseId?: string): Promise<PersonalRecord[]>;
};

// Re-export plan exercise input type for use cases
export type { PlanExerciseInput as CreatePlanExerciseInput };
