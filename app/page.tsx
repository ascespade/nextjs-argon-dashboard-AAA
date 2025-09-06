import React from 'react';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            NextJS Enterprise Dashboard
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            A modern, responsive, and feature-rich dashboard built with Next.js and Tailwind + Preline
          </p>
          <div className='space-x-4'>
            <a 
              href='/admin/dashboard' 
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200'
            >
              View Dashboard
            </a>
            <a 
              href='/editor' 
              className='bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200'
            >
              Open Editor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
