import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { Audio } from "expo-av";
import { useRouter, useFocusEffect } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { X, SkipForward, SkipBack, Play, Pause } from "lucide-react-native";
import { soundsConfig } from "@/constants/soundsConfig";
import { Asset } from "expo-asset";
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");

// Formater le temps
const formatTime = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/* ---------------------------------------------------------
   🔥 VERSION FINALE SANS CRASH DU toSourceAsync()
   --------------------------------------------------------- */
async function toSourceAsync(src) {
  if (!src) return undefined;

  // Cas 1 — asset local require() (module number)
  if (typeof src === "number") {
    try {
      const asset = Asset.fromModule(src);
      await asset.downloadAsync().catch(() => {});
      return { uri: asset.uri };
    } catch (e) {
      console.log("Local asset error:", e);
      return undefined;
    }
  }

  // Cas 2 — string (chemin relatif ou URL Metro)
  if (typeof src === "string") {
    // Metro génère des URLs http://... donc on renvoie tel quel
    return { uri: src };
  }

  // Cas 3 — objet { uri }
  if (typeof src === "object" && src.uri) {
    return { uri: src.uri };
  }

  return undefined;
}

export function FullScreenPlayer({ initialMediaId }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentMedia, setCurrentMedia] = useState(() =>
    soundsConfig.find((m) => m.id === initialMediaId)
  );

  const [videoSource, setVideoSource] = useState(undefined);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimeoutRef = useRef(null);
  const soundRef = useRef(null);
  const isCleaningRef = useRef(false);

  // Vidéo player
  const videoPlayer = useVideoPlayer(videoSource, (player) => {
    if (videoSource) {
      player.loop = true;
      player.muted = true;
      player.timeUpdateEventInterval = 0.3;
      player.play();
    }
  });

  const videoPlayerRef = useRef(videoPlayer);

  const { isPlaying } = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer?.playing ?? false,
  });

  const { currentTime = 0 } = useEvent(videoPlayer, "timeUpdate", {
    currentTime: videoPlayer?.currentTime ?? 0,
  });

  const duration = videoPlayer?.duration ?? 0;

  // Sync slider
  useEffect(() => {
    if (!isSeeking) setSliderValue(currentTime);
  }, [currentTime, isSeeking]);

  // Load media at mount
  useEffect(() => {
    loadMedia();

    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      SystemUI.setBackgroundColorAsync("transparent");
    }

    return () => {
      if (Platform.OS === "android")
        NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  // Cleanup on leaving screen
  useFocusEffect(
    React.useCallback(() => {
      return () => cleanup();
    }, [])
  );

  useEffect(() => {
    videoPlayerRef.current = videoPlayer;
  }, [videoPlayer]);

  useEffect(() => {
    if (currentMedia) loadMedia();
  }, [currentMedia?.id]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      fadeAnim.setValue(1);

      if (controlsTimeoutRef.current)
        clearTimeout(controlsTimeoutRef.current);

      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 4000);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (controlsTimeoutRef.current)
        clearTimeout(controlsTimeoutRef.current);
    };
  }, [showControls]);

  const handleScreenPress = () => setShowControls((prev) => !prev);

  /* ---------------------------------------------------------
      CLEANUP AUDIO + VIDEO
     --------------------------------------------------------- */
  const cleanup = async () => {
    if (isCleaningRef.current) return;
    isCleaningRef.current = true;

    // Stop audio (parfait)
    if (soundRef.current) {
      const s = soundRef.current;
      soundRef.current = null;

      try {
        await s.setIsLoopingAsync(false);
      } catch (_) {}
      try {
        await s.pauseAsync();
      } catch (_) {}
      try {
        await s.stopAsync();
      } catch (_) {}
      try {
        await s.unloadAsync();
      } catch (_) {}

      console.log("AUDIO CLEANED ✔");
    }

    // Stop video
    try {
      videoPlayerRef.current?.pause();
    } catch (_) {}

    setVideoSource(undefined);

    isCleaningRef.current = false;
  };

  /* ---------------------------------------------------------
      LOAD MEDIA
     --------------------------------------------------------- */
  const loadMedia = async () => {
    await cleanup();

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });

      // audio or frequency
      const rawAudio = currentMedia.audio ?? currentMedia.frequency;
      const audioSrc = await toSourceAsync(rawAudio);

      const { sound } = await Audio.Sound.createAsync(audioSrc, {
        isLooping: true,
        volume: 1.0,
        shouldPlay: false,
      });

      soundRef.current = sound;
      await sound.playAsync();

      // video
      const videoSrc = await toSourceAsync(currentMedia.video);
      if (videoSrc) setVideoSource({ uri: videoSrc.uri });

      setShowControls(true);
    } catch (e) {
      console.log("LOAD ERROR:", e);
    }
  };

  /* ---------------------------------------------------------
      CONTROLS
     --------------------------------------------------------- */
  const handleStop = async () => {
    await cleanup();
    router.back();
  };

  const handleNext = () => {
    const i = soundsConfig.findIndex((s) => s.id === currentMedia.id);
    if (i < soundsConfig.length - 1)
      setCurrentMedia(soundsConfig[i + 1]);
  };

  const handlePrevious = () => {
    const i = soundsConfig.findIndex((s) => s.id === currentMedia.id);
    if (i > 0) setCurrentMedia(soundsConfig[i - 1]);
  };

  const handlePlayPause = async () => {
    const s = soundRef.current;

    if (isPlaying) {
      videoPlayerRef.current?.pause();
      await s.pauseAsync();
    } else {
      videoPlayerRef.current?.play();
      await s.playAsync();
    }
  };

  const handleSeekComplete = async (value) => {
    const pos = value;

    if (videoPlayerRef.current)
      videoPlayerRef.current.currentTime = pos;

    if (soundRef.current)
      await soundRef.current.setPositionAsync(pos * 1000);

    setIsSeeking(false);
  };

  if (!currentMedia)
    return (
      <View>
        <Text>Erreur</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar hidden translucent />

      {videoSource && (
        <VideoView
          style={styles.video}
          player={videoPlayer}
          nativeControls={false}
          contentFit="cover"
        />
      )}

      <Pressable style={StyleSheet.absoluteFill} onPress={handleScreenPress} />

      <Animated.View
        style={[styles.overlay, { opacity: fadeAnim }]}
        pointerEvents={showControls ? "auto" : "none"}
      >
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>{currentMedia.title}</Text>
              <Text style={styles.description}>{currentMedia.description}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={handleStop}>
              <X size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTROLS */}
        <View style={[styles.controls, { paddingBottom: insets.bottom + 32 }]}>
          {/* SLIDER */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(sliderValue)}</Text>

            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration || 1}
              value={sliderValue}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#fff"
              onSlidingStart={() => setIsSeeking(true)}
              onValueChange={(v) => setSliderValue(v)}
              onSlidingComplete={handleSeekComplete}
            />

            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePrevious}
            >
              <SkipBack size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePlayPause}
            >
              {isPlaying ? (
                <Pause size={32} color="#fff" />
              ) : (
                <Play size={32} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleNext}
            >
              <SkipForward size={32} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* STOP */}
          <View style={styles.stopRow}>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={handleStop}
            >
              <X size={40} color="#fff" />
              <Text style={styles.stopText}>STOP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

/* ---------------------------------------------------------
   STYLES
   --------------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  video: { width, height },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "space-between",
  },
  header: { paddingHorizontal: 24 },
  headerContent: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 28, color: "#fff", fontWeight: "bold" },
  description: { fontSize: 16, color: "#fff", opacity: 0.9 },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: { paddingHorizontal: 24 },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  slider: { flex: 1 },
  timeText: { color: "#fff", width: 45, textAlign: "center" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginBottom: 20,
  },
  controlButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  stopRow: { alignItems: "center" },
  stopButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(239,68,68,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(239,68,68,0.6)",
  },
  stopText: { color: "#fff", marginTop: 4, fontWeight: "bold" },
});
