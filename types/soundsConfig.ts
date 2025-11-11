export interface SoundConfig {
  id: string;
  title: string;
  type: string;
  audio?: string | number | { uri: string } | null;
  video?: string | number | { uri: string } | null;
  frequency?: string | null;
  description?: string | null;
  benefits?: string | null;
}

export type SoundsConfig = SoundConfig[];
