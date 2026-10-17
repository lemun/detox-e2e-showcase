import { useEffect, useState } from 'react';
import { api, type Preferences } from '../api';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { ToggleRow } from '../components/ToggleRow';
import type { ScreenContext } from './types';

interface PreferencesScreenProps extends ScreenContext {
  readonly token: string;
  readonly onBack: () => void;
}

export function PreferencesScreen({ token, onBack, run, showDialog }: PreferencesScreenProps) {
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    run(async () => setPreferences(await api.getPreferences(token)), 'Could not load preferences');
  }, [token, run]);

  const update = (key: keyof Preferences) => (value: boolean) =>
    setPreferences((current) => (current ? { ...current, [key]: value } : current));

  const save = () =>
    run(async () => {
      if (!preferences) return;
      setPreferences(await api.savePreferences(token, preferences));
      showDialog({
        kind: 'success',
        title: 'Preferences saved',
        message: 'Your notification settings were updated.',
        actionLabel: 'Done',
      });
    }, 'Could not save preferences');

  return (
    <Screen testID="preferences.screen" title="Notifications" titleTestID="preferences.title" onBack={onBack}>
      {preferences ? (
        <>
          <ToggleRow
            testID="preferences.product-updates-toggle"
            label="Product updates"
            value={preferences.productUpdates}
            onValueChange={update('productUpdates')}
          />
          <ToggleRow
            testID="preferences.weekly-digest-toggle"
            label="Weekly digest"
            value={preferences.weeklyDigest}
            onValueChange={update('weeklyDigest')}
          />
          <ToggleRow
            testID="preferences.reminders-toggle"
            label="Reminders"
            value={preferences.reminders}
            onValueChange={update('reminders')}
          />
          <Button testID="preferences.save-button" label="Save" onPress={save} />
        </>
      ) : null}
    </Screen>
  );
}
