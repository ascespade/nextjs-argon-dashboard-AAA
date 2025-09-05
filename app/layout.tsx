export const metadata = {
  title: 'NextJS Enterprise Dashboard',
  description:
    'A modern, responsive, and feature-rich dashboard built with Next.js and Tailwind + Preline',
};

import React from 'react';
import './globals.css';
import { SidebarProvider } from './components/SidebarContext';
import PerformanceMonitor from './components/PerformanceMonitorApp';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        {/* Tailwind Play CDN for quick migration (development). For production, install Tailwind properly. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){if(typeof window!=='undefined'){var s=document.createElement('script');s.src='https://cdn.tailwindcss.com';s.async=true;document.head.appendChild(s)}}()`,
          }}
        />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.css'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className='bg-gray-50 text-gray-900'>
        <div id='page-transition'></div>
        <SidebarProvider>
          <div className='min-h-screen relative'>
            {children}
            {/* Only show perf monitor in development */}
            {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
