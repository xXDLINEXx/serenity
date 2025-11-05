import { tryRequire } from '@/utils/tryRequire';

const FALLBACK_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const FALLBACK_VIDEO = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';
const FALLBACK_FREQ_VIDEO = FALLBACK_VIDEO;

type SoundEntry = {
  title: string;
  audio?: number | string;
  video?: number | string;
  frequency?: number | string;
};

const local = (audioPath?: string, videoPath?: string, freqPath?: string) => {
  const audio = audioPath ? (tryRequire(audioPath) ?? FALLBACK_AUDIO) : undefined;
  const video = videoPath ? (tryRequire(videoPath) ?? FALLBACK_VIDEO) : undefined;
  const frequency = freqPath ? (tryRequire(freqPath) ?? FALLBACK_AUDIO) : undefined;
  return { audio, video, frequency };
};

const sounds: SoundEntry[] = [
  { title: "Vent léger", ...local('../media/audio/vent-leger.mp3', '../media/video/vent-leger.mp4') },
  { title: "Vague de l'océan", ...local('../media/audio/vague-de-locean.mp3', '../media/video/vague-de-locean.mp4') },
  { title: "Rivière calme", ...local('../media/audio/riviere-calme.mp3', '../media/video/riviere-calme.mp4') },
  { title: "Pluie douce", ...local('../media/audio/pluie-douce.mp3', '../media/video/pluie-douce.mp4') },
  { title: "Orage apaisant", ...local('../media/audio/orage-apaisant.mp3', '../media/video/orage-apaisant.mp4') },
  { title: "Forêt paisible", ...local('../media/audio/foret-paisible.mp3', '../media/video/foret-paisible.mp4') },
  { title: "Feu de camp", ...local('../media/audio/feu-de-camp.mp3', '../media/video/feu-de-camp.mp4') },
  { title: "Bruit blanc", ...local('../media/audio/bruit-blanc.mp3', '../media/video/bruit-blanc.mp4') },

  { title: "4–7 Hz – Avec 417 & 639 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/4-7hz-with-417hz-639hz.mp3') },
  { title: "8–12 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/8-to-12-hz.mp3') },
  { title: "10 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/10hz.mp3') },
  { title: "33 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/33hz.mp3') },
  { title: "66 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/66hz.mp3') },
  { title: "396/417/639 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/396-hz-417-hz-639hz.mp3') },
  { title: "417 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/417hz.mp3') },
  { title: "852 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/852hz.mp3') },
  { title: "1441 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/1441hz.mp3') },
  { title: "2772 Hz", ...local(undefined, '../media/frequency/frequence.mp4', '../media/frequency/2772hz.mp3') },
];

export default sounds;
export type { SoundEntry };
