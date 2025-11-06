import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import * as Tone from 'tone';

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

async function generateTone(frequency: number): Promise<string> {
  await Tone.start();
  const synth = new Tone.Oscillator(frequency, 'sine').toDestination();
  const recorder = new Tone.Recorder();
  synth.connect(recorder);
  synth.start();
  recorder.start();
  
  await new Promise(resolve => setTimeout(resolve, 60000));
  
  const recording = await recorder.stop();
  synth.stop();
  synth.dispose();
  
  return URL.createObjectURL(recording as unknown as Blob);
}

async function generateWhiteNoise(): Promise<string> {
  await Tone.start();
  const noise = new Tone.Noise('white').toDestination();
  const recorder = new Tone.Recorder();
  noise.connect(recorder);
  noise.start();
  recorder.start();
  
  await new Promise(resolve => setTimeout(resolve, 60000));
  
  const recording = await recorder.stop();
  noise.stop();
  noise.dispose();
  
  return URL.createObjectURL(recording as unknown as Blob);
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
          // narrow at runtime
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (sound as any).unloadAsync();
        }
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
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
        console.log('[Audio] Starting playback for:', title);
        console.log('[Audio] URL:', url);

        if (sound) {
          if (Platform.OS === 'web' && sound instanceof HTMLAudioElement) {
            sound.pause();
            sound.src = '';
            if (blobUrlRef.current) {
              URL.revokeObjectURL(blobUrlRef.current);
              blobUrlRef.current = null;
            }
          } else if (sound && 'unloadAsync' in sound) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (sound as any).unloadAsync();
          }
        }

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

          audio.addEventListener('play', () => {
            console.log('[Audio] Playing');
            setIsPlaying(true);
          });
          
          audio.addEventListener('pause', () => {
            console.log('[Audio] Paused');
            setIsPlaying(false);
          });
          
          audio.addEventListener('error', (e) => {
            const target = e.target as HTMLAudioElement;
            const errorCode = target.error?.code;
            let errorMessage = 'Unknown error';
            
            if (target.error) {
              switch (target.error.code) {
                case 1:
                  errorMessage = 'MEDIA_ERR_ABORTED: The fetching process was aborted by the user';
                  break;
                case 2:
                  errorMessage = 'MEDIA_ERR_NETWORK: A network error occurred (likely CORS or network issue)';
                  break;
                case 3:
                  errorMessage = 'MEDIA_ERR_DECODE: Error occurred while decoding the media';
                  break;
                case 4:
                  errorMessage = 'MEDIA_ERR_SRC_NOT_SUPPORTED: Media format not supported or blocked by CORS';
                  break;
                default:
                  errorMessage = target.error.message || 'Unknown media error';
              }
            }
            
            console.error('[Audio] Error loading audio:', errorCode, errorMessage, 'URL:', target.src);
            setIsLoading(false);
            setIsPlaying(false);
          });

          let blobUrl: string | null = null;
          
          if (url.startsWith('generated:')) {
            const type = url.split(':')[1];
            console.log('[Audio] Generating sound:', type);
            
            try {
              if (type === 'whitenoise') {
                blobUrl = await generateWhiteNoise();
              } else {
                const freq = parseInt(type, 10);
                blobUrl = await generateTone(freq);
              }
              
              audio.src = blobUrl;
              await audio.play();
              blobUrlRef.current = blobUrl;
              console.log('[Audio] Generated sound playing');
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : String(err);
              console.error('[Audio] Generation failed:', errorMessage, err);
              setIsLoading(false);
              return;
            }
          } else {
            try {
              console.log('[Audio] Loading via HTMLAudioElement:', url);
              audio.src = url;
              
              await new Promise((resolve, reject) => {
                const handleCanPlay = () => {
                  audio.removeEventListener('canplaythrough', handleCanPlay);
                  audio.removeEventListener('error', handleError);
                  resolve(undefined);
                };
                
                const handleError = (e: Event) => {
                  audio.removeEventListener('canplaythrough', handleCanPlay);
                  audio.removeEventListener('error', handleError);
                  const target = e.target as HTMLAudioElement;
                  const error = target.error;
                  let errorMsg = 'Unknown load error';
                  if (error) {
                    errorMsg = `Media Error (Code ${error.code}): `;
                    switch (error.code) {
                      case 1: errorMsg += 'Aborted'; break;
                      case 2: errorMsg += 'Network error (check CORS)'; break;
                      case 3: errorMsg += 'Decode error'; break;
                      case 4: errorMsg += 'Source not supported (CORS or format)'; break;
                    }
                  }
                  reject(new Error(errorMsg));
                };
                
                audio.addEventListener('canplaythrough', handleCanPlay);
                audio.addEventListener('error', handleError);
                
                setTimeout(() => {
                  audio.removeEventListener('canplaythrough', handleCanPlay);
                  audio.removeEventListener('error', handleError);
                  reject(new Error('Load timeout after 15s'));
                }, 15000);
              });
              
              await audio.play();
              console.log('[Audio] Playing successfully');
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : String(err);
              console.error('[Audio] Failed to load direct src:', errorMessage);
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
          console.log('[Audio] Loading on native:', url);
          
          try {
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
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error('[Audio] Native playback error:', errorMessage, err);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('[Audio] Playback error:', errorMessage, error);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (sound as any).pauseAsync();
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (sound as any).stopAsync();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (sound as any).unloadAsync();
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
