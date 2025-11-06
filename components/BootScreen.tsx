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
  const waveAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim1 = useRef(new Animated.Value(0)).current;
  const sparkleAnim2 = useRef(new Animated.Value(0)).current;

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

    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const sparkle1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim1, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim1, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(400),
      ])
    );

    const sparkle2Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(800),
        Animated.timing(sparkleAnim2, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim2, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(400),
      ])
    );

    pulseLoop.start();
    particle1Loop.start();
    particle2Loop.start();
    particle3Loop.start();
    waveLoop.start();
    sparkle1Loop.start();
    sparkle2Loop.start();

    const timeout = setTimeout(() => {
      pulseLoop.stop();
      particle1Loop.stop();
      particle2Loop.stop();
      particle3Loop.stop();
      waveLoop.stop();
      sparkle1Loop.stop();
      sparkle2Loop.stop();

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
      waveLoop.stop();
      sparkle1Loop.stop();
      sparkle2Loop.stop();
    };
  }, [fadeAnim, scaleAnim, glowAnim, pulseAnim, particleAnim1, particleAnim2, particleAnim3, waveAnim, sparkleAnim1, sparkleAnim2, onFinish]);

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

  const bar1Height = waveAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 1.4, 1, 0.8, 1],
  });

  const bar2Height = waveAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.9, 1.3, 1, 1],
  });

  const bar3Height = waveAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 1.2, 0.9, 1.3, 1],
  });

  const bar4Height = waveAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 0.8, 1.2, 0.9, 1],
  });

  const bar5Height = waveAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [1, 1.1, 1, 1.2, 1],
  });

  const sparkle1Scale = sparkleAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.5, 0],
  });

  const sparkle1Rotate = sparkleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const sparkle2Scale = sparkleAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.5, 0],
  });

  const sparkle2Rotate = sparkleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
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
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/gl6fzmc6levqq2gwickz4' }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
            
            <View style={styles.audioWaveContainer}>
              <Animated.View style={[styles.audioBar, { transform: [{ scaleY: bar1Height }] }]} />
              <Animated.View style={[styles.audioBar, { transform: [{ scaleY: bar2Height }] }]} />
              <Animated.View style={[styles.audioBar, styles.audioBarCenter, { transform: [{ scaleY: bar3Height }] }]} />
              <Animated.View style={[styles.audioBar, { transform: [{ scaleY: bar4Height }] }]} />
              <Animated.View style={[styles.audioBar, { transform: [{ scaleY: bar5Height }] }]} />
            </View>
            
            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkle1,
                {
                  opacity: sparkleAnim1,
                  transform: [{ scale: sparkle1Scale }, { rotate: sparkle1Rotate }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkle2,
                {
                  opacity: sparkleAnim2,
                  transform: [{ scale: sparkle2Scale }, { rotate: sparkle2Rotate }],
                },
              ]}
            />
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
  audioWaveContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    top: '45%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -25 }],
  },
  audioBar: {
    width: 6,
    height: 30,
    backgroundColor: '#8A9BB5',
    borderRadius: 3,
  },
  audioBarCenter: {
    height: 40,
    backgroundColor: '#A8B8D0',
  },
  sparkle: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  sparkle1: {
    top: 60,
    left: 40,
  },
  sparkle2: {
    bottom: 80,
    right: 50,
  },
});
