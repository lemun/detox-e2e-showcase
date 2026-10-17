import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from './theme';

interface ScreenProps {
  readonly testID: string;
  readonly title: string;
  readonly titleTestID: string;
  readonly onBack?: () => void;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

// Taps outside a focused input inside the ScrollView dismiss the keyboard (keyboardShouldPersistTaps
// defaults to "never"). The e2e suite relies on that: it taps the screen title to close the keyboard.
export function Screen({ testID, title, titleTestID, onBack, children, footer }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View testID={testID} style={[styles.container, { paddingTop: insets.top }]}>
      {onBack ? (
        <Pressable testID="header.back-button" accessibilityRole="button" onPress={onBack} style={styles.back}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
      ) : null}
      <ScrollView contentContainerStyle={styles.content}>
        <Text testID={titleTestID} accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {children}
      </ScrollView>
      {footer ? <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  back: { paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-start' },
  backLabel: { color: colors.primary, fontSize: 16 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 8 },
  footer: {
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
