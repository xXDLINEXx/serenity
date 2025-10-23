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
    audioUrl:
      'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Field_Recording_Rain/Field_Recording_Rain_-_Rain_Forest.mp3',
  },
  {
    id: 'ocean',
    title: "Vagues de l'océan",
    description: 'Bruit des vagues qui se brisent sur la plage',
    icon: 'waves',
    color: '#3B82F6',
    audioUrl:
      'https://cdn.pixabay.com/audio/2023/03/10/audio_16e4b6f4c3.mp3',
  },
  {
    id: 'forest',
    title: 'Forêt paisible',
    description: 'Sons apaisants de la nature en forêt',
    icon: 'trees',
    color: '#10B981',
    audioUrl:
      'https://cdn.pixabay.com/audio/2023/05/09/audio_6f9e66aab0.mp3',
  },
  {
    id: 'wind',
    title: 'Vent léger',
    description: 'Murmure doux du vent dans les arbres',
    icon: 'wind',
    color: '#8B5CF6',
    audioUrl:
      'https://cdn.pixabay.com/audio/2023/02/14/audio_f7cfb87e8c.mp3',
  },
  {
    id: 'fire',
    title: 'Feu de camp',
    description: "Crépitement relaxant d'un feu de bois",
    icon: 'flame',
    color: '#F59E0B',
    audioUrl:
      'https://cdn.pixabay.com/audio/2023/03/13/audio_2f20e2f0da.mp3',
  },
  {
    id: 'river',
    title: 'Rivière calme',
    description: 'Eau qui s’écoule paisiblement',
    icon: 'waves',
    color: '#06B6D4',
    audioUrl:
      'https://cdn.pixabay.com/audio/2023/02/20/audio_3a7e4b673f.mp3',
  },
  {
    id: 'night',
    title: 'Nuit d’été',
    description: 'Ambiance nocturne avec grillons',
    icon: 'trees',
    color: '#0EA5E9',
    audioUrl:
      'https://cdn.pixabay.com/audio/2023/03/19/audio_c3a23f238f.mp3',
  },
  {
    id: 'thunder',
    title: 'Orage apaisant',
    description: 'Tonnerre lointain et pluie douce',
    icon: 'cloud-rain',
    color: '#64748B',
    audioUrl:
      'https://cdn.pixabay.com/audio/2023/03/01/audio_76df6b5f1e.mp3',
  },
  {
    id: 'whitenoise',
    title: 'Bruit blanc',
    description: 'Son constant pour masquer les bruits ambiants',
    icon: 'radio',
    color: '#6B7280',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/10/30/audio_efa46c6e98.mp3',
  },
];
