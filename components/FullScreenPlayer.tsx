import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import { Asset } from "expo-asset";
import { useRouter, useFocusEffect } from "expo-router";
import Slider from "@react-native-community/slider";
import { X, SkipBack, SkipForward, Play, Pause } from "lucide-react-native";

import { soundsConfig } from "@/constants/soundsConfig";
import { useAudio } from "@/contexts/AudioContext";

const { width } = Dimensions.get("window");

type MediaItem = any; // on reste souple pour ton config

async function toVideoSource(src: any): Promise<{ uri: string } | undefined> {
  if (!src) return undefined;

  // string -> déjà une URI
  if (typeof src === "string") {
    return { uri: src };
  }

  // require() -> number
  if (typeof src === "number") {
    const asset = Asset.fromModule(src);
    await asset.downloadAsync();
    return { uri: asset.localUri ?? asset.uri };
  }

  // { uri: ... }
  if (typeof src === "object" && "uri" in src && typeof src.uri === "string") {
    return { uri: src.uri };
  }

  return undefined;
}

export function FullScreenPlayer({ initialMediaId }: { initialMediaId: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // On cherche par id d'abord, sinon par titre
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(() => {
    const list = soundsConfig as any[];
    const byId = list.find((m) => m.id === initialMediaId);
    if (byId) return byId;
    return list.find((m) => m.title === initialMediaId) ?? null;
  });

  const [videoSource, setVideoSource] = useState<{ uri: string } | undefined>();
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimeoutRef = useRef<any>(null);

  const videoPlayer = useVideoPlayer(videoSource, (player) => {
    if (videoSource) {
      player.loop = true;
      player.muted = true; // 🔇 la vidéo n’a PAS de son, seul l’audioContext joue
      player.timeUpdateEventInterval = 0.5;
      player.play();
    }
  });

  const videoPlayerRef = useRef(videoPlayer);

  const {
    isPlaying,
    duration,
    position,
    playSound,
    pauseSound,
    stopSound,
    currentTitle,
    seek,
  } = useAudio();

  const playingState = useEvent(videoPlayer, "playingChange", {
    isPlaying: videoPlayer?.playing ?? false,
  });

  useEffect(() => {
    videoPlayerRef.current = videoPlayer;
  }, [videoPlayer]);

  // Met à jour le slider selon la position audio
  useEffect(() => {
    if (!isSeeking && duration
