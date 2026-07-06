import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from './theme';

type CardProps = ViewProps & {
  padded?: boolean;
};

export function Card({ children, style, padded = true, ...props }: CardProps) {
  const { colors, radius, spacing } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: padded ? spacing.md : 0,
        },
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
