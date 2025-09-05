import React from 'react';
import { ApiError } from '@/types';

// Error types
export enum ErrorType {
    NETWORK = 'NETWORK_ERROR',
    VALIDATION = 'VALIDATION_ERROR',
    AUTHENTICATION = 'AUTHENTICATION_ERROR',
    AUTHORIZATION = 'AUTHORIZATION_ERROR',
    NOT_FOUND = 'NOT_FOUND_ERROR',
    SERVER = 'SERVER_ERROR',
    CLIENT = 'CLIENT_ERROR',
    UNKNOWN = 'UNKNOWN_ERROR',
}

export interface ErrorContext {
    component?: string;
    action?: string;
    userId?: string;
    timestamp?: Date;
    metadata?: Record<string, any>;
}

// Custom error class
export class AppError extends Error {
    public readonly type: ErrorType;
    public readonly code: string;
    public readonly context: ErrorContext;
    public readonly originalError?: Error;

    constructor(
        message: string,
        type: ErrorType = ErrorType.UNKNOWN,
        code: string = 'UNKNOWN',
        context: ErrorContext = {},
        originalError?: Error
    ) {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.code = code;
        this.context = {
            ...context,
            timestamp: new Date(),
        };
        this.originalError = originalError;

        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

// Error logger
class ErrorLogger {
    private static instance: ErrorLogger;
    private logs: Array<{ error: AppError; timestamp: Date }> = [];

    static getInstance(): ErrorLogger {
        if (!ErrorLogger.instance) {
            ErrorLogger.instance = new ErrorLogger();
        }
        return ErrorLogger.instance;
    }

    log(error: AppError): void {
        this.logs.push({ error, timestamp: new Date() });

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('🚨 Application Error:', {
                message: error.message,
                type: error.type,
                code: error.code,
                context: error.context,
                stack: error.stack,
                originalError: error.originalError,
            });
        }

        // Send to external logging service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendToLoggingService(error);
        }
    }

    private async sendToLoggingService(error: AppError): Promise<void> {
        try {
            // Example: Send to external logging service
            // await fetch('/api/logs', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     message: error.message,
            //     type: error.type,
            //     code: error.code,
            //     context: error.context,
            //     stack: error.stack,
            //     userAgent: navigator.userAgent,
            //     url: window.location.href,
            //   }),
            // });
        } catch (loggingError) {
            console.error('Failed to send error to logging service:', loggingError);
        }
    }

    getLogs(): Array<{ error: AppError; timestamp: Date }> {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

// Error handler utility
export class ErrorHandler {
    private static logger = ErrorLogger.getInstance();

    static handle(error: unknown, context: ErrorContext = {}): AppError {
        let appError: AppError;

        if (error instanceof AppError) {
            appError = error;
        } else if (error instanceof Error) {
            appError = new AppError(
                error.message,
                ErrorType.UNKNOWN,
                'UNKNOWN_ERROR',
                context,
                error
            );
        } else if (typeof error === 'string') {
            appError = new AppError(error, ErrorType.UNKNOWN, 'UNKNOWN_ERROR', context);
        } else {
            appError = new AppError(
                'An unknown error occurred',
                ErrorType.UNKNOWN,
                'UNKNOWN_ERROR',
                context
            );
        }

        this.logger.log(appError);
        return appError;
    }

    static handleApiError(error: ApiError, context: ErrorContext = {}): AppError {
        let type: ErrorType;

        switch (error.code) {
            case 'NETWORK_ERROR':
                type = ErrorType.NETWORK;
                break;
            case 'HTTP_401':
                type = ErrorType.AUTHENTICATION;
                break;
            case 'HTTP_403':
                type = ErrorType.AUTHORIZATION;
                break;
            case 'HTTP_404':
                type = ErrorType.NOT_FOUND;
                break;
            case 'HTTP_500':
                type = ErrorType.SERVER;
                break;
            default:
                type = ErrorType.UNKNOWN;
        }

        const appError = new AppError(
            error.message,
            type,
            error.code,
            context
        );

        this.logger.log(appError);
        return appError;
    }

    static createError(
        message: string,
        type: ErrorType = ErrorType.UNKNOWN,
        code: string = 'UNKNOWN',
        context: ErrorContext = {}
    ): AppError {
        const error = new AppError(message, type, code, context);
        this.logger.log(error);
        return error;
    }

    static getLogger(): ErrorLogger {
        return this.logger;
    }
}

// React Error Boundary
export class ErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ComponentType<{ error: AppError }> },
    { hasError: boolean; error?: AppError }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): { hasError: boolean; error: AppError } {
        const appError = ErrorHandler.handle(error, {
            component: 'ErrorBoundary',
            action: 'componentDidCatch',
        });

        return { hasError: true, error: appError };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        ErrorHandler.handle(error, {
            component: 'ErrorBoundary',
            action: 'componentDidCatch',
            metadata: {
                componentStack: errorInfo.componentStack,
            },
        });
    }

    render(): React.ReactNode {
        if (this.state.hasError && this.state.error) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return React.createElement(FallbackComponent, { error: this.state.error });
        }

        return this.props.children;
    }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: AppError }> = ({ error }) => 
    React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-gray-50' },
        React.createElement('div', { className: 'max-w-md w-full bg-white shadow-lg rounded-lg p-6' },
            React.createElement('div', { className: 'flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full' },
                React.createElement('svg', {
                    className: 'w-6 h-6 text-red-600',
                    fill: 'none',
                    stroke: 'currentColor',
                    viewBox: '0 0 24 24'
                },
                    React.createElement('path', {
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 2,
                        d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                    })
                )
            ),
            React.createElement('div', { className: 'mt-4 text-center' },
                React.createElement('h3', { className: 'text-lg font-medium text-gray-900' }, 'Something went wrong'),
                React.createElement('p', { className: 'mt-2 text-sm text-gray-500' }, error.message),
                React.createElement('div', { className: 'mt-4' },
                    React.createElement('button', {
                        onClick: () => window.location.reload(),
                        className: 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }, 'Reload Page')
                )
            )
        )
    );

// Utility functions
export const isNetworkError = (error: AppError): boolean => {
    return error.type === ErrorType.NETWORK;
};

export const isAuthError = (error: AppError): boolean => {
    return error.type === ErrorType.AUTHENTICATION || error.type === ErrorType.AUTHORIZATION;
};

export const isServerError = (error: AppError): boolean => {
    return error.type === ErrorType.SERVER;
};

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AppError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'An unexpected error occurred';
};

export default ErrorHandler;
