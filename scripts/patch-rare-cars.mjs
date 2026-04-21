import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Note: Run this with node --env-file=.env.local scripts/patch-rare-cars.mjs
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

const RARE_CARS = [
  {
    id: 'candy-striper-gasser',
    name: "'55 Chevy Bel Air Gasser (RLC)",
    description: 'The most famous modern RLC release. Features pink Spectraflame "Candy Striper" deco and a lifted drag body.',
    image: 'https://i.ebayimg.com/images/g/H0YAAOSw3Wxfy~hU/s-l1600.jpg'
  },
  {
    id: 'rear-load-beach-bomb',
    name: "VW Beach Bomb (Pink Prototype)",
    description: 'The "Holy Grail" of Hot Wheels. A rear-loading surfboard prototype that never reached full production.',
    image: 'https://media.vw.com/assets/images/original/2020/12/Hot-Wheels-Pink-Beach-Bomb-001.jpg'
  },
  {
    id: 'nissan-skyline-r34-rlc',
    name: "Nissan Skyline GT-R (R34) RLC",
    description: 'A masterpiece in Midnight Purple Spectraflame. Highly coveted for its opening hood and engine detail.',
    image: 'https://i.ebayimg.com/images/g/Y8IAAOSw~jxfz~R~/s-l1600.jpg'
  },
  {
    id: 'blue-rc-camaro',
    name: "Custom Camaro (Blue Redline)",
    description: 'One of the first 16 Hot Wheels ever made. Features "Redline" tires and classic Spectraflame blue paint.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Hot_Wheels_Custom_Camaro_blue.jpg/1200px-Hot_Wheels_Custom_Camaro_blue.jpg'
  },
  {
    id: 'purple-olds-442',
    name: "Olds 442 (Purple Redline)",
    description: 'The rarest of all production Redlines. Only a handful of authentic purple examples exist.',
    image: 'https://static.wikia.nocookie.net/hotwheels/images/6/63/Olds_442_Redline_Purple.jpg/revision/latest'
  },
  {
    id: 'huayra-roadster-sth',
    name: "'17 Pagani Huayra Roadster (STH)",
    description: 'An Italian hypercar in electric Spectraflame green with Real Rider wheels.',
    image: 'https://hwtreasure.com/wp-content/uploads/2020/07/Pagani-Huayra-Roadster-2020-STH.jpg'
  },
  {
    id: 'datsun-510-wagon-sth',
    name: "'71 Datsun Bluebird 510 Wagon (STH)",
    description: 'A JDM classic in Spectraflame red. One of the most valued modern Super Treasure Hunts.',
    image: 'https://static.wikia.nocookie.net/hotwheels/images/e/e0/71_Datsun_Bluebird_510_Wagon_STH_2014.jpg'
  },
  {
    id: '67-camaro-sth',
    name: "'67 Camaro (STH)",
    description: 'Dark Spectraflame Red muscle car with white racing stripes and Real Rider tires.',
    image: 'https://hwtreasure.com/wp-content/uploads/2017/09/67-Camaro.jpg'
  },
  {
    id: 'datsun-240z-bre-rlc',
    name: "Custom '72 Datsun 240Z (BRE RLC)",
    description: 'The legendary BRE livery in high-quality Spectraflame finish. RLC member exclusive.',
    image: 'https://i.ebayimg.com/images/g/T8AAAOSw~jxfz~S~/s-l1600.jpg'
  },
  {
    id: 'porsche-917k-gulf-rlc',
    name: "Porsche 917K (Gulf RLC)",
    description: 'Iconic Gulf Racing livery on a metal-on-metal Porsche silhouette. RLC masterpiece.',
    image: 'https://i.ebayimg.com/images/g/U8AAAOSw~jxfz~S~/s-l1600.jpg'
  },
  {
    id: 'dodge-challenger-sth',
    name: "1970 Dodge Challenger (STH)",
    description: 'Classic Mopar muscle in bright Spectraflame orange.',
    image: 'https://hwtreasure.com/wp-content/uploads/2022/01/1970-Dodge-Challenger-STH.jpg'
  },
  {
    id: 'copo-camaro-sth',
    name: "1968 COPO Camaro (STH)",
    description: 'Deep blue Spectraflame racer with bold "COPO" graphics.',
    image: 'https://hwtreasure.com/wp-content/uploads/2023/11/1968-COPO-Camaro-STH.jpg'
  },
  {
    id: 'chevy-c10-sth',
    name: "'67 Chevy C10 (STH)",
    description: 'A slammed vintage pickup in deep metallic Spectraflame green.',
    image: 'https://hwtreasure.com/wp-content/uploads/2021/01/67-Chevy-C10-STH.jpg'
  },
  {
    id: 'mercedes-300sl-rlc',
    name: "Mercedes-Benz 300 SL (RLC)",
    description: 'Polished chrome finish with functioning gullwing doors. Elite collector piece.',
    image: 'https://i.ebayimg.com/images/g/Y8IAAOSw~jxfz~R~/s-l1600.jpg'
  },
  {
    id: 'dodge-demon-sth',
    name: "1971 Dodge Demon (STH)",
    description: 'Bold pink Spectraflame finish on a classic Mopar Demon casting.',
    image: 'https://hwtreasure.com/wp-content/uploads/2018/01/1971-Dodge-Demon-STH.jpg'
  },
  {
    id: 'toyota-supra-sth',
    name: "1994 Toyota Supra (STH)",
    description: 'The legendary Mk4 Supra in deep red Spectraflame. JDM collectors absolute favorite.',
    image: 'https://hwtreasure.com/wp-content/uploads/2022/07/1994-Toyota-Supra-STH.jpg'
  },
  {
    id: 'honda-nsx-sth',
    name: "1990 Honda NSX Type R (STH)",
    description: 'Sleek Japanese supercar in striking Spectraflame yellow.',
    image: 'https://hwtreasure.com/wp-content/uploads/2023/11/1990-Honda-NSX-Type-R-STH.jpg'
  },
  {
    id: 'lamborghini-miura-sth',
    name: "Lamborghini Miura SV (STH)",
    description: 'Vintage exotic beauty in deep orange Spectraflame skin.',
    image: 'https://hwtreasure.com/wp-content/uploads/2022/01/Lamborghini-Miura-SV-STH.jpg'
  },
  {
    id: 'datsun-510-wagon-blue-sth',
    name: "'71 Datsun 510 Wagon (Blue STH)",
    description: 'Classic JDM wagon in deep blue Spectraflame with Speedhunters deco.',
    image: 'https://hwtreasure.com/wp-content/uploads/2014/01/71-Datsun-Bluebird-510-Wagon-Blue-STH.jpg'
  },
  {
    id: 'nissan-skyline-gtx-sth',
    name: "Nissan Skyline HT 2000GT-X (STH)",
    description: 'Classic Hakosuka Skyline in deep Spectraflame green forest finish.',
    image: 'https://hwtreasure.com/wp-content/uploads/2021/07/Nissan-Skyline-HT-2000GT-X-STH.jpg'
  }
];

async function updateCars() {
  console.log('Starting Firestore update...');
  for (const car of RARE_CARS) {
    try {
      const carRef = doc(db, 'cars', car.id);
      await setDoc(carRef, {
        name: car.name,
        description: car.description,
        image: car.image,
        category: 'rare-collection'
      }, { merge: true });
      console.log(`Updated: ${car.name}`);
    } catch (error) {
      console.error(`Error updating ${car.id}:`, error);
    }
  }
  console.log('Firestore update complete!');
  process.exit(0);
}

updateCars();
