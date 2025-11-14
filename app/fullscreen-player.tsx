import React from "react";
import { useLocalSearchParams } from "expo-router";
import FullScreenPlayer from "@/components/FullScreenPlayer";

export default function FullScreenPlayerScreen() {
  const { mediaId } = useLocalSearchParams();

  if (!mediaId || typeof mediaId !== "string") {
    return null;
  }

  return <FullScreenPlayer initialMediaId={mediaId} />;
}
