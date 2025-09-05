'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

interface Component {
  id: string;
  type: string;
  props: any;
}

interface EditorState {
  components: Component[];
  history: Component[][];
  historyIndex: number;
  editingComponent: string | null;
}

export default function HomeEditorClient({ initialComponents }: { initialComponents?: Component[] }) {
  const { theme } = useTheme();
  const { t, isRTL } = useI18n();
  const [editorState, setEditorState] = useState<EditorState>({
    components: initialComponents || [],
    history: [],
    historyIndex: -1,
    editingComponent: null
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if we're in edit mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsEditMode(urlParams.get('edit') === '1');
  }, []);

  // Listen for postMessage from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check - only accept messages from same origin
      if (event.origin !== window.location.origin) return;

      const { type, component, componentId, props, style } = event.data;

      switch (type) {
        case 'INIT':
          setIsInitialized(true);
          // Send current theme and locale to parent
          event.source?.postMessage({
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
          event.source?.postMessage({
            type: 'STATE_SYNC',
            state: editorState
          }, event.origin);
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [editorState, theme, isRTL]);

  // Save state to history
  const saveToHistory = (newComponents: Component[]) => {
    setEditorState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...newComponents]);
      
      return {
        ...prev,
        components: newComponents,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  };

  // Add component
  const addComponent = (component: any) => {
    const newComponent: Component = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: component.type,
      props: component.props_template || {}
    };

    const newComponents = [...editorState.components, newComponent];
    saveToHistory(newComponents);
    
    // Set as editing component
    setEditorState(prev => ({
      ...prev,
      editingComponent: newComponent.id
    }));
  };

  // Update component
  const updateComponent = (componentId: string, newProps: any) => {
    const newComponents = editorState.components.map(comp =>
      comp.id === componentId ? { ...comp, props: { ...comp.props, ...newProps } } : comp
    );
    saveToHistory(newComponents);
  };

  // Apply style to component
  const applyStyle = (componentId: string, style: any) => {
    const newComponents = editorState.components.map(comp =>
      comp.id === componentId 
        ? { ...comp, props: { ...comp.props, style: { ...comp.props.style, ...style } } }
        : comp
    );
    saveToHistory(newComponents);
  };

  // Undo
  const undo = () => {
    if (editorState.historyIndex > 0) {
      setEditorState(prev => ({
        ...prev,
        historyIndex: prev.historyIndex - 1,
        components: [...prev.history[prev.historyIndex - 1]]
      }));
    }
  };

  // Redo
  const redo = () => {
    if (editorState.historyIndex < editorState.history.length - 1) {
      setEditorState(prev => ({
        ...prev,
        historyIndex: prev.historyIndex + 1,
        components: [...prev.history[prev.historyIndex + 1]]
      }));
    }
  };

  // Save to server
  const saveToServer = async () => {
    try {
      const response = await fetch('/api/pages/home/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components_json: editorState.components,
          updated_by: 'editor'
        })
      });

      if (response.ok) {
        // Notify parent of successful save
        window.parent.postMessage({
          type: 'SAVE_ACK',
          success: true
        }, '*');
      }
    } catch (error) {
      console.error('Error saving:', error);
      window.parent.postMessage({
        type: 'SAVE_ACK',
        success: false,
        error: error.message
      }, '*');
    }
  };

  // Publish to server
  const publishToServer = async () => {
    try {
      const response = await fetch('/api/pages/home/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          components_json: editorState.components,
          updated_by: 'editor'
        })
      });

      if (response.ok) {
        // Notify parent of successful publish
        window.parent.postMessage({
          type: 'PUBLISH_ACK',
          success: true
        }, '*');
      }
    } catch (error) {
      console.error('Error publishing:', error);
      window.parent.postMessage({
        type: 'PUBLISH_ACK',
        success: false,
        error: error.message
      }, '*');
    }
  };

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
      window.parent.postMessage({ type: 'INIT' }, '*');
    }
  }, [isEditMode, isInitialized]);

  return (
    <div onClick={handleClick}>
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
    </div>
  );
}