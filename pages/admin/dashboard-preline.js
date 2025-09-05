import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/utils/errorHandler';
import AdminPreline from '@/layouts/AdminPreline';
import HeaderPreline from '@/components/Headers/HeaderPreline';
import { DashboardStats } from '@/types';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
            retry: 3,
            refetchOnWindowFocus: false,
        },
    },
});

const DashboardPreline: React.FC = () => {
    const stats: DashboardStats[] = [
        {
            id: 'revenue',
            title: 'Total Revenue',
            value: '$54,239',
            change: 12.5,
            changeType: 'increase',
            icon: 'fas fa-dollar-sign',
            color: 'bg-green-500',
        },
        {
            id: 'orders',
            title: 'New Orders',
            value: '1,423',
            change: 8.2,
            changeType: 'increase',
            icon: 'fas fa-shopping-cart',
            color: 'bg-blue-500',
        },
        {
            id: 'customers',
            title: 'Active Customers',
            value: '8,429',
            change: 2.1,
            changeType: 'increase',
            icon: 'fas fa-users',
            color: 'bg-purple-500',
        },
        {
            id: 'conversion',
            title: 'Conversion Rate',
            value: '3.24%',
            change: 0.5,
            changeType: 'decrease',
            icon: 'fas fa-chart-line',
            color: 'bg-orange-500',
        },
    ];

    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <div className="space-y-6">
                    {/* Header with Stats */}
                    <HeaderPreline
                        title="Dashboard Overview"
                        subtitle="Welcome back! Here's what's happening with your business today."
                        stats={stats}
                        actions={
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:ring-offset-neutral-800"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Export
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 5v14m7-7H5" />
                                    </svg>
                                    Add New
                                </button>
                            </div>
                        }
                    />

                    {/* Main Content */}
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Recent Activity */}
                            <div className="lg:col-span-2">
                                <div className="rounded-lg bg-white p-6 shadow-lg">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Recent Activity
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            View All
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            {
                                                id: 1,
                                                user: 'John Doe',
                                                action: 'placed a new order',
                                                time: '2 minutes ago',
                                                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                                            },
                                            {
                                                id: 2,
                                                user: 'Jane Smith',
                                                action: 'completed payment',
                                                time: '5 minutes ago',
                                                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                                            },
                                            {
                                                id: 3,
                                                user: 'Mike Johnson',
                                                action: 'updated profile',
                                                time: '10 minutes ago',
                                                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                                            },
                                        ].map((activity) => (
                                            <div key={activity.id} className="flex items-center space-x-3">
                                                <img
                                                    className="h-8 w-8 rounded-full"
                                                    src={activity.avatar}
                                                    alt={activity.user}
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">{activity.user}</span>{' '}
                                                        {activity.action}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <div className="rounded-lg bg-white p-6 shadow-lg">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                        Quick Actions
                                    </h3>

                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            className="flex w-full items-center space-x-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                                <svg
                                                    className="h-5 w-5 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Create New Order
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Add a new customer order
                                                </p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            className="flex w-full items-center space-x-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                                                <svg
                                                    className="h-5 w-5 text-green-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Add Customer
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Register a new customer
                                                </p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            className="flex w-full items-center space-x-3 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                                <svg
                                                    className="h-5 w-5 text-purple-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    View Reports
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Access detailed analytics
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </QueryClientProvider>
        </ErrorBoundary>
    );
};

DashboardPreline.layout = AdminPreline;

export default DashboardPreline;
