import React from 'react';

import { readPage, ensureDemoPage } from '@/lib/supabase';
import HomeEditorWrapper from './components/HomeEditorWrapper';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  await ensureDemoPage();
  const page = await readPage('home');
  const isEdit = searchParams?.edit === '1';

  if (isEdit) {
    return (
      <HomeEditorWrapper initialComponents={page?.components_json || []} />
    );
  }

  const components = page?.components_json || [];

  const renderComponent = (component: any, index: number) => {
    const { type, props = {} } = component;
    switch (type) {
      case 'hero_banner':
        return (
          <section
            key={index}
            className='relative py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
          >
            <div className='max-w-5xl mx-auto px-4 text-center'>
              <h1 className='text-4xl font-bold mb-4'>
                {props.title?.en || props.title || 'Welcome'}
              </h1>
              <p className='mb-6'>
                {props.subtitle?.en || props.subtitle || ''}
              </p>
              <div className='flex justify-center gap-3'>
                <a
                  href={props.ctaHref || '/admin/dashboard'}
                  className='bg-white text-indigo-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors'
                >
                  {props.ctaText?.en || props.ctaText || 'Get Started'}
                </a>
              </div>
            </div>
          </section>
        );
      case 'hero_gradient':
        return (
          <section
            key={index}
            className='relative py-20 text-white'
            style={{
              backgroundImage: `linear-gradient(90deg, ${props.gradientFrom || '#6366F1'}, ${props.gradientTo || '#8B5CF6'})`,
            }}
          >
            <div className='max-w-5xl mx-auto px-4 text-center'>
              <h1 className='text-4xl font-bold mb-4'>
                {props.title?.en || props.title || 'Welcome'}
              </h1>
              <p className='mb-6'>
                {props.subtitle?.en || props.subtitle || ''}
              </p>
              <div className='flex justify-center gap-3'>
                <a
                  href={props.ctaHref || '/admin/dashboard'}
                  className='bg-white text-indigo-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors'
                >
                  {props.ctaText?.en || props.ctaText || 'Get Started'}
                </a>
              </div>
            </div>
          </section>
        );
      case 'features_1':
        return (
          <section key={index} className='py-16'>
            <div className='max-w-6xl mx-auto px-4'>
              <h2 className='text-2xl font-bold mb-4'>
                {props.title?.en || props.title || 'Features'}
              </h2>
              <div className='grid md:grid-cols-3 gap-8'>
                {(props.items || []).map((item: any, i: number) => (
                  <div key={i} className='text-center'>
                    <div className='w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <i
                        className={`${item.icon || 'fas fa-star'} text-indigo-600 text-2xl`}
                      />
                    </div>
                    <h3 className='text-xl font-semibold mb-2'>
                      {item.title?.en || item.title || 'Feature'}
                    </h3>
                    <p className='text-gray-600'>
                      {item.description?.en || item.description || ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'stats_1':
        return (
          <section key={index} className='py-16 bg-gray-50'>
            <div className='max-w-6xl mx-auto px-4'>
              <div className='grid md:grid-cols-4 gap-8 text-center'>
                {(props.items || []).map((item: any, i: number) => (
                  <div key={i}>
                    <div className='text-3xl font-bold text-indigo-600 mb-2'>
                      {item.value || '0'}
                    </div>
                    <div className='text-gray-600'>
                      {item.label?.en || item.label || 'Stat'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {components.length > 0 ? (
        components.map((c: any, i: number) => renderComponent(c, i))
      ) : (
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              NextJS Enterprise Dashboard
            </h1>
            <p className='text-xl text-gray-600 mb-8'>
              A modern, responsive, and feature-rich dashboard built with
              Next.js and Tailwind + Preline
            </p>
            <a
              href='/admin/dashboard'
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200'
            >
              View Dashboard
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
