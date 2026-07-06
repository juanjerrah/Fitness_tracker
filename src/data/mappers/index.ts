import type { Exercise, UserSettings } from '@/domain/entities';
import type { SupportedLocale, TimerAlert, UnitSystem } from '@/domain/entities/types';
import type { exercises, userSettings } from '@/data/db/schema';

type ExerciseRow = typeof exercises.$inferSelect;
type SettingsRow = typeof userSettings.$inferSelect;

export function mapExerciseRow(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    muscleGroup: row.muscleGroup as Exercise['muscleGroup'],
    nameKey: row.nameKey,
    customName: row.customName,
    isCustom: row.isCustom,
    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
  };
}

export function mapSettingsRow(row: SettingsRow): UserSettings {
  return {
    id: row.id,
    locale: row.locale as SupportedLocale,
    unitSystem: row.unitSystem as UnitSystem,
    timerAlert: row.timerAlert as TimerAlert,
  };
}

export function toSettingsRow(settings: UserSettings): typeof userSettings.$inferInsert {
  return {
    id: settings.id,
    locale: settings.locale,
    unitSystem: settings.unitSystem,
    timerAlert: settings.timerAlert,
  };
}
