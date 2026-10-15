import { StyleSheet, Text } from 'react-native';
import type { User } from '../api';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { colors } from '../components/theme';

interface ProfileScreenProps {
  readonly user: User;
  readonly onOpenPreferences: () => void;
  readonly onSignOut: () => void;
}

export function ProfileScreen({ user, onOpenPreferences, onSignOut }: ProfileScreenProps) {
  return (
    <Screen testID="profile.screen" title="Profile" titleTestID="profile.title">
      <Text testID="profile.name" style={styles.name}>
        {user.name}
      </Text>
      <Text testID="profile.email" style={styles.email}>
        {user.email}
      </Text>
      <Button
        testID="profile.preferences-button"
        label="Notification preferences"
        variant="secondary"
        onPress={onOpenPreferences}
      />
      <Button testID="profile.sign-out-button" label="Sign out" variant="secondary" onPress={onSignOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 20, fontWeight: '600', color: colors.text },
  email: { fontSize: 15, color: colors.muted, marginBottom: 8 },
});
