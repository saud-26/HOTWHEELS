import { CARS } from './cars';

/**
 * Maps car IDs to their local image paths.
 * Used as a fallback when Firestore data has stale/broken external URLs.
 */
const LOCAL_IMAGE_MAP: Record<string, string> = {};
for (const car of CARS) {
  LOCAL_IMAGE_MAP[car.id] = car.image;
}

/**
 * Get the best working image URL for a car.
 * Prefers the provided image, but if it's an external/proxy URL,
 * falls back to the known local image.
 */
export function resolveCarImage(carId: string, imageUrl?: string): string {
  // If the image is already a local path, use it directly
  if (imageUrl && imageUrl.startsWith('/cars/')) {
    return imageUrl;
  }

  // If we have a local image for this car ID, prefer that
  if (LOCAL_IMAGE_MAP[carId]) {
    return LOCAL_IMAGE_MAP[carId];
  }

  // Otherwise use whatever was provided (may be broken)
  return imageUrl || '';
}

/**
 * Handles image load errors by swapping to a gradient placeholder.
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  // Hide the broken image
  img.style.display = 'none';
  // Show parent's fallback background if any
  const parent = img.parentElement;
  if (parent) {
    parent.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    parent.style.display = 'flex';
    parent.style.alignItems = 'center';
    parent.style.justifyContent = 'center';
    // Add a car emoji as fallback
    if (!parent.querySelector('.img-fallback')) {
      const fallback = document.createElement('span');
      fallback.className = 'img-fallback';
      fallback.textContent = '🏎️';
      fallback.style.fontSize = '3rem';
      fallback.style.opacity = '0.5';
      parent.appendChild(fallback);
    }
  }
}
