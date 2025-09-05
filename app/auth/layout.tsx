import React from 'react';

export const metadata = {
  title: 'Auth - NextJS Enterprise Dashboard',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <header className="py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold">Welcome!</h1>
          <p className="mt-2 text-lg text-indigo-100">Use these forms to login or create a new account for your project.</p>
        </div>
      </header>

      <div className="relative -mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          className="w-full h-20 block"
        >
          <polygon className="text-white fill-current" points="2560 0 2560 100 0 100" />
        </svg>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 -mt-12 text-gray-800">
          <div className="flex justify-center">
            <div className="w-full md:w-3/4">
              {children}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-white/80">
        © {new Date().getFullYear()} NextJS Enterprise Dashboard
      </footer>
    </div>
  );
}
