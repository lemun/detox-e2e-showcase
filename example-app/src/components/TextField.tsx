import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from './theme';

interface TextFieldProps {
  readonly testID: string;
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly secure?: boolean;
  readonly keyboardType?: 'default' | 'email-address' | 'number-pad';
  readonly error?: string;
}

export function TextField({
  testID,
  label,
  value,
  onChangeText,
  secure = false,
  keyboardType = 'default',
  error,
}: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        testID={testID}
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        textContentType="none"
        style={[styles.input, error ? styles.inputError : null]}
      />
      {error ? (
        <Text testID={`${testID}.error`} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 14 },
  label: { fontSize: 14, color: colors.muted, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, marginTop: 4, fontSize: 13 },
});
