import { StyleSheet, Text } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { colors } from '../components/theme';

interface WelcomeScreenProps {
  readonly onSignIn: () => void;
  readonly onSignUp: () => void;
}

export function WelcomeScreen({ onSignIn, onSignUp }: WelcomeScreenProps) {
  return (
    <Screen testID="welcome.screen" title="Sample App" titleTestID="welcome.title">
      <Text style={styles.lead}>
        A small public app that exists so an end-to-end suite has something real to drive.
      </Text>
      <Button testID="welcome.sign-up-button" label="Create account" onPress={onSignUp} />
      <Button testID="welcome.sign-in-button" label="Sign in" variant="secondary" onPress={onSignIn} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: { fontSize: 16, color: colors.muted, marginBottom: 16 },
});
