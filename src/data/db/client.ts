import { openDatabaseSync } from 'expo-sqlite';
import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import * as schema from './schema';

export const DATABASE_NAME = 'fitness_tracker.db';

let sqliteDb: ReturnType<typeof openDatabaseSync> | null = null;
let drizzleDb: ExpoSQLiteDatabase<typeof schema> | null = null;

export function getSQLiteDatabase() {
  if (!sqliteDb) {
    sqliteDb = openDatabaseSync(DATABASE_NAME);
  }
  return sqliteDb;
}

export function getDatabase() {
  if (!drizzleDb) {
    drizzleDb = drizzle(getSQLiteDatabase(), { schema });
  }
  return drizzleDb;
}

export type AppDatabase = ReturnType<typeof getDatabase>;
