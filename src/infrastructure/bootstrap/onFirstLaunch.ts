import * as Localization from 'expo-localization';

import type { AppDatabase } from '@/data/db/client';
import { ExerciseRepository } from '@/data/repositories/ExerciseRepository';
import { SettingsRepository } from '@/data/repositories/SettingsRepository';
import { SeedExercisesOnFirstLaunchUseCase } from '@/domain/use-cases/exercises';
import {
  GetSettingsUseCase,
  resolveDefaultLocale,
} from '@/domain/use-cases/settings';
import { buildSeedExercises } from '@/infrastructure/seed/exercises.seed';

/**
 * Idempotent first-launch bootstrap: settings row + exercise library seed.
 */
export async function runOnFirstLaunch(db: AppDatabase): Promise<void> {
  const settingsRepository = new SettingsRepository(db);
  const exerciseRepository = new ExerciseRepository(db);

  const deviceLocale = Localization.getLocales()[0]?.languageTag ?? null;
  const defaultLocale = resolveDefaultLocale(deviceLocale);

  const getSettings = new GetSettingsUseCase({
    settingsRepository,
    defaultLocale,
  });
  await getSettings.execute();

  const seedExercises = new SeedExercisesOnFirstLaunchUseCase(exerciseRepository);
  await seedExercises.execute(buildSeedExercises());
}
