import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">NextJS Enterprise Dashboard</h1>
          <p className="mb-6">A modern, responsive, and feature-rich dashboard built with Next.js, React 18, and the latest web technologies.</p>
          <div className="flex justify-center gap-3">
            <Link href="/admin/dashboard" className="bg-white text-indigo-600 px-6 py-3 rounded font-semibold">View Dashboard</Link>
            <Link href="/auth/login" className="border border-white text-white px-6 py-3 rounded">Get Started</Link>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Dashboard?</h2>
          <p className="text-gray-600">Built with modern technologies and best practices for enterprise applications.</p>
        </div>
      </section>
    </div>
  );
}
