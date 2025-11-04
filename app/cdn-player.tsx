import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SoundList } from '@/components/SoundList';
import { SoundPlayer } from '@/components/SoundPlayer';
import { SoundConfig } from '@/types/soundsConfig';

export default function CDNPlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedSound, setSelectedSound] = useState<SoundConfig | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const handleSelectSound = (sound: SoundConfig) => {
    console.log('[CDNPlayerScreen] Selected sound:', sound.title);
    setSelectedSound(sound);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    console.log('[CDNPlayerScreen] Closing player');
    setShowPlayer(false);
    setSelectedSound(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Serenity CDN</Text>
        <View style={styles.placeholder} />
      </View>

      <SoundList onSelectSound={handleSelectSound} />

      <Modal
        visible={showPlayer}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClosePlayer}
      >
        {selectedSound && (
          <SoundPlayer sound={selectedSound} onClose={handleClosePlayer} />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
});
