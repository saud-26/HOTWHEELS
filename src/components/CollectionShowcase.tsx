'use client';

import { motion } from 'framer-motion';
import { CARS } from '@/lib/cars';

const FEATURED_CARS = CARS.slice(0, 6);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CollectionShowcase() {
  return (
    <section className="showcase section">
      <div className="container">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            Signature Collection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Hand-picked legends from over 50 years of Hot Wheels history.
            Each casting tells a story of speed, design, and pure automotive passion.
          </motion.p>
        </div>

        <motion.div
          className="showcase-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {FEATURED_CARS.map((car) => (
            <motion.div
              key={car.id}
              className="showcase-card"
              variants={cardVariants}
            >
              <div className="showcase-card-image">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    style={{
                      width: '80%',
                      height: '80%',
                      objectFit: 'contain',
                    }}
                  />
              </div>
              <div className="showcase-card-content">
                <div className="showcase-card-tag">{car.series}</div>
                <h3 className="showcase-card-name">{car.name}</h3>
                <p className="showcase-card-year">{car.year} · {car.rarity.replace('-', ' ').toUpperCase()}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a href="/rare-collection/" className="btn btn-primary">
            View Full Collection
          </a>
        </motion.div>
      </div>
    </section>
  );
}
