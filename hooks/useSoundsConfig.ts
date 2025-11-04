import { useQuery } from "@tanstack/react-query";
import { SoundConfig } from "@/types/soundsConfig";
import { soundsConfig } from "@/constants/soundsConfig";

export const useSoundsConfig = () => {
  return useQuery<SoundConfig[]>({
    queryKey: ["sounds-config"],
    queryFn: async () => {
      console.log('[useSoundsConfig] Loading local config with', soundsConfig.length, 'items');
      return soundsConfig;
    },
    staleTime: Infinity,
  });
};
