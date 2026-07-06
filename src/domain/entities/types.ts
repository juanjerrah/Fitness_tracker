export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'biceps',
  'triceps',
  'abs',
  'glutes',
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export type PlanStatus = 'active' | 'archived';

export type SessionStatus = 'in_progress' | 'completed';

export type UnitSystem = 'metric' | 'imperial';

export type TimerAlert = 'sound' | 'vibration' | 'both';

export const SUPPORTED_LOCALES = ['pt-BR', 'es-ES', 'en-US'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
