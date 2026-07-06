import { index, int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  muscleGroup: text('muscle_group').notNull(),
  nameKey: text('name_key'),
  customName: text('custom_name'),
  isCustom: int('is_custom', { mode: 'boolean' }).notNull().default(false),
  deletedAt: text('deleted_at'),
  createdAt: text('created_at').notNull(),
});

export const workoutPlans = sqliteTable('workout_plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const planExercises = sqliteTable(
  'plan_exercises',
  {
    id: text('id').primaryKey(),
    planId: text('plan_id')
      .notNull()
      .references(() => workoutPlans.id),
    exerciseId: text('exercise_id')
      .notNull()
      .references(() => exercises.id),
    sortOrder: int('sort_order').notNull(),
    plannedSets: int('planned_sets').notNull(),
    repMin: int('rep_min').notNull(),
    repMax: int('rep_max').notNull(),
    restSeconds: int('rest_seconds').notNull(),
  },
  (table) => [index('idx_plan_exercises_plan').on(table.planId)],
);

export const workoutSessions = sqliteTable(
  'workout_sessions',
  {
    id: text('id').primaryKey(),
    planId: text('plan_id')
      .notNull()
      .references(() => workoutPlans.id),
    planNameSnapshot: text('plan_name_snapshot').notNull(),
    status: text('status').notNull(),
    startedAt: text('started_at').notNull(),
    completedAt: text('completed_at'),
  },
  (table) => [index('idx_sessions_completed_at').on(table.completedAt)],
);

export const sessionExercises = sqliteTable('session_exercises', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => workoutSessions.id),
  exerciseId: text('exercise_id')
    .notNull()
    .references(() => exercises.id),
  exerciseNameSnapshot: text('exercise_name_snapshot').notNull(),
  sortOrder: int('sort_order').notNull(),
  plannedSets: int('planned_sets').notNull(),
  repMin: int('rep_min').notNull(),
  repMax: int('rep_max').notNull(),
  restSeconds: int('rest_seconds').notNull(),
  isCompleted: int('is_completed', { mode: 'boolean' }).notNull().default(false),
});

export const setLogs = sqliteTable(
  'set_logs',
  {
    id: text('id').primaryKey(),
    sessionExerciseId: text('session_exercise_id')
      .notNull()
      .references(() => sessionExercises.id),
    setNumber: int('set_number').notNull(),
    reps: int('reps').notNull(),
    loadKg: real('load_kg').notNull(),
    completedAt: text('completed_at').notNull(),
  },
  (table) => [index('idx_set_logs_session_exercise').on(table.sessionExerciseId)],
);

export const userSettings = sqliteTable('user_settings', {
  id: int('id').primaryKey(),
  locale: text('locale').notNull(),
  unitSystem: text('unit_system').notNull(),
  timerAlert: text('timer_alert').notNull(),
});

export const schema = {
  exercises,
  workoutPlans,
  planExercises,
  workoutSessions,
  sessionExercises,
  setLogs,
  userSettings,
};
