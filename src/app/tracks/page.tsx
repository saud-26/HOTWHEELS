'use client';

import { motion } from 'framer-motion';
import TrackShowcase from '@/components/TrackShowcase';
import CommunityStats from '@/components/CommunityStats';
import Footer from '@/components/Footer';

export default function TracksPage() {
  return (
    <>
      {/* Hero with animated background */}
      <div className="track-hero">
        <div className="track-hero-bg">
          {/* Animated CSS background instead of video */}
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `
                radial-gradient(ellipse at 20% 50%, rgba(255,140,0,0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 50%, rgba(0,71,171,0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 100%, rgba(255,140,0,0.1) 0%, transparent 40%)
              `,
              animation: 'gradient-shift 8s ease-in-out infinite',
              backgroundSize: '200% 200%',
            }}
          />
        </div>
        <div className="track-hero-overlay" />
        <div className="track-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: 'var(--space-md)' }}
          >
            <span className="gradient-text">Track</span> Builder
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              color: 'var(--color-text-muted)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            From living room loops to garage mega-tracks. These are the most
            insane track builds from our global community of speed engineers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ marginTop: 'var(--space-xl)' }}
          >
            <a href="#tracks" className="btn btn-primary">
              Explore Tracks
            </a>
          </motion.div>
        </div>
      </div>

      {/* Track showcase */}
      <div id="tracks">
        <TrackShowcase />
      </div>

      {/* Community section */}
      <CommunityStats />

      {/* Join CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 style={{ marginBottom: 'var(--space-md)' }}>
              Ready to <span className="gradient-text-orange">Build</span>?
            </h2>
            <p style={{ margin: '0 auto var(--space-xl)', maxWidth: '500px' }}>
              Join thousands of track builders, share your layouts, and compete
              for the fastest times. The community awaits.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary">Join the Community</button>
              <button className="btn btn-secondary">Submit Your Track</button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
