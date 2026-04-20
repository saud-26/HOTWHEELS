export type RarityLevel = 'super-treasure' | 'treasure' | 'limited' | 'regular';

export interface CarData {
  id: string;
  name: string;
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
