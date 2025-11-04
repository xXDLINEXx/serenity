import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Audio, AVPlaybackStatus, Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SoundConfig } from '@/types/soundsConfig';

interface SoundPlayerProps {
  sound: SoundConfig;
  onClose: () => void;
}

export function SoundPlayer({ sound, onClose }: SoundPlayerProps) {
  const [audioSound, setAudioSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<any>(null);

  // Local asset loading with require
  const audioSource = sound.audio ? require(sound.audio) : sound.frequency ? require(sound.frequency) : null;
  const videoSource = sound.video ? require(sound.video) : null;

  useEffect(() => {
    setupAudio();
    loadAndPlay();

    return () => {
      cleanup();
    };
  }, [sound]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('[SoundPlayer] Error setting audio mode:', error);
    }
  };

  const cleanup = async () => {
    try {
      if (audioSound) {
        await audioSound.unloadAsync();
      }
      if (videoRef.current) {
        if (videoRef.current.stopAsync) {
          await videoRef.current.stopAsync();
        }
      }
    } catch (error) {
      console.error('[SoundPlayer] Cleanup error:', error);
    }
  };

  const loadAndPlay = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!audioSource) throw new Error('Aucun fichier audio trouvé !');

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        {
          shouldPlay: true,
          isLooping: true,
          volume: isMuted ? 0 : volume,
        },
        onPlaybackStatusUpdate
      );

      setAudioSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('[SoundPlayer] Error loading audio:', error);
      setError('Impossible de charger le son en local');
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  };

  const handlePlayPause = async () => {
    if (!audioSound) {
      await loadAndPlay();
      return;
    }

    try {
      if (isPlaying) {
        await audioSound.pauseAsync();
      } else {
        await audioSound.playAsync();
      }
    } catch (error) {
      console.error('[SoundPlayer] Error toggling playback:', error);
      setError('Erreur de lecture');
    }
  };

  const handleStop = async () => {
    try {
      if (audioSound) {
        await audioSound.stopAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('[SoundPlayer] Error stopping:', error);
    }
  };

  const handleRestart = async () => {
    try {
      if (audioSound) {
        await audioSound.setPositionAsync(0);
        await audioSound.playAsync();
      } else {
        await loadAndPlay();
      }
    } catch (error) {
      console.error('[SoundPlayer] Error restarting:', error);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    if (audioSound && !isMuted) {
      try {
        await audioSound.setVolumeAsync(newVolume);
      } catch (error) {
        console.error('[SoundPlayer] Error setting volume:', error);
      }
    }
  };

  const handleMuteToggle = async () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioSound) {
      try {
        await audioSound.setVolumeAsync(newMuted ? 0 : volume);
      } catch (error) {
        console.error('[SoundPlayer] Error toggling mute:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1E1B4B', '#312E81', '#4C1D95']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lecture</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Artwork or video */}
        {videoSource ? (
          <Video
            ref={videoRef}
            source={videoSource}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
          />
        ) : (
          <View style={styles.placeholderVideo}>
            <Ionicons name="musical-notes" size={80} color="#FFFFFF" />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{sound.title}</Text>

          {isLoading && <ActivityIndicator size="large" color="#FFFFFF" />}

          <View style={styles.controls}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRestart}>
              <Ionicons name="play-back" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={48} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleStop}>
              <Ionicons name="stop" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.volumeControls}>
            <TouchableOpacity onPress={handleMuteToggle} style={styles.muteButton}>
              <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.volumeSliderContainer}>
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((vol) => (
                <TouchableOpacity
                  key={vol}
                  style={[
                    styles.volumeDot,
                    volume >= vol && !isMuted ? styles.volumeDotActive : null,
                  ]}
                  onPress={() => handleVolumeChange(vol)}
                />
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1B4B' },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  placeholder: { width: 44 },
  video: { width: '100%', height: '50%' },
  placeholderVideo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', padding: 24 },
  title: { fontSize: 24, color: 'white', marginBottom: 24 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 24, marginVertical: 24 },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    paddingTop: 16,
  },
  muteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeSliderContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  volumeDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  volumeDotAct
