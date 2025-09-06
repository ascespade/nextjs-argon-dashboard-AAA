import React, { Suspense, ComponentType, ReactNode } from 'react';
import { Spinner } from 'reactstrap';

interface LazyComponentProps {
  fallback?: ReactNode;
  children: ReactNode;
}

// Default loading fallback
const DefaultFallback = () => (
  <div className='d-flex justify-content-center align-items-center py-5'>
    <Spinner color='primary' />
    <span className='ms-2'>Loading...</span>
  </div>
);

// Lazy component wrapper with error boundary
export const LazyComponent: React.FC<LazyComponentProps> = ({
  fallback = <DefaultFallback />,
  children,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) => {
  const LazyWrappedComponent = (props: P) => (
    <LazyComponent fallback={fallback}>
      <Component {...props} />
    </LazyComponent>
  );

  LazyWrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;

  return LazyWrappedComponent;
};

// Lazy load a component with dynamic import
export const lazyLoadComponent = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) => {
  const LazyComponent = React.lazy(importFunc);

  const WrappedComponent = (props: P) => (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyComponent {...(props as any)} />
    </Suspense>
  );

  WrappedComponent.displayName = `lazyLoadComponent(Component)`;

  return WrappedComponent;
};

export default LazyComponent;
