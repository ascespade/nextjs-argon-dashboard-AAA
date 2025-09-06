'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Save,
  Upload,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Component {
  id: string;
  type: string;
  name: string;
  category: string;
  description: string;
  preview_meta: any;
  props_template: any;
}

export default function EditorPage() {
  // Simplified version without hooks
  const theme = 'light';
  const isRTL = false;

  const t = (key: string) => {
    const translations: Record<string, string> = {
      'editor.save': 'Save',
      'editor.publish': 'Publish',
      'editor.components': 'Components',
      'editor.search_components': 'Search components',
    };
    return translations[key] || key;
  };
  const [components, setComponents] = useState<Component[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [devicePreview, setDevicePreview] = useState('desktop');
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load components on mount
  useEffect(() => {
    loadComponents();
  }, []);

  // Responsive: initialize and listen for screen size to adapt sidebars
  useEffect(() => {
    const onResize = () => {
      const small = window.innerWidth < 1024; // lg breakpoint
      setIsSmallScreen(small);
      if (small) {
        setLeftSidebarOpen(false);
        setRightSidebarOpen(false);
      } else {
        setLeftSidebarOpen(true);
        setRightSidebarOpen(true);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const loadComponents = async () => {
    try {
      const response = await fetch('/api/components');
      const data = await response.json();
      if (data.success) {
        setComponents(data.data);
      }
    } catch (error) {
      console.error('Error loading components:', error);
    }
  };

  const filteredComponents = components.filter(comp => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    'all',
    ...Array.from(new Set(components.map(c => c.category))),
  ];

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleDevicePreview = (device: string) => {
    setDevicePreview(device);
  };

  const getDeviceWidth = () => {
    switch (devicePreview) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  const handleSave = async () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'SAVE_REQUEST',
        },
        '*'
      );
    }
  };

  const handlePublish = async () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'PUBLISH_REQUEST',
        },
        '*'
      );
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          {
            type: 'UNDO',
          },
          '*'
        );
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          {
            type: 'REDO',
          },
          '*'
        );
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData('application/json');
    if (componentData && iframeRef.current) {
      const component = JSON.parse(componentData);
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'ADD_COMPONENT',
          component,
        },
        '*'
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className='h-screen flex flex-col editor-root bg-white'>
      {/* Top Toolbar */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 sticky top-0 z-30'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <button
              onClick={handleSave}
              className='flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors h-11 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800'
            >
              <Save className='w-4 h-4' />
              <span>{t('editor.save')}</span>
            </button>
            <button
              onClick={handlePublish}
              className='flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors h-11 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800'
            >
              <Upload className='w-4 h-4' />
              <span>{t('editor.publish')}</span>
            </button>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed h-11 focus:outline-none focus:ring-2 focus:ring-indigo-400'
            >
              <Undo className='w-4 h-4' />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed h-11 focus:outline-none focus:ring-2 focus:ring-indigo-400'
            >
              <Redo className='w-4 h-4' />
            </button>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={handleZoomOut}
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-11 focus:outline-none focus:ring-2 focus:ring-indigo-400'
            >
              <ZoomOut className='w-4 h-4' />
            </button>
            <span className='text-sm font-medium min-w-[3rem] text-center'>
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-11 focus:outline-none focus:ring-2 focus:ring-indigo-400'
            >
              <ZoomIn className='w-4 h-4' />
            </button>
            <button
              onClick={handleResetZoom}
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-11 focus:outline-none focus:ring-2 focus:ring-indigo-400'
            >
              <RotateCcw className='w-4 h-4' />
            </button>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={() => handleDevicePreview('desktop')}
              className={`p-2 rounded-lg transition-colors h-11 ${devicePreview === 'desktop'
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Monitor className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleDevicePreview('tablet')}
              className={`p-2 rounded-lg transition-colors h-11 ${devicePreview === 'tablet'
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Tablet className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleDevicePreview('mobile')}
              className={`p-2 rounded-lg transition-colors h-11 ${devicePreview === 'mobile'
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              <Smartphone className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Left Sidebar */}
        <div
          className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${leftSidebarOpen ? 'w-64' : 'w-0'
            } overflow-hidden z-20 ${isSmallScreen ? 'fixed inset-y-0 left-0' : ''}`}
        >
          <div className='p-4 h-full flex flex-col'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold'>
                {t('editor.components')}
              </h3>
              <button
                onClick={() => setLeftSidebarOpen(false)}
                className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>
            </div>

            <div className='space-y-2'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder={t('editor.search_components')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400'
                />
              </div>

              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400'
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all'
                      ? 'All Categories'
                      : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
              {filteredComponents.length} items
            </div>
          </div>
        </div>

        {/* Left Sidebar Toggle */}
        {!leftSidebarOpen && (
          <button
            onClick={() => setLeftSidebarOpen(true)}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2 rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          >
            <ChevronRight className='w-4 h-4' />
          </button>
        )}

        {/* Mobile overlay for left sidebar */}
        {isSmallScreen && leftSidebarOpen && (
          <div
            className='fixed inset-0 bg-black/40 z-10 lg:hidden'
            onClick={() => setLeftSidebarOpen(false)}
          />
        )}

        {/* Main Canvas */}
        <div className='flex-1 flex flex-col'>
          <div className='flex-1 canvas-container bg-white p-4 overflow-auto'>
            <div className='flex justify-center items-center min-h-full'>
              <div
                className='bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden'
                style={{
                  width: getDeviceWidth(),
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center center',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <iframe
                  ref={iframeRef}
                  src='/?edit=1'
                  className='w-full h-[600px] border-0'
                  title='Editor Canvas'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={`bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ${rightSidebarOpen ? 'w-80' : 'w-0'
            } overflow-hidden z-20 ${isSmallScreen ? 'fixed inset-y-0 right-0' : ''}`}
        >
          <div className='p-4 h-full flex flex-col'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold'>
                {t('editor.components')}
              </h3>
              <button
                onClick={() => setRightSidebarOpen(false)}
                className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>
            </div>

            <div className='space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto'>
              {filteredComponents.map(component => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={e => handleDragStart(e, component)}
                  className='p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-move transition-colors focus-within:ring-2 focus-within:ring-indigo-400'
                >
                  <div className='flex items-start space-x-3'>
                    <div className='w-16 h-12 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center'>
                      {component.preview_meta?.thumbnail ? (
                        <img
                          src={component.preview_meta.thumbnail}
                          alt={component.name}
                          className='w-full h-full object-cover rounded'
                        />
                      ) : (
                        <div className='text-xs text-gray-500'>Preview</div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                        {component.name}
                      </h4>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2'>
                        {component.description}
                      </p>
                      <span className='inline-block mt-1 px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded'>
                        {component.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile overlay for right sidebar */}
        {isSmallScreen && rightSidebarOpen && (
          <div
            className='fixed inset-0 bg-black/40 z-10 lg:hidden'
            onClick={() => setRightSidebarOpen(false)}
          />
        )}

        {/* Right Sidebar Toggle */}
        {!rightSidebarOpen && (
          <button
            onClick={() => setRightSidebarOpen(true)}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-2 rounded-l-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  );
}
