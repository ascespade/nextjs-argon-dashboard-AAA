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
  Pin,
  PinOff,
  Layout,
  Palette,
  Settings,
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
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [leftSidebarPinned, setLeftSidebarPinned] = useState(false);
  const [rightSidebarPinned, setRightSidebarPinned] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [devicePreview, setDevicePreview] = useState('desktop');
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load components and templates on mount
  useEffect(() => {
    loadComponents();
    loadTemplates();
  }, []);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { type, data } = event.data;

      switch (type) {
        case 'COMPONENT_SELECTED':
          setSelectedComponent(data);
          break;
        case 'COMPONENT_DESELECTED':
          setSelectedComponent(null);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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
        // Auto-collapse sidebars on desktop if not pinned
        if (!leftSidebarPinned) {
          setLeftSidebarOpen(false);
        }
        if (!rightSidebarPinned) {
          setRightSidebarOpen(false);
        }
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [leftSidebarPinned, rightSidebarPinned]);

  // Auto-collapse sidebars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const leftSidebar = document.querySelector('[data-sidebar="left"]');
      const rightSidebar = document.querySelector('[data-sidebar="right"]');

      if (leftSidebar && !leftSidebar.contains(target) && !target.closest('[data-sidebar="left"]')) {
        if (!leftSidebarPinned && leftSidebarOpen) {
          setLeftSidebarOpen(false);
        }
      }

      if (rightSidebar && !rightSidebar.contains(target) && !target.closest('[data-sidebar="right"]')) {
        if (!rightSidebarPinned && rightSidebarOpen) {
          setRightSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [leftSidebarOpen, rightSidebarOpen, leftSidebarPinned, rightSidebarPinned]);

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

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
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
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'UNDO',
        },
        '*'
      );
    }
  };

  const handleRedo = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'REDO',
        },
        '*'
      );
    }
  };

  const handleDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData('application/json');
    console.log('Drop event triggered, componentData:', componentData);
    if (componentData && iframeRef.current) {
      const component = JSON.parse(componentData);
      console.log('Sending ADD_COMPONENT message:', component);
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

  const applyTemplate = (template: any) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'APPLY_TEMPLATE',
          template,
        },
        '*'
      );
    }
  };

  const toggleSidebar = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftSidebarOpen(!leftSidebarOpen);
    } else {
      setRightSidebarOpen(!rightSidebarOpen);
    }
  };

  const toggleSidebarPin = (side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftSidebarPinned(!leftSidebarPinned);
      if (!leftSidebarPinned) {
        setLeftSidebarOpen(true);
      }
    } else {
      setRightSidebarPinned(!rightSidebarPinned);
      if (!rightSidebarPinned) {
        setRightSidebarOpen(true);
      }
    }
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
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-11 focus:outline-none focus:ring-2 focus:ring-indigo-400'
            >
              <Undo className='w-4 h-4' />
            </button>
            <button
              onClick={handleRedo}
              className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 h-11 focus:outline-none focus:ring-2 focus:ring-indigo-400'
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
          data-sidebar="left"
          className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${leftSidebarOpen ? 'w-80' : 'w-0'
            } overflow-hidden z-20 ${isSmallScreen ? 'fixed inset-y-0 left-0' : ''}`}
        >
          <div className='p-4 h-full flex flex-col'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Layout className='w-5 h-5' />
                Templates & Components
              </h3>
              <div className='flex items-center gap-1'>
                <button
                  onClick={() => toggleSidebarPin('left')}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${leftSidebarPinned ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  title={leftSidebarPinned ? 'Unpin sidebar' : 'Pin sidebar'}
                >
                  {leftSidebarPinned ? <Pin className='w-4 h-4' /> : <PinOff className='w-4 h-4' />}
                </button>
                <button
                  onClick={() => toggleSidebar('left')}
                  className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Templates Section */}
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>Quick Templates</h4>
              <div className='grid grid-cols-2 gap-2'>
                {templates.slice(0, 4).map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    className='p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left'
                  >
                    <div className='w-full h-16 bg-gray-100 dark:bg-gray-600 rounded mb-2 flex items-center justify-center'>
                      <Layout className='w-6 h-6 text-gray-400' />
                    </div>
                    <div className='text-xs font-medium text-gray-900 dark:text-white truncate'>
                      {template.name || `Template ${index + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Component Properties */}
            {selectedComponent && (
              <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-600'>
                <h4 className='text-sm font-semibold mb-3 flex items-center gap-2'>
                  <Settings className='w-4 h-4' />
                  Component Properties
                </h4>
                <div className='space-y-3'>
                  <div>
                    <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Component Type
                    </label>
                    <div className='text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded'>
                      {selectedComponent.type}
                    </div>
                  </div>

                  {selectedComponent.props && Object.keys(selectedComponent.props).length > 0 && (
                    <div>
                      <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                        Properties
                      </label>
                      <div className='space-y-2 max-h-40 overflow-y-auto'>
                        {Object.entries(selectedComponent.props).map(([key, value]: [string, any]) => (
                          <div key={key} className='text-xs'>
                            <span className='font-medium text-gray-600 dark:text-gray-400'>{key}:</span>
                            <span className='ml-2 text-gray-900 dark:text-white'>
                              {typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className='flex gap-2'>
                    <button
                      onClick={() => {
                        if (iframeRef.current) {
                          iframeRef.current.contentWindow?.postMessage(
                            {
                              type: 'DELETE_COMPONENT',
                              componentId: selectedComponent.id,
                            },
                            '*'
                          );
                        }
                        setSelectedComponent(null);
                      }}
                      className='flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-lg transition-colors'
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        if (iframeRef.current) {
                          iframeRef.current.contentWindow?.postMessage(
                            {
                              type: 'DUPLICATE_COMPONENT',
                              componentId: selectedComponent.id,
                            },
                            '*'
                          );
                        }
                      }}
                      className='flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-lg transition-colors'
                    >
                      Duplicate
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Left Sidebar Toggle */}
        {!leftSidebarOpen && (
          <button
            onClick={() => setLeftSidebarOpen(true)}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2 rounded-r-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
          >
            <ChevronLeft className='w-4 h-4' />
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
          <div className='flex-1 canvas-container bg-gray-100 p-4 overflow-auto'>
            <div className='flex justify-center items-center min-h-full'>
              <div
                className='editor-window-frame overflow-hidden bg-white shadow-2xl rounded-lg'
                style={{
                  width: getDeviceWidth(),
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center center',
                  minHeight: '600px',
                  marginTop: '20px', // Add space from top
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <iframe
                  ref={iframeRef}
                  src='/?edit=1'
                  className='w-full h-full min-h-[600px] editor-canvas-iframe border-0'
                  title='Editor Canvas'
                  style={{ minHeight: '600px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          data-sidebar="right"
          className={`bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ${rightSidebarOpen ? 'w-80' : 'w-0'
            } overflow-hidden z-20 ${isSmallScreen ? 'fixed inset-y-0 right-0' : ''}`}
        >
          <div className='p-4 h-full flex flex-col'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Palette className='w-5 h-5' />
                Components Library
              </h3>
              <div className='flex items-center gap-1'>
                <button
                  onClick={() => toggleSidebarPin('right')}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${rightSidebarPinned ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  title={rightSidebarPinned ? 'Unpin sidebar' : 'Pin sidebar'}
                >
                  {rightSidebarPinned ? <Pin className='w-4 h-4' /> : <PinOff className='w-4 h-4' />}
                </button>
                <button
                  onClick={() => toggleSidebar('right')}
                  className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400'
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className='space-y-2 mb-4'>
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

            {/* Components Grid */}
            <div className='grid grid-cols-2 gap-2 max-h-[calc(100vh-300px)] overflow-y-auto'>
              {filteredComponents.map(component => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={e => handleDragStart(e, component)}
                  className='p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-move transition-colors text-left group'
                >
                  <div className='w-full h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded mb-2 flex items-center justify-center border border-gray-200 dark:border-gray-600'>
                    {component.preview_meta?.thumbnail ? (
                      <img
                        src={component.preview_meta.thumbnail}
                        alt={component.name}
                        className='w-full h-full object-cover rounded'
                      />
                    ) : (
                      <div className='text-center'>
                        <div className='text-lg mb-1'>
                          {component.type === 'hero_banner' && '🎯'}
                          {component.type === 'hero_gradient' && '🌈'}
                          {component.type.includes('features') && '⭐'}
                          {component.type.includes('cards') && '🃏'}
                          {component.type.includes('testimonials') && '💬'}
                          {component.type.includes('gallery') && '🖼️'}
                          {component.type.includes('stats') && '📊'}
                          {component.type.includes('cta') && '📢'}
                          {component.type.includes('headers') && '📋'}
                          {component.type.includes('footers') && '🦶'}
                          {component.type.includes('forms') && '📝'}
                          {component.type.includes('faq') && '❓'}
                          {component.type.includes('pricing') && '💰'}
                          {component.type.includes('team') && '👥'}
                          {component.type.includes('contact') && '📞'}
                          {component.type.includes('badges') && '🏷️'}
                          {component.type.includes('banners') && '🚩'}
                          {component.type.includes('counters') && '🔢'}
                          {component.type.includes('image_blocks') && '🖼️'}
                          {component.type.includes('sliders') && '🎠'}
                          {component.type.includes('accordions') && '📋'}
                          {component.type.includes('maps') && '🗺️'}
                          {component.type.includes('client_logos') && '🏢'}
                          {!component.type.match(/hero_banner|hero_gradient|features|cards|testimonials|gallery|stats|cta|headers|footers|forms|faq|pricing|team|contact|badges|banners|counters|image_blocks|sliders|accordions|maps|client_logos/) && '🧩'}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>Preview</div>
                      </div>
                    )}
                  </div>
                  <div className='text-xs font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                    {component.name}
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
              {filteredComponents.length} components available
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
            <ChevronRight className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  );
}
