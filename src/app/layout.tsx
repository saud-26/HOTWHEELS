import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

import AdminButton from '@/components/AdminButton';

export const metadata: Metadata = {
  title: 'Hot Wheels Legends | The Ultimate Die-Cast Collection',
  description:
    'Explore the most iconic Hot Wheels die-cast cars ever made. Treasure Hunts, Super Treasure Hunts, and legendary castings from 1968 to today. Legends Never Die.',
  keywords: ['Hot Wheels', 'die-cast', 'Treasure Hunt', 'Super Treasure Hunt', 'collector', 'cars'],
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
        <AdminButton />
      </body>
    </html>
  );
}
