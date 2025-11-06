import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface BootScreenProps {
  onFinish: () => void;
}

export function BootScreen({ onFinish }: BootScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      fadeAnim: new Animated.Value(0),
      scaleAnim: new Animated.Value(0),
      translateYAnim: new Animated.Value(0),
    })),
  []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    rotateLoop.start();
    glowLoop.start();

    particles.forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.parallel([
            Animated.timing(particle.fadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.spring(particle.scaleAnim, {
              toValue: 1,
              tension: 40,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateYAnim, {
              toValue: -50,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.fadeAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scaleAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    const timeout = setTimeout(() => {
      pulseLoop.stop();
      rotateLoop.stop();
      glowLoop.stop();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 3000);

    return () => {
      clearTimeout(timeout);
      pulseLoop.stop();
      rotateLoop.stop();
      glowLoop.stop();
    };
  }, [fadeAnim, scaleAnim, pulseAnim, rotateAnim, glowAnim, onFinish, particles]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0d0d0d', '#1a1a2e', '#0d0d0d']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowOpacity,
              transform: [{ rotate }, { scale: pulseAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(147, 51, 234, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(147, 51, 234, 0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glowGradient}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.glowRing,
            styles.glowRing2,
            {
              opacity: glowOpacity,
              transform: [{ rotate: rotate }, { scale: pulseAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.2)', 'rgba(147, 51, 234, 0.2)', 'rgba(59, 130, 246, 0.2)']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.glowGradient}
          />
        </Animated.View>

        {particles.map((particle, index) => {
          const angle = (index / particles.length) * Math.PI * 2;
          const radius = 150;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <Animated.View
              key={particle.id}
              style={[
                styles.particle,
                {
                  left: width / 2 + x - 4,
                  top: height / 2 + y - 4,
                  opacity: particle.fadeAnim,
                  transform: [
                    { scale: particle.scaleAnim },
                    { translateY: particle.translateYAnim },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(147, 51, 234, 0.8)', 'rgba(59, 130, 246, 0.8)']}
                style={styles.particleGradient}
              />
            </Animated.View>
          );
        })}

        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
            },
          ]}
        >
          <View style={styles.logoShadow} />
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/719ruaz0g96bgzbih3j9r' }}
            style={styles.logoImage}
            resizeMode="contain"
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoImage: {
    width: 300,
    height: 300,
  },
  logoShadow: {
    position: 'absolute',
    width: 300,
    height: 300,
    backgroundColor: 'rgba(147, 51, 234, 0.3)',
    borderRadius: 150,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  glowRing: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    overflow: 'hidden',
  },
  glowRing2: {
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  particleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
