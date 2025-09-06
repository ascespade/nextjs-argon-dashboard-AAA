'use client';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simplified version without SidebarProvider
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='flex'>
      <Sidebar />
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-200 ${collapsed ? 'pl-16' : 'pl-64'}`}
      >
        <Header />
        <main className='flex-1 p-6 bg-gray-50'>{children}</main>
      </div>
    </div>
  );
}
