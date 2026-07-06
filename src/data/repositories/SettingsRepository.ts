import { eq } from 'drizzle-orm';

import type { AppDatabase } from '@/data/db/client';
import { userSettings } from '@/data/db/schema';
import { mapSettingsRow, toSettingsRow } from '@/data/mappers';
import type { UserSettings } from '@/domain/entities';
import { SETTINGS_ROW_ID } from '@/domain/entities/user-settings';
import type { ISettingsRepository } from '@/domain/repositories';

export class SettingsRepository implements ISettingsRepository {
  constructor(private readonly db: AppDatabase) {}

  async get(): Promise<UserSettings | null> {
    const rows = await this.db
      .select()
      .from(userSettings)
      .where(eq(userSettings.id, SETTINGS_ROW_ID))
      .limit(1);

    const row = rows[0];
    return row ? mapSettingsRow(row) : null;
  }

  async upsert(settings: UserSettings): Promise<UserSettings> {
    await this.db
      .insert(userSettings)
      .values(toSettingsRow(settings))
      .onConflictDoUpdate({
        target: userSettings.id,
        set: {
          locale: settings.locale,
          unitSystem: settings.unitSystem,
          timerAlert: settings.timerAlert,
        },
      });

    const saved = await this.get();
    if (!saved) {
      throw new Error('Failed to persist settings');
    }
    return saved;
  }
}
