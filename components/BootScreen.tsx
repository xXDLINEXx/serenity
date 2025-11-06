import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface BootScreenProps {
  onFinish: () => void;
}

export function BootScreen({ onFinish }: BootScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const letterAnims = useRef(
    'Drift into peaceful sleep'.split('').map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
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
      ]),
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.stagger(
          50,
          letterAnims.map((anim) =>
            Animated.loop(
              Animated.sequence([
                Animated.timing(anim, {
                  toValue: 1,
                  duration: 400,
                  useNativeDriver: true,
                }),
                Animated.timing(anim, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ])
            )
          )
        ),
      ]),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
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
  }, [fadeAnim, scaleAnim, logoOpacity, glowAnim, letterAnims, onFinish]);



  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0d0d0d', '#1a1a2e', '#0d0d0d']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.glowCircle,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.7],
              }),
              transform: [
                {
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.15],
                  }),
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/uiamvomi7oant6plfs9c6' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            {'Drift into peaceful sleep'.split('').map((char, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.letterText,
                  {
                    opacity: letterAnims[index],
                    transform: [
                      {
                        translateY: letterAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -8],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {char === ' ' ? '\u00A0' : char}
              </Animated.Text>
            ))}
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
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginTop: -120,
  },
  textContainer: {
    flexDirection: 'row',
    marginTop: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  letterText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '300' as const,
    letterSpacing: 1,
  },
  logoImage: {
    width: 400,
    height: 400,
  },
  glowCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(147, 51, 234, 0.15)',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
});
