'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AdminButton() {
  const pathname = usePathname();

  // Hide the floating button if we are already inside the admin section
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <Link href="/admin/dashboard" title="Admin Dashboard">
      <motion.div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          borderRadius: '50%',
          background: 'rgba(10, 10, 10, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#888888',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer'
        }}
        whileHover={{ 
          scale: 1.1, 
          color: '#FF8C00', 
          borderColor: '#FF8C00' 
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings size={22} />
      </motion.div>
    </Link>
  );
}
