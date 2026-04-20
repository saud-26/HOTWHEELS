'use client';

import { motion } from 'framer-motion';
import { TRACK_LAYOUTS } from '@/lib/constants';

export default function TrackShowcase() {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          className="track-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {TRACK_LAYOUTS.map((track, index) => (
            <motion.div
              key={track.id}
              className="track-card"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <div className="track-card-visual">
                {/* Animated gradient background */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(135deg, rgba(255,140,0,0.1), rgba(0,71,171,0.1))`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 30% 50%, rgba(255,140,0,0.08), transparent 60%)',
                  }} />
                  <img 
                    src={require('@/lib/cars').CARS[index % require('@/lib/cars').CARS.length].image} 
                    alt="Track Car" 
                    style={{ height: '70%', objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} 
                  />
                </div>
              </div>
              <div className="track-card-content">
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  marginBottom: 'var(--space-sm)',
                  letterSpacing: '0.05em',
                }}>
                  {track.name}
                </h3>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
                  {track.description}
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: 'var(--space-sm)',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 'var(--space-md)',
                }}>
                  {Object.entries(track.stats).map(([key, value]) => (
                    <div key={key} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.85rem',
                        color: 'var(--color-accent-1)',
                        fontWeight: 700,
                      }}>
                        {value}
                      </div>
                      <div style={{
                        fontSize: '0.6rem',
                        color: 'var(--color-text-dim)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '2px',
                      }}>
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
