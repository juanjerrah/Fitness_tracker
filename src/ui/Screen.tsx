import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from './theme';

type ScreenProps = ScrollViewProps & {
  scroll?: boolean;
  edges?: Edge[];
  padded?: boolean;
};

export function Screen({
  children,
  scroll = false,
  edges = ['top', 'bottom'],
  padded = true,
  contentContainerStyle,
  style,
  ...props
}: ScreenProps) {
  const { colors, spacing } = useTheme();

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[
        padded && styles.padded,
        { paddingHorizontal: padded ? spacing.md : 0 },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      style={[styles.flex, { backgroundColor: colors.background }, style]}
      {...props}>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.flex,
        padded && styles.padded,
        {
          backgroundColor: colors.background,
          paddingHorizontal: padded ? spacing.md : 0,
        },
        style,
      ]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: colors.background }]}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  padded: {
    paddingVertical: 16,
  },
});
