export interface SleepSound {
  id: string;
  title: string;
  description: string;
  icon: 'cloud-rain' | 'waves' | 'trees' | 'wind' | 'flame' | 'radio';
  color: string;
  audioUrl: string;
}

export const sleepSounds: SleepSound[] = [
  {
    id: 'rain',
    title: 'Gentle Rain',
    description: 'Soothing rainfall ambience',
    icon: 'cloud-rain',
    color: '#60A5FA',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8a0fc0e14.mp3',
  },
  {
    id: 'ocean',
    title: 'Ocean Waves',
    description: 'Rhythmic ocean sounds',
    icon: 'waves',
    color: '#3B82F6',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/06/07/audio_9d87e5a3ff.mp3',
  },
  {
    id: 'forest',
    title: 'Forest Night',
    description: 'Nature sounds and crickets',
    icon: 'trees',
    color: '#10B981',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_4084f339d5.mp3',
  },
  {
    id: 'wind',
    title: 'Calm Wind',
    description: 'Soft breeze through trees',
    icon: 'wind',
    color: '#8B5CF6',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_b32a6f8a8b.mp3',
  },
  {
    id: 'thunder',
    title: 'Distant Thunder',
    description: 'Gentle storm ambience',
    icon: 'cloud-rain',
    color: '#64748B',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/01/18/audio_f5a24c9b0f.mp3',
  },
  {
    id: 'river',
    title: 'Mountain Stream',
    description: 'Flowing water sounds',
    icon: 'waves',
    color: '#06B6D4',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/01/30/audio_bba788e9f2.mp3',
  },
  {
    id: 'night',
    title: 'Night Ambience',
    description: 'Peaceful nighttime sounds',
    icon: 'radio',
    color: '#4B5563',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_4084f339d5.mp3',
  },
  {
    id: 'bells',
    title: 'Meditation Bells',
    description: 'Calming bell tones',
    icon: 'radio',
    color: '#D97706',
    audioUrl: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',
  },
];
