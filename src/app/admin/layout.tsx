'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LogOut, Flame } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  useEffect(() => {
    const token = localStorage.getItem('hw_admin_token');
    if (!isLoginPage && !token) {
      router.replace('/admin/login/');
    }
    setChecking(false);
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('hw_admin_token');
    router.replace('/admin/login/');
  };

  if (checking) {
    return (
      <div className="admin-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Flame size={32} color="#FF8C00" />
        </motion.div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link href="/" className="admin-brand">
            <Flame size={20} color="#FF8C00" />
            <span>Hot Wheels</span>
            <span className="admin-badge">
              <Shield size={12} />
              Admin
            </span>
          </Link>

          <div className="admin-header-actions">
            <Link href="/" className="admin-header-link" target="_blank">
              View Site ↗
            </Link>
            <button onClick={handleLogout} className="admin-logout-btn">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="admin-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
