import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import enUS from './locales/en-US.json';
import esES from './locales/es-ES.json';
import ptBR from './locales/pt-BR.json';

export const SUPPORTED_LOCALES = ['pt-BR', 'es-ES', 'en-US'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const resources = {
  'pt-BR': { common: ptBR },
  'es-ES': { common: esES },
  'en-US': { common: enUS },
} as const;

function normalizeLocaleTag(tag: string): SupportedLocale | null {
  if (SUPPORTED_LOCALES.includes(tag as SupportedLocale)) {
    return tag as SupportedLocale;
  }

  const language = tag.split('-')[0]?.toLowerCase();

  if (language === 'pt') return 'pt-BR';
  if (language === 'es') return 'es-ES';
  if (language === 'en') return 'en-US';

  return null;
}

export function resolveDeviceLocale(): SupportedLocale {
  for (const locale of Localization.getLocales()) {
    const normalized = normalizeLocaleTag(locale.languageTag);
    if (normalized) {
      return normalized;
    }
  }

  return 'en-US';
}

let initialized = false;

const i18n = createInstance();

export function initI18n(locale?: SupportedLocale) {
  if (initialized) {
    return i18n;
  }

  const lng = locale ?? resolveDeviceLocale();

  i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en-US',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

  initialized = true;
  return i18n;
}

export default i18n;
