export interface HealingFrequency {
  id: string;
  frequency: string;
  title: string;
  description: string;
  benefits: string;
  color: string;
  audioUrl: string;
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
    audioUrl: 'https://drive.google.com/uc?export=download&id=1AjLjCEJwlrC2tUf1_YkOGWzBW7qglqX4'
  },
  { 
    id: '8-12hz', 
    frequency: '8-12 Hz', 
    title: '8-12 Hz', 
    description: 'Ondes Alpha pour relaxation',
    benefits: 'État de relaxation profonde, réduction du stress et de l\'anxiété. Améliore la concentration et la clarté mentale.',
    color: palette[1], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=165ZSFfznIaISSZ0bdU0h429HpjHGi6-b'
  },
  { 
    id: '10hz', 
    frequency: '10 Hz', 
    title: '10 Hz', 
    description: 'Fréquence Alpha optimale',
    benefits: 'Équilibre émotionnel et mental. Idéal pour la méditation et la visualisation positive.',
    color: palette[2], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=1AifsvOp4dPdwKKgdNvSjklIWh4_N_cVT'
  },
  { 
    id: '33hz', 
    frequency: '33 Hz', 
    title: '33 Hz', 
    description: 'Fréquence du Christ',
    benefits: 'Harmonisation spirituelle, ouverture du cœur. Favorise la compassion et la connexion divine.',
    color: palette[3], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=1UpVc_aGRN4QS1KgAilxgFOrmZbdqmvDd'
  },
  { 
    id: '66hz', 
    frequency: '66 Hz', 
    title: '66 Hz', 
    description: 'Fréquence sacrée',
    benefits: 'Activation énergétique et spirituelle. Renforce la vitalité et l\'alignement des chakras.',
    color: palette[4], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=1L6_hFYZssckZYJSk2CJxCVLg-WBzFZGD'
  },
  { 
    id: '396-417-639', 
    frequency: '396/417/639 Hz', 
    title: '396/417/639 Hz', 
    description: 'Triple fréquence Solfège',
    benefits: 'Libération des peurs, transformation et harmonisation des relations. Puissante combinaison de guérison.',
    color: palette[5], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=1m6XR8Ldir2YqNm27EFj8nauoKJNs7iaG'
  },
  { 
    id: '417hz', 
    frequency: '417 Hz', 
    title: '417 Hz', 
    description: 'Transformation et changement',
    benefits: 'Facilite le changement, efface les expériences traumatisantes. Stimule la transformation positive.',
    color: palette[6], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=1pLwz5EKfIQ-HBxgIsdTGXNvL88MZ-vqf'
  },
  { 
    id: '852hz', 
    frequency: '852 Hz', 
    title: '852 Hz', 
    description: 'Éveil spirituel',
    benefits: 'Active l\'intuition et renforce la connexion spirituelle. Ouvre le troisième œil et la conscience supérieure.',
    color: palette[7], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=1WMr5N0hIr9AYpXCi0d2EHVvJkn5c29Tf'
  },
  { 
    id: '1441hz', 
    frequency: '1441 Hz', 
    title: '1441 Hz', 
    description: 'Fréquence de guérison',
    benefits: 'Régénération cellulaire profonde. Aide à la guérison physique et émotionnelle.',
    color: palette[8], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=1K2XgzxsDE7_UiTJ-oD4zhR2ZonZIfCFl'
  },
  { 
    id: '2772hz', 
    frequency: '2772 Hz', 
    title: '2772 Hz', 
    description: 'Haute fréquence énergétique',
    benefits: 'Élévation vibratoire et purification énergétique. Stimule la clarté mentale et l\'éveil de la conscience.',
    color: palette[9], 
    audioUrl: 'https://drive.google.com/uc?export=download&id=1B6cjAt8CMB4BQw7erwkML5HS5bYLHyZ9'
  },
];
