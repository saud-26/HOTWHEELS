import type { Metadata, Viewport } from 'next';
import './globals.css';
import './toast.css';
import Navigation from '@/components/Navigation';
import MobileBottomNav from '@/components/MobileBottomNav';
import PwaBootstrap from '@/components/PwaBootstrap';

import AdminButton from '@/components/AdminButton';

export const metadata: Metadata = {
  title: 'Hot Wheels Legends | The Ultimate Die-Cast Collection',
  description:
    'Explore the most iconic Hot Wheels die-cast cars ever made. Treasure Hunts, Super Treasure Hunts, and legendary castings from 1968 to today. Legends Never Die.',
  keywords: ['Hot Wheels', 'die-cast', 'Treasure Hunt', 'Super Treasure Hunt', 'collector', 'cars'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hot Wheels',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E31937',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <MobileBottomNav />
        <AdminButton />
        <PwaBootstrap />
      </body>
    </html>
  );
}
