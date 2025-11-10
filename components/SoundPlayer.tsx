import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Video } from 'expo-video';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { soundsConfig as sounds } from '@/constants/soundsConfig';
import { SoundConfig } from '@/types/soundsConfig';

interface Props {
  sound: SoundConfig;
  onClose: () => void;
}

export function SoundPlayer({ sound: initialSound, onClose }: Props) {
  const [current, setCurrent] = useState<SoundConfig>(initialSound);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  const videoRef = useRef<Video>(null);
  const audioRef = useRef<Audio.Sound | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const audioSource = current.audio ? { uri: current.audio } : undefined;
  const videoSource = current.video ? { uri: current.video } : undefined;

  const currentIndex = sounds.findIndex((s) => s.id === current.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sounds.length - 1;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  const cleanupAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.unloadAsync();
      } catch {}
      audioRef.current = null;
    }
  };

  const loadAudio = useCallback(async () => {
    if (!audioSource) return;
    await cleanupAudio();
    const { sound } = await Audio.Sound.createAsync(audioSource, { shouldPlay: true, isLooping: true });
    audioRef.current = sound;
    setIsPlaying(true);
  }, [audioSource]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
        await loadAudio();
        setIsLoading(false);
        if (mounted) showControls();
      } catch (e) {
        console.warn('Erreur chargement audio', e);
        setError('Impossible de charger le son');
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
      cleanupAudio();
    };
  }, [current, loadAudio, showControls]);

  const togglePlay = useCallback(async () => {
    try {
      showControls();
      if (audioRef.current) {
        const status = await audioRef.current.getStatusAsync();
        if (status.isPlaying) {
          await audioRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await audioRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (e) {
      console.warn('Erreur toggle play', e);
    }
  }, [showControls]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    setCurrent(sounds[currentIndex + 1]);
  }, [currentIndex, hasNext]);

  const goPrev = useCallback(() => {
    if (!hasPrev) return;
    setCurrent(sounds[currentIndex - 1]);
  }, [currentIndex, hasPrev]);

  return (
    <View style={styles.root}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View style={styles.full}>
          {videoSource ? (
            <Video
              ref={videoRef}
              style={styles.video}
              source={videoSource}
              isLooping
              shouldPlay
              isMuted
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noVideo} />
          )}

          {controlsVisible && (
            <View style={styles.controls}>
              <TouchableOpacity onPress={onClose} style={styles.topClose}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>

              <View style={styles.centerRow}>
                <TouchableOpacity disabled={!hasPrev} onPress={goPrev} style={styles.sideBtn}>
                  <Ionicons name="play-skip-back" size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity disabled={!hasNext} onPress={goNext} style={styles.sideBtn}>
                  <Ionicons name="play-skip-forward" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              {isLoading && <ActivityIndicator color="#fff" style={{ marginTop: 10 }} />}
              {error && <Text style={styles.error}>{error}</Text>}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  full: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  video: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  noVideo: { ...StyleSheet.absoluteFillObject, backgroundColor: '#111' },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  centerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtn: { padding: 12, opacity: 0.8 },
  topClose: { position: 'absolute', top: 40, right: 20 },
  error: { color: '#ff7a7a', marginTop: 10 },
});
