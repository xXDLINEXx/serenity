// FullScreenPlayer.tsx — OPTION A (audio 100% via AudioContext)

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SkipBack, SkipForward, Play, Pause, X } from "lucide-react-native";
import { soundsConfig } from "@/constants/soundsConfig";
import { useAudio } from "@/contexts/AudioContext";

const { width, height } = Dimensions.get("window");

export default function FullScreenPlayer() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();

  const { playSound, pauseSound, stopSound, isPlaying } = useAudio();

  const [currentIndex, setCurrentIndex] = useState(
    soundsConfig.findIndex((s) => s.id === mediaId)
  );

  const fade = useRef(new Animated.Value(1)).current;
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  const current = soundsConfig[currentIndex];

  // 🎬 Video Player (jamais de son, muted)
  const videoPlayer = useVideoPlayer(current.video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Initialisation audio via AudioContext
  useEffect(() => {
    if (!current) return;
    stopSound().finally(() => {
      playSound(current.audio, current.title);
    });
  }, [current?.id]);

  // Nettoyage quand on quitte
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  // Auto-hide des contrôles
  const resetControlsTimer = () => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      setControlsVisible(false);
    }, 4000);
  };

  useEffect(() => {
    if (controlsVisible) {
      Animated.timing(fade, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
      resetControlsTimer();
    } else {
      Animated.timing(fade, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [controlsVisible]);

  const toggleControls = () => {
    setControlsVisible((prev) => !prev);
  };

  const handlePlayPause = () => {
    if (isPlaying) pauseSound();
    else playSound(current.audio, current.title);
  };

  const handleNext = () => {
    if (currentIndex < soundsConfig.length - 1) {
      stopSound();
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      stopSound();
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleStop = () => {
    stopSound();
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* VIDEO */}
      <VideoView
        player={videoPlayer}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Zone tactile */}
      <Pressable style={StyleSheet.absoluteFill} onPress={toggleControls} />

      {/* CONTROLS */}
      <Animated.View
        pointerEvents={controlsVisible ? "auto" : "none"}
        style={[styles.controlsOverlay, { opacity: fade }]}
      >
        {/* TOP BAR */}
        <View style={[styles.topBar, { top: insets.top + 16 }]}>
          <Text style={styles.title}>{current.title}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={handleStop}>
            <X size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* MIDDLE PLAYBACK */}
        <View style={[styles.middleControls, { marginBottom: insets.bottom + 40 }]}>
          <TouchableOpacity
            style={[styles.circleBtn, currentIndex === 0 && styles.disabled]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <SkipBack color="white" size={36} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
            {isPlaying ? (
              <Pause size={40} color="black" />
            ) : (
              <Play size={40} color="black" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleBtn,
              currentIndex === soundsConfig.length - 1 && styles.disabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === soundsConfig.length - 1}
          >
            <SkipForward color="white" size={36} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  video: { width, height },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topBar: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
  },
  middleControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  circleBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "rgba(0,0,0,0.50)",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.3 },
  playBtn: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
