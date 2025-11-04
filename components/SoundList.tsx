import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import sounds from '../soundsConfig.json'; // JSON local
import { SoundPlayer } from './SoundPlayer';

export function SoundList() {
  const [selectedSound, setSelectedSound] = useState<any | null>(null);

  const handleSelectSound = (sound: any) => {
    setSelectedSound(sound);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectSound(item)}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.audio ? "musical-notes" : "pulse"}
          size={32}
          color="#FFFFFF"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.audio && <Text style={styles.type}>Ambiance naturelle</Text>}
        {item.frequency && <Text style={styles.type}>Fréquence sonore</Text>}
      </View>
      <Ionicons name="play-circle" size={32} color="#A78BFA" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧘 Sons & Fréquences</Text>
      <FlatList
        data={sounds}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {selectedSound && (
        <SoundPlayer
          sound={selectedSound}
          onClose={() => setSelectedSound(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  type: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
});
