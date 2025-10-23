import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface State { hasError: boolean; errorMessage?: string }

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('ErrorBoundary captured error:', message);
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    console.error('ErrorBoundary details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container} testID="error-boundary">
          <Text style={styles.title}>Une erreur est survenue</Text>
          <Text style={styles.subtitle}>{this.state.errorMessage ?? 'Veuillez réessayer.'}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', padding: 24 },
  title: { color: '#FFF', fontSize: 18, fontWeight: '700' as const, marginBottom: 8 },
  subtitle: { color: '#94A3B8', fontSize: 14 },
});
