import { StyleSheet, Text } from 'react-native';
import type { User } from '../api';
import { Screen } from '../components/Screen';
import { colors } from '../components/theme';

export function HomeScreen({ user }: { readonly user: User }) {
  return (
    <Screen testID="home.screen" title="Home" titleTestID="home.title">
      <Text testID="home.greeting" style={styles.greeting}>
        Hello, {user.name}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { fontSize: 18, color: colors.muted },
});
