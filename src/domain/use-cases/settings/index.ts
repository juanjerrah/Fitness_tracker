import type { ISettingsRepository } from '@/domain/repositories';
import type { UserSettings } from '@/domain/entities';
import { SETTINGS_ROW_ID } from '@/domain/entities/user-settings';
import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
  type TimerAlert,
  type UnitSystem,
} from '@/domain/entities/types';

export type GetSettingsUseCaseDeps = {
  settingsRepository: ISettingsRepository;
  defaultLocale: SupportedLocale;
};

export class GetSettingsUseCase {
  constructor(private readonly deps: GetSettingsUseCaseDeps) {}

  async execute(): Promise<UserSettings> {
    const existing = await this.deps.settingsRepository.get();
    if (existing) {
      return existing;
    }

    const defaults: UserSettings = {
      id: SETTINGS_ROW_ID,
      locale: this.deps.defaultLocale,
      unitSystem: 'metric',
      timerAlert: 'both',
    };

    return this.deps.settingsRepository.upsert(defaults);
  }
}

export type UpdateSettingsInput = {
  locale?: SupportedLocale;
  unitSystem?: UnitSystem;
  timerAlert?: TimerAlert;
};

export class UpdateSettingsUseCase {
  constructor(private readonly deps: GetSettingsUseCaseDeps) {}

  async execute(input: UpdateSettingsInput): Promise<UserSettings> {
    const getSettings = new GetSettingsUseCase(this.deps);
    const current = await getSettings.execute();

    if (input.locale && !SUPPORTED_LOCALES.includes(input.locale)) {
      throw new Error(`Unsupported locale: ${input.locale}`);
    }

    return this.deps.settingsRepository.upsert({
      ...current,
      locale: input.locale ?? current.locale,
      unitSystem: input.unitSystem ?? current.unitSystem,
      timerAlert: input.timerAlert ?? current.timerAlert,
    });
  }
}

export function resolveDefaultLocale(deviceLocale: string | null): SupportedLocale {
  if (!deviceLocale) {
    return 'en-US';
  }

  const normalized = deviceLocale.replace('_', '-');
  if (SUPPORTED_LOCALES.includes(normalized as SupportedLocale)) {
    return normalized as SupportedLocale;
  }

  const language = normalized.split('-')[0];
  const match = SUPPORTED_LOCALES.find((locale) => locale.startsWith(`${language}-`));
  return match ?? 'en-US';
}
