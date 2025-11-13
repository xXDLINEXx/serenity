import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoundCard } from '@/components/SoundCard';
import { LinearGradient } from 'expo-linear-gradient';
import { soundsConfig } from '@/constants/soundsConfig';
import { healingFrequencies } from '@/constants/frequencies';
import { useAudio } from '@/contexts/AudioContext';
import { Pause, Play, X } from 'lucide-react-native';



const getFrequencyImage = (frequencyId: string): string => {
  const imageMapping: { [key: string]: string } = {
    '4-7hz': 'https://images.unsplash.com/photo-1494233892892-84542a694e72?w=400&q=80',
    '8-12hz': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
    '10hz': 'https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=400&q=80',
    '33hz': 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&q=80',
    '66hz': 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?w=400&q=80',
    '396-hz-417-hz-639hz': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
    '417hz': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    '852hz': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
    '1441hz': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
    '2772hz': 'https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?w=400&q=80',
  };
  return imageMapping[frequencyId] || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80';
};

const sleepSounds = [
  {
    id: "pluie-douce",
    title: "Pluie douce",
    description: "Pluie légère sur les feuilles",
    thumbnail: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(210 40% 20%), hsl(230 35% 15%))",
  },
  {
    id: "vague-de-locean",
    title: "Vague de l'océan",
    description: "Vagues rythmiques de l'océan",
    thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(195 60% 25%), hsl(210 50% 18%))",
  },
  {
    id: "feu-de-camp",
    title: "Feu de camp",
    description: "Crépitement chaleureux du feu",
    thumbnail: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/vr26mlk4l6oqchaekmtwk",
    gradient: "linear-gradient(135deg, hsl(20 60% 20%), hsl(10 50% 15%))",
  },
  {
    id: "foret-paisible",
    title: "Forêt paisible",
    description: "Oiseaux et nature de la forêt",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(140 40% 20%), hsl(160 35% 15%))",
  },
  {
    id: "vent-leger",
    title: "Vent léger",
    description: "Son doux du vent dans les arbres",
    thumbnail: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(180 30% 25%), hsl(200 30% 18%))",
  },
  {
    id: "orage-apaisant",
    title: "Orage apaisant",
    description: "Tonnerre lointain et pluie",
    thumbnail: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(240 30% 20%), hsl(250 35% 15%))",
  },
  {
    id: "riviere-calme",
    title: "Rivière calme",
    description: "Écoulement paisible d'une rivière",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(200 60% 20%), hsl(220 50% 15%))",
  },
  {
    id: "bruit-blanc",
    title: "Bruit blanc",
    description: "Bruit constant et uniforme",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(280 45% 22%), hsl(270 40% 16%))",
  },
];

type Section = 'sounds' | 'frequencies';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const { isPlaying, currentTitle, pauseSound, stopSound, playSound } = useAudio();
  const [activeSection, setActiveSection] = useState<Section>('sounds');

  const getAudioUrlForSound = (soundId: string): string | number => {
    const soundConfig = soundsConfig.find((s) => s.id === soundId);
    const audio = soundConfig?.audio;
    if (typeof audio === 'string' || typeof audio === 'number') {
      return audio;
    }
    return '';
  };

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container} testID="home-screen">
      <LinearGradient
        colors={['#0A1628', '#1A2A4A', '#2A3A5A']}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ backgroundColor: '#0A1628', height: insets.top }} />
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/uiamvomi7oant6plfs9c6' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>
            Plongez dans un sommeil paisible avec des sons apaisants et des fréquences relaxantes
          </Text>
        </View>

        <View style={styles.sectionButtons}>
          <TouchableOpacity
            style={[styles.sectionButton, activeSection === 'sounds' && styles.sectionButtonActive]}
            onPress={() => setActiveSection('sounds')}
            activeOpacity={0.8}
          >
            <Text style={[styles.sectionButtonText, activeSection === 'sounds' && styles.sectionButtonTextActive]}>
              Sons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sectionButton, activeSection === 'frequencies' && styles.sectionButtonActive]}
            onPress={() => setActiveSection('frequencies')}
            activeOpacity={0.8}
          >
            <Text style={[styles.sectionButtonText, activeSection === 'frequencies' && styles.sectionButtonTextActive]}>
              Fréquences
            </Text>
          </TouchableOpacity>
        </View>

        {activeSection === 'sounds' ? (
          <View style={styles.grid}>
            {sleepSounds.map((sound) => (
              <View key={sound.id} style={styles.gridItem}>
                <SoundCard
                  id={sound.id}
                  title={sound.title}
                  description={sound.description}
                  thumbnail={sound.thumbnail}
                  gradient={sound.gradient}
                  audioUrl={getAudioUrlForSound(sound.id)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            {healingFrequencies.map((freq) => {
              console.log(`[Frequency] ${freq.title}: ${freq.audioUrl}`);
              const frequencyImage = getFrequencyImage(freq.id);
              return (
                <View key={freq.id} style={styles.gridItem}>
                  <SoundCard
                    id={freq.id}
                    title={freq.title}
                    description={freq.description}
                    thumbnail={frequencyImage}
                    gradient={`linear-gradient(135deg, ${freq.color}cc, ${freq.color}99, #000000ee)`}
                    audioUrl={freq.audioUrl}
                  />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {currentTitle && (
        <View style={[styles.miniPlayer, { bottom: insets.bottom + 16 }]}>
          <LinearGradient
            colors={['#1E3A8A', '#1E40AF', '#3B82F6']}
            style={styles.miniPlayerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.miniPlayerContent}>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentTitle}</Text>
              <View style={styles.miniPlayerControls}>
                <TouchableOpacity
                  onPress={async () => {
                    if (isPlaying) {
                      await pauseSound();
                    } else {
                      const currentSound = soundsConfig.find(s => s.title === currentTitle);
                      const currentFreq = healingFrequencies.find(f => f.title === currentTitle);
                      
                      if (currentSound && typeof currentSound.audio === 'string') {
                        await playSound(currentSound.audio, currentSound.title);
                      } else if (currentFreq && typeof currentFreq.audioUrl === 'string') {
                        await playSound(currentFreq.audioUrl, currentFreq.title);
                      }
                    }
                  }}
                  style={styles.miniPlayerButton}
                >
                  {isPlaying ? (
                    <Pause size={24} color="#FFFFFF" fill="#FFFFFF" />
                  ) : (
                    <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => stopSound()}
                  style={styles.miniPlayerButton}
                >
                  <X size={24} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 8,
  },
  iconContainer: {
    marginBottom: -60,
    marginTop: -50,
  },
  logo: {
    width: 600,
    height: 360,
  },

  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center' as const,
    lineHeight: 24,
    paddingHorizontal: 32,
    maxWidth: 400,
    marginTop: -40,
    marginBottom: 20,
  },
  sectionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sectionButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
  },
  sectionButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#9CA3AF',
  },
  sectionButtonTextActive: {
    color: '#60A5FA',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 20,
  },
  gridItem: {
    width: '100%',
  },
  miniPlayer: {
    position: 'absolute' as const,
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  miniPlayerGradient: {
    padding: 16,
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniPlayerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginRight: 16,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  miniPlayerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
