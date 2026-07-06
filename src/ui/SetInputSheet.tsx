import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { Input } from './Input';
import { useTheme } from './theme';

export type SetInputValues = {
  reps: string;
  load: string;
};

type SetInputSheetProps = {
  weightUnitLabel: string;
  initialValues?: Partial<SetInputValues>;
  onConfirm: (values: { reps: number; load: number }) => void;
  onDismiss?: () => void;
};

export const SetInputSheet = forwardRef<BottomSheet, SetInputSheetProps>(function SetInputSheet(
  { weightUnitLabel, initialValues, onConfirm, onDismiss },
  ref
) {
  const { t } = useTranslation('common');
  const { colors, spacing, typography } = useTheme();
  const snapPoints = useMemo(() => ['45%'], []);
  const [reps, setReps] = useState(initialValues?.reps ?? '');
  const [load, setLoad] = useState(initialValues?.load ?? '');

  useEffect(() => {
    setReps(initialValues?.reps ?? '');
    setLoad(initialValues?.load ?? '');
  }, [initialValues?.load, initialValues?.reps]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  const handleConfirm = useCallback(() => {
    const parsedReps = Number.parseInt(reps, 10);
    const parsedLoad = Number.parseFloat(load);

    if (Number.isNaN(parsedReps) || Number.isNaN(parsedLoad) || parsedReps < 0 || parsedLoad < 0) {
      return;
    }

    onConfirm({ reps: parsedReps, load: parsedLoad });
  }, [load, onConfirm, reps]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.textSecondary }}
      onClose={onDismiss}>
      <BottomSheetView style={[styles.content, { padding: spacing.md }]}>
        <Text style={[typography.subtitle, { color: colors.text, marginBottom: spacing.md }]}>
          {t('setInput.title')}
        </Text>
        <Input
          keyboardType="number-pad"
          label={t('setInput.reps')}
          placeholder="0"
          value={reps}
          onChangeText={setReps}
        />
        <View style={{ height: spacing.sm }} />
        <Input
          keyboardType="decimal-pad"
          label={t('setInput.load', { unit: weightUnitLabel })}
          placeholder="0"
          value={load}
          onChangeText={setLoad}
        />
        <View style={{ height: spacing.md }} />
        <Button label={t('actions.confirm')} onPress={handleConfirm} />
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
