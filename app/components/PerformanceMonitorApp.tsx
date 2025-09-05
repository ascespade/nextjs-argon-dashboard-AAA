'use client';
import React, { useState, useEffect } from 'react';
import { useSidebar } from './SidebarContext';

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errors: 0,
  });
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // ensure this component renders nothing on the server to avoid hydration mismatch
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => {
      setMetrics(m => ({
        ...m,
        loadTime: Math.round(Math.random() * 200),
        memoryUsage: Math.round(Math.random() * 300),
        networkRequests: Math.round(Math.random() * 10),
      }));
    }, 2000);
    return () => clearInterval(t);
  }, [mounted]);

  // Render nothing on server; this prevents server/client markup mismatches
  if (!mounted) return null;

  if (!visible) {
    return (
      <div className='fixed bottom-6 left-6 z-50'>
        <button
          onClick={() => setVisible(true)}
          className='inline-flex items-center gap-2 px-3 py-2 bg-white border rounded shadow-sm'
          aria-label='Show performance monitor'
        >
          <svg className='w-4 h-4 text-indigo-600' viewBox='0 0 24 24' fill='none'>
            <path d='M12 5v14M5 12h14' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
          <span className='text-sm'>Show Monitor</span>
        </button>
      </div>
    );
  }

  return (
    <div className='fixed bottom-6 left-6 w-80 bg-white border rounded shadow p-3 z-50'>
      <div className='flex items-center justify-between gap-2 mb-2'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-indigo-500' />
          <div className='text-sm font-semibold'>Performance Monitor</div>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setVisible(false)}
            className='p-1 rounded hover:bg-gray-100'
            aria-label='Hide performance monitor'
          >
            <svg className='w-4 h-4 text-gray-600' viewBox='0 0 24 24' fill='none'>
              <path d='M6 6L18 18M6 18L18 6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </button>
        </div>
      </div>

      <div className='text-xs text-gray-500'>Load Time</div>
      <div className='text-sm font-medium text-green-600 mb-2'>
        {metrics.loadTime}ms
      </div>
      <div className='text-xs text-gray-500'>Memory</div>
      <div className='text-sm font-medium text-orange-600 mb-2'>
        {metrics.memoryUsage}MB
      </div>
      <div className='text-xs text-gray-500'>Requests</div>
      <div className='text-sm font-medium text-blue-600'>
        {metrics.networkRequests}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
