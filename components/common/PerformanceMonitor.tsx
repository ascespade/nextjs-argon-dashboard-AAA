import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Row, Col, Badge } from 'reactstrap';
import { usePerformance } from '@/hooks/usePerformance';

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  show = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className = '',
}) => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkRequests: 0,
    errors: 0,
  });

  const { getMetrics } = usePerformance({
    enableMemoryTracking: true,
    enableNetworkTracking: true,
    enableErrorTracking: true,
    onMetricsUpdate: (newMetrics) => {
      setMetrics({
        loadTime: newMetrics.loadTime,
        renderTime: newMetrics.renderTime,
        memoryUsage: newMetrics.memoryUsage || 0,
        networkRequests: newMetrics.networkRequests,
        errors: newMetrics.errors,
      });
    },
  });

  useEffect(() => {
    if (show) {
      const currentMetrics = getMetrics();
      setMetrics({
        loadTime: currentMetrics.loadTime,
        renderTime: currentMetrics.renderTime,
        memoryUsage: currentMetrics.memoryUsage || 0,
        networkRequests: currentMetrics.networkRequests,
        errors: currentMetrics.errors,
      });
    }
  }, [show, getMetrics]);

  if (!show) return null;

  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'position-fixed top-0 start-0 m-3';
      case 'top-right':
        return 'position-fixed top-0 end-0 m-3';
      case 'bottom-left':
        return 'position-fixed bottom-0 start-0 m-3';
      case 'bottom-right':
      default:
        return 'position-fixed bottom-0 end-0 m-3';
    }
  };

  const getMemoryColor = (usage: number) => {
    if (usage < 50) return 'success';
    if (usage < 100) return 'warning';
    return 'danger';
  };

  const getLoadTimeColor = (time: number) => {
    if (time < 1000) return 'success';
    if (time < 3000) return 'warning';
    return 'danger';
  };

  return (
    <Card
      className={`${getPositionClass()} ${className} perf-monitor-card`}
    >
      <CardBody className="p-3">
        <CardTitle tag="h6" className="mb-3 d-flex align-items-center">
          <i className="fas fa-tachometer-alt me-2 text-primary"></i>
          Performance Monitor
        </CardTitle>
        
        <Row className="g-2">
          <Col xs="6">
            <div className="text-center">
              <div className="small text-muted">Load Time</div>
              <Badge 
                color={getLoadTimeColor(metrics.loadTime)}
                className="fs-6"
              >
                {metrics.loadTime > 0 ? `${metrics.loadTime}ms` : 'N/A'}
              </Badge>
            </div>
          </Col>
          
          <Col xs="6">
            <div className="text-center">
              <div className="small text-muted">Render Time</div>
              <Badge 
                color={metrics.renderTime < 16 ? 'success' : 'warning'}
                className="fs-6"
              >
                {metrics.renderTime > 0 ? `${metrics.renderTime.toFixed(1)}ms` : 'N/A'}
              </Badge>
            </div>
          </Col>
          
          <Col xs="6">
            <div className="text-center">
              <div className="small text-muted">Memory</div>
              <Badge 
                color={getMemoryColor(metrics.memoryUsage)}
                className="fs-6"
              >
                {metrics.memoryUsage > 0 ? `${metrics.memoryUsage.toFixed(1)}MB` : 'N/A'}
              </Badge>
            </div>
          </Col>
          
          <Col xs="6">
            <div className="text-center">
              <div className="small text-muted">Requests</div>
              <Badge 
                color="info"
                className="fs-6"
              >
                {metrics.networkRequests}
              </Badge>
            </div>
          </Col>
          
          {metrics.errors > 0 && (
            <Col xs="12">
              <div className="text-center">
                <div className="small text-muted">Errors</div>
                <Badge color="danger" className="fs-6">
                  {metrics.errors}
                </Badge>
              </div>
            </Col>
          )}
        </Row>
        
        <div className="mt-3 pt-2 border-top">
          <div className="small text-muted text-center">
            <i className="fas fa-info-circle me-1"></i>
            Development Mode
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PerformanceMonitor;
