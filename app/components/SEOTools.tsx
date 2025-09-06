'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { SEOData, SEOTools as SEOService, SEOAnalysis } from '@/lib/seo-tools';

interface SEOToolsProps {
  seoData: SEOData;
  content: string;
  onUpdateSEO: (seoData: SEOData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SEOTools({
  seoData,
  content,
  onUpdateSEO,
  isOpen,
  onClose,
}: SEOToolsProps) {
  const { t } = useI18n();
  const [currentSEO, setCurrentSEO] = useState<SEOData>(seoData);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const seoAnalysis = SEOService.analyzeSEO(currentSEO, content);
      setAnalysis(seoAnalysis);
    }
  }, [currentSEO, content, isOpen]);

  const handleSave = () => {
    onUpdateSEO(currentSEO);
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div
          className='fixed inset-0 bg-black bg-opacity-50'
          onClick={onClose}
        ></div>

        <div className='relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                {t('editor.seo_tools', 'SEO Tools')}
              </h2>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* SEO Form */}
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t('seo.page_title', 'Page Title')}
                  </label>
                  <input
                    type='text'
                    value={currentSEO.title}
                    onChange={e =>
                      setCurrentSEO({ ...currentSEO, title: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter page title...'
                  />
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    {currentSEO.title.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t('seo.meta_description', 'Meta Description')}
                  </label>
                  <textarea
                    value={currentSEO.description}
                    onChange={e =>
                      setCurrentSEO({
                        ...currentSEO,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter meta description...'
                  />
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    {currentSEO.description.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t('seo.keywords', 'Keywords')}
                  </label>
                  <input
                    type='text'
                    value={currentSEO.keywords?.join(', ') || ''}
                    onChange={e =>
                      setCurrentSEO({
                        ...currentSEO,
                        keywords: e.target.value
                          .split(',')
                          .map(k => k.trim())
                          .filter(k => k),
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter keywords separated by commas...'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t('seo.og_title', 'Open Graph Title')}
                  </label>
                  <input
                    type='text'
                    value={currentSEO.ogTitle || ''}
                    onChange={e =>
                      setCurrentSEO({ ...currentSEO, ogTitle: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter OG title...'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t('seo.og_description', 'Open Graph Description')}
                  </label>
                  <textarea
                    value={currentSEO.ogDescription || ''}
                    onChange={e =>
                      setCurrentSEO({
                        ...currentSEO,
                        ogDescription: e.target.value,
                      })
                    }
                    rows={2}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter OG description...'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t('seo.og_image', 'Open Graph Image URL')}
                  </label>
                  <input
                    type='url'
                    value={currentSEO.ogImage || ''}
                    onChange={e =>
                      setCurrentSEO({ ...currentSEO, ogImage: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Enter OG image URL...'
                  />
                </div>
              </div>

              {/* SEO Analysis */}
              <div className='space-y-6'>
                {analysis && (
                  <>
                    {/* SEO Score */}
                    <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                          {t('seo.seo_score', 'SEO Score')}
                        </h3>
                        <div
                          className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}
                        >
                          {analysis.score}/100
                        </div>
                      </div>
                      <div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full ${getScoreBgColor(analysis.score)}`}
                          style={{ width: `${analysis.score}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Issues */}
                    {analysis.issues.length > 0 && (
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                          {t('seo.issues', 'Issues')}
                        </h3>
                        <div className='space-y-2'>
                          {analysis.issues.map((issue, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border-l-4 ${
                                issue.type === 'error'
                                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                                  : issue.type === 'warning'
                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                              }`}
                            >
                              <p className='text-sm text-gray-700 dark:text-gray-300'>
                                {issue.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-3'>
                          {t('seo.suggestions', 'Suggestions')}
                        </h3>
                        <div className='space-y-2'>
                          {analysis.suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border-l-4 ${
                                suggestion.priority === 'high'
                                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'
                                  : suggestion.priority === 'medium'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-500'
                              }`}
                            >
                              <p className='text-sm text-gray-700 dark:text-gray-300'>
                                {suggestion.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleSave}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                {t('common.save', 'Save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
