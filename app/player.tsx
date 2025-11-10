import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Play,
  Pause,
  X,
  Clock,
} from 'lucide-react-native';
import { useAudio } from '@/contexts/AudioContext';
import { sleepSounds, SleepSound } from '@/constants/sleepSounds';
import { healingFrequencies, HealingFrequency } from '@/constants/frequencies';
import { getAudioSource, getFrequencySource } from '../utils/tryRequire';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const audio = useAudio();

  const soundId = params.id as string;
  const type = params.type as 'sound' | 'frequency';

  const item: SleepSound | HealingFrequency | undefined =
    type === 'sound'
      ? sleepSounds.find((s) => s.id === soundId)
      : healingFrequencies.find((f) => f.id === soundId);

  const config = visualConfig[soundId] || visualConfig.frequency;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    rotateLoop.start();
    pulseLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const handleBack = async () => {
    await audio.stopSound();
    router.back();
  };

  const handlePlayPause = async () => {
    if (!item) return;

    let url = '';

    try {
      let source: any;

      // 🔊 Sons normaux (pluie, feu, vent...)
      if (type === 'sound') {
        source = getAudioSource(item.id);
      }
      // 🎶 Fréquences (Hz)
      else if (type === 'frequency') {
        source = getFrequencySource(item.id);
      } else {
        throw new Error(`Type inconnu: ${type}`);
      }

      url = source.default || source;
    } catch (err) {
      console.warn(`[PlayerScreen] Fichier introuvable pour l'id: ${item.id}`, err);
      url = ('audioUrl' in item && item.audioUrl) ? item.audioUrl : '';
    }

    const title = item.title || '';

    if (audio.currentTrack === url && audio.isPlaying) {
      await audio.pauseSound();
    } else {
      await audio.playSound(url, title);
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Son non trouvé</Text>
      </View>
    );
  }

  const Icon = config.icon;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={config.colors as [string, string, ...string[]]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            testID="back-button"
          >
            <ArrowLeft size={28} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lecture en cours</Text>
          <View style={styles.placeholder} />
        </View>

        <Animated.View
          style={[
            styles.visualContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <AnimatedBackground
            config={config}
            pulseAnim={pulseAnim}
            rotateAnim={rotate}
          />
          <Animated.View
            style={[styles.iconCircle, { transform: [{ rotate }, { scale: pulseAnim }] }]}
          >
            <Icon size={80} color="#FFFFFF" strokeWidth={1.5} />
          </Animated.View>
        </Animated.View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {'frequency' in item && (
            <View style={styles.frequencyBadge}>
              <Text style={styles.frequencyText}>{item.frequency} Hz</Text>
            </View>
          )}
        </View>

        <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePlayPause}
              testID="play-pause-button"
            >
              {audio.isPlaying ? (
                <Pause size={48} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={48} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleBack}
              testID="stop-button"
            >
              <X size={32} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {audio.timer && (
          <View style={styles.timerIndicator}>
            <Clock size={16} color="#FFFFFF" />
            <Text style={styles.timerText}>{audio.timer} min</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  backButton: { padding: 8 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  placeholder: { width: 32 },
  visualContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { padding: 40, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)' },
  infoContainer: { alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 4 },
  description: { fontSize: 16, color: '#eee', textAlign: 'center', marginBottom: 10 },
  frequencyBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  frequencyText: { color: '#fff', fontSize: 14 },
  controls: { alignItems: 'center' },
  controlsRow: { flexDirection: 'row', justifyContent: 'center', gap: 40 },
  controlButton: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 20, borderRadius: 60 },
  stopButton: { alignItems: 'center', marginTop: 20 },
  stopButtonText: { color: '#fff', marginTop: 6 },
  timerIndicator: { position: 'absolute', bottom: 20, alignSelf: 'center', flexDirection: 'row', gap: 8, alignItems: 'center' },
  timerText: { color: '#fff' },
  errorText: { color: '#fff', fontSize: 16, textAlign: 'center', marginTop: 20 },
});
