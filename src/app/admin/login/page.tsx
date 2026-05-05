'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Flame, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      
      const userCredential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      // Optional: Save tokens if needed later
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('hw_admin_token', token);
      
      router.push('/admin/dashboard/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Background effects */}
      <div className="admin-login-bg">
        <div className="admin-login-glow admin-login-glow-1" />
        <div className="admin-login-glow admin-login-glow-2" />
        <div className="admin-login-grid" />
      </div>

      <motion.div
        className={`admin-login-card glass-strong ${shake ? 'shake' : ''}`}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="admin-login-logo"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="admin-login-logo-icon">
            <Flame size={32} />
          </div>
          <h1>Hot Wheels</h1>
          <p>Admin Control Panel</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <motion.div
            className="admin-input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label htmlFor="email">
              <Mail size={14} />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </motion.div>

          <motion.div
            className="admin-input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label htmlFor="password">
              <Lock size={14} />
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </motion.div>

          {error && (
            <motion.div
              className="admin-login-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="btn btn-primary admin-login-submit"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-flex' }}
              >
                <Flame size={18} />
              </motion.span>
            ) : (
              <>
                Access Dashboard
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <motion.p
          className="admin-login-footer-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Authorized personnel only
        </motion.p>
      </motion.div>
    </div>
  );
}
