'use client';

import { useState, useEffect, useCallback } from 'react';
import { FRAME_COUNT, getFramePath } from '@/lib/constants';

interface PreloaderResult {
  progress: number;
  images: HTMLImageElement[];
  isLoaded: boolean;
}

export function useFramePreloader(): PreloaderResult {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = FRAME_COUNT;
    const images: HTMLImageElement[] = new Array(totalFrames);

    const onLoad = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / totalFrames) * 100);
      setProgress(pct);
      if (loadedCount === totalFrames) {
        setImages(images);
        setIsLoaded(true);
      }
    };

    // Load in batches of 10 to avoid network congestion
    const batchSize = 10;
    let batchIndex = 0;

    const loadBatch = () => {
      const start = batchIndex * batchSize;
      const end = Math.min(start + batchSize, totalFrames);

      for (let i = start; i < end; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          onLoad();
          // Start next batch when current batch is done
          if (loadedCount === end && end < totalFrames) {
            batchIndex++;
            loadBatch();
          }
        };
        img.onerror = onLoad; // Count errors as loaded to prevent hanging
        images[i] = img;
      }
    };

    loadBatch();
  }, []);

  return { progress, images, isLoaded };
}
