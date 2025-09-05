'use client';

import React from 'react';

// Enhanced Hero Component
export function EnhancedHero({
    title,
    subtitle,
    buttonText,
    buttonLink,
    backgroundImage,
    overlay = true,
    textAlign = 'center',
    height = 'h-96'
}: {
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
    overlay?: boolean;
    textAlign?: 'left' | 'center' | 'right';
    height?: string;
}) {
    const textAlignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }[textAlign];

    return (
        <div className={`relative ${height} flex items-center justify-center overflow-hidden`}>
            {backgroundImage && (
                <div className="absolute inset-0">
                    <img
                        src={backgroundImage}
                        alt="Hero background"
                        className="w-full h-full object-cover"
                    />
                    {overlay && (
                        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    )}
                </div>
            )}

            <div className={`relative z-10 max-w-4xl mx-auto px-4 ${textAlignClass}`}>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl md:text-2xl text-white mb-8 opacity-90">
                        {subtitle}
                    </p>
                )}
                {buttonText && (
                    <a
                        href={buttonLink || '#'}
                        className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                        {buttonText}
                    </a>
                )}
            </div>
        </div>
    );
}

// Enhanced Features Component
export function EnhancedFeatures({
    title,
    subtitle,
    features
}: {
    title: string;
    subtitle?: string;
    features: Array<{
        icon: string;
        title: string;
        description: string;
        color?: string;
    }>;
}) {
    return (
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${feature.color || 'bg-blue-500'
                                }`}>
                                <span className="text-2xl text-white">
                                    {feature.icon}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Enhanced Testimonials Component
export function EnhancedTestimonials({
    title,
    testimonials
}: {
    title: string;
    testimonials: Array<{
        name: string;
        role: string;
        company: string;
        content: string;
        avatar?: string;
        rating?: number;
    }>;
}) {
    return (
        <div className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                            {testimonial.rating && (
                                <div className="flex mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            )}

                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                "{testimonial.content}"
                            </p>

                            <div className="flex items-center">
                                {testimonial.avatar && (
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                )}
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {testimonial.role} at {testimonial.company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Enhanced Pricing Component
export function EnhancedPricing({
    title,
    subtitle,
    plans
}: {
    title: string;
    subtitle?: string;
    plans: Array<{
        name: string;
        price: string;
        period: string;
        description: string;
        features: string[];
        buttonText: string;
        buttonLink: string;
        popular?: boolean;
        color?: string;
    }>;
}) {
    return (
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 ${plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    {plan.description}
                                </p>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {plan.price}
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-300">
                                        /{plan.period}
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center">
                                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={plan.buttonLink}
                                className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors ${plan.popular
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {plan.buttonText}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Enhanced Contact Form Component
export function EnhancedContactForm({
    title,
    subtitle,
    fields = ['name', 'email', 'message'],
    submitText = 'Send Message'
}: {
    title: string;
    subtitle?: string;
    fields?: string[];
    submitText?: string;
}) {
    return (
        <div className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            {subtitle}
                        </p>
                    )}
                </div>

                <form className="max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {fields.includes('name') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}

                        {fields.includes('email') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </div>

                    {fields.includes('message') && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Message
                            </label>
                            <textarea
                                rows={6}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            ></textarea>
                        </div>
                    )}

                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
