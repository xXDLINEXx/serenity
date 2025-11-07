export interface MediaItem {
  id: string;
  title: string;
  description: string;
  audioPath: string;
  videoPath: string;
  thumbnail: string;
}

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media';

export const mediaMap: MediaItem[] = [
  {
    id: 'ocean',
    title: 'Vagues de l\'Océan',
    description: 'Vagues rythmiques pour la relaxation',
    audioPath: `${CDN_BASE}/audio/ocean.mp3`,
    videoPath: `${CDN_BASE}/video/ocean.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&q=80',
  },
  {
    id: 'rain',
    title: 'Pluie Douce',
    description: 'Ambiance apaisante de la pluie',
    audioPath: `${CDN_BASE}/audio/rain.mp3`,
    videoPath: `${CDN_BASE}/video/rain.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&q=80',
  },
  {
    id: 'firecamp',
    title: 'Feu de Camp',
    description: 'Sons chaleureux du feu pour un sommeil profond',
    audioPath: `${CDN_BASE}/audio/firecamp.mp3`,
    videoPath: `${CDN_BASE}/video/firecamp.mp4`,
    thumbnail: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/vr26mlk4l6oqchaekmtwk',
  },
  {
    id: 'forest',
    title: 'Nuit en Forêt',
    description: 'Sons de la nature et grillons',
    audioPath: `${CDN_BASE}/audio/forest.mp3`,
    videoPath: `${CDN_BASE}/video/forest.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  },
  {
    id: 'lake',
    title: 'Lac Paisible',
    description: 'Douces vagues et sons de l\'eau',
    audioPath: `${CDN_BASE}/audio/lake.mp3`,
    videoPath: `${CDN_BASE}/video/lake.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  },
  {
    id: 'wind',
    title: 'Vent Calme',
    description: 'Douce brise à travers les arbres',
    audioPath: `${CDN_BASE}/audio/wind.mp3`,
    videoPath: `${CDN_BASE}/video/wind.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=400&q=80',
  },
  {
    id: 'thunder',
    title: 'Tonnerre Lointain',
    description: 'Douce ambiance d\'orage',
    audioPath: `${CDN_BASE}/audio/thunder.mp3`,
    videoPath: `${CDN_BASE}/video/thunder.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=400&q=80',
  },
  {
    id: 'stream',
    title: 'Ruisseau de Montagne',
    description: 'Sons d\'eau qui coule',
    audioPath: `${CDN_BASE}/audio/stream.mp3`,
    videoPath: `${CDN_BASE}/video/stream.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1520869562399-e772f042f422?w=400&q=80',
  },
  {
    id: 'night',
    title: 'Ambiance Nocturne',
    description: 'Sons paisibles de la nuit',
    audioPath: `${CDN_BASE}/audio/night.mp3`,
    videoPath: `${CDN_BASE}/video/night.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&q=80',
  },
  {
    id: 'meditation',
    title: 'Cloches de Méditation',
    description: 'Tons de cloche apaisants',
    audioPath: `${CDN_BASE}/audio/meditation.mp3`,
    videoPath: `${CDN_BASE}/video/meditation.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
  },
  {
    id: '4-7hz',
    title: '4-7 Hz avec 417/639 Hz',
    description: 'Ondes Theta pour sommeil profond',
    audioPath: `${CDN_BASE}/frequency/4-7hz-with-417hz-639hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1494233892892-84542a694e72?w=400&q=80',
  },
  {
    id: '8-12hz',
    title: '8-12 Hz',
    description: 'Ondes Alpha pour relaxation',
    audioPath: `${CDN_BASE}/frequency/8-to-12-hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
  },
  {
    id: '10hz',
    title: '10 Hz',
    description: 'Fréquence Alpha optimale',
    audioPath: `${CDN_BASE}/frequency/10hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=400&q=80',
  },
  {
    id: '33hz',
    title: '33 Hz',
    description: 'Fréquence du Christ',
    audioPath: `${CDN_BASE}/frequency/33hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=400&q=80',
  },
  {
    id: '66hz',
    title: '66 Hz',
    description: 'Fréquence sacrée',
    audioPath: `${CDN_BASE}/frequency/66hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?w=400&q=80',
  },
  {
    id: '396-417-639',
    title: '396/417/639 Hz',
    description: 'Triple fréquence Solfège',
    audioPath: `${CDN_BASE}/frequency/396-hz-417-hz-639hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80',
  },
  {
    id: '417hz',
    title: '417 Hz',
    description: 'Transformation et changement',
    audioPath: `${CDN_BASE}/frequency/417hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  },
  {
    id: '852hz',
    title: '852 Hz',
    description: 'Éveil spirituel',
    audioPath: `${CDN_BASE}/frequency/852hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
  },
  {
    id: '1441hz',
    title: '1441 Hz',
    description: 'Fréquence de guérison',
    audioPath: `${CDN_BASE}/frequency/1441hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
    thumbnail: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80',
  },
  {
    id: '2772hz',
    title: '2772 Hz',
    description: 'Haute fréquence énergétique',
    audioPath: `${CDN_BASE}/frequency/2772hz.mp3`,
    videoPath: `${CDN_BASE}/video/frequence.mp4`,
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
