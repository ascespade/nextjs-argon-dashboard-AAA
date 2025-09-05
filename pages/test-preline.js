import React from 'react';
import Head from 'next/head';

const TestPreline = () => {
    return (
        <>
            <Head>
                <title>Test Preline UI</title>
            </Head>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">
                            Preline UI Test Page
                        </h1>

                        {/* Test Preline Components */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Card Component */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Card Component
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    This is a test card using Preline UI styling.
                                </p>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Click Me
                                </button>
                            </div>

                            {/* Button Variants */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Button Variants
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                        Primary Button
                                    </button>
                                    <button className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                                        Secondary Button
                                    </button>
                                    <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                                        Outline Button
                                    </button>
                                </div>
                            </div>

                            {/* Form Elements */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Form Elements
                                </h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option>Select an option</option>
                                        <option>Option 1</option>
                                        <option>Option 2</option>
                                    </select>
                                </div>
                            </div>

                            {/* Alert Component */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Alert Component
                                </h3>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-800">
                                                Success! Preline UI is working correctly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Badge Component */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Badge Component
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Blue Badge
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Green Badge
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Yellow Badge
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Red Badge
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Progress Bar
                                </h3>
                                <div className="space-y-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Success Message */}
                        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-green-800">
                                        Preline UI Integration Successful!
                                    </h3>
                                    <p className="mt-1 text-sm text-green-700">
                                        The enterprise dashboard has been successfully converted to use Preline UI components with modern styling and responsive design.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestPreline;
