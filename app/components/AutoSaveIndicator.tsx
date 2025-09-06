'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaveTime?: number;
  error?: string;
}

export default function AutoSaveIndicator({
  isSaving,
  lastSaveTime,
  error,
}: AutoSaveIndicatorProps) {
  const { t } = useI18n();

  const formatLastSaveTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) {
      // Less than 1 minute
      return t('common.just_now', 'Just now');
    } else if (diff < 3600000) {
      // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return t('common.minutes_ago', `${minutes} minutes ago`);
    } else {
      // More than 1 hour
      const hours = Math.floor(diff / 3600000);
      return t('common.hours_ago', `${hours} hours ago`);
    }
  };

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]'>
        {isSaving ? (
          <div className='flex items-center space-x-2'>
            <div className='animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent'></div>
            <span className='text-sm text-gray-600 dark:text-gray-300'>
              {t('common.saving', 'Saving...')}
            </span>
          </div>
        ) : error ? (
          <div className='flex items-center space-x-2'>
            <div className='h-4 w-4 text-red-500'>
              <svg fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <span className='text-sm text-red-600 dark:text-red-400'>
              {t('common.save_error', 'Save failed')}
            </span>
          </div>
        ) : lastSaveTime ? (
          <div className='flex items-center space-x-2'>
            <div className='h-4 w-4 text-green-500'>
              <svg fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <span className='text-sm text-gray-600 dark:text-gray-300'>
              {t('common.saved', 'Saved')} {formatLastSaveTime(lastSaveTime)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
