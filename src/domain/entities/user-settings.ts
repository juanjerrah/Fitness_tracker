import type { SupportedLocale, TimerAlert, UnitSystem } from './types';

export type UserSettings = {
  id: number;
  locale: SupportedLocale;
  unitSystem: UnitSystem;
  timerAlert: TimerAlert;
};

export const SETTINGS_ROW_ID = 1;
