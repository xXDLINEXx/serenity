import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getVideoSource } from '@/utils/tryRequire';

type FullScreenPlayerProps = {
  initialMediaId: string;
};

export function FullScreenPlayer({ initialMediaId }: FullScreenPlayerProps) {
  const videoRef = useRef<Video>(null);

  // Cleanup when the user exits the full-screen video
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={getVideoSource(initialMediaId)} // Auto-detects source path from your mapping
        shouldPlay
        isLooping
        resizeMode={ResizeMode.CONTAIN}
        useNativeControls
        style={styles.video}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
});
