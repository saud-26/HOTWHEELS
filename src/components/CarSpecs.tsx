'use client';

import { motion } from 'framer-motion';
import type { CarData } from '@/lib/types';

interface CarSpecsProps {
  car: CarData;
}

const specItems = [
  { key: 'engine', label: 'Engine', format: (v: string) => v },
  { key: 'horsepower', label: 'Horsepower', format: (v: number) => `${v} HP`, max: 1200 },
  { key: 'topSpeed', label: 'Top Speed', format: (v: number) => `${v} MPH`, max: 250 },
] as const;

export default function CarSpecs({ car }: CarSpecsProps) {
  return (
    <div className="spec-panel">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 style={{ marginBottom: 'var(--space-xs)' }}>{car.name}</h3>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-accent-1)', marginBottom: 'var(--space-sm)', fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {car.series} · {car.year}
        </div>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
          {car.description}
        </p>
      </motion.div>

      {/* Engine spec (text only) */}
      <motion.div
        className="spec-item"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="spec-label">
          <span>Engine</span>
          <span className="spec-value">{car.specs.engine}</span>
        </div>
      </motion.div>

      {/* HP bar */}
      <motion.div
        className="spec-item"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="spec-label">
          <span>Horsepower</span>
          <span className="spec-value">{car.specs.horsepower} HP</span>
        </div>
        <div className="spec-bar">
          <motion.div
            className="spec-bar-fill"
            initial={{ width: 0 }}
            whileInView={{ width: `${(car.specs.horsepower / 1200) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>

      {/* Top Speed bar */}
      <motion.div
        className="spec-item"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="spec-label">
          <span>Top Speed</span>
          <span className="spec-value">{car.specs.topSpeed} MPH</span>
        </div>
        <div className="spec-bar">
          <motion.div
            className="spec-bar-fill"
            initial={{ width: 0 }}
            whileInView={{ width: `${(car.specs.topSpeed / 250) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>

      {/* Weight & Scale */}
      <motion.div
        style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-sm)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="spec-item" style={{ flex: 1 }}>
          <div className="spec-label">
            <span>Weight</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-text)', marginTop: '4px' }}>
            {car.specs.weight}
          </div>
        </div>
        <div className="spec-item" style={{ flex: 1 }}>
          <div className="spec-label">
            <span>Scale</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-text)', marginTop: '4px' }}>
            {car.specs.scale}
          </div>
        </div>
      </motion.div>

      {/* Rarity */}
      <motion.div
        className="spec-item"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{ marginTop: 'var(--space-sm)' }}
      >
        <div className="spec-label">
          <span>Rarity</span>
          <span className="spec-value">{car.rarity.replace('-', ' ').toUpperCase()}</span>
        </div>
        <div className="rarity-dots" style={{ marginTop: '6px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              className={`rarity-dot ${i < car.rarityScore ? 'filled' : ''}`}
              style={{ width: '10px', height: '10px' }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
