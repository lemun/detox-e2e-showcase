import { useState } from 'react';
import { api, type Session } from '../api';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import type { ScreenContext } from './types';

interface SignInScreenProps extends ScreenContext {
  readonly onBack: () => void;
  readonly onSignedIn: (session: Session) => void;
}

export function SignInScreen({ onBack, onSignedIn, run }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () =>
    run(async () => {
      onSignedIn(await api.signIn({ email: email.trim(), password }));
    }, 'Sign-in failed');

  return (
    <Screen testID="sign-in.screen" title="Sign in" titleTestID="sign-in.title" onBack={onBack}>
      <TextField
        testID="sign-in.email-input"
        label="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextField testID="sign-in.password-input" label="Password" secure value={password} onChangeText={setPassword} />
      <Button testID="sign-in.submit-button" label="Sign in" onPress={submit} disabled={!email || !password} />
    </Screen>
  );
}
