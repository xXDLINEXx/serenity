import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import FullscreenPlayer from '../components/FullscreenPlayer'; // ✅ chemin cohérent

export default function FullscreenPlayerScreen() {
  const params = useLocalSearchParams<{ mediaId: string }>();

  return <FullscreenPlayer initialMediaId={params.mediaId} />;
}
