import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  CloudRain,
  Waves,
  Trees,
  Wind,
  Flame,
  Radio,
  Play,
  Pause,
  Clock,
  X,
} from 'lucide-react-native';
import { healingFrequencies, HealingFrequency } from '@/constants/frequencies';
import { sleepSounds, SleepSound } from '@/constants/sleepSounds';
import { useAudio } from '@/contexts/AudioContext';
import React from "react";

const iconMap: Record<string, any> = {
  'cloud-rain': CloudRain,
  waves: Waves,
  trees: Trees,
  wind: Wind,
  flame: Flame,
  radio: Radio,
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
      <LinearGradient colors={['#0F172A', '#1E293B', '#334155']} style={styles.gradient}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.headerTitle}>Sommeil & Guérison</Text>
          <Text style={styles.headerSubtitle}>Sons apaisants et fréquences sacrées</Text>
        </View>

        <View style={styles.tabContainer} testID="tabs">
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sounds' && styles.tabActive]}
            onPress={() => setActiveTab('sounds')}
            testID="tab-sounds"
          >
            <Text style={[styles.tabText, activeTab === 'sounds' && styles.tabTextActive]}>Sons de sommeil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'frequencies' && styles.tabActive]}
            onPress={() => setActiveTab('frequencies')}
            testID="tab-frequencies"
          >
            <Text style={[styles.tabText, activeTab === 'frequencies' && styles.tabTextActive]}>Fréquences sacrées</Text>
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
      </LinearGradient>
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
  const Icon = iconMap[sound.icon];

  return (
    <TouchableOpacity style={styles.card} onPress={onPlay} activeOpacity={0.8} testID={`sound-card-${sound.id}`}>
      <BlurContainer style={styles.cardBlur}>
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: sound.color }]}> 
            <Icon size={32} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{sound.title}</Text>
            <Text style={styles.cardDescription}>{sound.description}</Text>
          </View>
          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={onPlay}
            testID={`play-sound-${sound.id}`}
          >
            {isPlaying ? <Pause size={24} color="#FFFFFF" fill="#FFFFFF" /> : <Play size={24} color="#FFFFFF" fill="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </BlurContainer>
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
  return (
    <TouchableOpacity style={styles.card} onPress={onPlay} activeOpacity={0.8} testID={`frequency-card-${frequency.id}`}>
      <BlurContainer style={styles.cardBlur}>
        <View style={styles.cardContent}>
          <View style={[styles.frequencyBadge, { backgroundColor: frequency.color }]}>
            <Text style={styles.frequencyNumber}>{frequency.frequency}</Text>
            <Text style={styles.frequencyUnit}>Hz</Text>
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{frequency.title}</Text>
            <Text style={styles.cardDescription}>{frequency.description}</Text>
          </View>
          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={onPlay}
            testID={`play-frequency-${frequency.id}`}
          >
            {isPlaying ? <Pause size={24} color="#FFFFFF" fill="#FFFFFF" /> : <Play size={24} color="#FFFFFF" fill="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </BlurContainer>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '400' as const,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyNumber: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#1E293B',
  },
  frequencyUnit: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#475569',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: '#8B5CF6',
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
});
