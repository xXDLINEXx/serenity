import { tryRequire } from "@/utils/tryRequire";
import { SoundConfig } from "@/types/soundsConfig";

export const soundsConfig: SoundConfig[] = [
  {
    title: "Vent léger",
    type: "sound",
    audio: tryRequire("../media/audio/vent-leger.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/vent-leger.mp3",
    video: tryRequire("../media/video/vent-leger.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/vent-leger.mp4",
    description: "Son doux du vent dans les arbres",
    benefits: "Réduit le stress et favorise la relaxation"
  },
  {
    title: "Vague de l'océan",
    type: "sound",
    audio: tryRequire("../media/audio/vague-de-locean.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/vague-de-locean.mp3",
    video: tryRequire("../media/video/vague-de-locean.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/vague-de-locean.mp4",
    description: "Vagues rythmiques de l'océan",
    benefits: "Calme l'esprit et améliore le sommeil"
  },
  {
    title: "Rivière calme",
    type: "sound",
    audio: tryRequire("../media/audio/riviere-calme.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/riviere-calme.mp3",
    video: tryRequire("../media/video/riviere-calme.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/riviere-calme.mp4",
    description: "Écoulement paisible d'une rivière",
    benefits: "Apaise les tensions et favorise la méditation"
  },
  {
    title: "Pluie douce",
    type: "sound",
    audio: tryRequire("../media/audio/pluie-douce.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/pluie-douce.mp3",
    video: tryRequire("../media/video/pluie-douce.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/pluie-douce.mp4",
    description: "Pluie légère sur les feuilles",
    benefits: "Masque les bruits ambiants et facilite l'endormissement"
  },
  {
    title: "Orage apaisant",
    type: "sound",
    audio: tryRequire("../media/audio/orage-apaisant.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/orage-apaisant.mp3",
    video: tryRequire("../media/video/orage-apaisant.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/orage-apaisant.mp4",
    description: "Tonnerre lointain et pluie",
    benefits: "Relaxation profonde et sommeil réparateur"
  },
  {
    title: "Forêt paisible",
    type: "sound",
    audio: tryRequire("../media/audio/foret-paisible.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/foret-paisible.mp3",
    video: tryRequire("../media/video/foret-paisible.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/foret-paisible.mp4",
    description: "Oiseaux et nature de la forêt",
    benefits: "Connexion avec la nature et paix intérieure"
  },
  {
    title: "Feu de camp",
    type: "sound",
    audio: tryRequire("../media/audio/feu-de-camp.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/feu-de-camp.mp3",
    video: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/vr26mlk4l6oqchaekmtwk",
    description: "Crépitement chaleureux du feu",
    benefits: "Sensation de confort et de sécurité"
  },
  {
    title: "Bruit blanc",
    type: "sound",
    audio: tryRequire("../media/audio/bruit-blanc.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/audio/bruit-blanc.mp3",
    video: tryRequire("../media/video/bruit-blanc.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/bruit-blanc.mp4",
    description: "Bruit constant et uniforme",
    benefits: "Masque les distractions et améliore la concentration"
  },

  {
    title: "4–7 Hz – Avec 417 & 639 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/4-7hz-with-417hz-639hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/4-7hz-with-417hz-639hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "4–7 Hz",
    description: "Ondes thêta pour méditation profonde",
    benefits: "Libération émotionnelle et harmonisation"
  },
  {
    title: "8–12 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/8-to-12-hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/8-to-12-hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "8–12 Hz",
    description: "Ondes alpha pour relaxation",
    benefits: "Calme mental et créativité"
  },
  {
    title: "10 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/10hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/10hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "10 Hz",
    description: "Fréquence de Schumann",
    benefits: "Équilibre naturel et régénération"
  },
  {
    title: "33 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/33hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/33hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "33 Hz",
    description: "Fréquence de Christ",
    benefits: "Éveil spirituel et compassion"
  },
  {
    title: "66 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/66hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/66hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "66 Hz",
    description: "Fréquence d'activation",
    benefits: "Énergie vitale et alignement"
  },
  {
    title: "396/417/639 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/396-hz-417-hz-639hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/396-hz-417-hz-639hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "396/417/639 Hz",
    description: "Trio de fréquences solfège",
    benefits: "Libération, transformation et connexion"
  },
  {
    title: "417 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/417hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/417hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "417 Hz",
    description: "Fréquence de transformation",
    benefits: "Facilite le changement et élimine les blocages"
  },
  {
    title: "852 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/852hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/852hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "852 Hz",
    description: "Éveil de l'intuition",
    benefits: "Clarté mentale et connexion spirituelle"
  },
  {
    title: "1441 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/1441hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/1441hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "1441 Hz",
    description: "Fréquence de Fibonacci",
    benefits: "Harmonie divine et équilibre cosmique"
  },
  {
    title: "2772 Hz",
    type: "frequency",
    audio: tryRequire("../media/frequency/2772hz.mp3") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/2772hz.mp3",
    video: tryRequire("../media/video/frequence.mp4") ?? "https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/video/frequence.mp4",
    frequency: "2772 Hz",
    description: "Fréquence d'ascension",
    benefits: "Élévation spirituelle et guérison"
  }
];

export type SoundEntry = SoundConfig;
