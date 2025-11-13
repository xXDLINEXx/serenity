import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer, VideoSource } from 'expo-video';
import { Audio } from 'expo-av';
import { useRouter, useFocusEffect } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { X, SkipForward, SkipBack } from 'lucide-react-native';
import { soundsConfig } from '@/constants/soundsConfig';
import { SoundConfig } from '@/types/soundsConfig';
import { Asset } from 'expo-asset';

const { width, height } = Dimensions.get('window');

interface FullScreenPlayerProps {
  initialMediaId: string;
}

async function toSourceAsync(src: number | string | { uri: string } | null | undefined): Promise<string | { uri: string } | undefined> {
  if (!src) {
    console.warn('[FullScreenPlayer] toSourceAsync: No source provided');
    return undefined;
  }
  
  if (typeof src === 'number') {
    console.log('[FullScreenPlayer] toSourceAsync: Converting local asset to URI');
    try {
      const asset = Asset.fromModule(src);
      await asset.downloadAsync();
      console.log('[FullScreenPlayer] toSourceAsync: Asset URI:', asset.uri);
      if (!asset.uri) {
        console.error('[FullScreenPlayer] Asset has no URI');
        return undefined;
      }
      return { uri: asset.uri };
    } catch (error) {
      console.error('[FullScreenPlayer] toSourceAsync: Failed to load asset:', error);
      return undefined;
    }
  }
  
  if (typeof src === 'object' && 'uri' in src) {
    console.log('[FullScreenPlayer] toSourceAsync: Using URI from object:', src.uri);
    if (!src.uri) {
      console.error('[FullScreenPlayer] Object has empty URI');
      return undefined;
    }
    return src;
  }
  
  if (typeof src === 'string') {
    console.log('[FullScreenPlayer] toSourceAsync: Using string URI:', src);
    return { uri: src };
  }
  
  console.warn('[FullScreenPlayer] toSourceAsync: Unknown source type:', typeof src, src);
  return undefined;
}

export function FullScreenPlayer({ initialMediaId }: FullScreenPlayerProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [currentMedia, setCurrentMedia] = useState<SoundConfig | undefined>(() => 
    soundsConfig.find(m => m.id === initialMediaId)
  );
  const [showControls, setShowControls] = useState<boolean>(true);
  const [videoSource, setVideoSource] = useState<VideoSource | undefined>(undefined);
  const [isLoadingVideo, setIsLoadingVideo] = useState<boolean>(true);
  const videoPlayer = useVideoPlayer(videoSource, player => {
    if (videoSource) {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  });
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const fadeAnimRef = useRef(new Animated.Value(1));
  const fadeAnim = fadeAnimRef.current;
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadMedia();
    
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden').catch(console.error);
      SystemUI.setBackgroundColorAsync('transparent').catch(console.error);
    }
    
    return () => {
      if (Platform.OS === 'android') {
        NavigationBar.setVisibilityAsync('visible').catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        console.log('[FullScreenPlayer] Screen unfocused, cleaning up');
        cleanup();
      };
    }, [])
  );

  useEffect(() => {
    if (currentMedia) {
      loadMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMedia?.id]);



  useEffect(() => {
    if (showControls) {
      fadeAnim.setValue(1);
      resetControlsTimeout();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showControls]);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  };

  const handleScreenPress = () => {
    setShowControls(!showControls);
    if (!showControls) {
      resetControlsTimeout();
    }
  };

  const cleanup = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.error('[FullScreenPlayer] Error cleaning up sound:', error);
      }
      soundRef.current = null;
    }
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const loadMedia = async () => {
    if (!currentMedia) {
      console.error('[FullScreenPlayer] No current media');
      return;
    }

    console.log('[FullScreenPlayer] Loading media:', currentMedia.id);
    console.log('[FullScreenPlayer] Video raw:', currentMedia.video);
    console.log('[FullScreenPlayer] Audio raw:', currentMedia.audio);

    await cleanup();
    setIsLoadingVideo(true);

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      console.log('[FullScreenPlayer] Loading audio...');
      const audioSource = await toSourceAsync(currentMedia.audio);
      console.log('[FullScreenPlayer] Audio source after toSourceAsync:', audioSource);
      
      if (!audioSource) {
        console.error('[FullScreenPlayer] No audio source available after conversion');
        console.error('[FullScreenPlayer] Original audio value:', currentMedia.audio);
        console.error('[FullScreenPlayer] Audio type:', typeof currentMedia.audio);
        setIsLoadingVideo(false);
        return;
      }
      
      console.log('[FullScreenPlayer] Creating Audio.Sound with source:', JSON.stringify(audioSource));
      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { 
          isLooping: true, 
          volume: 1.0,
          shouldPlay: true,
        }
      );
      soundRef.current = sound;
      await sound.playAsync();
      console.log('[FullScreenPlayer] Audio started successfully');

      console.log('[FullScreenPlayer] Loading video...');
      const videoSourceResolved = await toSourceAsync(currentMedia.video);
      console.log('[FullScreenPlayer] Video source after toSourceAsync:', videoSourceResolved);
      
      if (videoSourceResolved) {
        console.log('[FullScreenPlayer] Setting video source...');
        if (typeof videoSourceResolved === 'object' && 'uri' in videoSourceResolved) {
          const uriString = videoSourceResolved.uri;
          console.log('[FullScreenPlayer] Using URI for video:', uriString);
          setVideoSource({ uri: uriString });
        } else if (typeof videoSourceResolved === 'string') {
          console.log('[FullScreenPlayer] Using string URI for video:', videoSourceResolved);
          setVideoSource({ uri: videoSourceResolved });
        }
        console.log('[FullScreenPlayer] Video loaded successfully');
      } else {
        console.log('[FullScreenPlayer] No video to load');
      }
      
      setIsLoadingVideo(false);
    } catch (error) {
      console.error('[FullScreenPlayer] Error loading media:', error);
      console.error('[FullScreenPlayer] Error details:', JSON.stringify(error, null, 2));
      setIsLoadingVideo(false);
    }
  };

  const handleStop = async () => {
    console.log('[FullScreenPlayer] Stop button pressed');
    await cleanup();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleNext = () => {
    if (!currentMedia) return;
    const currentIndex = soundsConfig.findIndex(s => s.id === currentMedia.id);
    if (currentIndex >= 0 && currentIndex < soundsConfig.length - 1) {
      const nextMedia = soundsConfig[currentIndex + 1];
      console.log('[FullScreenPlayer] Next media:', nextMedia.id);
      setCurrentMedia(nextMedia);
    }
  };

  const handlePrevious = () => {
    if (!currentMedia) return;
    const currentIndex = soundsConfig.findIndex(s => s.id === currentMedia.id);
    if (currentIndex > 0) {
      const prevMedia = soundsConfig[currentIndex - 1];
      console.log('[FullScreenPlayer] Previous media:', prevMedia.id);
      setCurrentMedia(prevMedia);
    }
  };

  if (!currentMedia) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Média non trouvé</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={1} 
      onPress={handleScreenPress}
    >
      <StatusBar hidden translucent backgroundColor="transparent" />
      
      {isLoadingVideo ? (
        <View style={{ width, height, backgroundColor: '#0b0b0f', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Chargement...</Text>
        </View>
      ) : Platform.OS === 'web' && videoSource ? (
        <video
          key={currentMedia.id}
          style={{
            width: width,
            height: height,
            objectFit: 'cover',
          }}
          src={typeof videoSource === 'object' && 'uri' in videoSource ? videoSource.uri : ''}
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            console.error('[FullScreenPlayer] Video error event:', e);
            console.error('[FullScreenPlayer] Video source:', JSON.stringify(videoSource));
            console.error('[FullScreenPlayer] Current media ID:', currentMedia.id);
          }}
          onLoadStart={() => {
            console.log('[FullScreenPlayer] Video load started');
          }}
          onCanPlay={() => {
            console.log('[FullScreenPlayer] Video can play');
          }}
        />
      ) : videoSource ? (
        <VideoView
          style={styles.video}
          player={videoPlayer}
          nativeControls={false}
          contentFit="cover"
        />
      ) : (
        <View style={{ width, height, backgroundColor: '#0b0b0f' }} />
      )}

      <Animated.View 
        style={[
          styles.overlay, 
          { opacity: fadeAnim }
        ]}
        pointerEvents={showControls ? 'auto' : 'none'}
      >
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>{currentMedia.title}</Text>
              <Text style={styles.description}>{currentMedia.description || ''}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleStop}
              activeOpacity={0.8}
            >
              <X size={28} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.controls, { paddingBottom: insets.bottom + 32 }]}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePrevious}
              activeOpacity={0.8}
            >
              <SkipBack size={32} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={handleStop}
              activeOpacity={0.8}
            >
              <X size={40} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.stopText}>STOP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <SkipForward size={32} color="#FFFFFF" fill="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  video: {
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  controls: {
    paddingHorizontal: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  controlButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stopButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    borderColor: 'rgba(239, 68, 68, 0.6)',
    gap: 4,
  },
  stopText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: -4,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
});
