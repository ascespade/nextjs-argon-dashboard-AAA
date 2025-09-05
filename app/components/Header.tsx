'use client';
import React from 'react';
import { useSidebar } from './SidebarContext';
import Link from 'next/link';

const Header: React.FC = () => {
  const { collapsed } = useSidebar();
  return (
    <header className='sticky top-0 z-30 bg-white border-b'>
      <div
        className={`flex items-center h-14 px-4 transition-all duration-200 ${collapsed ? 'md:pl-20' : 'md:pl-72'}`}
      >
        <div className='flex-1'>
          <nav className='flex items-center gap-4'>
            <Link
              href='/admin/dashboard'
              className='text-sm font-medium text-gray-700'
            >
              Dashboard
            </Link>
            <Link
              href='/admin/profile'
              className='text-sm font-medium text-gray-700'
            >
              Profile
            </Link>
          </nav>
        </div>
        <div className='flex items-center gap-3'>
          <button className='p-2 rounded-full hover:bg-gray-100'>
            <svg className='w-5 h-5 text-gray-600' viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M12 2a10 10 0 100 20 10 10 0 000-20z'
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
