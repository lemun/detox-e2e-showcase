import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { colors } from './theme';

export type DialogKind = 'success' | 'error' | 'info';

export interface DialogState {
  readonly kind: DialogKind;
  readonly title: string;
  readonly message: string;
  readonly actionLabel: string;
  readonly onAction?: () => void;
}

interface DialogProps {
  readonly dialog: DialogState;
  readonly onClose: () => void;
}

// Rendered as an overlay inside the root view rather than a native Modal, so it stays in the same
// view hierarchy the tests query.
export function Dialog({ dialog, onClose }: DialogProps) {
  const handleAction = () => {
    onClose();
    dialog.onAction?.();
  };

  return (
    <View style={styles.backdrop}>
      <View testID="dialog" accessibilityViewIsModal style={styles.card}>
        <Text testID={`dialog.kind.${dialog.kind}`} style={[styles.kind, kindColor[dialog.kind]]}>
          {dialog.kind.toUpperCase()}
        </Text>
        <Text testID="dialog.title" style={styles.title}>
          {dialog.title}
        </Text>
        <Text testID="dialog.message" style={styles.message}>
          {dialog.message}
        </Text>
        <Button testID="dialog.primary-button" label={dialog.actionLabel} onPress={handleAction} />
      </View>
    </View>
  );
}

const kindColor = StyleSheet.create({
  success: { color: colors.success },
  error: { color: colors.danger },
  info: { color: colors.primary },
});

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 24,
  },
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 20 },
  kind: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 6 },
  message: { fontSize: 15, color: colors.muted, marginTop: 8 },
});
