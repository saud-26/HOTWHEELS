'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { TIMELINE_DATA } from '@/lib/constants';

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
    { stiffness: 80, damping: 25 }
  );

  return (
    <div className="timeline-container" ref={containerRef}>
      {/* Animated progress line */}
      <div className="timeline-line">
        <motion.div
          className="timeline-line-fill"
          style={{ height: lineHeight }}
        />
      </div>

      {TIMELINE_DATA.map((entry, i) => (
        <motion.div
          key={entry.year}
          className="timeline-item"
          initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            duration: 0.7,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <div className="timeline-dot" />
          <div className="timeline-content">
            <div className="timeline-year">{entry.year}</div>
            <h3 className="timeline-title">{entry.title}</h3>
            <p className="timeline-desc">{entry.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
