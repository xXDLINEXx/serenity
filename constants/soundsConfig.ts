import { getAudioSource, getVideoSource } from '../utils/tryRequire';

export const soundsConfig = [
  {
    id: "pluie-douce",
    title: "Pluie douce",
    description: "Le son apaisant d’une pluie légère tombant doucement.",
    audio: getAudioSource("pluie-douce"),
    video: getVideoSource("pluie-douce"),
  },
  {
    id: "feu-de-camp",
    title: "Feu de camp",
    description: "Le crépitement réconfortant du feu de bois.",
    audio: getAudioSource("feu-de-camp"),
    video: getVideoSource("feu-de-camp"),
  },
  {
    id: "foret-paisible",
    title: "Forêt paisible",
    description: "Les bruits d’oiseaux et le vent dans les arbres.",
    audio: getAudioSource("foret-paisible"),
    video: getVideoSource("foret-paisible"),
  },
  {
    id: "vague-de-locean",
    title: "Vagues de l’océan",
    description: "Le roulis régulier des vagues sur la plage.",
    audio: getAudioSource("vague-de-locean"),
    video: getVideoSource("vague-de-locean"),
  },
  {
    id: "vent-leger",
    title: "Vent léger",
    description: "Une brise douce et apaisante.",
    audio: getAudioSource("vent-leger"),
    video: getVideoSource("vent-leger"),
  },
  {
    id: "riviere-calme",
    title: "Rivière calme",
    description: "Le murmure tranquille d’un cours d’eau.",
    audio: getAudioSource("riviere-calme"),
    video: getVideoSource("riviere-calme"),
  },
  {
    id: "orage-apaisant",
    title: "Orage apaisant",
    description: "Le grondement lointain du tonnerre accompagné de la pluie.",
    audio: getAudioSource("orage-apaisant"),
    video: getVideoSource("orage-apaisant"),
  },
  {
    id: "bruit-blanc",
    title: "Bruit blanc",
    description: "Un son constant qui aide à se concentrer ou à s’endormir.",
    audio: getAudioSource("bruit-blanc"),
    video: getVideoSource("bruit-blanc"),
  },
];
