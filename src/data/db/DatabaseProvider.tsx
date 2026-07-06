import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useState, type ReactNode } from 'react';

import { runOnFirstLaunch } from '@/infrastructure/bootstrap/onFirstLaunch';
import { Loading } from '@/ui/Loading';

import { getDatabase } from './client';
import migrations from './migrations/migrations';

type DatabaseProviderProps = {
  children: ReactNode;
};

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const db = getDatabase();
  const { success, error } = useMigrations(db, migrations);
  const [ready, setReady] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<Error | null>(null);

  useEffect(() => {
    if (!success) {
      return;
    }

    let cancelled = false;

    runOnFirstLaunch(db)
      .then(() => {
        if (!cancelled) {
          setReady(true);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setBootstrapError(err instanceof Error ? err : new Error(String(err)));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [success, db]);

  if (error) {
    throw error;
  }

  if (bootstrapError) {
    throw bootstrapError;
  }

  if (!success || !ready) {
    return <Loading fullScreen message="Preparing database…" />;
  }

  return children;
}
