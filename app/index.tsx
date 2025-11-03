import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Clock,
  Play,
  Pause,
  X,
} from 'lucide-react-native';
import { healingFrequencies, HealingFrequency } from '@/constants/frequencies';
import { sleepSounds, SleepSound } from '@/constants/sleepSounds';
import { useAudio } from '@/contexts/AudioContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const thumbnailMap: Record<string, string> = {
  rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80',
  ocean: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
  wind: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80',
  fire: 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?w=800&q=80',
  river: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
  night: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
  thunder: 'https://images.unsplash.com/photo-1429552077091-836152271555?w=800&q=80',
  whitenoise: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
};

function BlurContainer({ children, style }: { children: React.ReactNode; style?: any }) {
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          style,
          {
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(12px)' } as any) : {}),
          },
        ]}
      >
        {children}
      </View>
    );
  }
  return (
    <BlurView intensity={20} tint="dark" style={style}>
      {children}
    </BlurView>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'sounds' | 'frequencies'>('sounds');
  const audio = useAudio();
  const [showTimerModal, setShowTimerModal] = useState(false);

  const handlePlaySound = (id: string, type: 'sound' | 'frequency') => {
    console.log('[UI] Opening player', { id, type });
    router.push(`/player?id=${id}&type=${type}`);
  };

  return (
    <View style={styles.container} testID="home-screen">
      <StatusBar barStyle="light-content" />
      <View style={[styles.backgroundContainer, { backgroundColor: '#0A0A0F' }]}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.headerTitle}>Serenity</Text>
          <Text style={styles.headerSubtitle}>Peaceful audio for better sleep</Text>
        </View>

        <View style={styles.tabContainer} testID="tabs">
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sounds' && styles.tabActive]}
            onPress={() => setActiveTab('sounds')}
            testID="tab-sounds"
          >
            <Text style={[styles.tabText, activeTab === 'sounds' && styles.tabTextActive]}>Sounds</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'frequencies' && styles.tabActive]}
            onPress={() => setActiveTab('frequencies')}
            testID="tab-frequencies"
          >
            <Text style={[styles.tabText, activeTab === 'frequencies' && styles.tabTextActive]}>Frequencies</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'sounds' ? (
            <>
              {sleepSounds.map((sound) => (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  isPlaying={audio.currentTrack === sound.audioUrl && audio.isPlaying}
                  onPlay={() => handlePlaySound(sound.id, 'sound')}
                />
              ))}
            </>
          ) : (
            <>
              {healingFrequencies.map((frequency) => (
                <FrequencyCard
                  key={frequency.id}
                  frequency={frequency}
                  isPlaying={audio.currentTrack === frequency.audioUrl && audio.isPlaying}
                  onPlay={() => handlePlaySound(frequency.id, 'frequency')}
                />
              ))}
            </>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {audio.currentTrack && <PlayerBar onTimerPress={() => setShowTimerModal(true)} />}

        {showTimerModal && <TimerModal onClose={() => setShowTimerModal(false)} />}
      </View>
    </View>
  );
}

function PlayerBar({ onTimerPress }: { onTimerPress: () => void }) {
  const audio = useAudio();
  const insets = useSafeAreaInsets();

  return (
    <BlurContainer style={[styles.playerBar, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.playerContent}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerTitle} numberOfLines={1} testID="now-playing">
            {audio.currentTitle}
          </Text>
          <Text style={styles.playerSubtitle}>Lecture en boucle {audio.timer ? `• ${audio.timer} min` : ''}</Text>
        </View>
        <View style={styles.playerControls}>
          <TouchableOpacity style={styles.timerButton} onPress={onTimerPress} testID="open-timer">
            <Clock size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playerButton}
            onPress={
              audio.isPlaying
                ? audio.pauseSound
                : () => audio.playSound(audio.currentTrack!, audio.currentTitle!)
            }
            testID={audio.isPlaying ? 'pause' : 'resume'}
          >
            {audio.isPlaying ? <Pause size={28} color="#FFFFFF" fill="#FFFFFF" /> : <Play size={28} color="#FFFFFF" fill="#FFFFFF" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopButton} onPress={audio.stopSound} testID="stop">
            <X size={24} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </BlurContainer>
  );
}

function TimerModal({ onClose }: { onClose: () => void }) {
  const audio = useAudio();
  const timerOptions = [15, 30, 45, 60, 90, 120];

  const handleSelectTimer = (minutes: number) => {
    console.log('[UI] Set timer', minutes);
    audio.setTimer(minutes);
    onClose();
  };

  const handleClearTimer = () => {
    console.log('[UI] Clear timer');
    audio.setTimer(null);
    onClose();
  };

  return (
    <View style={styles.modalOverlay}>
      <BlurContainer style={styles.modalBlur}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.modalContent} testID="timer-modal">
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Minuteur de sommeil</Text>
            <TouchableOpacity onPress={onClose} testID="close-timer">
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          <View style={styles.timerGrid}>
            {timerOptions.map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[styles.timerOption, audio.timer === minutes && styles.timerOptionActive]}
                onPress={() => handleSelectTimer(minutes)}
                testID={`timer-${minutes}`}
              >
                <Text style={[styles.timerOptionText, audio.timer === minutes && styles.timerOptionTextActive]}>
                  {minutes} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {audio.timer && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearTimer} testID="clear-timer">
              <Text style={styles.clearButtonText}>Désactiver le minuteur</Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurContainer>
    </View>
  );
}

function SoundCard({ sound, isPlaying, onPlay }: { sound: SleepSound; isPlaying: boolean; onPlay: () => void }) {
  const thumbnailUrl = thumbnailMap[sound.id] || thumbnailMap.rain;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPlay} 
      activeOpacity={0.9} 
      testID={`sound-card-${sound.id}`}
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
          <View style={styles.cardContentNew}>
            <Text style={styles.cardTitleNew}>{sound.title}</Text>
            <Text style={styles.cardDescriptionNew}>{sound.description}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

function FrequencyCard({
  frequency,
  isPlaying,
  onPlay,
}: {
  frequency: HealingFrequency;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const frequencyImages: Record<string, string> = {
    '4-7 Hz': 'https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=800&q=80',
    '8-12 Hz': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    '10 Hz': 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80',
    '33 Hz': 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&q=80',
    '66 Hz': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
    '396/417/639 Hz': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80',
    '417 Hz': 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=800&q=80',
    '852 Hz': 'https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=800&q=80',
    '1441 Hz': 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&q=80',
    '2772 Hz': 'https://images.unsplash.com/photo-1472552944129-b035e9ea3744?w=800&q=80',
  };
  
  const thumbnailUrl = frequencyImages[frequency.frequency] || 'https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=800&q=80';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPlay} 
      activeOpacity={0.9} 
      testID={`frequency-card-${frequency.id}`}
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
          <View style={styles.cardContentNew}>
            <Text style={styles.cardTitleNew}>{frequency.title}</Text>
            <Text style={styles.cardDescriptionNew}>{frequency.description}</Text>
            <Text style={styles.cardBenefits}>{frequency.benefits}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  backgroundContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '400' as const,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    height: 280,
    width: SCREEN_WIDTH - 32,
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
  cardContentNew: {
    padding: 24,
    paddingBottom: 28,
  },
  cardTitleNew: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardDescriptionNew: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 100,
  },
  playerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  playerInfo: {
    flex: 1,
    marginRight: 16,
  },
  playerTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  playerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  modalBlur: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  timerOption: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timerOptionActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  timerOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#94A3B8',
  },
  timerOptionTextActive: {
    color: '#FFFFFF',
  },
  clearButton: {
    paddingVertical: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#EF4444',
  },
  cardBenefits: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
    marginTop: 6,
    fontStyle: 'italic' as const,
  },
});
