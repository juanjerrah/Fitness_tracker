import type { IAnalyticsRepository } from '@/domain/repositories';

export class GetLoadHistoryUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  execute(exerciseId: string, fromIso?: string, toIso?: string) {
    return this.analyticsRepository.getLoadHistory(exerciseId, fromIso, toIso);
  }
}

export class GetWeeklyVolumeUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  execute(fromIso: string, toIso: string) {
    return this.analyticsRepository.getWeeklyVolume(fromIso, toIso);
  }
}

export class GetPersonalRecordsUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  execute(exerciseId?: string) {
    return this.analyticsRepository.getPersonalRecords(exerciseId);
  }
}
