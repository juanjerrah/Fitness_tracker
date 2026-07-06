import * as Localization from 'expo-localization';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { getDatabase } from '@/data/db/client';

import { createAppContainer, resolveDefaultLocale, type AppContainer } from './container';

const AppContainerContext = createContext<AppContainer | null>(null);

type AppContainerProviderProps = {
  children: ReactNode;
};

export function AppContainerProvider({ children }: AppContainerProviderProps) {
  const container = useMemo(() => {
    const deviceLocale = Localization.getLocales()[0]?.languageTag ?? null;
    return createAppContainer(getDatabase(), {
      defaultLocale: resolveDefaultLocale(deviceLocale),
    });
  }, []);

  return <AppContainerContext.Provider value={container}>{children}</AppContainerContext.Provider>;
}

export function useAppContainer(): AppContainer {
  const container = useContext(AppContainerContext);

  if (!container) {
    throw new Error('useAppContainer must be used within AppContainerProvider');
  }

  return container;
}
