import { StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from './theme';

interface ToggleRowProps {
  readonly testID: string;
  readonly label: string;
  readonly value: boolean;
  readonly onValueChange: (value: boolean) => void;
}

export function ToggleRow({ testID, label, value, onValueChange }: ToggleRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch testID={testID} accessibilityLabel={label} value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 16, color: colors.text, flexShrink: 1, paddingRight: 12 },
});
