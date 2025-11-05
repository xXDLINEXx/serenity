import { tryRequire } from "@/utils/tryRequire";

export const soundsConfig = [
  {
    title: "Vent léger",
    audio: tryRequire("../media/audio/vent-leger.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/vent-leger.mp3",
    video: tryRequire("../media/video/vent-leger.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/vent-leger.mp4"
  },
  {
    title: "Vague de l'océan",
    audio: tryRequire("../media/audio/vague-de-locean.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/vague-de-locean.mp3",
    video: tryRequire("../media/video/vague-de-locean.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/vague-de-locean.mp4"
  },
  {
    title: "Rivière calme",
    audio: tryRequire("../media/audio/riviere-calme.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/riviere-calme.mp3",
    video: tryRequire("../media/video/riviere-calme.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/riviere-calme.mp4"
  },
  {
    title: "Pluie douce",
    audio: tryRequire("../media/audio/pluie-douce.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/pluie-douce.mp3",
    video: tryRequire("../media/video/pluie-douce.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/pluie-douce.mp4"
  },
  {
    title: "Orage apaisant",
    audio: tryRequire("../media/audio/orage-apaisant.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/orage-apaisant.mp3",
    video: tryRequire("../media/video/orage-apaisant.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/orage-apaisant.mp4"
  },
  {
    title: "Forêt paisible",
    audio: tryRequire("../media/audio/foret-paisible.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/foret-paisible.mp3",
    video: tryRequire("../media/video/foret-paisible.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/foret-paisible.mp4"
  },
  {
    title: "Feu de camp",
    audio: tryRequire("../media/audio/feu-de-camp.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/feu-de-camp.mp3",
    video: tryRequire("../media/video/feu-de-camp.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/feu-de-camp.mp4"
  },
  {
    title: "Bruit blanc",
    audio: tryRequire("../media/audio/bruit-blanc.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/bruit-blanc.mp3",
    video: tryRequire("../media/video/bruit-blanc.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/bruit-blanc.mp4"
  }
];
