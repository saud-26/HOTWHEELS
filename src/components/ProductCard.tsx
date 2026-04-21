'use client';

import { motion } from 'framer-motion';
import type { CarData } from '@/lib/types';
import { RARITY_LEVELS } from '@/lib/constants';
import { resolveCarImage, handleImageError } from '@/lib/image-utils';

interface ProductCardProps {
  car: CarData;
  index: number;
}

const badgeClassMap: Record<string, string> = {
  'super-treasure': 'badge-super-treasure',
  'treasure': 'badge-treasure',
  'limited': 'badge-limited',
  'regular': 'badge-regular',
};

export default function ProductCard({ car, index }: ProductCardProps) {
  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Rarity Badge */}
      <div className={`product-card-badge ${badgeClassMap[car.rarity]}`}>
        {RARITY_LEVELS[car.rarity].label}
      </div>

      {/* Car Image Area */}
      <div className="product-card-image">
        {car.image ? (
          <img 
            src={resolveCarImage(car.id, car.image)} 
            alt={car.name} 
            onError={handleImageError}
            style={{
              width: '85%',
              height: '85%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
            }} 
          />
        ) : (
          <div style={{ color: 'var(--color-text-dim)', fontStyle: 'italic', fontSize: '0.8rem' }}>
            Image Coming Soon
          </div>
        )}
      </div>

      {/* Info */}
      <div className="product-card-info">
        <h3 className="product-card-name">{car.name}</h3>
        <div className="product-card-series">{car.series}</div>
        <p className="product-card-year">{car.year}</p>
      </div>

      {/* Footer with rarity dots */}
      <div className="product-card-footer">
        <div className="product-card-rarity">
          <span>Rarity</span>
          <div className="rarity-dots">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`rarity-dot ${i < car.rarityScore ? 'filled' : ''}`}
              />
            ))}
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-1)' }}>
          {car.specs.engine}
        </span>
      </div>
    </motion.div>
  );
}
