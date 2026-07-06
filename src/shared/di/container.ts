import type { AppDatabase } from '@/data/db/client';

/**
 * Application DI container. Repositories and use cases are wired here as modules land (MO-007+).
 */
export type AppContainer = {
  db: AppDatabase;
};

export function createAppContainer(db: AppDatabase): AppContainer {
  return { db };
}
