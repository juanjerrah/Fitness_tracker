import { calculateSetVolume } from '@/domain/volume';
import {
  GetSettingsUseCase,
  UpdateSettingsUseCase,
  resolveDefaultLocale,
} from '@/domain/use-cases/settings';
import type { UserSettings } from '@/domain/entities';
import { SETTINGS_ROW_ID } from '@/domain/entities/user-settings';
import type { ISettingsRepository } from '@/domain/repositories';

function createSettingsRepo(initial: UserSettings | null = null): ISettingsRepository {
  let stored = initial;
  return {
    async get() {
      return stored;
    },
    async upsert(settings) {
      stored = settings;
      return settings;
    },
  };
}

describe('GetSettingsUseCase', () => {
  it('seeds defaults on first access', async () => {
    const repo = createSettingsRepo(null);
    const useCase = new GetSettingsUseCase({ settingsRepository: repo, defaultLocale: 'pt-BR' });

    const settings = await useCase.execute();

    expect(settings).toEqual({
      id: SETTINGS_ROW_ID,
      locale: 'pt-BR',
      unitSystem: 'metric',
      timerAlert: 'both',
    });
  });

  it('returns existing settings without overwriting', async () => {
    const existing: UserSettings = {
      id: SETTINGS_ROW_ID,
      locale: 'en-US',
      unitSystem: 'imperial',
      timerAlert: 'sound',
    };
    const repo = createSettingsRepo(existing);
    const useCase = new GetSettingsUseCase({ settingsRepository: repo, defaultLocale: 'pt-BR' });

    const settings = await useCase.execute();
    expect(settings.unitSystem).toBe('imperial');
  });
});

describe('UpdateSettingsUseCase', () => {
  it('updates unit system', async () => {
    const repo = createSettingsRepo(null);
    const deps = { settingsRepository: repo, defaultLocale: 'en-US' as const };
    const update = new UpdateSettingsUseCase(deps);

    const updated = await update.execute({ unitSystem: 'imperial' });
    expect(updated.unitSystem).toBe('imperial');
  });
});

describe('resolveDefaultLocale', () => {
  it('falls back to en-US for unsupported locale', () => {
    expect(resolveDefaultLocale('fr-FR')).toBe('en-US');
  });

  it('maps pt locale', () => {
    expect(resolveDefaultLocale('pt-PT')).toBe('pt-BR');
  });
});

describe('RN-05 volume', () => {
  it('calculates reps × load', () => {
    expect(calculateSetVolume(10, 50)).toBe(500);
  });
});
