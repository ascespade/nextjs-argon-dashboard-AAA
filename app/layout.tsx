export const metadata = {
  title: 'NextJS Enterprise Dashboard',
  description:
    'A modern, responsive, and feature-rich dashboard built with Next.js and Tailwind + Preline',
};

import React from 'react';
import './globals.css';
// Original Argon CSS (imported so Next can bundle it)
import '../assets/css/nextjs-argon-dashboard.min.css';
import '../assets/css/custom-home.css';
import { SidebarProvider } from './components/SidebarContext';
import { ThemeProvider } from '@/lib/theme';
import { I18nProvider } from '@/lib/i18n';

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
        {/* Original Argon Dashboard fonts and fontawesome (served via CDN) */}
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
        />
        {/* Next: consider migrating to next/font. Temporarily allow custom font import. */}
        {/* Bootstrap JS bundle and Preline script (CDN) */}
        <script
          src='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
          defer
        ></script>
        <script
          src='https://cdn.jsdelivr.net/npm/preline@2.0.3/dist/preline.min.js'
          defer
        ></script>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className='bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100'>
        <div id='page-transition'></div>
        <ThemeProvider>
          <I18nProvider>
            <SidebarProvider>
              <div className='min-h-screen relative'>{children}</div>
            </SidebarProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
