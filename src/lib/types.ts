export type RarityLevel = 'super-treasure' | 'treasure' | 'limited' | 'regular';

export interface CarData {
  _id?: string;
  id: string;
  name: string;
  bio?: string;
  series: string;
  year: number;
  rarity: RarityLevel;
  rarityScore: number; // 1-5
  description: string;
  specs: {
    engine: string;
    horsepower: number;
    topSpeed: number;
    weight: string;
    scale: string;
  };
  colors: string[];
  image: string;
  category?: 'rare-collection' | 'garage';
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

export interface TrackLayout {
  id: string;
  name: string;
  description: string;
  stats: {
    length: string;
    loops: number;
    jumps: number;
    speed: string;
  };
}
