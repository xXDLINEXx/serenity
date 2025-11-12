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
import { VideoView, useVideoPlayer } from 'expo-video';
import { Audio } from 'expo-av';
import * as Brightness from 'expo-brightness';
import { useRouter } from 'expo-router';
import { X, SkipForward, SkipBack, Volume2 } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { soundsConfig } from '@/constants/soundsConfig';
import { SoundConfig } from '@/types/soundsConfig';
import { Asset } from 'expo-asset';

const { width, height } = Dimensions.get('window');

interface FullScreenPlayerProps {
initialMediaId: string;
}

async function toSourceAsync(src: number | string | { uri: string } | null | undefined): Promise<string | number | { uri: string } | undefined> {
if (!src) {
  console.warn('[FullScreenPlayer] toSourceAsync: No source provided');
  return undefined;
}

if (typeof src === 'number') {
  console.log('[FullScreenPlayer] toSourceAsync: Using local asset (number)');
  if (Platform.OS === 'web') {
    try {
      const asset = Asset.fromModule(src);
      await asset.downloadAsync();
      console.log('[FullScreenPlayer] toSourceAsync: Web asset URI:', asset.uri);
      if (!asset.uri) {
        console.error('[FullScreenPlayer] Asset has no URI');
        return undefined;
      }
      return asset.uri;
    } catch (error) {
      console.error('[FullScreenPlayer] toSourceAsync: Failed to load asset on web:', error);
      return undefined;
    }
  }
  return src;
}

if (typeof src === 'object' && 'uri' in src) {
  console.log('[FullScreenPlayer] toSourceAsync: Using URI from object:', src.uri);
  if (!src.uri) {
    console.error('[FullScreenPlayer] Object has empty URI');
    return undefined;
  }
  return Platform.OS === 'web' ? src.uri : src;
}

if (typeof src === 'string') {
  console.log('[FullScreenPlayer] toSourceAsync: Using string URI:', src);
  return src;
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
const [volume, setVolume] = useState<number>(1.0);
const [brightness, setBrightness] = useState<number>(0.5);
const [showControls, setShowControls] = useState<boolean>(true);
const [videoSource, setVideoSource] = useState<any>(undefined);
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
  
  if (Platform.OS !== 'web') {
    Brightness.getBrightnessAsync().then(setBrightness).catch(console.error);
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
    soundRef.current.setVolumeAsync(volume).catch(console.error);
  }
}, [volume]);

useEffect(() => {
  if (Platform.OS !== 'web') {
    Brightness.setBrightnessAsync(brightness).catch(console.error);
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
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
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

    console.log('[FullScreenPlayer] Loading video...');
    const videoSourceResolved = await toSourceAsync(currentMedia.video);
    console.log('[FullScreenPlayer] Video source after toSourceAsync:', videoSourceResolved);
    console.log('[FullScreenPlayer] Video source type:', typeof videoSourceResolved);
    
    if (videoSourceResolved) {
      console.log('[FullScreenPlayer] Setting video source...');
      setVideoSource(videoSourceResolved);
      if (videoPlayer && Platform.OS !== 'web') {
        try {
          videoPlayer.replace(videoSourceResolved as any);
          videoPlayer.play();
        } catch (videoError) {
          console.error('[FullScreenPlayer] Error replacing video:', videoError);
        }
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
  videoPlayer.pause();
  await cleanup();
  router.back();
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
    <StatusBar hidden />
    
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
        src={typeof videoSource === 'string' ? videoSource : (typeof videoSource === 'object' && 'uri' in videoSource ? videoSource.uri : '')}
        autoPlay
        loop
        muted
        playsInline
        onError={(e) => {
          const src = typeof videoSource === 'string' ? videoSource : (typeof videoSource === 'object' && 'uri' in videoSource ? videoSource.uri : 'unknown');
          console.error('[FullScreenPlayer] Video error event:', e);
          console.error('[FullScreenPlayer] Video src:', src);
          console.error('[FullScreenPlayer] Video source type:', typeof videoSource);
          console.error('[FullScreenPlayer] Video source value:', JSON.stringify(videoSource));
          console.error('[FullScreenPlayer] Current media ID:', currentMedia.id);
          console.error('[FullScreenPlayer] Original video value:', currentMedia.video);
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