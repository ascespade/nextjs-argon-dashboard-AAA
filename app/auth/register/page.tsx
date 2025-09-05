'use client';

import React from 'react';
import Image from 'next/image';

export default function RegisterPage() {
  return (
    <section className='auth-register'>
      <div className='flex flex-col items-center gap-6'>
        <div className='w-full'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <button
              onClick={e => e.preventDefault()}
              className='inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200'
            >
              <Image
                src='/assets/img/icons/common/github.svg'
                alt='github'
                width={20}
                height={20}
              />
              <span className='font-medium'>Github</span>
            </button>
            <button
              onClick={e => e.preventDefault()}
              className='inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200'
            >
              <Image
                src='/assets/img/icons/common/google.svg'
                alt='google'
                width={20}
                height={20}
              />
              <span className='font-medium'>Google</span>
            </button>
          </div>

          <div className='text-center text-sm text-gray-500 mb-4'>
            Or sign up with credentials
          </div>

          <form className='space-y-4'>
            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Name
              </label>
              <input
                type='text'
                placeholder='Your name'
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400'
              />
            </div>

            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Email
              </label>
              <input
                type='email'
                autoComplete='email'
                placeholder='you@company.com'
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400'
              />
            </div>

            <div>
              <label className='block text-xs font-medium text-gray-600 mb-1'>
                Password
              </label>
              <input
                type='password'
                autoComplete='new-password'
                placeholder='Password'
                className='w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400'
              />
            </div>

            <div className='text-sm text-gray-500'>
              password strength:{' '}
              <span className='text-green-600 font-semibold'>strong</span>
            </div>

            <div className='flex items-center'>
              <label className='inline-flex items-center gap-2 text-sm text-gray-600'>
                <input
                  type='checkbox'
                  className='form-checkbox h-4 w-4 text-indigo-600'
                />
                <span>
                  I agree with the{' '}
                  <a
                    href='#'
                    onClick={e => e.preventDefault()}
                    className='text-indigo-600'
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            <div>
              <button
                type='button'
                className='w-full py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700'
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
