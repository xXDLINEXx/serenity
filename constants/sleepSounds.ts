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
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/13/audio_2fe327e3d4.mp3',
  },
  {
    id: 'ocean',
    title: 'Vagues de l océan',
    description: 'Bruit des vagues qui se brisent sur la plage',
    icon: 'waves',
    color: '#3B82F6',
    audioUrl: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3',
  },
  {
    id: 'forest',
    title: 'Forêt paisible',
    description: 'Sons apaisants de la nature en forêt',
    icon: 'trees',
    color: '#10B981',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf26638.mp3',
  },
  {
    id: 'wind',
    title: 'Vent léger',
    description: 'Murmure doux du vent dans les arbres',
    icon: 'wind',
    color: '#8B5CF6',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/24/audio_c36ef90927.mp3',
  },
  {
    id: 'fire',
    title: 'Feu de camp',
    description: 'Crépitement relaxant d un feu de bois',
    icon: 'flame',
    color: '#F59E0B',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/12/audio_4deacb8d8e.mp3',
  },
  {
    id: 'river',
    title: 'Rivière calme',
    description: 'Eau qui s écoule paisiblement',
    icon: 'waves',
    color: '#06B6D4',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/06/07/audio_0f6748e313.mp3',
  },
  {
    id: 'night',
    title: 'Nuit d été',
    description: 'Ambiance nocturne avec grillons',
    icon: 'trees',
    color: '#0EA5E9',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_78d11cf64e.mp3',
  },
  {
    id: 'thunder',
    title: 'Orage apaisant',
    description: 'Tonnerre lointain et pluie douce',
    icon: 'cloud-rain',
    color: '#64748B',
    audioUrl: 'https://cdn.pixabay.com/audio/2021/11/26/audio_4140d70196.mp3',
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
