'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HomeEditorClient = dynamic(() => import('./HomeEditorClient'), {
  ssr: false,
});

export default function HomeEditorWrapper({
  initialComponents,
}: {
  initialComponents?: any[];
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const edit = params.get('edit');
      if (edit === '1') setActive(true);
    } catch (e) {
      // ignore
    }
  }, []);

  if (!active) {
    // Show default page content when not in edit mode
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NextJS Enterprise Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern, responsive, and feature-rich dashboard built with Next.js and Tailwind + Preline
          </p>
          <a 
            href="/admin/dashboard" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            View Dashboard
          </a>
        </div>
      </div>
    );
  }
  return <HomeEditorClient initialComponents={initialComponents} />;
}
