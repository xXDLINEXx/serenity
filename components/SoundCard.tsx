import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';

interface SoundCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  gradient: string;
  audioUrl: string | number;
}

export function SoundCard({ id, title, description, thumbnail, gradient, audioUrl }: SoundCardProps) {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const gradientColors = parseGradient(gradient);

  const handlePress = () => {
    console.log('[SoundCard] Opening fullscreen player for:', id);
    router.push(`/fullscreen-player?mediaId=${id}`);
  };

  return (
    <Pressable
      style={[styles.card, isPressed && styles.cardPressed]}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <ImageBackground
        source={{ uri: thumbnail }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.1)',
            gradientColors[0] || 'rgba(30, 58, 138, 0.7)', 
            gradientColors[1] || 'rgba(0, 0, 0, 0.85)', 
            'rgba(0,0,0,0.95)'
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.gradient}
        >
          <View style={styles.playIconContainer}>
            <View style={styles.playIconBg}>
              <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.description} numberOfLines={2}>{description}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
      
      <View style={styles.shimmer} />
    </Pressable>
  );
}

function parseGradient(gradient: string): string[] {
  const matches = gradient.match(/hsl\([^)]+\)/g);
  if (!matches || matches.length < 2) {
    return ['rgba(30, 58, 138, 0.7)', 'rgba(0, 0, 0, 0.9)'];
  }

  return matches.map(hsl => {
    const values = hsl.match(/\d+/g);
    if (!values || values.length < 3) return 'rgba(0, 0, 0, 0.8)';
    
    const h = parseInt(values[0]);
    const s = parseInt(values[1]);
    const l = parseInt(values[2]);
    
    return `hsla(${h}, ${s}%, ${l}%, 0.8)`;
  });
}

const styles = StyleSheet.create({
  card: {
    height: 260,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    transform: [{ scale: 1 }],
    backgroundColor: '#1a1a2e',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 4,
    shadowOpacity: 0.2,
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: 24,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  playIconContainer: {
    alignSelf: 'flex-end',
  },
  playIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    lineHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  shimmer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    pointerEvents: 'none' as const,
  },
});
