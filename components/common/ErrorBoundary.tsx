import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Row, Col, Button, Card, CardBody } from 'reactstrap';
import { ErrorHandler, AppError } from '@/utils/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: AppError; resetError: () => void }>;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: AppError;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const appError = ErrorHandler.handle(error, {
      component: 'ErrorBoundary',
      action: 'getDerivedStateFromError',
    });

    return {
      hasError: true,
      error: appError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = ErrorHandler.handle(error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    });

    this.setState({ error: appError });
    this.props.onError?.(appError, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{
  error: AppError;
  resetError: () => void;
}> = ({ error, resetError }) => (
  <Container className='py-5'>
    <Row className='justify-content-center'>
      <Col md='8' lg='6'>
        <Card className='border-0 shadow'>
          <CardBody className='text-center p-5'>
            <div className='mb-4'>
              <i
                className='fas fa-exclamation-triangle text-danger'
                style={{ fontSize: '4rem' }}
              ></i>
            </div>

            <h2 className='h4 mb-3'>Something went wrong</h2>

            <p className='text-muted mb-4'>
              We're sorry, but something unexpected happened. Our team has been
              notified and is working to fix the issue.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className='alert alert-warning text-start mb-4'>
                <strong>Development Error Details:</strong>
                <pre className='mt-2 mb-0 small'>
                  {error.message}
                  {error.stack && (
                    <>
                      {'\n\nStack Trace:\n'}
                      {error.stack}
                    </>
                  )}
                </pre>
              </div>
            )}

            <div className='d-flex flex-column flex-sm-row gap-3 justify-content-center'>
              <Button color='primary' onClick={resetError} className='px-4'>
                <i className='fas fa-redo me-2'></i>
                Try Again
              </Button>

              <Button
                color='outline-secondary'
                onClick={() => window.location.reload()}
                className='px-4'
              >
                <i className='fas fa-refresh me-2'></i>
                Reload Page
              </Button>

              <Button
                color='outline-primary'
                onClick={() => window.history.back()}
                className='px-4'
              >
                <i className='fas fa-arrow-left me-2'></i>
                Go Back
              </Button>
            </div>

            <div className='mt-4 pt-4 border-top'>
              <p className='small text-muted mb-0'>
                If this problem persists, please contact our support team.
              </p>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

// Higher-order component for error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// Hook for error reporting
export const useErrorReporting = () => {
  const reportError = React.useCallback(
    (error: Error, context?: Record<string, any>) => {
      const appError = ErrorHandler.handle(error, {
        component: 'useErrorReporting',
        action: 'reportError',
        metadata: context,
      });

      // You can add additional error reporting logic here
      // e.g., send to external error tracking service
      console.error('Error reported:', appError);
    },
    []
  );

  return { reportError };
};

export default ErrorBoundary;
