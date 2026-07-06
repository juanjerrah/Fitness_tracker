import { AnalyticsRepository } from '@/data/repositories/AnalyticsRepository';
import { CalendarRepository } from '@/data/repositories/CalendarRepository';
import { ExerciseRepository } from '@/data/repositories/ExerciseRepository';
import { PlanRepository } from '@/data/repositories/PlanRepository';
import { SessionRepository } from '@/data/repositories/SessionRepository';
import { SettingsRepository } from '@/data/repositories/SettingsRepository';
import type { AppDatabase } from '@/data/db/client';
import {
  GetLoadHistoryUseCase,
  GetPersonalRecordsUseCase,
  GetWeeklyVolumeUseCase,
} from '@/domain/use-cases/analytics';
import {
  GetCalendarMonthUseCase,
  GetSessionsByDateUseCase,
} from '@/domain/use-cases/calendar';
import {
  CreateCustomExerciseUseCase,
  ListExercisesByGroupUseCase,
  SearchExercisesUseCase,
  SeedExercisesOnFirstLaunchUseCase,
} from '@/domain/use-cases/exercises';
import {
  ArchivePlanUseCase,
  CreatePlanUseCase,
  DuplicatePlanUseCase,
  ListActivePlansUseCase,
  UpdatePlanUseCase,
} from '@/domain/use-cases/plans';
import {
  CompleteExerciseUseCase,
  CompleteSessionUseCase,
  GetActiveSessionUseCase,
  LogSetUseCase,
  StartSessionUseCase,
} from '@/domain/use-cases/sessions';
import {
  GetSettingsUseCase,
  UpdateSettingsUseCase,
  resolveDefaultLocale,
} from '@/domain/use-cases/settings';
import type { SupportedLocale } from '@/domain/entities/types';

export type AppContainer = {
  db: AppDatabase;
  settings: {
    getSettings: GetSettingsUseCase;
    updateSettings: UpdateSettingsUseCase;
  };
  exercises: {
    listByGroup: ListExercisesByGroupUseCase;
    search: SearchExercisesUseCase;
    createCustom: CreateCustomExerciseUseCase;
    seedOnFirstLaunch: SeedExercisesOnFirstLaunchUseCase;
  };
  plans: {
    create: CreatePlanUseCase;
    update: UpdatePlanUseCase;
    archive: ArchivePlanUseCase;
    duplicate: DuplicatePlanUseCase;
    listActive: ListActivePlansUseCase;
  };
  sessions: {
    start: StartSessionUseCase;
    getActive: GetActiveSessionUseCase;
    logSet: LogSetUseCase;
    completeExercise: CompleteExerciseUseCase;
    completeSession: CompleteSessionUseCase;
  };
  calendar: {
    getMonth: GetCalendarMonthUseCase;
    getSessionsByDate: GetSessionsByDateUseCase;
  };
  analytics: {
    getLoadHistory: GetLoadHistoryUseCase;
    getWeeklyVolume: GetWeeklyVolumeUseCase;
    getPersonalRecords: GetPersonalRecordsUseCase;
  };
};

export type CreateAppContainerOptions = {
  defaultLocale?: SupportedLocale;
};

export function createAppContainer(
  db: AppDatabase,
  options: CreateAppContainerOptions = {},
): AppContainer {
  const settingsRepository = new SettingsRepository(db);
  const exerciseRepository = new ExerciseRepository(db);
  const planRepository = new PlanRepository(db);
  const sessionRepository = new SessionRepository(db);
  const calendarRepository = new CalendarRepository(db);
  const analyticsRepository = new AnalyticsRepository(db);

  const settingsDeps = {
    settingsRepository,
    defaultLocale: options.defaultLocale ?? ('en-US' as SupportedLocale),
  };

  return {
    db,
    settings: {
      getSettings: new GetSettingsUseCase(settingsDeps),
      updateSettings: new UpdateSettingsUseCase(settingsDeps),
    },
    exercises: {
      listByGroup: new ListExercisesByGroupUseCase(exerciseRepository),
      search: new SearchExercisesUseCase(exerciseRepository),
      createCustom: new CreateCustomExerciseUseCase(exerciseRepository),
      seedOnFirstLaunch: new SeedExercisesOnFirstLaunchUseCase(exerciseRepository),
    },
    plans: {
      create: new CreatePlanUseCase(planRepository),
      update: new UpdatePlanUseCase(planRepository),
      archive: new ArchivePlanUseCase(planRepository),
      duplicate: new DuplicatePlanUseCase(planRepository),
      listActive: new ListActivePlansUseCase(planRepository),
    },
    sessions: {
      start: new StartSessionUseCase(planRepository, sessionRepository, exerciseRepository),
      getActive: new GetActiveSessionUseCase(sessionRepository),
      logSet: new LogSetUseCase(sessionRepository),
      completeExercise: new CompleteExerciseUseCase(sessionRepository),
      completeSession: new CompleteSessionUseCase(sessionRepository),
    },
    calendar: {
      getMonth: new GetCalendarMonthUseCase(calendarRepository),
      getSessionsByDate: new GetSessionsByDateUseCase(calendarRepository),
    },
    analytics: {
      getLoadHistory: new GetLoadHistoryUseCase(analyticsRepository),
      getWeeklyVolume: new GetWeeklyVolumeUseCase(analyticsRepository),
      getPersonalRecords: new GetPersonalRecordsUseCase(analyticsRepository),
    },
  };
}

export { resolveDefaultLocale };
