'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Gauge, History, Home, Route } from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/rare-collection/', label: 'Rare', icon: Flame },
  { href: '/garage/', label: 'Garage', icon: Gauge },
  { href: '/history/', label: 'History', icon: History },
  { href: '/tracks/', label: 'Tracks', icon: Route },
];

function normalizePath(pathname: string | null) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const currentPath = normalizePath(pathname);

  if (currentPath.startsWith('/admin/')) {
    return null;
  }

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {MOBILE_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = currentPath === href;

        return (
          <Link
            key={href}
            href={href}
            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="mobile-bottom-nav-dot" />
            <Icon size={20} strokeWidth={2.2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
