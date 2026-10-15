import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from './theme';

interface ButtonProps {
  readonly testID: string;
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: 'primary' | 'secondary';
  readonly disabled?: boolean;
}

export function Button({ testID, label, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        (pressed || disabled) && styles.dimmed,
      ]}>
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 10, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', marginTop: 12 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  dimmed: { opacity: 0.6 },
  label: { fontSize: 16, fontWeight: '600' },
  primaryLabel: { color: colors.primaryText },
  secondaryLabel: { color: colors.text },
});
