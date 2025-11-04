import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Play,
  Pause,
  X,
  Clock,
  CloudRain,
  Waves,
  Trees,
  Wind,
  Flame,
  Radio,
  Zap,
} from 'lucide-react-native';
import { useAudio } from '@/contexts/AudioContext';
import { sleepSounds, SleepSound } from '@/constants/sleepSounds';
import { healingFrequencies, HealingFrequency } from '@/constants/frequencies';

const { width, height } = Dimensions.get('window');

const visualConfig: Record<string, {
  colors: string[];
  icon: any;
  animation: string;
}> = {
  rain: {
    colors: ['#1E3A8A', '#3B82F6', '#60A5FA'],
    icon: CloudRain,
    animation: 'drops',
  },
  ocean: {
    colors: ['#0C4A6E', '#0369A1', '#0EA5E9'],
    icon: Waves,
    animation: 'waves',
  },
  forest: {
    colors: ['#14532D', '#166534', '#22C55E'],
    icon: Trees,
    animation: 'leaves',
  },
  wind: {
    colors: ['#312E81', '#4C1D95', '#7C3AED'],
    icon: Wind,
    animation: 'flow',
  },
  fire: {
    colors: ['#7C2D12', '#EA580C', '#FB923C'],
    icon: Flame,
    animation: 'flicker',
  },
  river: {
    colors: ['#164E63', '#0891B2', '#22D3EE'],
    icon: Waves,
    animation: 'flow',
  },
  night: {
    colors: ['#0F172A', '#1E293B', '#334155'],
    icon: Trees,
    animation: 'stars',
  },
  thunder: {
    colors: ['#1E293B', '#475569', '#64748B'],
    icon: Zap,
    animation: 'lightning',
  },
  whitenoise: {
    colors: ['#374151', '#4B5563', '#6B7280'],
    icon: Radio,
    animation: 'static',
  },
  frequency: {
    colors: ['#581C87', '#7C3AED', '#A78BFA'],
    icon: Radio,
    animation: 'pulse',
  },
};

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const audio = useAudio();

  const soundId = params.id as string;
  const type = params.type as 'sound' | 'frequency';
  
  const item: SleepSound | HealingFrequency | undefined = type === 'sound' 
    ? sleepSounds.find(s => s.id === soundId)
    : healingFrequencies.find(f => f.id === soundId);

  const config = visualConfig[soundId] || visualConfig.frequency;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    rotateLoop.start();
    pulseLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  const handleBack = async () => {
    await audio.stopSound();
    router.back();
  };

  const handlePlayPause = async () => {
    if (!item) return;

    const url = item.audioUrl;
    const title = item.title;

    if (audio.currentTrack === url && audio.isPlaying) {
      await audio.pauseSound();
    } else {
      await audio.playSound(url, title);
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Son non trouvé</Text>
      </View>
    );
  }

  const Icon = config.icon;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={config.colors as [string, string, ...string[]]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            testID="back-button"
          >
            <ArrowLeft size={28} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lecture en cours</Text>
          <View style={styles.placeholder} />
        </View>

        <Animated.View
          style={[
            styles.visualContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <AnimatedBackground config={config} pulseAnim={pulseAnim} rotateAnim={rotate} />
          
          <Animated.View
            style={[
              styles.iconCircle,
              {
                transform: [{ rotate }, { scale: pulseAnim }],
              },
            ]}
          >
            <Icon size={80} color="#FFFFFF" strokeWidth={1.5} />
          </Animated.View>
        </Animated.View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          {'frequency' in item && (
            <View style={styles.frequencyBadge}>
              <Text style={styles.frequencyText}>{item.frequency} Hz</Text>
            </View>
          )}
        </View>

        <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePlayPause}
              testID="play-pause-button"
            >
              {audio.isPlaying ? (
                <Pause size={48} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={48} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleBack}
              testID="stop-button"
            >
              <X size={32} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {audio.timer && (
          <View style={styles.timerIndicator}>
            <Clock size={16} color="#FFFFFF" />
            <Text style={styles.timerText}>{audio.timer} min</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

function AnimatedBackground({ config, pulseAnim, rotateAnim }: {
  config: typeof visualConfig[string];
  pulseAnim: Animated.Value;
  rotateAnim: Animated.AnimatedInterpolation<string | number>;
}) {
  const particles = Array.from({ length: 20 }, (_, i) => i);

  if (config.animation === 'drops') {
    return (
      <View style={styles.animationContainer}>
        {particles.map((i) => (
          <RainDrop key={i} delay={i * 100} />
        ))}
      </View>
    );
  }

  if (config.animation === 'waves') {
    return (
      <View style={styles.animationContainer}>
        {[0, 1, 2, 3].map((i) => (
          <WaveCircle key={i} delay={i * 800} />
        ))}
      </View>
    );
  }

  if (config.animation === 'lightning') {
    return (
      <View style={styles.animationContainer}>
        <Lightning />
      </View>
    );
  }

  if (config.animation === 'stars') {
    return (
      <View style={styles.animationContainer}>
        {particles.map((i) => (
          <Star key={i} delay={i * 200} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.animationContainer}>
      {particles.slice(0, 8).map((i) => (
        <FloatingParticle key={i} delay={i * 300} />
      ))}
    </View>
  );
}

function RainDrop({ delay }: { delay: number }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const leftPos = useRef(Math.random() * width).current;

  useEffect(() => {
    const animate = () => {
      animValue.setValue(0);
      Animated.timing(animValue, {
        toValue: 1,
        duration: 2000 + Math.random() * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
        delay,
      }).start(() => animate());
    };
    animate();
  }, []);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, height],
  });

  return (
    <Animated.View
      style={[
        styles.raindrop,
        {
          left: leftPos,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

function WaveCircle({ delay }: { delay: number }) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      animValue.setValue(0);
      Animated.timing(animValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
        delay,
      }).start(() => animate());
    };
    animate();
  }, []);

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 0.3, 0],
  });

  return (
    <Animated.View
      style={[
        styles.wave,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
}

function Lightning() {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      setTimeout(() => {
        animValue.setValue(0);
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0.8,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        
        setTimeout(animate, 3000 + Math.random() * 5000);
      }, Math.random() * 2000);
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.lightning,
        {
          opacity: animValue,
        },
      ]}
    />
  );
}

function Star({ delay }: { delay: number }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const leftPos = useRef(Math.random() * width).current;
  const topPos = useRef(Math.random() * height * 0.6).current;

  useEffect(() => {
    const animate = () => {
      animValue.setValue(0);
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 1000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: leftPos,
          top: topPos,
          opacity: animValue,
        },
      ]}
    />
  );
}

function FloatingParticle({ delay }: { delay: number }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const leftPos = useRef(Math.random() * width).current;
  const topPos = useRef(height * 0.3 + Math.random() * height * 0.4).current;

  useEffect(() => {
    const animate = () => {
      animValue.setValue(0);
      Animated.timing(animValue, {
        toValue: 1,
        duration: 3000 + Math.random() * 2000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
        delay,
      }).start(() => animate());
    };
    animate();
  }, []);

  const translateY = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -30, 0],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: leftPos,
          top: topPos,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  placeholder: {
    width: 44,
  },
  visualContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  animationContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  infoContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  frequencyBadge: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  frequencyText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  controls: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  stopButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  stopButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  timerIndicator: {
    position: 'absolute',
    top: 80,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  raindrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 1,
  },
  wave: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    top: height / 2 - 100,
    left: width / 2 - 100,
  },
  lightning: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
