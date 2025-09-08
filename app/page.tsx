import React from 'react';

import { readPage, ensureDemoPage } from '@/lib/supabase';
import HomeEditorWrapper from './components/HomeEditorWrapper';

export default async function HomePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await ensureDemoPage();
  const page = await readPage('home');
  const params = await props.searchParams;
  const isEdit = params?.edit === '1';

  if (isEdit) {
    return (
      <HomeEditorWrapper initialComponents={page?.components_json || []} />
    );
  }

  const components = page?.components_json || [];

  const asText = (v: any): string => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    if (typeof v === 'object') {
      if ('en' in v && typeof (v as any).en !== 'object')
        return String((v as any).en ?? '');
      if ('ar' in v && typeof (v as any).ar !== 'object')
        return String((v as any).ar ?? '');
    }
    return '';
  };

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
                {asText(props.title) || 'Welcome'}
              </h1>
              <p className='mb-6'>{asText(props.subtitle)}</p>
              <div className='flex justify-center gap-3'>
                <a
                  href={props.ctaHref || '/admin/dashboard'}
                  className='bg-white text-indigo-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors'
                >
                  {asText(props.ctaText) || 'Get Started'}
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
                {asText(props.title) || 'Welcome'}
              </h1>
              <p className='mb-6'>{asText(props.subtitle)}</p>
              <div className='flex justify-center gap-3'>
                <a
                  href={props.ctaHref || '/admin/dashboard'}
                  className='bg-white text-indigo-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors'
                >
                  {asText(props.ctaText) || 'Get Started'}
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
                {asText(props.title) || 'Features'}
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
                      {asText(item.title) || 'Feature'}
                    </h3>
                    <p className='text-gray-600'>{asText(item.description)}</p>
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
                      {asText(item.label) || 'Stat'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'cta_1':
        return (
          <section key={index} className='py-16 bg-indigo-600 text-white'>
            <div className='max-w-4xl mx-auto px-4 text-center'>
              <h2 className='text-3xl font-bold mb-4'>
                {asText(props.title) || 'Call to Action'}
              </h2>
              <p className='text-xl mb-8 text-indigo-100'>
                {asText(props.description) || 'Take action now!'}
              </p>
              <a
                href={props.ctaHref || '/contact'}
                className='bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block'
              >
                {asText(props.ctaText) || 'Get Started'}
              </a>
            </div>
          </section>
        );
      case 'cards_1':
        return (
          <section key={index} className='py-16'>
            <div className='max-w-6xl mx-auto px-4'>
              <h2 className='text-2xl font-bold mb-8 text-center'>
                {asText(props.title) || 'Cards Section'}
              </h2>
              <div className='grid md:grid-cols-3 gap-8'>
                {(props.items || []).map((item: any, i: number) => (
                  <div key={i} className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
                    <h3 className='text-xl font-semibold mb-3'>
                      {asText(item.title) || 'Card Title'}
                    </h3>
                    <p className='text-gray-600 mb-4'>
                      {asText(item.description) || 'Card description'}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        className='text-indigo-600 hover:text-indigo-800 font-medium'
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'testimonials_1':
        return (
          <section key={index} className='py-16 bg-gray-50'>
            <div className='max-w-6xl mx-auto px-4'>
              <h2 className='text-2xl font-bold mb-8 text-center'>
                {asText(props.title) || 'What Our Clients Say'}
              </h2>
              <div className='grid md:grid-cols-2 gap-8'>
                {(props.items || []).map((item: any, i: number) => (
                  <div key={i} className='bg-white p-6 rounded-lg shadow-lg'>
                    <p className='text-gray-600 mb-4 italic'>
                      "{asText(item.content) || 'Great service!'}"
                    </p>
                    <div className='flex items-center'>
                      <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4'>
                        <span className='text-indigo-600 font-semibold'>
                          {asText(item.name)?.charAt(0) || 'A'}
                        </span>
                      </div>
                      <div>
                        <div className='font-semibold'>
                          {asText(item.name) || 'Client Name'}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {asText(item.role) || 'Client Role'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'footers_1':
        return (
          <footer key={index} className='bg-gray-900 text-white py-12'>
            <div className='max-w-6xl mx-auto px-4'>
              <div className='grid md:grid-cols-4 gap-8'>
                <div>
                  <h3 className='text-lg font-semibold mb-4'>
                    {asText(props.title) || 'Company'}
                  </h3>
                  <p className='text-gray-400 mb-4'>
                    {asText(props.description) || 'Company description'}
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold mb-4'>Quick Links</h4>
                  <ul className='space-y-2 text-gray-400'>
                    <li><a href='/about' className='hover:text-white'>About</a></li>
                    <li><a href='/services' className='hover:text-white'>Services</a></li>
                    <li><a href='/contact' className='hover:text-white'>Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold mb-4'>Services</h4>
                  <ul className='space-y-2 text-gray-400'>
                    <li><a href='/web-design' className='hover:text-white'>Web Design</a></li>
                    <li><a href='/development' className='hover:text-white'>Development</a></li>
                    <li><a href='/marketing' className='hover:text-white'>Marketing</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className='font-semibold mb-4'>Contact</h4>
                  <div className='text-gray-400 space-y-2'>
                    <p>Email: info@company.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Address: 123 Main St, City</p>
                  </div>
                </div>
              </div>
              <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
                <p>&copy; 2024 Company Name. All rights reserved.</p>
              </div>
            </div>
          </footer>
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
