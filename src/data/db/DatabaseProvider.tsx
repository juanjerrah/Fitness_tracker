import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useState, type ReactNode } from 'react';

import { Loading } from '@/ui/Loading';

import { getDatabase } from './client';
import migrations from './migrations/migrations';
import { runPocHealthcheck } from './pocHealthcheck';

type DatabaseProviderProps = {
  children: ReactNode;
};

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const db = getDatabase();
  const { success, error } = useMigrations(db, migrations);
  const [pocReady, setPocReady] = useState(false);
  const [pocError, setPocError] = useState<Error | null>(null);

  useEffect(() => {
    if (!success) {
      return;
    }

    let cancelled = false;

    runPocHealthcheck()
      .then(() => {
        if (!cancelled) {
          setPocReady(true);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setPocError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [success]);

  if (error) {
    throw error;
  }

  if (pocError) {
    throw pocError;
  }

  if (!success || !pocReady) {
    return <Loading fullScreen message="Preparing database…" />;
  }

  return children;
}
