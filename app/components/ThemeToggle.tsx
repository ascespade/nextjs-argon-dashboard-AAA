'use client';
import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme-preference';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // After mount, sync with documentElement and localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const root = document.documentElement;
      const hasDark = root.classList.contains('dark');
      const saved = localStorage.getItem(STORAGE_KEY) as
        | 'light'
        | 'dark'
        | null;
      if (saved) {
        setMode(saved);
      } else {
        setMode(hasDark ? 'dark' : 'light');
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const root = document.documentElement;
      if (mode === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (_) {}
  }, [mounted, mode]);

  if (!mounted) {
    // Avoid SSR/CSR mismatch
    return <div className='h-10 w-10 rounded-md border bg-transparent' />;
  }

  return (
    <button
      aria-label='Toggle dark mode'
      title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}
      onClick={() => setMode(m => (m === 'dark' ? 'light' : 'dark'))}
      className='inline-flex items-center justify-center h-10 w-10 rounded-md border bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700'
    >
      {mode === 'dark' ? (
        // Sun
        <svg
          className='w-5 h-5 text-yellow-400'
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM20 13h3v-2h-3v2zM17.66 4.46l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42zM11 5a6 6 0 100 12A6 6 0 0011 5zm0 10a4 4 0 110-8 4 4 0 010 8zm7 5.54l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM3.76 18.37l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42z' />
        </svg>
      ) : (
        // Moon
        <svg
          className='w-5 h-5 text-gray-700'
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M12.76 3a9 9 0 108.24 12.91A8 8 0 0112.76 3z' />
        </svg>
      )}
    </button>
  );
}
