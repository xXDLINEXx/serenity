import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, StatusBar, Platform } from 'react-native';
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

export default function SoundPlayer({ sound: initialSound, onClose }: Props) {
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

  const currentIndex = useMemo(() => {
    const i = sounds.findIndex((s) => s.id === current.id);
    return i >= 0 ? i : 0;
  }, [current]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sounds.length - 1;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), AUTO_HIDE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (audioRef.current) {
        audioRef.current.unloadAsync().catch(() => {});
        audioRef.current = null;
      }
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
    const { sound: snd } = await Audio.Sound.createAsync(audioSource as any, { shouldPlay: true, isLooping: true, volume: 1.0 },
      (status: AVPlaybackStatus) => {
        if ('isLoaded' in status && status.isLoaded) setIsPlaying(status.isPlaying);
      }
    );
    audioRef.current = snd;
  }, [audioSource]);

  useEffect(() => {
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

        if (videoSource && videoPlayer) videoPlayer.play();

        setIsLoading(false);
        setIsPlaying(true);
        showControls();
      } catch (e: any) {
        console.warn('[SoundPlayer] load error', e?.message ?? e);
        setError("Impossible de charger ce média");
        setIsLoading(false);
        setIsPlaying(false);
      }
    })();
  }, [current, loadAudio, videoSource, showControls, videoPlayer]);

  const togglePlay = useCallback(async () => {
    showControls();
    try {
      if (audioRef.current) {
        if (isPlaying) await audioRef.current.pauseAsync();
        else await audioRef.current.playAsync();
      }
      if (videoPlayer) {
        if (videoPlayer.playing) videoPlayer.pause();
        else videoPlayer.play();
      }
    } catch (e) {
      console.warn('[SoundPlayer] toggle error', e);
    }
  }, [isPlaying, showControls, videoPlayer]);

  const goNext = useCallback(() => {
    showControls();
    if (!hasNext) return;
    setCurrent(sounds[currentIndex + 1]);
  }, [currentIndex, hasNext, showControls]);

  const goPrev = useCallback(() => {
    showControls();
    if (!hasPrev) return;
    setCurrent(sounds[currentIndex - 1]);
  }, [currentIndex, hasPrev, showControls]);

  return (
    <View style={styles.root}>
      <StatusBar hidden={Platform.OS !== 'web'} barStyle="light-content" />
      <TouchableWithoutFeedback onPress={showControls}>
        <View style={styles.fullscreen}>
          {videoSource && <VideoView player={videoPlayer} style={styles.video} nativeControls={false} />}
          {controlsVisible && (
            <View style={styles.controls}>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.navRow}>
                <TouchableOpacity onPress={goPrev} disabled={!hasPrev}>
                  <Ionicons name="play-skip-back" size={26} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={goNext} disabled={!hasNext}>
                  <Ionicons name="play-skip-forward" size={26} color="#fff" />
                </TouchableOpacity>
              </View>
              {isLoading && <ActivityIndicator size="small" color="#fff" />}
              {error && <Text style={styles.errorTxt}>{error}</Text>}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', inset: 0, backgroundColor: '#000' },
  fullscreen: { flex: 1, backgroundColor: '#000' },
  video: { flex: 1 },
  controls: { position: 'absolute', inset: 0, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  closeBtn: { alignSelf: 'flex-start', marginTop: 40, marginLeft: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20 },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 30 },
  playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  errorTxt: { color: '#ff7a7a', fontSize: 14, textAlign: 'center' },
});
