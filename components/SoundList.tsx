import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Music, Radio, AlertCircle } from 'lucide-react-native';
import { SoundConfig } from '@/types/soundsConfig';
import { useSoundsConfig } from '@/hooks/useSoundsConfig';

interface SoundListProps {
  onSelectSound: (sound: SoundConfig) => void;
}

export function SoundList({ onSelectSound }: SoundListProps) {
  const { data: sounds, isLoading, error, refetch } = useSoundsConfig();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Chargement des sons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={styles.errorText}>Erreur de chargement</Text>
        <Text style={styles.errorSubtext}>{(error as Error).message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!sounds || sounds.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Aucun son disponible</Text>
      </View>
    );
  }

  const frequencies = sounds.filter(s => s.frequency);
  const regularSounds = sounds.filter(s => s.audio && !s.frequency);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {regularSounds.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Sons relaxants</Text>
          {regularSounds.map((sound, index) => (
            <SoundCard
              key={`sound-${index}`}
              sound={sound}
              onPress={() => onSelectSound(sound)}
              type="sound"
            />
          ))}
        </>
      )}

      {frequencies.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Fréquences régénérantes</Text>
          {frequencies.map((sound, index) => (
            <SoundCard
              key={`freq-${index}`}
              sound={sound}
              onPress={() => onSelectSound(sound)}
              type="frequency"
            />
          ))}
        </>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

interface SoundCardProps {
  sound: SoundConfig;
  onPress: () => void;
  type: 'sound' | 'frequency';
}

function SoundCard({ sound, onPress, type }: SoundCardProps) {
  const thumbnailMap: Record<string, string> = {
    'Pluie douce': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80',
    'Vagues océan': 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    'Forêt paisible': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    'Vent léger': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80',
    'Feu de camp': 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800&q=80',
    'Rivière': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
    'Orage': 'https://images.unsplash.com/photo-1429552077091-836152271555?w=800&q=80',
    'Bruit blanc': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  };

  const frequencyImages: Record<string, string> = {
    '4-7 Hz': 'https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=800&q=80',
    '8-12 Hz': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    '10 Hz': 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80',
    '33 Hz': 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80',
    '66 Hz': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
    '396/417/639 Hz': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80',
    '417 Hz': 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=800&q=80',
    '528 Hz': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    '852 Hz': 'https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=800&q=80',
    '1441 Hz': 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&q=80',
    '2772 Hz': 'https://images.unsplash.com/photo-1472552944129-b035e9ea3744?w=800&q=80',
  };

  const thumbnailUrl = type === 'frequency' 
    ? (sound.frequency && frequencyImages[sound.frequency]) || frequencyImages['528 Hz']
    : thumbnailMap[sound.title] || 'https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=800&q=80';

  const Icon = type === 'frequency' ? Radio : Music;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: thumbnailUrl }}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
          style={styles.cardGradient}
        >
          <View style={styles.iconBadge}>
            <Icon size={20} color="#FFFFFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{sound.title}</Text>
            {sound.description && (
              <Text style={styles.cardDescription}>{sound.description}</Text>
            )}
            {sound.benefits && (
              <Text style={styles.cardBenefits}>{sound.benefits}</Text>
            )}
            {sound.frequency && (
              <View style={styles.frequencyBadge}>
                <Text style={styles.frequencyText}>{sound.frequency}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#EF4444',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 16,
    marginLeft: 4,
  },
  card: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    height: 280,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageStyle: {
    borderRadius: 24,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  iconBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 24,
    paddingBottom: 28,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  cardBenefits: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
    marginTop: 6,
    fontStyle: 'italic' as const,
  },
  frequencyBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    alignSelf: 'flex-start',
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 100,
  },
});
