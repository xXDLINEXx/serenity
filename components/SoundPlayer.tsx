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

export default function SoundPlayer({ sound: initialSound, onClose }: Props) {
  const [current, setCurrent] = useState<SoundConfig>(initialSound);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const audioRef = useRef<Audio.Sound | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toSource = (src?: number | string | null) =>
    src ? (typeof src === 'number' ? src : { uri: src }) : undefined;

  const audioSource = useMemo(() => toSource(current.audio), [current]);
  const videoSource = useMemo(() => toSource(current.video), [current]);

  const videoPlayer = useVideoPlayer(videoSource as any, (player) => {
    player.loop = true;
    player.muted = true; // ✅ vidéo muette
  });

  const currentIndex = useMemo(
    () => sounds.findIndex((s) => s.id === current.id),
    [current]
  );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sounds.length - 1;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), AUTO_HIDE_MS);
  }, []);

  const loadAudio = useCallback(async () => {
    if (!audioSource) return;
    if (audioRef.current) await audioRef.current.unloadAsync().catch(() => {});
    const { sound: snd } = await Audio.Sound.createAsync(
      audioSource as any,
      { shouldPlay: true, isLooping: true, volume: 1.0 },
      (status: AVPlaybackStatus) => {
        if ('isLoaded' in status) setIsPlaying(status.isPlaying);
      }
    );
    audioRef.current = snd;
  }, [audioSource]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      await loadAudio();
      if (videoPlayer) videoPlayer.play();

      if (!cancelled) {
        setIsLoading(false);
        showControls();
      }
    })();

    return () => {
      cancelled = true;
      hideTimer.current && clearTimeout(hideTimer.current);
      audioRef.current?.unloadAsync();
    };
  }, [current, loadAudio, videoPlayer, showControls]);

  const togglePlay = useCallback(async () => {
    showControls();
    if (!audioRef.current) return;

    if (isPlaying) {
      await audioRef.current.pauseAsync();
      videoPlayer?.pause();
    } else {
      await audioRef.current.playAsync();
      videoPlayer?.play();
    }
  }, [isPlaying, videoPlayer, showControls]);

  const goNext = () => hasNext && setCurrent(sounds[currentIndex + 1]);
  const goPrev = () => hasPrev && setCurrent(sounds[currentIndex - 1]);

  return (
    <View style={styles.root}>
      <StatusBar hidden barStyle="light-content" />

      <TouchableWithoutFeedback onPress={showControls}>
        <View style={styles.fullscreen}>
          {videoSource && (
            <VideoView player={videoPlayer} style={styles.video} nativeControls={false} />
          )}

          {controlsVisible && (
            <View style={styles.controlsWrap}>
              <View style={styles.topBar}>
                <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>{current.title}</Text>
                <View style={styles.rightGap} />
              </View>

              <View style={styles.centerRow}>
                <TouchableOpacity
                  onPress={goPrev}
                  disabled={!hasPrev}
                  style={[styles.circleBtn, !hasPrev && styles.btnDisabled]}>
                  <Ionicons name="play-skip-back" size={26} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlay} style={styles.playBtn}>
                  <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={goNext}
                  disabled={!hasNext}
                  style={[styles.circleBtn, !hasNext && styles.btnDisabled]}>
                  <Ionicons name="play-skip-forward" size={26} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.bottomBar}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.helpTxt}>Touchez l’écran pour afficher/masquer les contrôles</Text>
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
  fullscreen: { position: 'absolute', inset: 0 },
  video: { position: 'absolute', inset: 0 },
  controlsWrap: { position: 'absolute', inset: 0, justifyContent: 'space-between' },
  topBar: { marginTop: 24, paddingHorizontal: 16, height: 48, flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  rightGap: { width: 40 },
  centerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22 },
  circleBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  playBtn: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.3 },
  bottomBar: { paddingBottom: 28, alignItems: 'center' },
  helpTxt: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
});
