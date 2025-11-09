import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getVideoSource } from '@/utils/tryRequire';

type FullScreenPlayerProps = {
  initialMediaId: string;
};

export default function FullScreenPlayer({ initialMediaId }: FullScreenPlayerProps) {
  const videoRef = useRef<Video>(null);

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
        source={getVideoSource(initialMediaId)}
        shouldPlay
        isLooping
        resizeMode={ResizeMode.COVER}
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
