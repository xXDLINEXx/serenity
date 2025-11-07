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
import { Video, ResizeMode, Audio } from 'expo-av';
import * as Brightness from 'expo-brightness';
import { useRouter } from 'expo-router';
import { X, SkipForward, SkipBack, Volume2 } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { mediaMap, getNextMedia, getPreviousMedia, MediaItem } from '@/utils/mediaMap';

const { width, height } = Dimensions.get('window');

interface FullScreenPlayerProps {
  initialMediaId: string;
}

export function FullScreenPlayer({ initialMediaId }: FullScreenPlayerProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [currentMedia, setCurrentMedia] = useState<MediaItem | undefined>(() => 
    mediaMap.find(m => m.id === initialMediaId)
  );
  const [volume, setVolume] = useState<number>(1.0);
  const [brightness, setBrightness] = useState<number>(0.5);
  const [showControls, setShowControls] = useState<boolean>(true);
  
  const videoRef = useRef<Video>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadMedia();
    
    if (Platform.OS !== 'web') {
      Brightness.getBrightnessAsync().then(setBrightness);
    }

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (currentMedia) {
      loadMedia();
    }
  }, [currentMedia?.id]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Brightness.setBrightnessAsync(brightness);
    }
  }, [brightness]);

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
        console.error('Error cleaning up sound:', error);
      }
      soundRef.current = null;
    }
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  const loadMedia = async () => {
    if (!currentMedia) return;

    console.log('[FullScreenPlayer] Loading media:', currentMedia.id);
    console.log('[FullScreenPlayer] Video path:', currentMedia.videoPath);
    console.log('[FullScreenPlayer] Audio path:', currentMedia.audioPath);

    await cleanup();

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const audioSource = currentMedia.audioPath.startsWith('http') 
        ? { uri: currentMedia.audioPath }
        : (currentMedia.audioPath as any);
      
      console.log('[FullScreenPlayer] Loading audio...');
      const { sound } = await Audio.Sound.createAsync(
        audioSource as any,
        { 
          isLooping: true, 
          volume: volume,
          shouldPlay: true,
        }
      );
      soundRef.current = sound;
      await sound.playAsync();
      console.log('[FullScreenPlayer] Audio started successfully');

      if (videoRef.current) {
        const videoSource = currentMedia.videoPath.startsWith('http')
          ? { uri: currentMedia.videoPath }
          : (currentMedia.videoPath as any);
        console.log('[FullScreenPlayer] Loading video with source:', videoSource);
        await videoRef.current.loadAsync(videoSource as any, { shouldPlay: true });
        console.log('[FullScreenPlayer] Video started successfully');
      }
    } catch (error) {
      console.error('[FullScreenPlayer] Error loading media:', error);
      console.error('[FullScreenPlayer] Error details:', JSON.stringify(error, null, 2));
    }
  };

  const handleStop = async () => {
    console.log('[FullScreenPlayer] Stop button pressed');
    await cleanup();
    router.back();
  };

  const handleNext = () => {
    if (!currentMedia) return;
    const nextMedia = getNextMedia(currentMedia.id);
    if (nextMedia) {
      console.log('[FullScreenPlayer] Next media:', nextMedia.id);
      setCurrentMedia(nextMedia);
    }
  };

  const handlePrevious = () => {
    if (!currentMedia) return;
    const prevMedia = getPreviousMedia(currentMedia.id);
    if (prevMedia) {
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
      <StatusBar hidden />
      
      <Video
        ref={videoRef}
        style={styles.video}
        source={(currentMedia.videoPath.startsWith('http') ? { uri: currentMedia.videoPath } : currentMedia.videoPath) as any}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
        onError={(error) => console.error('[Video Error]:', error)}
      />

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
              <Text style={styles.description}>{currentMedia.description}</Text>
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
          <View style={styles.sliderContainer}>
            <Volume2 size={24} color="#FFFFFF" />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={setVolume}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
              thumbTintColor="#FFFFFF"
            />
            <Text style={styles.sliderValue}>{Math.round(volume * 100)}%</Text>
          </View>

          {Platform.OS !== 'web' && (
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>☀️</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={brightness}
                onValueChange={setBrightness}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                thumbTintColor="#FFFFFF"
              />
              <Text style={styles.sliderValue}>{Math.round(brightness * 100)}%</Text>
            </View>
          )}

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
    gap: 24,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sliderLabel: {
    fontSize: 24,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    width: 48,
    textAlign: 'right' as const,
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
