'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function CarRotator({ image }: { image?: string }) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-200, 200], [-45, 45]);
  const smoothRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className="car-rotator"
      ref={constraintsRef}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,0,0.08), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Draggable car */}
      <motion.div
        style={{
          rotateY: smoothRotateY,
          x,
          fontSize: '6rem',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          perspective: '800px',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
        }}
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setIsDragging(false);
          x.set(0);
        }}
      >
        {image ? (
          <img src={image} alt="Car 3D View" onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{ height: '250px', objectFit: 'contain', pointerEvents: 'none' }} draggable={false} />
        ) : (
          <span style={{ fontSize: '6rem' }}>🏎️</span>
        )}
      </motion.div>

      {/* Ground shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          width: '50%',
          height: '8px',
          background: 'radial-gradient(ellipse, rgba(255,140,0,0.15), transparent)',
          borderRadius: '50%',
        }}
      />

      <div className="car-rotator-hint">
        ← Drag to Rotate →
      </div>
    </motion.div>
  );
}
