import { useQuery } from "@tanstack/react-query";

export interface SoundItem {
  title: string;
  type: string;
  audio?: string | null;
  video?: string | null;
  frequency?: string | null;
  description?: string | null;
  benefits?: string | null;
}

export const useSoundsConfig = () => {
  const CONFIG_URL =
    "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/soundsConfig.json";

  return useQuery<SoundItem[]>({
    queryKey: ["sounds-config"],
    queryFn: async () => {
      console.log('[useSoundsConfig] Fetching from:', CONFIG_URL);
      
      const response = await fetch(CONFIG_URL, {
        headers: { "Cache-Control": "no-cache" },
      });

      if (!response.ok) {
        console.error('[useSoundsConfig] HTTP error:', response.status);
        throw new Error(`Failed to load JSON: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('[useSoundsConfig] Invalid format:', typeof data);
        throw new Error("Invalid JSON format: expected array");
      }

      console.log('[useSoundsConfig] Loaded', data.length, 'items');
      return data;
    },
    staleTime: 1000 * 60 * 30,
    retry: 2,
  });
};
