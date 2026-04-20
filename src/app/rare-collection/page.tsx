'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import RarityFilter from '@/components/RarityFilter';
import Footer from '@/components/Footer';
import { CARS } from '@/lib/cars';

export default function RareCollectionPage() {
  const [filter, setFilter] = useState('all');

  const filteredCars = useMemo(() => {
    if (filter === 'all') return CARS;
    return CARS.filter((car) => car.rarity === filter);
  }, [filter]);

  return (
    <>
      <div className="page-hero">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="gradient-text">The Rare</span> Collection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          From Treasure Hunts hidden in store pegs to the mythical Super Treasure Hunts
          with Spectraflame paint — these are the rarest Hot Wheels ever produced.
        </motion.p>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <RarityFilter active={filter} onChange={setFilter} />

          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--space-lg)',
            }}
          >
            {filteredCars.map((car, i) => (
              <ProductCard key={car.id} car={car} index={i} />
            ))}
          </motion.div>

          {filteredCars.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: 'var(--space-2xl)',
                color: 'var(--color-text-dim)',
              }}
            >
              <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                No cars found in this category
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
