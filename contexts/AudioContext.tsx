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
          } else if (sound && 'unloadAsync' in sound) {
            await sound.unloadAsync();
          }
        }

        console.log('Loading sound from URL:', url);

        if (Platform.OS === 'web') {
          const audio = new window.Audio();
          audio.loop = true;
          audio.preload = 'auto';
          try {
            audio.crossOrigin = 'anonymous';
          } catch (_e) {
            console.log('crossOrigin not settable');
          }

          audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration * 1000);
            console.log('Audio loaded successfully:', url);
          });

          audio.addEventListener('timeupdate', () => {
            setPosition(audio.currentTime * 1000);
          });

          audio.addEventListener('play', () => {
            setIsPlaying(true);
          });

          audio.addEventListener('pause', () => {
            setIsPlaying(false);
          });

          audio.addEventListener('error', (_e: Event) => {
            const errorMessage = audio.error?.code === 4 
              ? 'Audio source not supported or CORS blocked'
              : (audio.error as any)?.message || 'Unknown audio error';
            console.error('Audio error:', errorMessage);
            console.error('Failed URL:', url);
            console.error('Error code:', audio.error?.code);
          });

          audio.addEventListener('canplaythrough', () => {
            console.log('Audio ready to play:', url);
          });

          const tryPlay = async (src: string) => {
            return new Promise<void>(async (resolve, reject) => {
              try {
                audio.src = src;
                await audio.play();
                resolve();
              } catch (e) {
                reject(e);
              }
            });
          };

          const tryPlayViaBlob = async (src: string) => {
            try {
              const res = await fetch(src);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const blob = await res.blob();
              const objectUrl = URL.createObjectURL(blob);
              try {
                await tryPlay(objectUrl);
                // Revoke later to keep playing; schedule cleanup on pause/stop
                return { objectUrl };
              } catch (err) {
                URL.revokeObjectURL(objectUrl);
                throw err;
              }
            } catch (err) {
              throw err;
            }
          };

          let objectUrlToRevoke: string | null = null;
          try {
            await tryPlay(url);
          } catch (primaryErr) {
            console.warn('Primary playback failed, trying fetch->blob...', primaryErr);
            try {
              const result = await tryPlayViaBlob(url);
              objectUrlToRevoke = result.objectUrl;
            } catch (blobErr) {
              console.warn('Blob playback failed, trying CORS proxy...', blobErr);
              const proxied = `https://cors.isomorphic-git.org/${encodeURIComponent(url)}`;
              try {
                const result = await tryPlayViaBlob(proxied);
                objectUrlToRevoke = result.objectUrl;
              } catch (proxyErr) {
                console.error('Error starting playback:', proxyErr);
                setIsLoading(false);
                throw proxyErr;
              }
            }
          }

          // Keep track to revoke object URL on stop
          (audio as any)._objectUrlToRevoke = objectUrlToRevoke;

          setSound(audio);
          setCurrentTrack(url);
          setCurrentTitle(title);
          setIsPlaying(true);

          if (timer) {
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
              audio.pause();
              if ((audio as any)._objectUrlToRevoke) {
                try { URL.revokeObjectURL((audio as any)._objectUrlToRevoke); } catch {}
                (audio as any)._objectUrlToRevoke = null;
              }
              audio.src = '';
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
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
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
        console.error('Error playing sound:', error);
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
        if ((sound as any)._objectUrlToRevoke) {
          try { URL.revokeObjectURL((sound as any)._objectUrlToRevoke); } catch {}
          (sound as any)._objectUrlToRevoke = null;
        }
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
        if ((sound as any)._objectUrlToRevoke) {
          try { URL.revokeObjectURL((sound as any)._objectUrlToRevoke); } catch {}
          (sound as any)._objectUrlToRevoke = null;
        }
        sound.src = '';
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
