'use client';

import { useRef, useEffect } from 'react';
import {
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion';

interface GForceResult {
  scrollYProgress: MotionValue<number>;
  y: MotionValue<number>;
  rotation: MotionValue<number>;
  vibrationX: MotionValue<number>;
  vibrationY: MotionValue<number>;
}

export function useGForce(containerRef: React.RefObject<HTMLElement | null>): GForceResult {
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track scroll velocity
  const scrollVelocity = useVelocity(scrollYProgress);

  // Map velocity to Y offset (G-force push)
  const rawY = useTransform(scrollVelocity, [-0.5, 0, 0.5], [15, 0, -15]);
  const y = useSpring(rawY, { stiffness: 100, damping: 30 });

  // Map velocity to rotation (tilt under torque)
  const rawRotation = useTransform(scrollVelocity, [-0.5, 0, 0.5], [-3, 0, 3]);
  const rotation = useSpring(rawRotation, { stiffness: 100, damping: 30 });

  // High-frequency vibration based on velocity magnitude
  const vibIntensity = useTransform(scrollVelocity, [-1, 0, 1], [2, 0, 2]);
  const vibrationX = useSpring(vibIntensity, { stiffness: 300, damping: 20 });
  const vibrationY = useSpring(vibIntensity, { stiffness: 300, damping: 20 });

  // Apply random vibration via RAF
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const intensity = vibIntensity.get();
      if (intensity > 0.2) {
        const freqX = Math.sin(Date.now() * 0.05) * intensity;
        const freqY = Math.cos(Date.now() * 0.07) * intensity;
        vibrationX.set(freqX);
        vibrationY.set(freqY);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [vibIntensity, vibrationX, vibrationY]);

  return { scrollYProgress, y, rotation, vibrationX, vibrationY };
}
