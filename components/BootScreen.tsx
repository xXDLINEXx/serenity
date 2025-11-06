import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface BootScreenProps {
  onFinish: () => void;
}

export function BootScreen({ onFinish }: BootScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const particle1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim1, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const particle2Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(particleAnim2, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim2, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const particle3Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(particleAnim3, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim3, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    particle1Loop.start();
    particle2Loop.start();
    particle3Loop.start();

    const timeout = setTimeout(() => {
      pulseLoop.stop();
      particle1Loop.stop();
      particle2Loop.stop();
      particle3Loop.stop();

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500);

    return () => {
      clearTimeout(timeout);
      pulseLoop.stop();
      particle1Loop.stop();
      particle2Loop.stop();
      particle3Loop.stop();
    };
  }, [fadeAnim, scaleAnim, glowAnim, pulseAnim, particleAnim1, particleAnim2, particleAnim3, onFinish]);

  const particle1Translate = particleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  const particle1Opacity = particleAnim1.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 1, 0.6, 0],
  });

  const particle2Translate = particleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const particle2Opacity = particleAnim2.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 1, 0.5, 0],
  });

  const particle3TranslateX = particleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -90],
  });

  const particle3TranslateY = particleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const particle3Opacity = particleAnim3.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 1, 0.4, 0],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#000000']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.imageWrapper}>
            <Animated.View
              style={[
                styles.glowEffect,
                { opacity: glowAnim },
              ]}
            />
            
            <Animated.View
              style={[
                styles.particle,
                styles.particle1,
                {
                  opacity: particle1Opacity,
                  transform: [
                    { translateY: particle1Translate },
                    { scale: pulseAnim },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.particle,
                styles.particle2,
                {
                  opacity: particle2Opacity,
                  transform: [
                    { translateY: particle2Translate },
                    { scale: pulseAnim },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.particle,
                styles.particle3,
                {
                  opacity: particle3Opacity,
                  transform: [
                    { translateX: particle3TranslateX },
                    { translateY: particle3TranslateY },
                    { scale: pulseAnim },
                  ],
                },
              ]}
            />
            
            <Animated.View
              style={[{
                transform: [{ scale: pulseAnim }],
              }]}
            >
              <Image
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ixs5q48yhwper8dmqv9hy' }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
          </View>
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  glowEffect: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#ffffff',
    opacity: 0.15,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 20,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  particle1: {
    top: 100,
    left: 145,
  },
  particle2: {
    bottom: 110,
    right: 145,
  },
  particle3: {
    top: 140,
    right: 80,
  },
});
