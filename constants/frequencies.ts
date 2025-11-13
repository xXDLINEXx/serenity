import { tryRequire } from "@/utils/tryRequire";

export interface HealingFrequency {
  id: string;
  frequency: string;
  title: string;
  description: string;
  benefits: string;
  color: string;
  audioUrl: string | number;
}

const palette = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#E9D5FF', '#FAF5FF', '#FDF4FF', '#FCE7F3', '#FBCFE8', '#F9A8D4'];

export const healingFrequencies: HealingFrequency[] = [
  { 
    id: '4-7hz', 
    frequency: '4-7 Hz', 
    title: '4-7 Hz avec 417/639 Hz', 
    description: 'Ondes Theta pour sommeil profond',
    benefits: 'Favorise le sommeil profond, la méditation et la régénération cellulaire. Stimule la créativité et l\'intuition.',
    color: palette[0], 
    audioUrl: tryRequire('../media/frequency/4-7hz-with-417hz-639hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/4-7hz-with-417hz-639hz.mp3'
  },
  { 
    id: '8-12hz', 
    frequency: '8-12 Hz', 
    title: '8-12 Hz', 
    description: 'Ondes Alpha pour relaxation',
    benefits: 'État de relaxation profonde, réduction du stress et de l\'anxiété. Améliore la concentration et la clarté mentale.',
    color: palette[1], 
    audioUrl: tryRequire('../media/frequency/8-to-12-hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/8-to-12-hz.mp3'
  },
  { 
    id: '10hz', 
    frequency: '10 Hz', 
    title: '10 Hz', 
    description: 'Fréquence Alpha optimale',
    benefits: 'Équilibre émotionnel et mental. Idéal pour la méditation et la visualisation positive.',
    color: palette[2], 
    audioUrl: tryRequire('../media/frequency/10hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/10hz.mp3'
  },
  { 
    id: '33hz', 
    frequency: '33 Hz', 
    title: '33 Hz', 
    description: 'Fréquence du Christ',
    benefits: 'Harmonisation spirituelle, ouverture du cœur. Favorise la compassion et la connexion divine.',
    color: palette[3], 
    audioUrl: tryRequire('../media/frequency/33hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/33hz.mp3'
  },
  { 
    id: '66hz', 
    frequency: '66 Hz', 
    title: '66 Hz', 
    description: 'Fréquence sacrée',
    benefits: 'Activation énergétique et spirituelle. Renforce la vitalité et l\'alignement des chakras.',
    color: palette[4], 
    audioUrl: tryRequire('../media/frequency/66hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/66hz.mp3'
  },
  { 
    id: '396-hz-417-hz-639hz', 
    frequency: '396/417/639 Hz', 
    title: '396/417/639 Hz', 
    description: 'Triple fréquence Solfège',
    benefits: 'Libération des peurs, transformation et harmonisation des relations. Puissante combinaison de guérison.',
    color: palette[5], 
    audioUrl: tryRequire('../media/frequency/396-hz-417-hz-639hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/396-hz-417-hz-639hz.mp3'
  },
  { 
    id: '417hz', 
    frequency: '417 Hz', 
    title: '417 Hz', 
    description: 'Transformation et changement',
    benefits: 'Facilite le changement, efface les expériences traumatisantes. Stimule la transformation positive.',
    color: palette[6], 
    audioUrl: tryRequire('../media/frequency/417hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/417hz.mp3'
  },
  { 
    id: '852hz', 
    frequency: '852 Hz', 
    title: '852 Hz', 
    description: 'Éveil spirituel',
    benefits: 'Active l\'intuition et renforce la connexion spirituelle. Ouvre le troisième œil et la conscience supérieure.',
    color: palette[7], 
    audioUrl: tryRequire('../media/frequency/852hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/852hz.mp3'
  },
  { 
    id: '1441hz', 
    frequency: '1441 Hz', 
    title: '1441 Hz', 
    description: 'Fréquence de guérison',
    benefits: 'Régénération cellulaire profonde. Aide à la guérison physique et émotionnelle.',
    color: palette[8], 
    audioUrl: tryRequire('../media/frequency/1441hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/1441hz.mp3'
  },
  { 
    id: '2772hz', 
    frequency: '2772 Hz', 
    title: '2772 Hz', 
    description: 'Haute fréquence énergétique',
    benefits: 'Élévation vibratoire et purification énergétique. Stimule la clarté mentale et l\'éveil de la conscience.',
    color: palette[9], 
    audioUrl: tryRequire('../media/frequency/2772hz.mp3') ?? 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity/media/frequency/2772hz.mp3'
  },
];
