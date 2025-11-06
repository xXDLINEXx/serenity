import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoundCard } from '@/components/SoundCard';
import { LinearGradient } from 'expo-linear-gradient';

const sleepSounds = [
  {
    id: "lake",
    title: "Peaceful Lake",
    description: "Gentle waves and water sounds",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(200 60% 20%), hsl(220 50% 15%))",
  },
  {
    id: "firecamp",
    title: "Crackling Fireplace",
    description: "Warm fire sounds for deep sleep",
    thumbnail: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(20 60% 20%), hsl(10 50% 15%))",
  },
  {
    id: "rain",
    title: "Gentle Rain",
    description: "Soothing rainfall ambience",
    thumbnail: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(210 40% 20%), hsl(230 35% 15%))",
  },
  {
    id: "ocean",
    title: "Ocean Waves",
    description: "Rhythmic waves for relaxation",
    thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(195 60% 25%), hsl(210 50% 18%))",
  },
  {
    id: "forest",
    title: "Forest Night",
    description: "Nature sounds and crickets",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(140 40% 20%), hsl(160 35% 15%))",
  },
  {
    id: "wind",
    title: "Calm Wind",
    description: "Soft breeze through trees",
    thumbnail: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(180 30% 25%), hsl(200 30% 18%))",
  },
  {
    id: "thunder",
    title: "Distant Thunder",
    description: "Gentle storm ambience",
    thumbnail: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(240 30% 20%), hsl(250 35% 15%))",
  },
  {
    id: "stream",
    title: "Mountain Stream",
    description: "Flowing water sounds",
    thumbnail: "https://images.unsplash.com/photo-1520869562399-e772f042f422?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(190 50% 25%), hsl(210 45% 18%))",
  },
  {
    id: "night",
    title: "Night Ambience",
    description: "Peaceful nighttime sounds",
    thumbnail: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(250 40% 18%), hsl(260 35% 12%))",
  },
  {
    id: "meditation",
    title: "Meditation Bells",
    description: "Calming bell tones",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
    gradient: "linear-gradient(135deg, hsl(280 45% 22%), hsl(270 40% 16%))",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container} testID="home-screen">
      <LinearGradient
        colors={['#0A1628', '#1A2A4A', '#2A3A5A']}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ backgroundColor: '#0A1628', height: insets.top }} />
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/uiamvomi7oant6plfs9c6' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>
            Drift into peaceful sleep with calming sounds and soothing frequencies
          </Text>
        </View>

        <View style={styles.grid}>
          {sleepSounds.map((sound) => (
            <View key={sound.id} style={styles.gridItem}>
              <SoundCard {...sound} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 8,
  },
  iconContainer: {
    marginBottom: -60,
    marginTop: -50,
  },
  logo: {
    width: 600,
    height: 360,
  },

  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center' as const,
    lineHeight: 24,
    paddingHorizontal: 32,
    maxWidth: 400,
    marginTop: -40,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 20,
  },
  gridItem: {
    width: '100%',
  },
});
