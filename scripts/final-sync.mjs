import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Note: Run this with node --env-file=.env.local scripts/final-sync.mjs
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const CARS = [
  {
    id: 'twin-mill',
    name: 'Twin Mill',
    series: 'Original Sweet Sixteen',
    year: 1969,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'The twin-engined legend that defined Hot Wheels.',
    specs: { engine: 'Twin Supercharged V8', horsepower: 1200, topSpeed: 240, weight: '3,400 lbs', scale: '1:64' },
    colors: ['Electric Blue', 'Chrome'],
    image: '/cars/twin-mill.png',
    category: 'rare-collection'
  },
  {
    id: 'bone-shaker',
    name: 'Bone Shaker',
    series: '2006 New Models',
    year: 2006,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'A hot rod skull on wheels. The exposed engine, skeletal grille, and menacing stance make this one of the most iconic fantasy castings ever produced.',
    specs: { engine: 'Blown 426 Hemi', horsepower: 850, topSpeed: 195, weight: '2,800 lbs', scale: '1:64' },
    colors: ['Spectraflame Red', 'Skull White'],
    image: '/cars/bone-shaker.png',
    category: 'rare-collection'
  },
  {
    id: '67-camaro',
    name: "'67 Camaro",
    series: 'Muscle Mania',
    year: 2012,
    rarity: 'treasure',
    rarityScore: 4,
    description: 'The first-gen Camaro in its purest form. Rally stripes, rumbling 350 V8, and the unmistakable silhouette that launched a million drag races.',
    specs: { engine: '350 Small Block V8', horsepower: 375, topSpeed: 155, weight: '3,100 lbs', scale: '1:64' },
    colors: ['Racing Green', 'White Stripes'],
    image: '/cars/67-camaro.png',
    category: 'garage'
  },
  {
    id: 'datsun-510',
    name: 'Datsun Bluebird 510',
    series: 'JDM Legends',
    year: 2018,
    rarity: 'treasure',
    rarityScore: 4,
    description: 'The Japanese underdog that conquered rally stages worldwide.',
    specs: { engine: 'L18 Inline-4 Turbo', horsepower: 280, topSpeed: 145, weight: '2,200 lbs', scale: '1:64' },
    colors: ['Safari Brown', 'BRE livery'],
    image: '/cars/datsun-510.png',
    category: 'rare-collection'
  },
  {
    id: 'deora-ii',
    name: 'Deora II',
    series: 'Highway 35',
    year: 2003,
    rarity: 'limited',
    rarityScore: 3,
    description: 'A futuristic surf wagon designed by Nathan Proch.',
    specs: { engine: 'Twin Turbo V6', horsepower: 450, topSpeed: 175, weight: '2,600 lbs', scale: '1:64' },
    colors: ['Pearl Orange', 'Metallic Silver'],
    image: '/cars/deora-ii.png',
    category: 'garage'
  },
  {
    id: 'volkswagen-drag-bus',
    name: 'VW Drag Bus',
    series: 'Treasure Hunt',
    year: 1996,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'A chopped, channeled, and drag-ready VW Bus. One of the most valuable Treasure Hunts ever produced.',
    specs: { engine: 'Blown Flat-4', horsepower: 500, topSpeed: 165, weight: '2,400 lbs', scale: '1:64' },
    colors: ['Spectraflame Pink', 'Chrome Base'],
    image: '/cars/vw-drag-bus.png',
    category: 'rare-collection'
  },
  {
    id: 'nissan-skyline',
    name: 'Nissan Skyline GT-R (R34)',
    series: 'Fast & Furious',
    year: 2020,
    rarity: 'limited',
    rarityScore: 3,
    description: 'Godzilla in 1:64. The R34 GT-R in its most iconic blue.',
    specs: { engine: 'RB26DETT Twin-Turbo I6', horsepower: 560, topSpeed: 190, weight: '3,200 lbs', scale: '1:64' },
    colors: ['Bayside Blue', 'Carbon Hood'],
    image: '/cars/nissan-skyline.png',
    category: 'garage'
  },
  {
    id: 'porsche-356',
    name: 'Porsche 356A Outlaw',
    series: 'Car Culture',
    year: 2019,
    rarity: 'regular',
    rarityScore: 2,
    description: 'The Porsche that started it all, reimagined as a lowered outlaw.',
    specs: { engine: 'Flat-4 Boxer', horsepower: 180, topSpeed: 130, weight: '1,800 lbs', scale: '1:64' },
    colors: ['Slate Grey', 'Rouge Interior'],
    image: '/cars/porsche-356.png',
    category: 'garage'
  },
  {
    id: 'lamborghini-countach',
    name: 'Lamborghini Countach',
    series: 'Exotics',
    year: 2015,
    rarity: 'regular',
    rarityScore: 2,
    description: 'The poster car of the 1980s. Scissor doors, wedge profile.',
    specs: { engine: 'V12 5.2L', horsepower: 455, topSpeed: 183, weight: '3,000 lbs', scale: '1:64' },
    colors: ['Rosso Red', 'Black Accents'],
    image: '/cars/lamborghini-countach.png',
    category: 'garage'
  },
  {
    id: 'batmobile-1966',
    name: '1966 TV Series Batmobile',
    series: 'Entertainment',
    year: 2014,
    rarity: 'limited',
    rarityScore: 3,
    description: 'Holy Hot Wheels, Batman! The Lincoln Futura-based Batmobile.',
    specs: { engine: 'Atomic Turbine', horsepower: 900, topSpeed: 200, weight: '5,500 lbs', scale: '1:64' },
    colors: ['Gloss Black', 'Red Pinstripe'],
    image: '/cars/batmobile-1966.png',
    category: 'garage'
  },
  {
    id: 'mazda-rx7',
    name: 'Mazda RX-7 (FD)',
    series: 'JDM Legends',
    year: 2021,
    rarity: 'treasure',
    rarityScore: 4,
    description: 'The rotary-powered masterpiece. Sequential twin turbos.',
    specs: { engine: '13B-REW Twin-Rotor Turbo', horsepower: 320, topSpeed: 165, weight: '2,700 lbs', scale: '1:64' },
    colors: ['Brilliant Red', 'RE Amemiya Kit'],
    image: '/cars/mazda-rx7.png',
    category: 'rare-collection'
  },
  {
    id: 'ford-gt40',
    name: 'Ford GT-40',
    series: 'Race Day',
    year: 2017,
    rarity: 'regular',
    rarityScore: 2,
    description: 'Built with one mission: beat Ferrari at Le Mans.',
    specs: { engine: '7.0L V8', horsepower: 485, topSpeed: 210, weight: '2,200 lbs', scale: '1:64' },
    colors: ['Gulf Blue', 'Orange Stripes'],
    image: '/cars/ford-gt40.png',
    category: 'garage'
  },
  {
    id: 'candy-striper-gasser',
    name: "'55 Chevy Bel Air Gasser (RLC)",
    series: 'RLC Exclusive',
    year: 2014,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'The most famous modern RLC release. Features pink Spectraflame \"Candy Striper\" deco and a lifted drag body.',
    specs: { engine: 'Blown 454 V8', horsepower: 900, topSpeed: 180, weight: '3,200 lbs', scale: '1:64' },
    colors: ['Spectraflame Pink', 'White Stripes'],
    image: 'https://i.ebayimg.com/images/g/H0YAAOSw3Wxfy~hU/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'rear-load-beach-bomb',
    name: "VW Beach Bomb (Pink Prototype)",
    series: 'Redline Era',
    year: 1969,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'The \"Holy Grail\" of Hot Wheels. A rear-loading surfboard prototype that never reached full production.',
    specs: { engine: 'Air-Cooled Flat 4', horsepower: 60, topSpeed: 70, weight: '2,200 lbs', scale: '1:64' },
    colors: ['Spectraflame Pink'],
    image: 'https://media.vw.com/assets/images/original/2020/12/Hot-Wheels-Pink-Beach-Bomb-001.jpg',
    category: 'rare-collection'
  },
  {
    id: 'nissan-skyline-r34-rlc',
    name: "Nissan Skyline GT-R (R34) RLC",
    series: 'RLC Exclusive',
    year: 2019,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'A masterpiece in Midnight Purple Spectraflame. Highly coveted for its opening hood and engine detail.',
    specs: { engine: 'RB26DETT', horsepower: 550, topSpeed: 195, weight: '3,200 lbs', scale: '1:64' },
    colors: ['Spectraflame Midnight Purple'],
    image: 'https://i.ebayimg.com/images/g/Y8IAAOSw~jxfz~R~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'blue-rc-camaro',
    name: "Custom Camaro (Blue Redline)",
    series: 'Original 16',
    year: 1968,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'One of the first 16 Hot Wheels ever made. Features \"Redline\" tires and classic Spectraflame blue paint.',
    specs: { engine: 'V8', horsepower: 300, topSpeed: 140, weight: '3,000 lbs', scale: '1:64' },
    colors: ['Spectraflame Blue'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Hot_Wheels_Custom_Camaro_blue.jpg/1200px-Hot_Wheels_Custom_Camaro_blue.jpg',
    category: 'rare-collection'
  },
  {
    id: 'purple-olds-442',
    name: "Olds 442 (Purple Redline)",
    series: 'Redline Era',
    year: 1971,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'The rarest of all production Redlines. Only a handful of authentic purple examples exist.',
    specs: { engine: '455 CID V8', horsepower: 340, topSpeed: 130, weight: '3,600 lbs', scale: '1:64' },
    colors: ['Spectraflame Purple'],
    image: 'https://static.wikia.nocookie.net/hotwheels/images/6/63/Olds_442_Redline_Purple.jpg/revision/latest',
    category: 'rare-collection'
  },
  {
    id: 'huayra-roadster-sth',
    name: "'17 Pagani Huayra Roadster (STH)",
    series: 'Super Treasure Hunt',
    year: 2020,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'An Italian hypercar in electric Spectraflame green with Real Rider wheels.',
    specs: { engine: 'V12 Twin-Turbo', horsepower: 720, topSpeed: 210, weight: '2,800 lbs', scale: '1:64' },
    colors: ['Spectraflame green'],
    image: 'https://i.ebayimg.com/images/g/Y8IAAOSw~jxfz~R~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'datsun-510-wagon-sth',
    name: "'71 Datsun Bluebird 510 Wagon (STH)",
    series: 'Super Treasure Hunt',
    year: 2014,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'A JDM classic in Spectraflame red. One of the most valued modern Super Treasure Hunts.',
    specs: { engine: 'L18 I4', horsepower: 200, topSpeed: 130, weight: '2,100 lbs', scale: '1:64' },
    colors: ['Spectraflame Red', 'Speedhunters Graphic'],
    image: 'https://static.wikia.nocookie.net/hotwheels/images/e/e0/71_Datsun_Bluebird_510_Wagon_STH_2014.jpg',
    category: 'rare-collection'
  },
  {
    id: '67-camaro-sth',
    name: "'67 Camaro (STH)",
    series: 'Super Treasure Hunt',
    year: 2017,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Dark Spectraflame Red muscle car with white racing stripes and Real Rider tires.',
    specs: { engine: 'V8', horsepower: 375, topSpeed: 155, weight: '3,100 lbs', scale: '1:64' },
    colors: ['Spectraflame Red'],
    image: 'https://i.ebayimg.com/images/g/e7oAAOSw5Vpfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'datsun-240z-bre-rlc',
    name: "Custom '72 Datsun 240Z (BRE RLC)",
    series: 'RLC Exclusive',
    year: 2023,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'The legendary BRE livery in high-quality Spectraflame finish. RLC member exclusive.',
    specs: { engine: 'L24 I6', horsepower: 150, topSpeed: 125, weight: '2,300 lbs', scale: '1:64' },
    colors: ['BRE Livery', 'Chrome Accents'],
    image: 'https://i.ebayimg.com/images/g/T8AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'porsche-917k-gulf-rlc',
    name: "Porsche 917K (Gulf RLC)",
    series: 'RLC Exclusive',
    year: 2013,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Iconic Gulf Racing livery on a metal-on-metal Porsche silhouette. RLC masterpiece.',
    specs: { engine: 'Flat-12', horsepower: 600, topSpeed: 215, weight: '1,760 lbs', scale: '1:64' },
    colors: ['Gulf Blue', 'Gulf Orange'],
    image: 'https://i.ebayimg.com/images/g/U8AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'dodge-challenger-sth',
    name: "1970 Dodge Challenger (STH)",
    series: 'Super Treasure Hunt',
    year: 2022,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Classic Mopar muscle in bright Spectraflame orange.',
    specs: { engine: 'V8', horsepower: 425, topSpeed: 150, weight: '3,400 lbs', scale: '1:64' },
    colors: ['Spectraflame Orange'],
    image: 'https://i.ebayimg.com/images/g/G4QAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'copo-camaro-sth',
    name: "1968 COPO Camaro (STH)",
    series: 'Super Treasure Hunt',
    year: 2023,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Deep blue Spectraflame racer with bold \"COPO\" graphics.',
    specs: { engine: 'V8', horsepower: 450, topSpeed: 160, weight: '3,200 lbs', scale: '1:64' },
    colors: ['Spectraflame Blue'],
    image: 'https://i.ebayimg.com/images/g/O4AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'chevy-c10-sth',
    name: "'67 Chevy C10 (STH)",
    series: 'Super Treasure Hunt',
    year: 2021,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'A slammed vintage pickup in deep metallic Spectraflame green.',
    specs: { engine: 'V8', horsepower: 350, topSpeed: 130, weight: '3,600 lbs', scale: '1:64' },
    colors: ['Spectraflame Green'],
    image: 'https://i.ebayimg.com/images/g/U4AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'mercedes-300sl-rlc',
    name: "Mercedes-Benz 300 SL (RLC)",
    series: 'RLC Exclusive',
    year: 2021,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Polished chrome finish with functioning gullwing doors. Elite collector piece.',
    specs: { engine: 'I6', horsepower: 215, topSpeed: 160, weight: '3,300 lbs', scale: '1:64' },
    colors: ['Polished Chrome'],
    image: 'https://i.ebayimg.com/images/g/Y8IAAOSw~jxfz~R~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'dodge-demon-sth',
    name: "1971 Dodge Demon (STH)",
    series: 'Super Treasure Hunt',
    year: 2018,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Bold pink Spectraflame finish on a classic Mopar Demon casting.',
    specs: { engine: 'V8', horsepower: 340, topSpeed: 140, weight: '3,100 lbs', scale: '1:64' },
    colors: ['Spectraflame Magenta'],
    image: 'https://i.ebayimg.com/images/g/Z4AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'toyota-supra-sth',
    name: "1994 Toyota Supra (STH)",
    series: 'Super Treasure Hunt',
    year: 2022,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'The legendary Mk4 Supra in deep red Spectraflame. JDM collectors absolute favorite.',
    specs: { engine: '2JZ-GTE', horsepower: 320, topSpeed: 165, weight: '3,400 lbs', scale: '1:64' },
    colors: ['Spectraflame Red'],
    image: 'https://i.ebayimg.com/images/g/S8AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'honda-nsx-sth',
    name: "1990 Honda NSX Type R (STH)",
    series: 'Super Treasure Hunt',
    year: 2023,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Sleek Japanese supercar in striking Spectraflame yellow.',
    specs: { engine: 'V6', horsepower: 270, topSpeed: 168, weight: '2,700 lbs', scale: '1:64' },
    colors: ['Spectraflame Yellow'],
    image: 'https://i.ebayimg.com/images/g/X4AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'lamborghini-miura-sth',
    name: "Lamborghini Miura SV (STH)",
    series: 'Super Treasure Hunt',
    year: 2022,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Vintage exotic beauty in deep orange Spectraflame skin.',
    specs: { engine: 'V12', horsepower: 380, topSpeed: 170, weight: '2,800 lbs', scale: '1:64' },
    colors: ['Spectraflame Orange'],
    image: 'https://i.ebayimg.com/images/g/R8AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'datsun-510-wagon-blue-sth',
    name: "'71 Datsun 510 Wagon (Blue STH)",
    series: 'Super Treasure Hunt',
    year: 2014,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Classic JDM wagon in deep blue Spectraflame with Speedhunters deco.',
    specs: { engine: 'L18 I4', horsepower: 200, topSpeed: 130, weight: '2,100 lbs', scale: '1:64' },
    colors: ['Spectraflame Blue'],
    image: 'https://i.ebayimg.com/images/g/M4AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  },
  {
    id: 'nissan-skyline-gtx-sth',
    name: "Nissan Skyline HT 2000GT-X (STH)",
    series: 'Super Treasure Hunt',
    year: 2021,
    rarity: 'super-treasure',
    rarityScore: 5,
    description: 'Classic Hakosuka Skyline in deep Spectraflame green forest finish.',
    specs: { engine: 'I6', horsepower: 160, topSpeed: 130, weight: '2,400 lbs', scale: '1:64' },
    colors: ['Spectraflame Green'],
    image: 'https://i.ebayimg.com/images/g/K4AAAOSw~jxfz~S~/s-l1600.jpg',
    category: 'rare-collection'
  }
];

async function syncCollections() {
  console.log('Starting Final Comprehensive Firestore Sync...');
  for (const car of CARS) {
    try {
      const carRef = doc(db, 'cars', car.id);
      await setDoc(carRef, car);
      console.log(`Synced: ${car.name}`);
    } catch (error) {
      console.error(`Error syncing ${car.id}:`, error);
    }
  }
  console.log('Firestore sync complete!');
  process.exit(0);
}

syncCollections();
