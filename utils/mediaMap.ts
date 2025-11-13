import { tryRequire } from './tryRequire';

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  audioPath: any;
  videoPath: any;
  thumbnail: string;
}

export const mediaMap: MediaItem[] = [
  {
    id: 'pluie-douce',
    title: 'Pluie Douce',
    description: 'Pluie légère sur les feuilles',
    audioPath: tryRequire('../media/audio/pluie-douce.mp3'),
    videoPath: tryRequire('../media/video/pluie-douce.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&q=80',
  },
  {
    id: 'vague-de-locean',
    title: 'Vague de l\'Océan',
    description: 'Vagues rythmiques de l\'océan',
    audioPath: tryRequire('../media/audio/vague-de-locean.mp3'),
    videoPath: tryRequire('../media/video/vague-de-locean.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&q=80',
  },
  {
    id: 'feu-de-camp',
    title: 'Feu de Camp',
    description: 'Crépitement chaleureux du feu',
    audioPath: tryRequire('../media/audio/feu-de-camp.mp3'),
    videoPath: tryRequire('../media/video/feu-de-camp.mp4'),
    thumbnail: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/vr26mlk4l6oqchaekmtwk',
  },
  {
    id: 'foret-paisible',
    title: 'Forêt Paisible',
    description: 'Oiseaux et nature de la forêt',
    audioPath: tryRequire('../media/audio/foret-paisible.mp3'),
    videoPath: tryRequire('../media/video/foret-paisible.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  },
  {
    id: 'vent-leger',
    title: 'Vent Léger',
    description: 'Son doux du vent dans les arbres',
    audioPath: tryRequire('../media/audio/vent-leger.mp3'),
    videoPath: tryRequire('../media/video/vent-leger.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&q=80',
  },
  {
    id: 'orage-apaisant',
    title: 'Orage Apaisant',
    description: 'Tonnerre lointain et pluie',
    audioPath: tryRequire('../media/audio/orage-apaisant.mp3'),
    videoPath: tryRequire('../media/video/orage-apaisant.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400&q=80',
  },
  {
    id: 'riviere-calme',
    title: 'Rivière Calme',
    description: 'Écoulement paisible d\'une rivière',
    audioPath: tryRequire('../media/audio/riviere-calme.mp3'),
    videoPath: tryRequire('../media/video/riviere-calme.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  },
  {
    id: 'bruit-blanc',
    title: 'Bruit Blanc',
    description: 'Bruit constant et uniforme',
    audioPath: tryRequire('../media/audio/bruit-blanc.mp3'),
    videoPath: tryRequire('../media/video/bruit-blanc.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
  },
  {
    id: '4-7hz',
    title: '4-7 Hz avec 417/639 Hz',
    description: 'Ondes Theta pour sommeil profond',
    audioPath: tryRequire('../media/frequency/4-7hz-with-417hz-639hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1494233892892-84542a694e72?w=400&q=80',
  },
  {
    id: '8-12hz',
    title: '8-12 Hz',
    description: 'Ondes Alpha pour relaxation',
    audioPath: tryRequire('../media/frequency/8-to-12-hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
  },
  {
    id: '10hz',
    title: '10 Hz',
    description: 'Fréquence Alpha optimale',
    audioPath: tryRequire('../media/frequency/10hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=400&q=80',
  },
  {
    id: '33hz',
    title: '33 Hz',
    description: 'Fréquence du Christ',
    audioPath: tryRequire('../media/frequency/33hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&q=80',
  },
  {
    id: '66hz',
    title: '66 Hz',
    description: 'Fréquence sacrée',
    audioPath: tryRequire('../media/frequency/66hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?w=400&q=80',
  },
  {
    id: '396-hz-417-hz-639hz',
    title: '396/417/639 Hz',
    description: 'Triple fréquence Solfège',
    audioPath: tryRequire('../media/frequency/396-hz-417-hz-639hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
  },
  {
    id: '417hz',
    title: '417 Hz',
    description: 'Transformation et changement',
    audioPath: tryRequire('../media/frequency/417hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  },
  {
    id: '852hz',
    title: '852 Hz',
    description: 'Éveil spirituel',
    audioPath: tryRequire('../media/frequency/852hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
  },
  {
    id: '1441hz',
    title: '1441 Hz',
    description: 'Fréquence de guérison',
    audioPath: tryRequire('../media/frequency/1441hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
  },
  {
    id: '2772hz',
    title: '2772 Hz',
    description: 'Haute fréquence énergétique',
    audioPath: tryRequire('../media/frequency/2772hz.mp3'),
    videoPath: tryRequire('../media/video/frequence.mp4'),
    thumbnail: 'https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?w=400&q=80',
  },
];

export function getMediaById(id: string): MediaItem | undefined {
  return mediaMap.find(item => item.id === id);
}

export function getMediaIndex(id: string): number {
  return mediaMap.findIndex(item => item.id === id);
}

export function getNextMedia(currentId: string): MediaItem | undefined {
  const currentIndex = getMediaIndex(currentId);
  if (currentIndex === -1) return undefined;
  const nextIndex = (currentIndex + 1) % mediaMap.length;
  return mediaMap[nextIndex];
}

export function getPreviousMedia(currentId: string): MediaItem | undefined {
  const currentIndex = getMediaIndex(currentId);
  if (currentIndex === -1) return undefined;
  const prevIndex = currentIndex === 0 ? mediaMap.length - 1 : currentIndex - 1;
  return mediaMap[prevIndex];
}
