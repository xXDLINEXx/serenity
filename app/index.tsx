import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import sounds from '../soundsConfig.json'; // Local JSON
import { SoundPlayer } from '@/components/SoundPlayer';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'sounds' | 'frequencies'>('sounds');
  const [selectedSound, setSelectedSound] = useState<any | null>(null);

  const handlePlay = (sound: any) => {
    setSelectedSound(sound);
  };

  const soundsOnly = sounds.filter((item) => item.audio);
  const frequenciesOnly = sounds.filter((item) => item.frequency);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Serenity 🌙</Text>
        <Text style={styles.headerSubtitle}>Sonothérapie & Relaxation</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sounds' && styles.tabActive]}
          onPress={() => setActiveTab('sounds')}
        >
          <Text style={[styles.tabText, activeTab === 'sounds' && styles.tabTextActive]}>Sons</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'frequencies' && styles.tabActive]}
          onPress={() => setActiveTab('frequencies')}
        >
          <Text style={[styles.tabText, activeTab === 'frequencies' && styles.tabTextActive]}>Fréquences</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {(activeTab === 'sounds' ? soundsOnly : frequenciesOnly).map((item, index) => (
          <TouchableOpacity key={index} style={styles.item} onPress={() => handlePlay(item)}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.description || 'Audio relaxant'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedSound && (
        <SoundPlayer sound={selectedSound} onClose={() => setSelectedSound(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#9CA3AF',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  item: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  itemDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
});
