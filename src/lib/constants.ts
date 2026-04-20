import type { CarData, RarityLevel } from './types';

export const FRAME_COUNT = 116;
export const FRAME_PATH_PREFIX = '/frames/ezgif-frame-';

export function getFramePath(index: number): string {
  const padded = String(index + 1).padStart(3, '0');
  return `${FRAME_PATH_PREFIX}${padded}.jpg`;
}

export const RARITY_LEVELS: Record<RarityLevel, { label: string; color: string }> = {
  'super-treasure': { label: 'Super Treasure Hunt', color: '#FF8C00' },
  'treasure': { label: 'Treasure Hunt', color: '#FFa733' },
  'limited': { label: 'Limited Edition', color: '#0047AB' },
  'regular': { label: 'Regular', color: '#888888' },
};

export const TIMELINE_DATA = [
  {
    year: '1968',
    title: 'The Birth of Hot Wheels',
    description: 'Elliot Handler, co-founder of Mattel, introduces 16 original "Sweet Sixteen" die-cast cars. With custom paint, redline wheels, and low-friction axles, they blew Matchbox off the track. The die-cast world was never the same.',
  },
  {
    year: '1970',
    title: 'Snake & Mongoose Era',
    description: 'Hot Wheels sponsors real drag racers Don "The Snake" Prudhomme and Tom "The Mongoose" McEwen. The line between toy and motorsport blurs forever.',
  },
  {
    year: '1977',
    title: 'The Flying Colors',
    description: 'Tampo printing arrives. Every car becomes a rolling canvas of flames, stripes, and racing liveries. Hot Wheels enters its most colorful decade.',
  },
  {
    year: '1995',
    title: 'Treasure Hunts Begin',
    description: 'Mattel introduces the first "Treasure Hunt" series — limited-production cars hidden in regular cases. The collector frenzy begins. Hunting becomes a sport.',
  },
  {
    year: '2007',
    title: 'Super Treasure Hunts',
    description: 'The "Super" variant arrives with Spectraflame paint, Real Rider rubber tires, and extreme rarity. A single car can be worth hundreds. The holy grail of collecting.',
  },
  {
    year: '2011',
    title: 'Hot Wheels Goes Digital',
    description: 'Video games, animated series, and digital integrations bring the brand to a new generation. The orange track expands beyond the physical world.',
  },
  {
    year: '2018',
    title: '50th Anniversary',
    description: 'Half a century of speed. Commemorative editions, museum exhibits, and the realization that 6 billion cars have been produced — more than every real car manufacturer combined.',
  },
  {
    year: '2024',
    title: 'The Legends Tour',
    description: 'Fan-built custom cars compete to become the next official Hot Wheels casting. The community IS the brand. Collectors, customizers, and dreamers unite.',
  },
];

export const TRACK_LAYOUTS = [
  {
    id: 'mega-loop',
    name: 'Mega Loop Mayhem',
    description: 'A triple loop-de-loop connected by a 12-foot straight drag launch. Gravity-defying, physics-bending, and absolutely relentless.',
    stats: { length: '18 ft', loops: 3, jumps: 2, speed: '200 scale mph' },
  },
  {
    id: 'spiral-tower',
    name: 'Spiral Tower Drop',
    description: 'Cars climb 6 feet of spiraling track before a freefall drop into a banked hairpin. The tower shakes. Legends are born.',
    stats: { length: '24 ft', loops: 1, jumps: 4, speed: '180 scale mph' },
  },
  {
    id: 'crash-zone',
    name: 'Crash Zone Arena',
    description: 'Two tracks converge at an intersection of chaos. Timing is everything — and collisions are spectacular. No car leaves unscathed.',
    stats: { length: '15 ft', loops: 2, jumps: 3, speed: '220 scale mph' },
  },
  {
    id: 'canyon-run',
    name: 'Canyon Run Express',
    description: 'A sweeping S-curve through elevated terrain with banked turns and a 4-car-wide finish line. The ultimate test of speed and precision.',
    stats: { length: '30 ft', loops: 0, jumps: 6, speed: '250 scale mph' },
  },
];

export const COMMUNITY_STATS = [
  { label: 'Tracks Built', value: 12847 },
  { label: 'Active Collectors', value: 98500 },
  { label: 'Speed Records', value: 3421 },
  { label: 'Custom Builds', value: 45230 },
];
