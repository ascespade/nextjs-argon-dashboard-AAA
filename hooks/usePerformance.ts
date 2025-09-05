import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  networkRequests: number;
  errors: number;
}

interface PerformanceOptions {
  enableMemoryTracking?: boolean;
  enableNetworkTracking?: boolean;
  enableErrorTracking?: boolean;
  reportInterval?: number;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const usePerformance = (options: PerformanceOptions = {}) => {
  const {
    enableMemoryTracking = false,
    enableNetworkTracking = true,
    enableErrorTracking = true,
    reportInterval = 5000,
    onMetricsUpdate,
  } = options;

  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errors: 0,
  });

  const startTimeRef = useRef<number>(Date.now());
  const renderStartTimeRef = useRef<number>(0);

  // Track page load time
  useEffect(() => {
    const handleLoad = () => {
      metricsRef.current.loadTime = Date.now() - startTimeRef.current;
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Track render time
  const startRenderTimer = useCallback(() => {
    renderStartTimeRef.current = performance.now();
  }, []);

  const endRenderTimer = useCallback(() => {
    if (renderStartTimeRef.current > 0) {
      metricsRef.current.renderTime = performance.now() - renderStartTimeRef.current;
    }
  }, []);

  // Track memory usage
  useEffect(() => {
    if (!enableMemoryTracking || !('memory' in performance)) return;

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory;
      if (memory) {
        metricsRef.current.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      }
    };

    const interval = setInterval(updateMemoryUsage, reportInterval);
    return () => clearInterval(interval);
  }, [enableMemoryTracking, reportInterval]);

  // Track network requests using PerformanceObserver (safer than monkey-patching fetch)
  useEffect(() => {
    if (!enableNetworkTracking) return;

    if (typeof PerformanceObserver === 'undefined' || typeof performance === 'undefined') {
      return;
    }

    let requestCount = metricsRef.current.networkRequests || 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() || [];
      entries.forEach((entry: any) => {
        // Count resource fetches and XHR/fetch initiator types
        if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch' || entry.entryType === 'resource') {
          requestCount++;
          metricsRef.current.networkRequests = requestCount;
        }
      });
    });

    try {
      observer.observe({ type: 'resource', buffered: true });
    } catch (_e) {
      // Some browsers require observe with entryTypes
      try {
        // @ts-ignore
        observer.observe({ entryTypes: ['resource'] });
      } catch (_err) {
        // Give up silently
      }
    }

    return () => {
      try { observer.disconnect(); } catch (_e) {}
    };
  }, [enableNetworkTracking]);

  // Track errors
  useEffect(() => {
    if (!enableErrorTracking) return;

    const isNoisyNetworkError = (reason: any) => {
      try {
        if (!reason) return false;
        const msg = typeof reason === 'string' ? reason : reason.message || reason.name || '';
        const stack = reason && reason.stack ? String(reason.stack) : '';
        // Ignore generic network fetch failures and known 3rd-party hosts like fullstory
        if (msg.toLowerCase().includes('failed to fetch')) return true;
        if (stack.toLowerCase().includes('fullstory')) return true;
        if ((reason && reason.name && reason.name === 'TypeError') && msg.toLowerCase().includes('failed')) return true;
      } catch (_e) {
        // ignore
      }
      return false;
    };

    const handleError = (event: ErrorEvent) => {
      // Ignore noisy network errors from third-party scripts
      if (isNoisyNetworkError(event.error || event.message)) return;
      metricsRef.current.errors++;
      try { console.error('Performance tracked error:', event.error || event.message); } catch (_e) {}
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isNoisyNetworkError(event.reason)) return;
      metricsRef.current.errors++;
      try { console.error('Performance tracked unhandled rejection:', event.reason); } catch (_e) {}
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [enableErrorTracking]);

  // Report metrics periodically
  useEffect(() => {
    if (!onMetricsUpdate) return;

    const interval = setInterval(() => {
      onMetricsUpdate({ ...metricsRef.current });
    }, reportInterval);

    return () => clearInterval(interval);
  }, [onMetricsUpdate, reportInterval]);

  // Get current metrics
  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      networkRequests: 0,
      errors: 0,
    };
    startTimeRef.current = Date.now();
  }, []);

  // Measure function execution time
  const measureExecution = useCallback(async <T>(
    fn: () => Promise<T> | T,
    label?: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const end = performance.now();
      const duration = end - start;
      
      if (label) {
        console.log(`${label} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      if (label) {
        console.error(`${label} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  }, []);

  // Measure component render time
  const measureRender = useCallback((componentName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      console.log(`${componentName} rendered in ${duration.toFixed(2)}ms`);
    };
  }, []);

  return {
    getMetrics,
    resetMetrics,
    startRenderTimer,
    endRenderTimer,
    measureExecution,
    measureRender,
  };
};

// Hook for measuring component performance
export const useComponentPerformance = (componentName: string) => {
  const { measureRender } = usePerformance();

  useEffect(() => {
    const endMeasure = measureRender(componentName);
    return endMeasure;
  }, [componentName, measureRender]);
};

// Hook for measuring API call performance
export const useApiPerformance = () => {
  const { measureExecution } = usePerformance();

  const measureApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    return measureExecution(apiCall, `API call to ${endpoint}`);
  }, [measureExecution]);

  return { measureApiCall };
};

export default usePerformance;
