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

  // Track network requests
  useEffect(() => {
    if (!enableNetworkTracking) return;

    const originalFetch = window.fetch;
    let requestCount = 0;

    window.fetch = async (...args) => {
      requestCount++;
      metricsRef.current.networkRequests = requestCount;
      
      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        metricsRef.current.errors++;
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [enableNetworkTracking]);

  // Track errors
  useEffect(() => {
    if (!enableErrorTracking) return;

    const handleError = (event: ErrorEvent) => {
      metricsRef.current.errors++;
      console.error('Performance tracked error:', event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      metricsRef.current.errors++;
      console.error('Performance tracked unhandled rejection:', event.reason);
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