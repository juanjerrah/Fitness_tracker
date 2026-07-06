import { and, asc, eq, isNotNull } from 'drizzle-orm';

import type { AppDatabase } from '@/data/db/client';
import { sessionExercises, workoutSessions } from '@/data/db/schema';
import type {
  CalendarDay,
  ICalendarRepository,
  SessionDaySummary,
} from '@/domain/repositories';
import { toLocalDateKey } from '@/lib/dates';

export class CalendarRepository implements ICalendarRepository {
  constructor(private readonly db: AppDatabase) {}

  async getDaysWithWorkouts(year: number, month: number): Promise<CalendarDay[]> {
    const start = new Date(Date.UTC(year, month - 1, 1)).toISOString();
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString();

    const sessions = await this.db
      .select({
        completedAt: workoutSessions.completedAt,
      })
      .from(workoutSessions)
      .where(
        and(
          eq(workoutSessions.status, 'completed'),
          isNotNull(workoutSessions.completedAt),
        ),
      )
      .orderBy(asc(workoutSessions.completedAt));

    const counts = new Map<string, number>();
    for (const session of sessions) {
      if (!session.completedAt) {
        continue;
      }
      const dateKey = toLocalDateKey(session.completedAt);
      const [y, m] = dateKey.split('-').map(Number);
      if (y !== year || m !== month) {
        if (session.completedAt < start || session.completedAt > end) {
          continue;
        }
      }
      counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([date, sessionCount]) => ({ date, sessionCount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getSessionsByDate(dateKey: string): Promise<SessionDaySummary[]> {
    const sessions = await this.db
      .select()
      .from(workoutSessions)
      .where(
        and(eq(workoutSessions.status, 'completed'), isNotNull(workoutSessions.completedAt)),
      )
      .orderBy(asc(workoutSessions.completedAt));

    const result: SessionDaySummary[] = [];
    for (const session of sessions) {
      if (!session.completedAt || toLocalDateKey(session.completedAt) !== dateKey) {
        continue;
      }

      const exerciseRows = await this.db
        .select({ id: sessionExercises.id })
        .from(sessionExercises)
        .where(eq(sessionExercises.sessionId, session.id));

      result.push({
        id: session.id,
        planNameSnapshot: session.planNameSnapshot,
        startedAt: session.startedAt,
        completedAt: session.completedAt,
        exerciseCount: exerciseRows.length,
      });
    }

    return result;
  }
}
