'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CarRotator from '@/components/CarRotator';
import CarSpecs from '@/components/CarSpecs';
import Footer from '@/components/Footer';
import { CARS } from '@/lib/cars';
import type { CarData } from '@/lib/types';
import { getGarageCars } from '@/lib/db';
import { resolveCarImage } from '@/lib/image-utils';

export default function GaragePage() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    async function fetchCars() {
      try {
        const data = await getGarageCars();
        setCars(data.length > 0 ? data : CARS);
      } catch (err) {
        setCars(CARS.filter(c => c.category === 'garage'));
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const selectedCar = cars[selectedIndex] || cars[0];

  if (loading) {
    return (
      <>
        <div className="page-hero">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="gradient-text">The</span> Garage
          </motion.h1>
        </div>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="admin-loading-cars">
              {[1, 2, 3].map((i) => (
                <div key={i} className="admin-car-skeleton" style={{ height: 200 }} />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (cars.length === 0) return null;

  return (
    <>
      <div className="page-hero">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="gradient-text">The</span> Garage
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Get up close with every casting. Inspect the specs, feel the power, 
          and rotate your favorite legends in full 3D.
        </motion.p>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Car selector */}
          <motion.div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-sm)',
              justifyContent: 'center',
              marginBottom: 'var(--space-2xl)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {cars.map((car, i) => (
              <button
                key={car._id || car.id}
                onClick={() => setSelectedIndex(i)}
                className={`filter-pill ${selectedIndex === i ? 'active' : ''}`}
              >
                {car.name}
              </button>
            ))}
          </motion.div>

          {/* Garage Viewer */}
          <div className="garage-viewer">
            <CarRotator image={resolveCarImage(selectedCar.id, selectedCar.image)} />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCar._id || selectedCar.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5 }}
              >
                <CarSpecs car={selectedCar} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Color palette section */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="section-header">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Paint Finishes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              From Spectraflame to Zamac, each finish tells a different story.
            </motion.p>
          </div>

          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--space-md)',
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {[
              { name: 'Spectraflame Red', color: '#CC0000', glow: 'rgba(204,0,0,0.3)' },
              { name: 'Spectraflame Blue', color: '#0047AB', glow: 'rgba(0,71,171,0.3)' },
              { name: 'Spectraflame Green', color: '#006400', glow: 'rgba(0,100,0,0.3)' },
              { name: 'Spectraflame Gold', color: '#DAA520', glow: 'rgba(218,165,32,0.3)' },
              { name: 'Zamac (Raw)', color: '#B0B0B0', glow: 'rgba(176,176,176,0.2)' },
              { name: 'Gloss Black', color: '#1A1A1A', glow: 'rgba(255,255,255,0.1)' },
            ].map((finish) => (
              <motion.div
                key={finish.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-lg)',
                  background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: finish.color,
                    margin: '0 auto var(--space-md)',
                    boxShadow: `0 0 25px ${finish.glow}`,
                  }}
                />
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                }}>
                  {finish.name}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
