import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User, SidebarState, Theme, Notification } from '@/types';

// Sidebar Store
interface SidebarStore extends SidebarState {
    toggleSidebar: () => void;
    setCollapsed: (collapsed: boolean) => void;
    setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
    devtools(
        persist(
            immer((set) => ({
                isCollapsed: false,
                isMobileOpen: false,
                toggleSidebar: () =>
                    set((state) => {
                        state.isCollapsed = !state.isCollapsed;
                    }),
                setCollapsed: (collapsed) =>
                    set((state) => {
                        state.isCollapsed = collapsed;
                    }),
                setMobileOpen: (open) =>
                    set((state) => {
                        state.isMobileOpen = open;
                    }),
            })),
            {
                name: 'sidebar-storage',
                partialize: (state) => ({ isCollapsed: state.isCollapsed }),
            }
        ),
        { name: 'sidebar-store' }
    )
);

// User Store
interface UserStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
}

export const useUserStore = create<UserStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                setUser: (user) =>
                    set((state) => {
                        state.user = user;
                        state.isAuthenticated = !!user;
                        state.error = null;
                    }),
                setLoading: (loading) =>
                    set((state) => {
                        state.isLoading = loading;
                    }),
                setError: (error) =>
                    set((state) => {
                        state.error = error;
                    }),
                logout: () =>
                    set((state) => {
                        state.user = null;
                        state.isAuthenticated = false;
                        state.error = null;
                    }),
                hasPermission: (permission) => {
                    const { user } = get();
                    if (!user) return false;
                    return user.permissions.some((p) => p.name === permission);
                },
            })),
            {
                name: 'user-storage',
                partialize: (state) => ({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated
                }),
            }
        ),
        { name: 'user-store' }
    )
);

// Theme Store
interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleMode: () => void;
    setPrimaryColor: (color: string) => void;
    setSecondaryColor: (color: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
    devtools(
        persist(
            immer((set) => ({
                theme: {
                    mode: 'system',
                    primaryColor: '#3b82f6',
                    secondaryColor: '#64748b',
                },
                setTheme: (theme) =>
                    set((state) => {
                        state.theme = theme;
                    }),
                toggleMode: () =>
                    set((state) => {
                        state.theme.mode = state.theme.mode === 'light' ? 'dark' : 'light';
                    }),
                setPrimaryColor: (color) =>
                    set((state) => {
                        state.theme.primaryColor = color;
                    }),
                setSecondaryColor: (color) =>
                    set((state) => {
                        state.theme.secondaryColor = color;
                    }),
            })),
            {
                name: 'theme-storage',
            }
        ),
        { name: 'theme-store' }
    )
);

// Notification Store
interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
    devtools(
        immer((set) => ({
            notifications: [],
            addNotification: (notification) =>
                set((state) => {
                    const id = Math.random().toString(36).substr(2, 9);
                    state.notifications.push({
                        ...notification,
                        id,
                        duration: notification.duration || 5000,
                    });
                }),
            removeNotification: (id) =>
                set((state) => {
                    state.notifications = state.notifications.filter((n: Notification) => n.id !== id);
                }),
            clearAll: () =>
                set((state) => {
                    state.notifications = [];
                }),
        })),
        { name: 'notification-store' }
    )
);

// Loading Store
interface LoadingStore {
    loadingStates: Record<string, boolean>;
    setLoading: (key: string, loading: boolean) => void;
    isLoading: (key: string) => boolean;
    clearLoading: (key: string) => void;
}

export const useLoadingStore = create<LoadingStore>()(
    devtools(
        immer((set, get) => ({
            loadingStates: {},
            setLoading: (key, loading) =>
                set((state) => {
                    state.loadingStates[key] = loading;
                }),
            isLoading: (key) => {
                const { loadingStates } = get();
                return loadingStates[key] || false;
            },
            clearLoading: (key) =>
                set((state) => {
                    delete state.loadingStates[key];
                }),
        })),
        { name: 'loading-store' }
    )
);

// Global App Store
interface AppStore {
    isInitialized: boolean;
    config: any;
    setInitialized: (initialized: boolean) => void;
    setConfig: (config: any) => void;
}

export const useAppStore = create<AppStore>()(
    devtools(
        immer((set) => ({
            isInitialized: false,
            config: null,
            setInitialized: (initialized) =>
                set((state) => {
                    state.isInitialized = initialized;
                }),
            setConfig: (config) =>
                set((state) => {
                    state.config = config;
                }),
        })),
        { name: 'app-store' }
    )
);
