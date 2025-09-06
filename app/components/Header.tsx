'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Globe, Menu } from 'lucide-react';

export default function Header() {
  // Simplified version without hooks for now
  const theme = 'light';
  const locale = 'en';
  
  const toggleLanguage = () => {
    // Simplified toggle
    console.log('Toggle language');
  };
  
  const toggleTheme = () => {
    // Simplified toggle
    console.log('Toggle theme');
  };
  
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.editor': 'Editor',
      'nav.login': 'Login',
      'lang.toggle': 'Toggle Language',
      'theme.toggle': 'Toggle Theme',
    };
    return translations[key] || key;
  };

  return (
    <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>AD</span>
              </div>
              <span className='text-xl font-bold text-gray-900 dark:text-white'>
                {t('nav.home')}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href='/admin/dashboard'
              className='text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
            >
              {t('nav.dashboard')}
            </Link>
            <Link
              href='/editor'
              className='text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
            >
              {t('nav.editor')}
            </Link>
            <Link
              href='/auth/login'
              className='text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
            >
              {t('nav.login')}
            </Link>
          </nav>

          {/* Controls */}
          <div className='flex items-center space-x-4'>
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              title={t('lang.toggle')}
            >
              <Globe className='w-5 h-5 text-gray-600 dark:text-gray-400' />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              title={t('theme.toggle')}
            >
              {theme === 'light' ? (
                <Moon className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              ) : (
                <Sun className='w-5 h-5 text-gray-600 dark:text-gray-400' />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button className='md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
              <Menu className='w-5 h-5 text-gray-600 dark:text-gray-400' />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
