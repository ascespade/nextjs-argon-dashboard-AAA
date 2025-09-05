"use client";
import React, { useState, useEffect } from 'react';
import { useSidebar } from './SidebarContext';

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState({ loadTime: 0, renderTime: 0, memoryUsage: 0, networkRequests: 0, errors: 0 });

  useEffect(() => {
    const t = setTimeout(() => {
      setMetrics(m => ({ ...m, loadTime: Math.round(Math.random() * 200) }));
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 w-72 bg-white border rounded shadow p-3 z-50">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-indigo-500" />
        <div className="text-sm font-semibold">Performance Monitor</div>
      </div>
      <div className="text-xs text-gray-500">Load Time</div>
      <div className="text-sm font-medium text-green-600 mb-2">{metrics.loadTime}ms</div>
      <div className="text-xs text-gray-500">Memory</div>
      <div className="text-sm font-medium text-orange-600 mb-2">{metrics.memoryUsage}MB</div>
      <div className="text-xs text-gray-500">Requests</div>
      <div className="text-sm font-medium text-blue-600">{metrics.networkRequests}</div>
    </div>
  );
};

export default PerformanceMonitor;
