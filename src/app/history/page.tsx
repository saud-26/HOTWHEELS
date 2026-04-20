'use client';

import { motion } from 'framer-motion';
import Timeline from '@/components/Timeline';
import Footer from '@/components/Footer';

export default function HistoryPage() {
  return (
    <>
      <div className="page-hero">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="gradient-text">Hot Wheels</span> History
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          From a garage idea in 1968 to the world&apos;s #1 selling toy car brand.
          Over 6 billion cars produced. One legendary story.
        </motion.p>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <Timeline />
      </section>

      {/* Legacy Stats */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            textAlign: 'center',
          }}>
            {[
              { value: '6B+', label: 'Cars Produced' },
              { value: '800+', label: 'Models Per Year' },
              { value: '150+', label: 'Countries' },
              { value: '56+', label: 'Years of Speed' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ padding: 'var(--space-xl)' }}
              >
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 900,
                  color: 'var(--color-accent-1)',
                  marginBottom: 'var(--space-xs)',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
