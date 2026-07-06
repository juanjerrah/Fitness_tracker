import { useColorScheme } from '@/components/useColorScheme';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
};

export const palette = {
  light: {
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    primary: '#2563EB',
    primaryText: '#FFFFFF',
    danger: '#DC2626',
    success: '#16A34A',
    overlay: 'rgba(17, 24, 39, 0.45)',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    primary: '#3B82F6',
    primaryText: '#FFFFFF',
    danger: '#F87171',
    success: '#4ADE80',
    overlay: 'rgba(15, 23, 42, 0.6)',
  },
} as const;

export type ThemeColors = (typeof palette)['light'];

export function useTheme() {
  const scheme = useColorScheme() ?? 'light';
  return {
    scheme,
    colors: palette[scheme],
    spacing,
    radius,
    typography,
  };
}
