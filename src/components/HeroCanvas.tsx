'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useGForce } from '@/hooks/useGForce';
import { FRAME_COUNT } from '@/lib/constants';

interface HeroCanvasProps {
  images: HTMLImageElement[];
}

export default function HeroCanvas({ images }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);

  const {
    scrollYProgress,
    y,
    rotation,
    vibrationX,
    vibrationY,
  } = useGForce(containerRef);

  // Map scroll progress to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Canvas render logic
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !images.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(Math.round(index), images.length - 1));
    const img = images[clampedIndex];
    if (!img || !img.complete) return;

    // Contain fit: maintain aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth: number, drawHeight: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      // Image is wider — fit to width
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgAspect;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      // Image is taller — fit to height
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgAspect;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, [images]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      renderFrame(currentFrameRef.current);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [renderFrame]);

  // Subscribe to frame changes
  useEffect(() => {
    const unsubscribe = frameIndex.on('change', (v: number) => {
      currentFrameRef.current = v;
      renderFrame(v);
    });
    return unsubscribe;
  }, [frameIndex, renderFrame]);

  // Initial render
  useEffect(() => {
    if (images.length > 0) {
      renderFrame(0);
    }
  }, [images, renderFrame]);

  return (
    <div className="hero" ref={containerRef}>
      <div className="hero-sticky">
        {/* Canvas with G-force transforms */}
        <motion.div
          className="hero-canvas"
          style={{
            y,
            rotate: rotation,
            x: vibrationX,
          }}
        >
          <canvas ref={canvasRef} />
        </motion.div>

        {/* Overlay Text */}
        <div className="hero-overlay">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.span
              className="hero-title-line gradient-text-orange"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Legends
            </motion.span>
            <motion.span
              className="hero-title-line"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Never Die
            </motion.span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            The Ultimate Hot Wheels Collection
          </motion.p>

          <motion.div
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <a href="/rare-collection/" className="btn btn-primary">
              Explore Collection
            </a>
            <a href="/history/" className="btn btn-secondary">
              Our Legacy
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="hero-scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <span>Scroll to Ignite</span>
            <div className="hero-scroll-line" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
