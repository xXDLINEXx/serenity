import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SoundList } from '../components/SoundList';
import SoundPlayer from '../components/SoundPlayer'; // ✅ maintenant dans /components
import { SoundConfig } from '../types/soundsConfig';

export default function LocalPlayerScreen() {
  const [selectedSound, setSelectedSound] = useState<SoundConfig | null>(null);
  const router = useRouter();

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
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <Text style={styles.title}>Sons Locaux</Text>
        <View style={{ width: 22 }} />
      </View>

      <SoundList onSelectSound={setSelectedSound} type="local" />
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
