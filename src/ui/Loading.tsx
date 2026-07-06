import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from './theme';

type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
};

export function Loading({ message, fullScreen = false }: LoadingProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        { backgroundColor: colors.background, padding: spacing.lg },
      ]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <Text style={[typography.body, styles.message, { color: colors.textSecondary }]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
  },
});
