import React from 'react';
import Header from './components/Header';
import HomeEditorClient from './components/HomeEditorClient';
import { readPage } from '@/lib/supabase';

export default async function HomePage() {
  // Load page data from Supabase
  let pageData = null;
  try {
    pageData = await readPage('home');
  } catch (error) {
    console.error('Error loading page data:', error);
  }

  const components = pageData?.components_json || [];

  return (
    <div className='min-h-screen'>
      <Header />
      <HomeEditorClient initialComponents={components} />
    </div>
  );
}
