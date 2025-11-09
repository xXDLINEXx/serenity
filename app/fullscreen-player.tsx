import { useLocalSearchParams } from "expo-router";
import { FullScreenPlayer } from "@/components/FullScreenPlayer";

export default function Screen() {
  const params = useLocalSearchParams<{ mediaId: string }>();
  return <FullScreenPlayer initialMediaId={params.mediaId} />;
}
