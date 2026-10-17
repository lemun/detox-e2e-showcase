import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from './theme';

export type Tab = 'home' | 'profile';

interface TabBarProps {
  readonly current: Tab;
  readonly onSelect: (tab: Tab) => void;
}

const tabs: readonly { key: Tab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'profile', label: 'Profile' },
];

export function TabBar({ current, onSelect }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View testID="tab-bar" style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          testID={`tab-bar.${tab.key}-tab`}
          accessibilityRole="tab"
          accessibilityState={{ selected: current === tab.key }}
          onPress={() => onSelect(tab.key)}
          style={styles.tab}>
          <Text style={[styles.label, current === tab.key && styles.selected]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  label: { fontSize: 15, color: colors.muted },
  selected: { color: colors.primary, fontWeight: '700' },
});
