import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import type { SoundEntry } from '@/constants/soundsConfig';

interface Props {
  sound: SoundEntry;
  onClose: () => void;
}

export function SoundPlayer({ sound, onClose }: Props) {
  const [audioObj, setAudioObj] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<Video | null>(null);

  const cleanup = useCallback(async () => {
    if (audioObj) await audioObj.unloadAsync();
  }, [audioObj]);

  const start = useCallback(async () => {
    setLoading(true);
    try {
      const audioSource = typeof sound.audio === 'string' ? { uri: sound.audio } : sound.audio;
      if (audioSource) {
        const { sound: created } = await Audio.Sound.createAsync(
          audioSource as any,
          { shouldPlay: true, isLooping: true },
          onPlaybackStatus
        );
        setAudioObj(created);
      }
      setIsPlaying(true);
    } finally {
      setLoading(false);
    }
  }, [sound]);

  useEffect(() => {
    start();
    return () => {
      cleanup();
    };
  }, [start, cleanup]);

  const onPlaybackStatus = (status: AVPlaybackStatus) => {
    if ('isLoaded' in status && status.isLoaded) setIsPlaying(status.isPlaying);
  };

  const togglePlay = async () => {
    if (!audioObj) return;
    if (isPlaying) {
      await audioObj.pauseAsync();
      setIsPlaying(false);
      await videoRef.current?.pauseAsync();
    } else {
      await audioObj.playAsync();
      setIsPlaying(true);
      await videoRef.current?.playAsync();
    }
  };

  const stopAll = async () => {
    await audioObj?.stopAsync();
    await videoRef.current?.stopAsync();
    setIsPlaying(false);
  };

  const toggleMute = async () => {
    setMuted((m) => {
      const next = !m;
      audioObj?.setVolumeAsync(next ? 0 : 1);
      return next;
    });
  };

  const videoSource = typeof sound.video === 'string' ? { uri: sound.video } : sound.video;

  return (
    <View style={styles.wrapper}>
      {videoSource ? (
        <Video
          ref={videoRef}
          source={videoSource as any}
          style={styles.backgroundVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted={muted}
        />
      ) : (
        <View style={styles.backgroundFallback} />
      )}

      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{sound.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.controls}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <TouchableOpacity onPress={togglePlay} style={styles.btn}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={stopAll} style={styles.btn}>
                <Ionicons name="stop" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleMute} style={styles.btn}>
                <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={28} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#000' },
  backgroundVideo: { position: 'absolute', width: '100%', height: '100%' },
  backgroundFallback: { position: 'absolute', width: '100%', height: '100%', backgroundColor: '#0a0a0f' },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 20 },
  header: { marginTop: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '700' },
  controls: { alignSelf: 'center', flexDirection: 'row', gap: 16, marginBottom: 80 },
  btn: { marginHorizontal: 12, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10 },
});
export default SoundPlayer;
