import React from 'react';
// import { DashboardStats } from '@/types';

// interface HeaderPrelineProps {
//   title?: string;
//   subtitle?: string;
//   stats?: DashboardStats[];
//   actions?: React.ReactNode;
// }

interface HeaderPrelineProps {
    title?: string;
    subtitle?: string;
    stats?: Array<{
        id: string;
        title: string;
        value: string;
        change: number;
        changeType: 'increase' | 'decrease';
        icon: string;
        color: string;
    }>;
    actions?: React.ReactNode;
}

const HeaderPreline: React.FC<HeaderPrelineProps> = ({
    title = 'Dashboard',
    subtitle,
    stats = [],
    actions,
}) => {
    const defaultStats = [
        {
            id: 'traffic',
            title: 'Traffic',
            value: '350,897',
            change: 3.48,
            changeType: 'increase',
            icon: 'fas fa-chart-bar',
            color: 'bg-red-500',
        },
        {
            id: 'users',
            title: 'New Users',
            value: '2,356',
            change: 3.48,
            changeType: 'decrease',
            icon: 'fas fa-chart-pie',
            color: 'bg-yellow-500',
        },
        {
            id: 'sales',
            title: 'Sales',
            value: '924',
            change: 1.10,
            changeType: 'decrease',
            icon: 'fas fa-users',
            color: 'bg-green-500',
        },
        {
            id: 'performance',
            title: 'Performance',
            value: '49.65%',
            change: 12,
            changeType: 'increase',
            icon: 'fas fa-percent',
            color: 'bg-blue-500',
        },
    ];

    const displayStats = stats.length > 0 ? stats : defaultStats;

    return (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 pb-8 pt-5 pt-md-8">
            <div className="container mx-auto px-4">
                <div className="header-body">
                    {/* Header Content */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="mt-1 text-sm text-gray-300 sm:text-base">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                            {actions && (
                                <div className="mt-4 sm:mt-0">
                                    {actions}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {displayStats.map((stat) => (
                            <div
                                key={stat.id}
                                className="rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                                            <i className={`${stat.icon} text-lg text-white`} />
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center">
                                        {stat.changeType === 'increase' ? (
                                            <svg
                                                className="h-4 w-4 text-green-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-4 w-4 text-red-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                        <span
                                            className={`ml-1 text-sm font-medium ${stat.changeType === 'increase'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                                }`}
                                        >
                                            {stat.change}%
                                        </span>
                                        <span className="ml-1 text-sm text-gray-500">
                                            Since last month
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderPreline;
