'use client';

import { useFramePreloader } from '@/hooks/useFramePreloader';
import LoadingScreen from '@/components/LoadingScreen';
import HeroCanvas from '@/components/HeroCanvas';
import CollectionShowcase from '@/components/CollectionShowcase';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { progress, images, isLoaded } = useFramePreloader();

  return (
    <>
      <LoadingScreen progress={progress} isLoaded={isLoaded} />

      {isLoaded && (
        <>
          <HeroCanvas images={images} />
          <CollectionShowcase />
          <Footer />
        </>
      )}
    </>
  );
}
