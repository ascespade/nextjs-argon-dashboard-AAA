import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '@/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = Math.random().toString(36).substr(2, 9);

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                data: config.data,
                params: config.params,
            });
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data,
            });
        }

        return response;
    },
    (error: AxiosError) => {
        const apiError: ApiError = {
            message: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
            timestamp: new Date().toISOString(),
        };

        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            apiError.message = (data as any)?.message || `HTTP ${status} Error`;
            apiError.code = (data as any)?.code || `HTTP_${status}`;
            apiError.details = data;

            // Handle specific error codes
            switch (status) {
                case 401:
                    // Unauthorized - redirect to login
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth_token');
                        window.location.href = '/auth/login';
                    }
                    break;
                case 403:
                    apiError.message = 'You do not have permission to perform this action';
                    break;
                case 404:
                    apiError.message = 'The requested resource was not found';
                    break;
                case 429:
                    apiError.message = 'Too many requests. Please try again later';
                    break;
                case 500:
                    apiError.message = 'Internal server error. Please try again later';
                    break;
            }
        } else if (error.request) {
            // Network error
            apiError.message = 'Network error. Please check your connection';
            apiError.code = 'NETWORK_ERROR';
        } else {
            // Request setup error
            apiError.message = error.message || 'Request setup error';
            apiError.code = 'REQUEST_ERROR';
        }

        console.error('❌ API Error:', apiError);

        return Promise.reject(apiError);
    }
);

// Generic API methods
export class ApiService {
    static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await apiClient.get(url, config);
        return response.data;
    }

    static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await apiClient.post(url, data, config);
        return response.data;
    }

    static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await apiClient.put(url, data, config);
        return response.data;
    }

    static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await apiClient.patch(url, data, config);
        return response.data;
    }

    static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await apiClient.delete(url, config);
        return response.data;
    }

    // File upload method
    static async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
        const formData = new FormData();
        formData.append('file', file);

        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            },
        };

        const response = await apiClient.post(url, formData, config);
        return response.data;
    }

    // Download method
    static async download(url: string, filename?: string): Promise<void> {
        const response = await apiClient.get(url, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
    }
}

// Specific API services
export class AuthService {
    static async login(email: string, password: string) {
        return ApiService.post('/auth/login', { email, password });
    }

    static async logout() {
        return ApiService.post('/auth/logout');
    }

    static async refreshToken() {
        return ApiService.post('/auth/refresh');
    }

    static async forgotPassword(email: string) {
        return ApiService.post('/auth/forgot-password', { email });
    }

    static async resetPassword(token: string, password: string) {
        return ApiService.post('/auth/reset-password', { token, password });
    }

    static async changePassword(currentPassword: string, newPassword: string) {
        return ApiService.post('/auth/change-password', { currentPassword, newPassword });
    }
}

export class UserService {
    static async getProfile() {
        return ApiService.get('/users/profile');
    }

    static async updateProfile(data: any) {
        return ApiService.put('/users/profile', data);
    }

    static async getUsers(params?: any) {
        return ApiService.get('/users', { params });
    }

    static async getUser(id: string) {
        return ApiService.get(`/users/${id}`);
    }

    static async createUser(data: any) {
        return ApiService.post('/users', data);
    }

    static async updateUser(id: string, data: any) {
        return ApiService.put(`/users/${id}`, data);
    }

    static async deleteUser(id: string) {
        return ApiService.delete(`/users/${id}`);
    }
}

export class DashboardService {
    static async getStats() {
        return ApiService.get('/dashboard/stats');
    }

    static async getChartData(period: string) {
        return ApiService.get(`/dashboard/charts?period=${period}`);
    }

    static async getRecentActivity() {
        return ApiService.get('/dashboard/activity');
    }
}

export default apiClient;
