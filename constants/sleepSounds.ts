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
    title: 'Pluie douce',
    description: 'Son apaisant de la pluie qui tombe',
    icon: 'cloud-rain',
    color: '#60A5FA',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8a0fc0e14.mp3',
  },
  {
    id: 'ocean',
    title: 'Vagues de l océan',
    description: 'Bruit des vagues qui se brisent sur la plage',
    icon: 'waves',
    color: '#3B82F6',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/06/07/audio_9d87e5a3ff.mp3',
  },
  {
    id: 'forest',
    title: 'Forêt paisible',
    description: 'Sons apaisants de la nature en forêt',
    icon: 'trees',
    color: '#10B981',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_4084f339d5.mp3',
  },
  {
    id: 'wind',
    title: 'Vent léger',
    description: 'Murmure doux du vent dans les arbres',
    icon: 'wind',
    color: '#8B5CF6',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_b32a6f8a8b.mp3',
  },
  {
    id: 'fire',
    title: 'Feu de camp',
    description: 'Crépitement relaxant d un feu de bois',
    icon: 'flame',
    color: '#F59E0B',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_f490a157af.mp3',
  },
  {
    id: 'river',
    title: 'Rivière calme',
    description: 'Eau qui s écoule paisiblement',
    icon: 'waves',
    color: '#06B6D4',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/01/30/audio_bba788e9f2.mp3',
  },
  {
    id: 'night',
    title: 'Nuit d été',
    description: 'Ambiance nocturne avec grillons',
    icon: 'trees',
    color: '#0EA5E9',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_1714f0852e.mp3',
  },
  {
    id: 'thunder',
    title: 'Orage apaisant',
    description: 'Tonnerre lointain et pluie douce',
    icon: 'cloud-rain',
    color: '#64748B',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/01/18/audio_f5a24c9b0f.mp3',
  },
  {
    id: 'whitenoise',
    title: 'Bruit blanc',
    description: 'Son constant pour masquer les bruits ambiants',
    icon: 'radio',
    color: '#6B7280',
    audioUrl: 'generated:whitenoise',
  },
];
