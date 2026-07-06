import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { AnalyticsRepository } from '@/data/repositories/AnalyticsRepository';
import * as schema from '@/data/db/schema';

function createTestDb() {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });

  sqlite.exec(`
    CREATE TABLE exercises (
      id TEXT PRIMARY KEY,
      muscle_group TEXT NOT NULL,
      name_key TEXT,
      custom_name TEXT,
      is_custom INTEGER NOT NULL DEFAULT 0,
      deleted_at TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE workout_plans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE plan_exercises (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      planned_sets INTEGER NOT NULL,
      rep_min INTEGER NOT NULL,
      rep_max INTEGER NOT NULL,
      rest_seconds INTEGER NOT NULL
    );
    CREATE TABLE workout_sessions (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      plan_name_snapshot TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT
    );
    CREATE TABLE session_exercises (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      exercise_name_snapshot TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      planned_sets INTEGER NOT NULL,
      rep_min INTEGER NOT NULL,
      rep_max INTEGER NOT NULL,
      rest_seconds INTEGER NOT NULL,
      is_completed INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE set_logs (
      id TEXT PRIMARY KEY,
      session_exercise_id TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      load_kg REAL NOT NULL,
      completed_at TEXT NOT NULL
    );
    CREATE TABLE user_settings (
      id INTEGER PRIMARY KEY,
      locale TEXT NOT NULL,
      unit_system TEXT NOT NULL,
      timer_alert TEXT NOT NULL
    );
  `);

  return db;
}

describe('AnalyticsRepository (in-memory SQLite)', () => {
  it('returns load history and personal records', async () => {
    const db = createTestDb();

    await db.insert(schema.exercises).values({
      id: 'seed-chest-01',
      muscleGroup: 'chest',
      nameKey: 'exercises.bench_press',
      customName: null,
      isCustom: false,
      deletedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
    });

    await db.insert(schema.workoutPlans).values({
      id: 'plan-1',
      name: 'A',
      status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });

    await db.insert(schema.workoutSessions).values({
      id: 'session-1',
      planId: 'plan-1',
      planNameSnapshot: 'A',
      status: 'completed',
      startedAt: '2026-01-10T10:00:00.000Z',
      completedAt: '2026-01-10T11:00:00.000Z',
    });

    await db.insert(schema.sessionExercises).values({
      id: 'se-1',
      sessionId: 'session-1',
      exerciseId: 'seed-chest-01',
      exerciseNameSnapshot: 'exercises.bench_press',
      sortOrder: 0,
      plannedSets: 3,
      repMin: 8,
      repMax: 12,
      restSeconds: 90,
      isCompleted: true,
    });

    await db.insert(schema.setLogs).values([
      {
        id: 'set-1',
        sessionExerciseId: 'se-1',
        setNumber: 1,
        reps: 10,
        loadKg: 60,
        completedAt: '2026-01-10T10:15:00.000Z',
      },
      {
        id: 'set-2',
        sessionExerciseId: 'se-1',
        setNumber: 2,
        reps: 8,
        loadKg: 65,
        completedAt: '2026-01-10T10:25:00.000Z',
      },
    ]);

    const repo = new AnalyticsRepository(db as never);

    const history = await repo.getLoadHistory('seed-chest-01');
    expect(history).toHaveLength(2);
    expect(history[1].loadKg).toBe(65);
    expect(history[1].volume).toBe(520);

    const prs = await repo.getPersonalRecords('seed-chest-01');
    expect(prs[0].bestLoadKg).toBe(65);
    expect(prs[0].bestVolume).toBe(600);
  });
});
