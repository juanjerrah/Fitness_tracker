import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from './theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...props }: InputProps) {
  const { colors, radius, spacing, typography } = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[typography.caption, styles.label, { color: colors.textSecondary }]}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[
          typography.body,
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radius.md,
            color: colors.text,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 4,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.xs }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
  },
});
