import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SoundList } from '@/components/SoundList';
import { SoundPlayer } from '@/components/SoundPlayer';
import { SoundConfig } from '@/types/soundsConfig';



export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedSound, setSelectedSound] = useState<SoundConfig | null>(null);

  const handleClose = () => {
    setSelectedSound(null);
  };

  if (selectedSound) {
    return <SoundPlayer sound={selectedSound} onClose={handleClose} />;
  }

  return (
    <View style={styles.container} testID="home-screen">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0A0A0F', '#1E1B4B', '#312E81']}
        style={styles.gradient}
      >
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View>
            <Text style={styles.headerTitle}>Serenity</Text>
            <Text style={styles.headerSubtitle}>Sons & Fréquences pour le sommeil</Text>
          </View>
        </View>

        <SoundList onSelectSound={setSelectedSound} />
      </LinearGradient>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '400' as const,
  },
});
