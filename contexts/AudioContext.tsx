import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

interface AudioContextValue {
  isPlaying: boolean;
  currentTrack: string | null;
  currentTitle: string | null;
  duration: number;
  position: number;
  isLoading: boolean;
  timer: number | null;
  playSound: (url: string, title: string) => Promise<void>;
  pauseSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  setTimer: (minutes: number | null) => void;
}

async function fetchAndConvertToBlob(url: string): Promise<string> {
  const response = await fetch(url, { mode: 'cors', cache: 'force-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export const [AudioProvider, useAudio] = createContextHook<AudioContextValue>(() => {
  const [sound, setSound] = useState<Sound | HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimerState] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const setupAudio = async () => {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      }
    };

    setupAudio();
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        if (Platform.OS === 'web' && sound instanceof HTMLAudioElement) {
          sound.pause();
          sound.src = '';
        } else if (sound && 'unloadAsync' in sound) {
          sound.unloadAsync();
        }
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sound]);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);

      if (status.didJustFinish && !status.isLooping) {
        setPosition(0);
      }
    }
  }, []);

  const playSound = useCallback(
    async (url: string, title: string) => {
      try {
        setIsLoading(true);

        if (sound) {
          if (Platform.OS === 'web' && sound instanceof HTMLAudioElement) {
            sound.pause();
            sound.src = '';
            if (blobUrlRef.current) {
              URL.revokeObjectURL(blobUrlRef.current);
              blobUrlRef.current = null;
            }
          } else if (sound && 'unloadAsync' in sound) {
            await sound.unloadAsync();
          }
        }

        console.log('[Audio] Loading:', url);

        if (Platform.OS === 'web') {
          const audio = new window.Audio();
          audio.loop = true;
          audio.preload = 'auto';
          audio.crossOrigin = 'anonymous';

          audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration * 1000);
          });

          audio.addEventListener('timeupdate', () => {
            setPosition(audio.currentTime * 1000);
          });

          audio.addEventListener('play', () => setIsPlaying(true));
          audio.addEventListener('pause', () => setIsPlaying(false));
          audio.addEventListener('error', () => {
            console.error('[Audio] Playback error for:', url);
          });

          let blobUrl: string | null = null;
          try {
            blobUrl = await fetchAndConvertToBlob(url);
            audio.src = blobUrl;
            await audio.play();
            blobUrlRef.current = blobUrl;
            console.log('[Audio] Playing via blob');
          } catch (err) {
            console.warn('[Audio] Blob failed, trying CORS proxy:', err);
            if (blobUrl) URL.revokeObjectURL(blobUrl);
            try {
              const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
              blobUrl = await fetchAndConvertToBlob(proxyUrl);
              audio.src = blobUrl;
              await audio.play();
              blobUrlRef.current = blobUrl;
              console.log('[Audio] Playing via proxy');
            } catch (proxyErr) {
              console.error('[Audio] All methods failed:', proxyErr);
              if (blobUrl) URL.revokeObjectURL(blobUrl);
              setIsLoading(false);
              return;
            }
          }

          setSound(audio);
          setCurrentTrack(url);
          setCurrentTitle(title);
          setIsPlaying(true);

          if (timer) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              audio.pause();
              audio.src = '';
              if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
              }
              setIsPlaying(false);
              setCurrentTrack(null);
              setCurrentTitle(null);
            }, timer * 60 * 1000);
          }
        } else {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: url },
            { shouldPlay: true, isLooping: true },
            onPlaybackStatusUpdate
          );

          setSound(newSound);
          setCurrentTrack(url);
          setCurrentTitle(title);
          setIsPlaying(true);

          if (timer) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(async () => {
              await newSound.stopAsync();
              await newSound.unloadAsync();
              setIsPlaying(false);
              setCurrentTrack(null);
              setCurrentTitle(null);
            }, timer * 60 * 1000);
          }
        }
      } catch (error) {
        console.error('[Audio] Error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [sound, timer, onPlaybackStatusUpdate]
  );

  const pauseSound = useCallback(async () => {
    if (sound) {
      if (Platform.OS === 'web' && sound instanceof HTMLAudioElement) {
        sound.pause();
        setIsPlaying(false);
      } else if (sound && 'pauseAsync' in sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [sound]);

  const stopSound = useCallback(async () => {
    if (sound) {
      if (Platform.OS === 'web' && sound instanceof HTMLAudioElement) {
        sound.pause();
        sound.currentTime = 0;
        sound.src = '';
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
        setSound(null);
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTitle(null);
        setPosition(0);
      } else if (sound && 'stopAsync' in sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTitle(null);
        setPosition(0);
      }
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [sound]);

  const setTimer = useCallback((minutes: number | null) => {
    setTimerState(minutes);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    isPlaying,
    currentTrack,
    currentTitle,
    duration,
    position,
    isLoading,
    timer,
    playSound,
    pauseSound,
    stopSound,
    setTimer,
  };
});
