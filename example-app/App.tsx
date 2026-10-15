import { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Session } from './src/api';
import { Dialog, type DialogState } from './src/components/Dialog';
import { LoadingOverlay } from './src/components/LoadingOverlay';
import { TabBar, type Tab } from './src/components/TabBar';
import { colors } from './src/components/theme';
import { HomeScreen } from './src/screens/HomeScreen';
import { PreferencesScreen } from './src/screens/PreferencesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SignInScreen } from './src/screens/SignInScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import type { ScreenContext } from './src/screens/types';
import { WelcomeScreen } from './src/screens/WelcomeScreen';

type Route = 'welcome' | 'signIn' | 'signUp' | 'main' | 'preferences';

// Navigation is a plain state machine on purpose: the app has five screens and the point of the
// repository is the test suite, so it avoids native navigation dependencies.
export default function App() {
  const [route, setRoute] = useState<Route>('welcome');
  const [tab, setTab] = useState<Tab>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback<ScreenContext['run']>((action, errorTitle) => {
    setLoading(true);
    action()
      .catch((error: unknown) => {
        setDialog({
          kind: 'error',
          title: errorTitle,
          message: error instanceof Error ? error.message : 'Something went wrong',
          actionLabel: 'Try again',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const context: ScreenContext = { run, showDialog: setDialog };

  const signedIn = (next: Session) => {
    setSession(next);
    setTab('home');
    setRoute('main');
  };

  const signOut = () => {
    setSession(null);
    setRoute('welcome');
  };

  const renderRoute = () => {
    if (route === 'signIn') {
      return <SignInScreen {...context} onBack={() => setRoute('welcome')} onSignedIn={signedIn} />;
    }

    if (route === 'signUp') {
      return <SignUpScreen {...context} onBack={() => setRoute('welcome')} onSignedUp={signedIn} />;
    }

    if (session && route === 'preferences') {
      return <PreferencesScreen {...context} token={session.token} onBack={() => setRoute('main')} />;
    }

    if (session && route === 'main') {
      return (
        <>
          {tab === 'home' ? (
            <HomeScreen user={session.user} />
          ) : (
            <ProfileScreen user={session.user} onOpenPreferences={() => setRoute('preferences')} onSignOut={signOut} />
          )}
          <TabBar current={tab} onSelect={setTab} />
        </>
      );
    }

    return <WelcomeScreen onSignIn={() => setRoute('signIn')} onSignUp={() => setRoute('signUp')} />;
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.root}>
        {renderRoute()}
        {loading ? <LoadingOverlay /> : null}
        {dialog ? <Dialog dialog={dialog} onClose={() => setDialog(null)} /> : null}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
