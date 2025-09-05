import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSidebarStore, useUserStore, useNotificationStore, useLoadingStore } from '@/store';
import { ApiError } from '@/types';
import { ErrorHandler, AppError } from '@/utils/errorHandler';

// Custom hook for API queries
export const useApiQuery = <T = any>(
    queryKey: string[],
    queryFn: () => Promise<T>,
    options?: {
        enabled?: boolean;
        staleTime?: number;
        cacheTime?: number;
        retry?: boolean | number;
        onError?: (error: AppError) => void;
    }
) => {
    const { setLoading } = useLoadingStore();
    const loadingKey = queryKey.join('-');

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            setLoading(loadingKey, true);
            try {
                const result = await queryFn();
                return result;
            } catch (error) {
                const appError = ErrorHandler.handleApiError(error as ApiError, {
                    action: 'useApiQuery',
                    metadata: { queryKey },
                });
                options?.onError?.(appError);
                throw appError;
            } finally {
                setLoading(loadingKey, false);
            }
        },
        enabled: options?.enabled ?? true,
        staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
        gcTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 minutes
        retry: options?.retry ?? 3,
    });

    return {
        ...query,
        isLoading: query.isLoading || useLoadingStore.getState().isLoading(loadingKey),
    };
};

// Custom hook for API mutations
export const useApiMutation = <TData = any, TVariables = any>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: {
        onSuccess?: (data: TData, variables: TVariables) => void;
        onError?: (error: AppError, variables: TVariables) => void;
        invalidateQueries?: string[][];
    }
) => {
    const queryClient = useQueryClient();
    const { setLoading } = useLoadingStore();
    const { addNotification } = useNotificationStore();

    return useMutation({
        mutationFn: async (variables: TVariables) => {
            setLoading('mutation', true);
            try {
                const result = await mutationFn(variables);
                return result;
            } catch (error) {
                const appError = ErrorHandler.handleApiError(error as ApiError, {
                    action: 'useApiMutation',
                    metadata: { variables },
                });

                addNotification({
                    type: 'error',
                    title: 'Error',
                    message: appError.message,
                });

                options?.onError?.(appError, variables);
                throw appError;
            } finally {
                setLoading('mutation', false);
            }
        },
        onSuccess: (data, variables) => {
            // Invalidate related queries
            if (options?.invalidateQueries) {
                options.invalidateQueries.forEach((queryKey) => {
                    queryClient.invalidateQueries({ queryKey });
                });
            }
            options?.onSuccess?.(data, variables);
        },
    });
};

// Custom hook for sidebar management
export const useSidebar = () => {
    const { isCollapsed, isMobileOpen, toggleSidebar, setCollapsed, setMobileOpen } = useSidebarStore();

    const toggleMobileSidebar = useCallback(() => {
        setMobileOpen(!isMobileOpen);
    }, [isMobileOpen, setMobileOpen]);

    const closeMobileSidebar = useCallback(() => {
        setMobileOpen(false);
    }, [setMobileOpen]);

    return {
        isCollapsed,
        isMobileOpen,
        toggleSidebar,
        setCollapsed,
        toggleMobileSidebar,
        closeMobileSidebar,
    };
};

// Custom hook for user management
export const useUser = () => {
    const { user, isAuthenticated, isLoading, error, setUser, setLoading, setError, logout, hasPermission } = useUserStore();

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            // This would typically call your auth service
            // const response = await AuthService.login(email, password);
            // setUser(response.data.user);
            // localStorage.setItem('auth_token', response.data.token);
        } catch (error) {
            const appError = ErrorHandler.handle(error as Error, {
                action: 'login',
                metadata: { email },
            });
            setError(appError.message);
            throw appError;
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading, setError]);

    const checkPermission = useCallback((permission: string) => {
        return hasPermission(permission);
    }, [hasPermission]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        checkPermission,
    };
};

// Custom hook for notifications
export const useNotifications = () => {
    const { notifications, addNotification, removeNotification, clearAll } = useNotificationStore();

    const showSuccess = useCallback((title: string, message: string) => {
        addNotification({ type: 'success', title, message });
    }, [addNotification]);

    const showError = useCallback((title: string, message: string) => {
        addNotification({ type: 'error', title, message });
    }, [addNotification]);

    const showWarning = useCallback((title: string, message: string) => {
        addNotification({ type: 'warning', title, message });
    }, [addNotification]);

    const showInfo = useCallback((title: string, message: string) => {
        addNotification({ type: 'info', title, message });
    }, [addNotification]);

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
};

// Custom hook for loading states
export const useLoading = (key: string) => {
    const { isLoading, setLoading } = useLoadingStore();

    const setLoadingState = useCallback((loading: boolean) => {
        setLoading(key, loading);
    }, [key, setLoading]);

    return {
        isLoading: isLoading(key),
        setLoading: setLoadingState,
    };
};

// Custom hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Custom hook for local storage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue] as const;
};

// Custom hook for previous value
export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

// Custom hook for intersection observer
export const useIntersectionObserver = (
    elementRef: React.RefObject<Element>,
    options?: IntersectionObserverInit
) => {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            options
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [elementRef, options]);

    return isIntersecting;
};

// Custom hook for media queries
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

// Custom hook for async operations
export const useAsync = <T, E = string>(
    asyncFunction: () => Promise<T>,
    immediate = true
) => {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
        } catch (error) {
            setError(error as E);
            setStatus('error');
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, data, error };
};

// Custom hook for pagination
export const usePagination = (totalItems: number, itemsPerPage: number = 10) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);

    const startIndex = useMemo(() => {
        return (currentPage - 1) * itemsPerPage;
    }, [currentPage, itemsPerPage]);

    const endIndex = useMemo(() => {
        return Math.min(startIndex + itemsPerPage, totalItems);
    }, [startIndex, itemsPerPage, totalItems]);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }, [totalPages]);

    const nextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    return {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        goToPage,
        nextPage,
        prevPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
};

// Custom hook for route protection
export const useRouteProtection = (requiredPermissions?: string[]) => {
    const router = useRouter();
    const { isAuthenticated, user, checkPermission } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthorization = async () => {
            if (!isAuthenticated) {
                router.push('/auth/login');
                return;
            }

            if (requiredPermissions && requiredPermissions.length > 0) {
                const hasAllPermissions = requiredPermissions.every(permission =>
                    checkPermission(permission)
                );

                if (!hasAllPermissions) {
                    router.push('/unauthorized');
                    return;
                }
            }

            setIsAuthorized(true);
            setIsLoading(false);
        };

        checkAuthorization();
    }, [isAuthenticated, user, requiredPermissions, checkPermission, router]);

    return { isAuthorized, isLoading };
};
