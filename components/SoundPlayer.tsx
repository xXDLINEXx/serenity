import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { SoundConfig } from '@/types/soundsConfig';
import { soundsConfig as sounds } from '@/constants/soundsConfig';

interface Props {
  sound: SoundConfig;
  onClose: () => void;
}

const AUTO_HIDE_MS = 3000;

export function SoundPlayer({ sound: initialSound, onClose }: Props) {
  const [current, setCurrent] = useState<SoundConfig>(initialSound);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<Audio.Sound | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toSource = useCallback((src?: number | string | null) => {
    if (!src) return undefined;
    return typeof src === 'number' ? src : { uri: src };
  }, []);

  const audioSource = useMemo(() => toSource(current.audio ?? undefined), [current, toSource]);
  const videoSource = useMemo(() => toSource(current.video), [current, toSource]);

  const videoPlayer = useVideoPlayer(videoSource as any, (player) => {
    player.loop = true;
    player.muted = true;
  });

  const currentIndex = useMemo(() => sounds.findIndex((s) => s.id === current.id), [current]);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sounds.length - 1;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), AUTO_HIDE_MS);
  }, []);

  const hideControlsNow = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setControlsVisible(false);
  }, []);

  const cleanupMedia = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.stopAsync();
        await audioRef.current.unloadAsync();
      } catch {}
      audioRef.current = null;
    }
    if (videoPlayer) {
      videoPlayer.pause();
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      cleanupMedia();
    };
  }, []);

  const loadAudio = useCallback(async () => {
    if (!audioSource) return;
    if (audioRef.current) {
      try {
        await audioRef.current.unloadAsync();
      } catch {}
      audioRef.current = null;
    }
    const { sound: snd } = await Audio.Sound.createAsync(
      audioSource as any,
      { shouldPlay: true, isLooping: true, volume: 1.0 },
      (status: AVPlaybackStatus) => {
        if ('isLoaded' in status && status.isLoaded) {
          setIsPlaying(status.isPlaying);
        }
      }
    );
    audioRef.current = snd;
  }, [audioSource]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          allowsRecordingIOS: false,
        });

        await loadAudio();

        if (videoSource && videoPlayer) {
          videoPlayer.play();
        }

        if (!cancelled) {
          setIsLoading(false);
          setIsPlaying(true);
          showControls();
        }
      } catch (e: any) {
        console.warn('[SoundPlayer] load error', e?.message ?? e);
        if (!cancelled) {
          setError("Impossible de charger ce média");
          setIsLoading(false);
          setIsPlaying(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [current, loadAudio, videoSource, showControls, videoPlayer]);

  const togglePlay = useCallback(async () => {
    showControls();
    if (audioRef.current) {
      if (isPlaying) await audioRef.current.pauseAsync();
      else await audioRef.current.playAsync();
    }
    if (videoPlayer) {
      if (videoPlayer.playing) videoPlayer.pause();
      else videoPlayer.play();
    }
  }, [isPlaying, showControls, videoPlayer]);

  const goNext = useCallback(() => {
    showControls();
    if (hasNext) setCurrent(sounds[currentIndex + 1]);
  }, [currentIndex, hasNext, showControls]);

  const goPrev = useCallback(() => {
    showControls();
    if (hasPrev) setCurrent(sounds[currentIndex - 1]);
  }, [currentIndex, hasPrev, showControls]);

  return (
    <View style={styles.root}>
      <StatusBar hidden={Platform.OS !== 'web'} barStyle="light-content" />
      <TouchableWithoutFeedback onPress={showControls}>
        <View style={styles.fullscreen}>
          {videoSource ? (
            <VideoView player={videoPlayer} style={styles.video} nativeControls={false} />
          ) : (
            <View style={styles.videoFallback} />
          )}
          {controlsVisible && (
            <View style={styles.controlsWrap}>
              <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={async () => {
                    hideControlsNow();
                    await cleanupMedia();
                    onClose();
                  }}
                  style={styles.iconBtn}
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title} numberOfLines={1}>
                  {current.title}
                </Text>
              </View>
              <View style={styles.centerRow}>
                <TouchableOpacity
                  onPress={goPrev}
                  disabled={!hasPrev}
                  style={[styles.circleBtn, !hasPrev && styles.btnDisabled]}
                >
                  <Ionicons name="play-skip-back" size={26} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={goNext}
                  disabled={!hasNext}
                  style={[styles.circleBtn, !hasNext && styles.btnDisabled]}
                >
                  <Ionicons name="play-skip-forward" size={26} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.bottomBar}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : error ? (
                  <Text style={styles.errorTxt}>{error}</Text>
                ) : (
                  <Text style={styles.helpTxt}>Touchez l'écran pour afficher/masquer les contrôles</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', inset: 0, backgroundColor: '#000' },
  fullscreen: { position: 'absolute', inset: 0, backgroundColor: '#000' },
  video: { position: 'absolute', inset: 0 },
  videoFallback: { position: 'absolute', inset: 0, backgroundColor: '#0b0b0f' },
  controlsWrap: { position: 'absolute', inset: 0, justifyContent: 'space-between' },
  topBar: { marginTop: 24, paddingHorizontal: 16, height: 48, flexDirection: 'row', alignItems: 'center' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '700' },
  centerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22 },
  circleBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.35 },
  bottomBar: { paddingHorizontal: 16, paddingBottom: 28, alignItems: 'center' },
  helpTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  errorTxt: { color: '#ff7a7a', fontSize: 13, textAlign: 'center' },
});

export default SoundPlayer;
