import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

interface BootScreenProps {
  onFinish: () => void;
}

export function BootScreen({ onFinish }: BootScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A1628', '#1A2A4A', '#2A3A5A']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
