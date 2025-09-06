'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';
import { AutoSaveManager } from '@/lib/auto-save';
import { UndoRedoManager } from '@/lib/undo-redo';
import { KeyboardShortcutManager, createDefaultShortcuts } from '@/lib/keyboard-shortcuts';
import { AnalyticsManager } from '@/lib/analytics';
import AutoSaveIndicator from './AutoSaveIndicator';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';
import TemplateSelector from './TemplateSelector';
import SEOTools from './SEOTools';
import { TemplateManager } from '@/lib/templates';
import { SEOData, SEOTools as SEOToolsLib } from '@/lib/seo-tools';

interface Component {
  id: string;
  type: string;
  props: any;
}

interface EditorState {
  components: Component[];
  editingComponent: string | null;
}

export default function HomeEditorClient({ initialComponents }: { initialComponents?: Component[] }) {
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();
  const [editorState, setEditorState] = useState<EditorState>({
    components: initialComponents || [],
    editingComponent: null
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Enhanced features
  const [autoSaveManager] = useState(() => new AutoSaveManager(
    async () => {
      await saveToServer();
    },
    () => setIsAutoSaving(true),
    () => {
      setIsAutoSaving(false);
      setLastSaveTime(Date.now());
    },
    (error) => {
      setIsAutoSaving(false);
      setSaveError(error.message);
    }
  ));

  const [undoRedoManager] = useState(() => new UndoRedoManager());
  const [keyboardShortcuts] = useState(() => new KeyboardShortcutManager());
  const [analytics] = useState(() => new AnalyticsManager());
  const [templateManager] = useState(() => new TemplateManager());

  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<number>(0);
  const [saveError, setSaveError] = useState<string>('');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showSEOTools, setShowSEOTools] = useState(false);
  const [seoData, setSeoData] = useState<SEOData>({
    title: '',
    description: '',
    keywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: ''
  });

  // Keep latest components without triggering function identity changes
  const latestComponentsRef = useRef<Component[]>(editorState.components);
  useEffect(() => {
    latestComponentsRef.current = editorState.components;
  }, [editorState.components]);

  // Check if we're in edit mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsEditMode(urlParams.get('edit') === '1');
  }, []);

  

  // Add component
  const addComponent = useCallback((component: any) => {
    const newComponent: Component = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: component.type,
      props: component.props_template || {}
    };

    setEditorState(prev => {
      const newComponents = [...prev.components, newComponent];
      undoRedoManager.addState(newComponents, 'add_component');
      return { ...prev, components: newComponents, editingComponent: newComponent.id };
    });
  }, [undoRedoManager]);

  // Update component
  const updateComponent = useCallback((componentId: string, newProps: any) => {
    setEditorState(prev => {
      const newComponents = prev.components.map(comp =>
        comp.id === componentId ? { ...comp, props: { ...comp.props, ...newProps } } : comp
      );
      undoRedoManager.addState(newComponents, 'update_component');
      return { ...prev, components: newComponents };
    });
  }, [undoRedoManager]);

  // Apply style to component
  const applyStyle = useCallback((componentId: string, style: any) => {
    setEditorState(prev => {
      const newComponents = prev.components.map(comp =>
        comp.id === componentId
          ? { ...comp, props: { ...comp.props, style: { ...comp.props.style, ...style } } }
          : comp
      );
      undoRedoManager.addState(newComponents, 'apply_style');
      return { ...prev, components: newComponents };
    });
  }, [undoRedoManager]);

  // Undo
  const undo = useCallback(() => {
    const previousState = undoRedoManager.undo();
    if (previousState) {
      setEditorState(prev => ({
        ...prev,
        components: previousState
      }));
      analytics.trackEditorAction('undo');
    }
  }, [undoRedoManager, analytics]);

  // Redo
  const redo = useCallback(() => {
    const nextState = undoRedoManager.redo();
    if (nextState) {
      setEditorState(prev => ({
        ...prev,
        components: nextState
      }));
      analytics.trackEditorAction('redo');
    }
  }, [undoRedoManager, analytics]);

  // Save to server
  const saveToServer = useCallback(async () => {
    try {
      const response = await fetch('/api/pages/home/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components_json: latestComponentsRef.current,
          updated_by: 'editor'
        })
      });

      if (response.ok) {
        // Notify parent of successful save
        window.parent.postMessage({
          type: 'SAVE_ACK',
          success: true
        }, window.location.origin);
      }
    } catch (error: unknown) {
      console.error('Error saving:', error);
      window.parent.postMessage({
        type: 'SAVE_ACK',
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }, window.location.origin);
    }
  }, []);

  // Publish to server
  const publishToServer = useCallback(async () => {
    try {
      const response = await fetch('/api/pages/home/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components_json: latestComponentsRef.current,
          updated_by: 'editor'
        })
      });

      if (response.ok) {
        // Notify parent of successful publish
        window.parent.postMessage({
          type: 'PUBLISH_ACK',
          success: true
        }, window.location.origin);
      }
    } catch (error: unknown) {
      console.error('Error publishing:', error);
      window.parent.postMessage({
        type: 'PUBLISH_ACK',
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }, window.location.origin);
    }
  }, []);

  // Listen for postMessage from parent
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check - only accept messages from same origin
      if (event.origin !== window.location.origin) return;

      const { type, component, componentId, props, style } = event.data;

      switch (type) {
        case 'INIT':
          setIsInitialized(true);
          // Send current theme and locale to parent
          (event.source as Window).postMessage({
            type: 'THEME_UPDATE',
            theme,
            locale: isRTL ? 'ar' : 'en'
          }, event.origin);
          break;
        case 'ADD_COMPONENT':
          if (component) {
            addComponent(component);
          }
          break;
        case 'UPDATE_COMPONENT':
          if (componentId && props) {
            updateComponent(componentId, props);
          }
          break;
        case 'APPLY_STYLE':
          if (componentId && style) {
            applyStyle(componentId, style);
          }
          break;
        case 'UNDO':
          undo();
          break;
        case 'REDO':
          redo();
          break;
        case 'SAVE_REQUEST':
          saveToServer();
          break;
        case 'PUBLISH_REQUEST':
          publishToServer();
          break;
        case 'SYNC_STATE':
          // Send current state to parent
          (event.source as Window).postMessage({
            type: 'STATE_SYNC',
            state: {
              components: latestComponentsRef.current,
              canUndo: undoRedoManager.canUndo(),
              canRedo: undoRedoManager.canRedo()
            }
          }, event.origin);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addComponent, updateComponent, applyStyle, undo, redo, saveToServer, publishToServer, theme, isRTL, undoRedoManager]);

  // Handle inline editing
  const handleInlineEdit = (componentId: string, field: string, value: any) => {
    updateComponent(componentId, { [field]: value });

    // Debounced save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToServer();
    }, 2000);
  };

  // Prevent navigation in edit mode
  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        e.preventDefault();
        // Show toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = t('editor.navigation_disabled');
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
    }
  };

  // Render component based on type
  const renderComponent = (component: Component) => {
    const { type, props } = component;
    const isEditing = isEditMode && editorState.editingComponent === component.id;

    switch (type) {
      case 'hero_banner':
        return (
          <section
            key={component.id}
            className={`relative py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white ${isEditing ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => isEditMode && setEditorState(prev => ({ ...prev, editingComponent: component.id }))}
          >
            <div className="max-w-5xl mx-auto px-4 text-center">
              {isEditing ? (
                <input
                  type="text"
                  value={props.title?.[isRTL ? 'ar' : 'en'] || ''}
                  onChange={(e) => handleInlineEdit(component.id, 'title', {
                    ...props.title,
                    [isRTL ? 'ar' : 'en']: e.target.value
                  })}
                  className="w-full text-4xl font-bold mb-4 bg-transparent border-none text-white placeholder-white text-center"
                  placeholder="Enter title"
                />
              ) : (
                <h1 className="text-4xl font-bold mb-4">
                  {props.title?.[isRTL ? 'ar' : 'en'] || 'Default Title'}
                </h1>
              )}

              {isEditing ? (
                <textarea
                  value={props.subtitle?.[isRTL ? 'ar' : 'en'] || ''}
                  onChange={(e) => handleInlineEdit(component.id, 'subtitle', {
                    ...props.subtitle,
                    [isRTL ? 'ar' : 'en']: e.target.value
                  })}
                  className="w-full mb-6 bg-transparent border-none text-white placeholder-white text-center resize-none"
                  placeholder="Enter subtitle"
                  rows={3}
                />
              ) : (
                <p className="mb-6">
                  {props.subtitle?.[isRTL ? 'ar' : 'en'] || 'Default subtitle'}
                </p>
              )}

              <div className="flex justify-center gap-3">
                <a
                  href={props.ctaHref || '#'}
                  className="bg-white text-indigo-600 px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors"
                  onClick={handleClick}
                >
                  {props.ctaText?.[isRTL ? 'ar' : 'en'] || 'Get Started'}
                </a>
              </div>
            </div>
          </section>
        );

      case 'features_1':
        return (
          <section key={component.id} className="py-16">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-4">
                {props.title?.[isRTL ? 'ar' : 'en'] || 'Features'}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {(props.items || []).map((item: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className={`${item.icon || 'fas fa-star'} text-indigo-600 text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {item.title?.[isRTL ? 'ar' : 'en'] || 'Feature'}
                    </h3>
                    <p className="text-gray-600">
                      {item.description?.[isRTL ? 'ar' : 'en'] || 'Feature description'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'stats_1':
        return (
          <section key={component.id} className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {(props.items || []).map((item: any, index: number) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {item.value || '0'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {item.label?.[isRTL ? 'ar' : 'en'] || 'Stat'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return (
          <div key={component.id} className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Component: {type} (Not implemented)
            </p>
          </div>
        );
    }
  };

  // Initialize communication with parent
  useEffect(() => {
    if (isEditMode && !isInitialized) {
      window.parent.postMessage({ type: 'INIT' }, window.location.origin);
    }
  }, [isEditMode, isInitialized]);

  // Initialize enhanced features
  useEffect(() => {
    if (isEditMode) {
      // Initialize undo/redo with initial components
      undoRedoManager.addState(editorState.components, 'initial');

      // Setup keyboard shortcuts
      const shortcuts = createDefaultShortcuts(
        () => saveToServer(),
        () => undo(),
        () => redo(),
        () => handleZoomIn(),
        () => handleZoomOut(),
        () => handleResetZoom(),
        () => setIsEditMode(!isEditMode)
      );

      shortcuts.forEach(shortcut => {
        keyboardShortcuts.addShortcut(shortcut);
      });

      // Track page view
      analytics.trackPageView('home', 'Home Page');

      // Initialize auto-save
      autoSaveManager.triggerSave();
    }

    return () => {
      keyboardShortcuts.destroy();
      autoSaveManager.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, editorState.components]);

  // Enhanced functions
  // Internal handlers removed; undo/redo use callbacks above

  const handleZoomIn = () => {
    analytics.trackEditorAction('zoom_in');
  };

  const handleZoomOut = () => {
    analytics.trackEditorAction('zoom_out');
  };

  const handleResetZoom = () => {
    analytics.trackEditorAction('reset_zoom');
  };

  const handleTemplateSelect = (template: any) => {
    setEditorState(prev => ({
      ...prev,
      components: template.components
    }));
    undoRedoManager.addState(template.components, 'template_applied');
    analytics.trackEditorAction('template_applied', template.id);
    setShowTemplateSelector(false);
  };

  const handleSEOUpdate = (newSeoData: SEOData) => {
    setSeoData(newSeoData);
    analytics.trackEditorAction('seo_updated');
  };

  const handleComponentChange = (componentId: string, newProps: any) => {
    setEditorState(prev => {
      const newComponents = prev.components.map(comp =>
        comp.id === componentId ? { ...comp, props: newProps } : comp
      );

      // Add to undo/redo history
      undoRedoManager.addState(newComponents, 'component_updated');

      // Trigger auto-save
      autoSaveManager.triggerSave();

      // Track analytics
      analytics.trackEditorAction('component_updated', componentId);

      return {
        ...prev,
        components: newComponents
      };
    });
  };

  return (
    <div onClick={handleClick}>
      {/* Enhanced Toolbar */}
      {isEditMode && (
        <div className="fixed top-4 left-4 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <span>Templates</span>
              </button>

              <button
                onClick={() => setShowSEOTools(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>SEO</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={undo}
                disabled={!undoRedoManager.canUndo()}
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>

              <button
                onClick={redo}
                disabled={!undoRedoManager.canRedo()}
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
              </button>

              <button
                onClick={() => setShowShortcutsHelp(true)}
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {editorState.components.map(renderComponent)}

      {isEditMode && editorState.components.length === 0 && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              {t('editor.add_component')}
            </h2>
            <p className="text-gray-500 dark:text-gray-500">
              Drag components from the sidebar to start building your page
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Components */}
      <AutoSaveIndicator
        isSaving={isAutoSaving}
        lastSaveTime={lastSaveTime}
        error={saveError}
      />

      <KeyboardShortcutsHelp
        shortcuts={keyboardShortcuts.getShortcutsForHelp()}
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />

      <TemplateSelector
        templates={templateManager.getAllTemplates()}
        categories={templateManager.getCategories()}
        onSelectTemplate={handleTemplateSelect}
        onClose={() => setShowTemplateSelector(false)}
        isOpen={showTemplateSelector}
      />

      <SEOTools
        seoData={seoData}
        content={editorState.components.map(c => JSON.stringify(c)).join(' ')}
        onUpdateSEO={handleSEOUpdate}
        isOpen={showSEOTools}
        onClose={() => setShowSEOTools(false)}
      />
    </div>
  );
}
