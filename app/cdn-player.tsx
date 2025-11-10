import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { SoundList } from '../components/SoundList';
import SoundPlayer from '../components/SoundPlayer'; // ✅ correct
import { SoundConfig } from '../types/soundsConfig';

export default function CDNPlayerScreen() {
  const [selectedSound, setSelectedSound] = useState<SoundConfig | null>(null);

  if (selectedSound) {
    return (
      <SoundPlayer
        sound={selectedSound}
        onClose={() => setSelectedSound(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ArrowLeft color="#fff" size={22} />
        <Text style={styles.title}>Sons Relaxants (CDN)</Text>
        <View style={{ width: 22 }} />
      </View>

      <SoundList onSelectSound={setSelectedSound} type="cdn" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0f', paddingTop: 42 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
