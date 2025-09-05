"use client";
import React from 'react';
import Link from 'next/link';
import { useSidebar } from './SidebarContext';

const Sidebar: React.FC = () => {
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white border-r shadow-sm z-40 flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}
      aria-expanded={!collapsed}
    >
      <div className="flex items-center justify-between px-3 h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className={`text-xl font-bold ${collapsed ? 'hidden' : 'block'}`}>NextJS</span>
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">N</span>
        </Link>
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={toggle}
          className="p-1 rounded hover:bg-gray-100"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-600"><path fill="currentColor" d="M4 11h16v2H4z"/></svg>
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 overflow-auto">
        <ul className="space-y-1">
          <li>
            <Link href="/admin/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${collapsed ? 'justify-center' : ''}`}>
              <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zm10 8h8v-6h-8v6zM13 3v6h8V3h-8zM3 21h8v-6H3v6z" fill="currentColor"/></svg>
              <span className={`${collapsed ? 'hidden' : 'block'}`}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/profile" className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 ${collapsed ? 'justify-center' : ''}`}>
              <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 21v-1c0-2.761 4.477-5 8-5s8 2.239 8 5v1H4z" fill="currentColor"/></svg>
              <span className={`${collapsed ? 'hidden' : 'block'}`}>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-3">
        <button className="w-full text-sm text-left text-gray-600 hover:text-gray-900">Settings</button>
      </div>
    </aside>
  );
};

export default Sidebar;
