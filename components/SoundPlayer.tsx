import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, X, Volume2, VolumeX, SkipBack } from 'lucide-react-native';
import { SoundConfig } from '@/types/soundsConfig';

interface SoundPlayerProps {
  sound: SoundConfig;
  onClose: () => void;
}

export function SoundPlayer({ sound, onClose }: SoundPlayerProps) {
  const insets = useSafeAreaInsets();
  const [audioSound, setAudioSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const player = useVideoPlayer(videoUrl || '', (player) => {
    player.loop = true;
    player.muted = true;
  });

  const performCleanup = useCallback(async () => {
    try {
      if (audioSound) {
        console.log('[SoundPlayer] Stopping and unloading audio');
        await audioSound.stopAsync();
        await audioSound.unloadAsync();
      }
      if (player) {
        console.log('[SoundPlayer] Stopping video');
        player.pause();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
    } catch (error) {
      console.error('[SoundPlayer] Cleanup error:', error);
    }
  }, [audioSound, player]);

  useEffect(() => {
    console.log('[SoundPlayer] Mounting with sound:', sound.title);
    setupAudio();
    
    if (sound.video) {
      console.log('[SoundPlayer] Loading local video asset');
      setVideoUrl(sound.video.toString());
    }
    
    return () => {
      console.log('[SoundPlayer] Unmounting, cleaning up');
      performCleanup();
    };
  }, [sound.title, sound.video, performCleanup]);

  const setupAudio = async () => {
    try {
      console.log('[SoundPlayer] Setting up audio mode for background playback');
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
      });
    } catch (error) {
      console.error('[SoundPlayer] Error setting audio mode:', error);
    }
  };

  const cleanup = async () => {
    try {
      if (audioSound) {
        console.log('[SoundPlayer] Stopping audio');
        await audioSound.stopAsync();
        await audioSound.unloadAsync();
        setAudioSound(null);
      }
      if (player) {
        console.log('[SoundPlayer] Stopping video');
        player.pause();
      }
      setIsPlaying(false);
    } catch (error) {
      console.error('[SoundPlayer] Error during cleanup:', error);
    }
  };

  const loadAndPlay = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await cleanup();

      const audioAsset = sound.audio;
      
      if (!audioAsset) {
        throw new Error('Aucun asset audio disponible');
      }

      console.log('[SoundPlayer] Loading local audio asset:', audioAsset);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioAsset,
        { 
          shouldPlay: true, 
          isLooping: true, 
          volume: isMuted ? 0 : volume 
        },
        onPlaybackStatusUpdate
      );
      
      setAudioSound(newSound);
      setIsPlaying(true);
      console.log('[SoundPlayer] Audio loaded and playing');

      if (player && videoUrl) {
        console.log('[SoundPlayer] Starting video playback');
        player.play();
      }

    } catch (error) {
      console.error('[SoundPlayer] Error loading audio:', error);
      setError('Impossible de charger le son');
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
        console.log('[SoundPlayer] Pausing');
        await audioSound.pauseAsync();
        if (player) player.pause();
      } else {
        console.log('[SoundPlayer] Resuming');
        await audioSound.playAsync();
        if (player) player.play();
      }
    } catch (error) {
      console.error('[SoundPlayer] Error toggling playback:', error);
      setError('Erreur de lecture');
    }
  };

  const handleStop = async () => {
    try {
      if (audioSound) {
        console.log('[SoundPlayer] Stopping');
        await audioSound.stopAsync();
        setIsPlaying(false);
      }
      if (player) {
        player.pause();
        player.currentTime = 0;
      }
    } catch (error) {
      console.error('[SoundPlayer] Error stopping:', error);
    }
  };

  const handleRestart = async () => {
    try {
      if (audioSound) {
        console.log('[SoundPlayer] Restarting');
        await audioSound.setPositionAsync(0);
        await audioSound.playAsync();
      } else {
        await loadAndPlay();
      }
      if (player) {
        player.currentTime = 0;
        player.play();
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

  const handleClose = async () => {
    console.log('[SoundPlayer] Closing player');
    await cleanup();
    onClose();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {videoUrl && (
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="cover"
            nativeControls={false}
          />
          <View style={styles.videoOverlay} />
        </View>
      )}
      <LinearGradient
        colors={videoUrl ? ['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)'] : ['#1E1B4B', '#312E81', '#4C1D95']}
        style={styles.gradient}
      >
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={28} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lecture</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.content, { paddingBottom: insets.bottom + 60 }]}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{sound.title}</Text>
            {sound.description && (
              <Text style={styles.description}>{sound.description}</Text>
            )}
            {sound.benefits && (
              <Text style={styles.benefits}>{sound.benefits}</Text>
            )}
            {sound.frequency && (
              <View style={styles.frequencyBadge}>
                <Text style={styles.frequencyText}>{sound.frequency}</Text>
              </View>
            )}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.controls}>
            <View style={styles.mainControls}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleRestart}
                disabled={isLoading}
              >
                <SkipBack size={32} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.playButton, isLoading && styles.playButtonDisabled]}
                onPress={handlePlayPause}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="#FFFFFF" />
                ) : isPlaying ? (
                  <Pause size={48} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Play size={48} color="#FFFFFF" fill="#FFFFFF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleStop}
                disabled={isLoading}
              >
                <X size={32} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <View style={styles.volumeControls}>
              <TouchableOpacity onPress={handleMuteToggle} style={styles.muteButton}>
                {isMuted ? (
                  <VolumeX size={24} color="#FFFFFF" />
                ) : (
                  <Volume2 size={24} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              
              <View style={styles.volumeSliderContainer}>
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((vol) => (
                  <TouchableOpacity
                    key={vol}
                    style={[
                      styles.volumeDot,
                      volume >= vol && !isMuted && styles.volumeDotActive,
                    ]}
                    onPress={() => handleVolumeChange(vol)}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isPlaying ? '▶ Lecture en boucle' : isLoading ? 'Chargement...' : '⏸ En pause'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  benefits: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic' as const,
  },
  frequencyBadge: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  frequencyText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#FCA5A5',
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
    gap: 32,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  muteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeSliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volumeDot: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  volumeDotActive: {
    backgroundColor: '#FFFFFF',
  },
  statusContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600' as const,
  },
});
