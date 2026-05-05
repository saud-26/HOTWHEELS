import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from './firebase';

export async function convertAndUploadImage(file: File, productId: string) {
  // Read the file as an Image
  const img = new Image();
  const reader = new FileReader();

  const loadImage = new Promise<HTMLImageElement>((resolve, reject) => {
    reader.onload = (e) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  await loadImage;

  // Sizes to resize to
  const sizes = [
    { name: 'thumb', size: 200, quality: 0.7 },
    { name: 'medium', size: 600, quality: 0.75 },
    { name: 'large', size: 1200, quality: 0.85 },
  ];

  const uploadPromises = sizes.map(async ({ name, size, quality }) => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    // Calculate aspect ratio
    if (width > height) {
      if (width > size) {
        height = height * (size / width);
        width = size;
      }
    } else {
      if (height > size) {
        width = width * (size / height);
        height = size;
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');

    ctx.drawImage(img, 0, 0, width, height);

    // Convert canvas to Blob as WebP
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', quality);
    });

    if (!blob) throw new Error('Failed to create WebP blob');

    // Upload to Firebase Storage
    const storageRef = ref(getFirebaseStorage(), `products/${productId}/${name}.webp`);
    
    // Set metadata to cache the image
    const metadata = {
      contentType: 'image/webp',
      cacheControl: 'public,max-age=31536000',
    };

    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return { name, url: downloadUrl };
  });

  const results = await Promise.all(uploadPromises);

  return {
    thumb: results.find((r) => r.name === 'thumb')?.url || '',
    medium: results.find((r) => r.name === 'medium')?.url || '',
    large: results.find((r) => r.name === 'large')?.url || '',
  };
}
