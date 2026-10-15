import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from './theme';

export function LoadingOverlay() {
  return (
    <View testID="loading-overlay" style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.primaryText} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
