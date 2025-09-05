import React, { useState, useEffect, useRef } from 'react';
import Admin from 'layouts/Admin.js';
import Toolbar from 'components/Editor/Toolbar';
import Sidebar from 'components/Editor/Sidebar';
import DeviceControls from 'components/Editor/DeviceControls';
import PreviewLens from 'components/Editor/PreviewLens';
import { Messages, isEditorMessage, postToEditor } from '../lib/editor-protocol';

export default function Editor() {
  const iframeRef = useRef(null);
  const [componentsLibrary, setComponentsLibrary] = useState([]);
  const [device, setDevice] = useState('desktop');
  useEffect(() => {
    // fetch components library from server-side API to avoid bundling server fs code into client
    (async () => {
      try {
        const res = await fetch('/api/components');
        const json = await res.json();
        if (json && json.ok) setComponentsLibrary(json.components || []);
      } catch (e) {
        console.error('Failed to load components library', e);
      }
    })();
  }, []);

  useEffect(() => {
    const handler = (ev) => {
      if (!isEditorMessage(ev)) return;
      // handle messages from iframe
      const { type, payload } = ev.data;
      console.log('Editor received', type, payload);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const saveDraft = () => {
    postToEditor(iframeRef.current.contentWindow, Messages.SAVE_DRAFT, {});
  };
  const publish = () => {
    postToEditor(iframeRef.current.contentWindow, Messages.PUBLISH, {});
  };
  const undo = () => postToEditor(iframeRef.current.contentWindow, Messages.UNDO, {});
  const redo = () => postToEditor(iframeRef.current.contentWindow, Messages.REDO, {});
  const onAdd = (c) => postToEditor(iframeRef.current.contentWindow, Messages.ADD_COMPONENT, { component: c });

  const exportJSON = async () => {
    postToEditor(iframeRef.current.contentWindow, Messages.SAVE_DRAFT, {});
    setTimeout(async () => {
      try {
        const res = await fetch('/api/pages/home?mode=draft');
        const json = await res.json();
        if (json && json.ok) {
          const blob = new Blob([JSON.stringify(json.page, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'page-home.json';
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch (e) { console.error(e); }
    }, 700);
  };

  const importJSON = async (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    try {
      const txt = await file.text();
      const data = JSON.parse(txt);
      postToEditor(iframeRef.current.contentWindow, Messages.IMPORT_PAGE, { page: data });
    } catch (e) { console.error(e); }
  };

  const togglePalette = () => { alert('Color palette would open (placeholder)'); };
  const toggleFont = () => { alert('Font selector would open (placeholder)'); };

  const iframeStyle = (() => {
    if (device === 'desktop') return { width: '100%', height: '100%', border: 0 };
    if (device === 'tablet') return { width: 960, height: '100%', border: 0, margin: '0 auto' };
    return { width: 375, height: '100%', border: 0, margin: '0 auto' };
  })();

  const onIframeLoad = () => {
    try {
      postToEditor(iframeRef.current.contentWindow, Messages.INIT, { mode: 'draft' });
    } catch (e) {}
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar components={componentsLibrary} onAdd={onAdd} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Toolbar onSave={saveDraft} onPublish={publish} onUndo={undo} onRedo={redo} onExport={exportJSON} onImport={importJSON} onTogglePalette={togglePalette} onToggleFont={toggleFont} />
        <DeviceControls device={device} setDevice={setDevice} />
        <div style={{ flex: 1, display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
          <div className="editor-device-frame" style={{ flex: device==='desktop'?1:'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <iframe ref={iframeRef} className="editor-iframe" src="/?edit=1&mode=draft" style={iframeStyle} onLoad={onIframeLoad} />
          </div>
          <PreviewLens />
        </div>
      </div>
    </div>
  );
}

Editor.layout = function EditorLayout({ children }) {
  return <Admin hideSidebar>{children}</Admin>;
};
