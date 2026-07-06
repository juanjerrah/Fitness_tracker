import type { ICalendarRepository } from '@/domain/repositories';

export class GetCalendarMonthUseCase {
  constructor(private readonly calendarRepository: ICalendarRepository) {}

  execute(year: number, month: number) {
    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }
    return this.calendarRepository.getDaysWithWorkouts(year, month);
  }
}

export class GetSessionsByDateUseCase {
  constructor(private readonly calendarRepository: ICalendarRepository) {}

  execute(dateKey: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      throw new Error('Date must be YYYY-MM-DD');
    }
    return this.calendarRepository.getSessionsByDate(dateKey);
  }
}
