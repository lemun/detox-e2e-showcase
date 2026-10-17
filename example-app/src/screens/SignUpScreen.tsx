import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { api, type Session } from '../api';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { ToggleRow } from '../components/ToggleRow';
import { colors } from '../components/theme';
import type { ScreenContext } from './types';

type Step = 'details' | 'verify';

interface SignUpScreenProps extends ScreenContext {
  readonly onBack: () => void;
  readonly onSignedUp: (session: Session) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Two steps: account details, then the 6-digit code the backend "emails" (the fake backend logs it
// and exposes it on a test route instead of sending mail). The button under the form changes per step.
export function SignUpScreen({ onBack, onSignedUp, run, showDialog }: SignUpScreenProps) {
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !EMAIL_PATTERN.test(email.trim()) ? 'Enter a valid email address' : undefined;
  const passwordError = submitted && password.length < 8 ? 'Use at least 8 characters' : undefined;

  const next = () => {
    setSubmitted(true);

    if (!name.trim() || !EMAIL_PATTERN.test(email.trim()) || password.length < 8 || !acceptedTerms) {
      return;
    }

    run(async () => {
      await api.signUp({ name: name.trim(), email: email.trim(), password });
      setStep('verify');
    }, 'Could not create account');
  };

  const verify = () =>
    run(async () => {
      const session = await api.verifyEmail({ email: email.trim(), code: code.trim() });
      showDialog({
        kind: 'success',
        title: 'Account created',
        message: `Welcome aboard, ${session.user.name}.`,
        actionLabel: 'Continue',
        onAction: () => onSignedUp(session),
      });
    }, 'Verification failed');

  const footer =
    step === 'details' ? (
      <Button testID="sign-up.next-button" label="Next" onPress={next} />
    ) : (
      <Button testID="sign-up.create-button" label="Create account" onPress={verify} disabled={code.length !== 6} />
    );

  return (
    <Screen
      testID="sign-up.screen"
      title={step === 'details' ? 'Create account' : 'Check your email'}
      titleTestID={step === 'details' ? 'sign-up.details-title' : 'sign-up.verify-title'}
      onBack={step === 'details' ? onBack : () => setStep('details')}
      footer={footer}>
      <View testID={`sign-up.step.${step}`}>
        {step === 'details' ? (
          <>
            <TextField testID="sign-up.name-input" label="Name" value={name} onChangeText={setName} />
            <TextField
              testID="sign-up.email-input"
              label="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />
            <TextField
              testID="sign-up.password-input"
              label="Password"
              secure
              value={password}
              onChangeText={setPassword}
              error={passwordError}
            />
            <ToggleRow
              testID="sign-up.terms-toggle"
              label="I accept the terms of use"
              value={acceptedTerms}
              onValueChange={setAcceptedTerms}
            />
          </>
        ) : (
          <>
            <Text style={styles.hint}>We sent a 6-digit code to {email.trim()}.</Text>
            <TextField
              testID="sign-up.code-input"
              label="Verification code"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 15, color: colors.muted },
});
