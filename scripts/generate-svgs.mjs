import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const carsDir = join(process.cwd(), 'public', 'cars');

// Cars that still need images (the 13 not yet generated)
const cars = [
  { id: '67-camaro-sth', name: "'67 Camaro STH", color: '#cc2233', accent: '#ff4455' },
  { id: 'datsun-240z-bre-rlc', name: '240Z BRE RLC', color: '#dd3322', accent: '#ff6644' },
  { id: 'porsche-917k-gulf-rlc', name: '917K Gulf RLC', color: '#0099cc', accent: '#33bbee' },
  { id: 'dodge-challenger-sth', name: 'Challenger STH', color: '#ee6600', accent: '#ff8833' },
  { id: 'copo-camaro-sth', name: 'COPO Camaro STH', color: '#2244cc', accent: '#4466ee' },
  { id: 'chevy-c10-sth', name: "C10 STH", color: '#228844', accent: '#33bb66' },
  { id: 'mercedes-300sl-rlc', name: '300 SL RLC', color: '#999999', accent: '#cccccc' },
  { id: 'dodge-demon-sth', name: 'Demon STH', color: '#cc2288', accent: '#ee44aa' },
  { id: 'toyota-supra-sth', name: 'Supra STH', color: '#cc2222', accent: '#ee4444' },
  { id: 'honda-nsx-sth', name: 'NSX STH', color: '#ccaa00', accent: '#eedd22' },
  { id: 'lamborghini-miura-sth', name: 'Miura STH', color: '#dd6600', accent: '#ff8822' },
  { id: 'datsun-510-wagon-blue-sth', name: '510 Blue STH', color: '#2244aa', accent: '#4466cc' },
  { id: 'nissan-skyline-gtx-sth', name: 'GTX STH', color: '#226633', accent: '#338855' },
];

function generateCarSVG({ name, color, accent }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#0a0a14"/>
    </radialGradient>
    <linearGradient id="body" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="50%" stop-color="${color}"/>
      <stop offset="100%" stop-color="${color}88"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="white" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.6"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="600" fill="url(#bg)"/>
  
  <!-- Ambient glow -->
  <ellipse cx="400" cy="380" rx="280" ry="40" fill="${color}" opacity="0.15" filter="url(#glow)"/>
  
  <!-- Ground reflection line -->
  <line x1="120" y1="420" x2="680" y2="420" stroke="${color}" stroke-width="1" opacity="0.3"/>
  
  <!-- Car Body - Sporty silhouette -->
  <g filter="url(#shadow)">
    <!-- Main body -->
    <path d="M 180 380 
             L 200 380 
             Q 220 380 230 360 
             L 270 310 
             Q 280 295 300 290 
             L 380 275 
             Q 400 272 420 275 
             L 520 295 
             Q 540 300 550 310 
             L 590 350 
             Q 600 365 620 370 
             L 640 375 
             Q 660 378 660 385 
             L 660 395 
             Q 660 405 645 410 
             L 180 410 
             Q 165 410 165 395 
             L 165 395 
             Q 165 385 180 380 Z" 
          fill="url(#body)" stroke="${accent}" stroke-width="1.5"/>
    
    <!-- Shine overlay -->
    <path d="M 230 360 
             L 270 310 
             Q 280 295 300 290 
             L 380 275 
             Q 400 272 420 275 
             L 520 295 
             Q 540 300 550 310 
             L 560 325 
             Q 450 310 340 310 
             Q 280 310 240 340 Z" 
          fill="url(#shine)"/>
    
    <!-- Windows -->
    <path d="M 275 308 
             L 310 290 
             Q 320 286 340 284 
             L 390 280 
             L 390 305 
             Q 340 303 275 308 Z" 
          fill="#1a1a3e" opacity="0.7" stroke="${accent}" stroke-width="0.5"/>
    <path d="M 395 280 
             L 470 288 
             Q 500 293 520 300 
             L 540 308 
             L 395 305 Z" 
          fill="#1a1a3e" opacity="0.7" stroke="${accent}" stroke-width="0.5"/>
    
    <!-- Headlights -->
    <ellipse cx="645" cy="385" rx="12" ry="8" fill="#ffffcc" opacity="0.9" filter="url(#glow)"/>
    <ellipse cx="645" cy="385" rx="6" ry="4" fill="white"/>
    
    <!-- Taillights -->
    <rect x="168" y="385" width="14" height="8" rx="3" fill="#ff2222" opacity="0.9" filter="url(#glow)"/>
  </g>
  
  <!-- Front wheel -->
  <g>
    <circle cx="560" cy="410" r="35" fill="#111" stroke="#333" stroke-width="3"/>
    <circle cx="560" cy="410" r="28" fill="#1a1a1a" stroke="#444" stroke-width="1"/>
    <circle cx="560" cy="410" r="18" fill="#222" stroke="#555" stroke-width="1"/>
    <!-- Spokes -->
    <line x1="560" y1="385" x2="560" y2="435" stroke="#444" stroke-width="2"/>
    <line x1="535" y1="410" x2="585" y2="410" stroke="#444" stroke-width="2"/>
    <line x1="542" y1="392" x2="578" y2="428" stroke="#444" stroke-width="2"/>
    <line x1="578" y1="392" x2="542" y2="428" stroke="#444" stroke-width="2"/>
    <circle cx="560" cy="410" r="8" fill="#333" stroke="#666" stroke-width="1"/>
    <circle cx="560" cy="410" r="4" fill="${color}"/>
  </g>
  
  <!-- Rear wheel -->
  <g>
    <circle cx="240" cy="410" r="35" fill="#111" stroke="#333" stroke-width="3"/>
    <circle cx="240" cy="410" r="28" fill="#1a1a1a" stroke="#444" stroke-width="1"/>
    <circle cx="240" cy="410" r="18" fill="#222" stroke="#555" stroke-width="1"/>
    <line x1="240" y1="385" x2="240" y2="435" stroke="#444" stroke-width="2"/>
    <line x1="215" y1="410" x2="265" y2="410" stroke="#444" stroke-width="2"/>
    <line x1="222" y1="392" x2="258" y2="428" stroke="#444" stroke-width="2"/>
    <line x1="258" y1="392" x2="222" y2="428" stroke="#444" stroke-width="2"/>
    <circle cx="240" cy="410" r="8" fill="#333" stroke="#666" stroke-width="1"/>
    <circle cx="240" cy="410" r="4" fill="${color}"/>
  </g>
  
  <!-- Hot Wheels branding -->
  <text x="400" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${accent}" letter-spacing="6" opacity="0.8">HOT WHEELS</text>
  
  <!-- Car name -->
  <text x="400" y="555" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="white" opacity="0.6" letter-spacing="3">${name.toUpperCase()}</text>
  
  <!-- Speed lines -->
  <line x1="80" y1="340" x2="140" y2="340" stroke="${color}" stroke-width="2" opacity="0.3"/>
  <line x1="60" y1="360" x2="150" y2="360" stroke="${color}" stroke-width="1.5" opacity="0.2"/>
  <line x1="90" y1="380" x2="155" y2="380" stroke="${color}" stroke-width="1" opacity="0.15"/>
</svg>`;
}

for (const car of cars) {
  const svg = generateCarSVG(car);
  const filePath = join(carsDir, `${car.id}.svg`);
  writeFileSync(filePath, svg);
  console.log(`✅ Generated: ${car.id}.svg`);
}

console.log(`\n🏎️ Done! Generated ${cars.length} SVG thumbnails.`);
