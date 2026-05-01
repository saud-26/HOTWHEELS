'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function PwaBootstrap() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // PWA support should never block the website.
      });
    }

    const visits = Number(localStorage.getItem('hw_visit_count') || '0') + 1;
    localStorage.setItem('hw_visit_count', String(visits));

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);

      if (visits >= 3 && localStorage.getItem('hw_install_dismissed') !== 'true') {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  const install = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  const dismiss = () => {
    localStorage.setItem('hw_install_dismissed', 'true');
    setShowInstallBanner(false);
  };

  if (!showInstallBanner) {
    return null;
  }

  return (
    <div className="pwa-install-banner" role="dialog" aria-label="Install Hot Wheels app">
      <div>
        <strong>Install Hot Wheels</strong>
        <span>Faster loading and a home-screen shortcut.</span>
      </div>
      <button type="button" onClick={install}>
        Install
      </button>
      <button type="button" className="pwa-install-dismiss" onClick={dismiss} aria-label="Dismiss install banner">
        x
      </button>
    </div>
  );
}
