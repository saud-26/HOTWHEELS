'use client';

import { motion } from 'framer-motion';
import type { RarityLevel } from '@/lib/types';

interface RarityFilterProps {
  active: string;
  onChange: (filter: string) => void;
}

const FILTERS = [
  { key: 'all', label: 'All Cars' },
  { key: 'super-treasure', label: 'Super Treasure Hunt' },
  { key: 'treasure', label: 'Treasure Hunt' },
  { key: 'limited', label: 'Limited Edition' },
  { key: 'regular', label: 'Regular' },
];

export default function RarityFilter({ active, onChange }: RarityFilterProps) {
  return (
    <motion.div
      className="filter-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          className={`filter-pill ${active === filter.key ? 'active' : ''}`}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
        </button>
      ))}
    </motion.div>
  );
}
