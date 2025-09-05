import React, { useState, useEffect, useRef } from 'react';
import Admin from 'layouts/Admin.js';
import { Messages, isEditorMessage, postToEditor } from '../lib/editor-protocol';

// New simplified editor subcomponents (kept lightweight and self-contained)
function NewToolbar({ ready, onSave, onPublish, onUndo, onRedo, onExport, onImport, onTogglePalette, onToggleFont }) {
  return (
    <header className="new-editor-toolbar">
      <div className="toolbar-left">
        <button className="btn btn-sm btn-light" onClick={onSave} disabled={!ready}><i className="ni ni-cloud-upload-96 mr-2" />Save</button>
        <button className="btn btn-sm btn-primary" onClick={onPublish} disabled={!ready}><i className="ni ni-paper-diploma mr-2" />Publish</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={onUndo} disabled={!ready}><i className="ni ni-curved-next mr-2" />Undo</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={onRedo} disabled={!ready}><i className="ni ni-fat-add mr-2" />Redo</button>
      </div>
      <div className="toolbar-center">
        <div className="device-controls">
          <span className="device-label">Preview:</span>
          <button className="btn btn-sm btn-outline-secondary" data-device="desktop"><i className="ni ni-tv-2 mr-2" />Desktop</button>
          <button className="btn btn-sm btn-outline-secondary" data-device="tablet"><i className="ni ni-tablet-button mr-2" />Tablet</button>
          <button className="btn btn-sm btn-outline-secondary" data-device="mobile"><i className="ni ni-mobile-button mr-2" />Mobile</button>
        </div>
      </div>
      <div className="toolbar-right">
        <button className="btn btn-sm btn-outline-light" onClick={onExport}><i className="ni ni-ungroup mr-2" />Export</button>
        <label className="btn btn-sm btn-outline-light mb-0"><i className="ni ni-fat-add mr-2" />Import<input type="file" className="file-input-hidden" onChange={onImport} /></label>
        <button className="btn btn-sm btn-outline-light" onClick={onTogglePalette}><i className="ni ni-palette mr-2" />Palette</button>
        <button className="btn btn-sm btn-outline-light" onClick={onToggleFont}><i className="ni ni-zoom-split-in mr-2" />Fonts</button>
      </div>
    </header>
  );
}

function NewSidebar({ components = [], onAdd, collapsed, toggleCollapsed, ready }) {
  return (
    <aside className={`new-editor-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        <button className="collapse-toggle" onClick={toggleCollapsed} aria-label="Toggle sidebar">{collapsed ? '›' : '‹'}</button>
        <div className="brand">BRAND</div>
      </div>
      <div className="components-list">
        <h6>Components</h6>
        {components.map(c => (
          <button key={c.id} className="component-btn" onClick={() => onAdd(c)} disabled={!ready}>{c.type}</button>
        ))}
      </div>
      <div className="sidebar-footer">Documentation</div>
    </aside>
  );
}

function RightPanel({ visible }) {
  if (!visible) return null;
  return (
    <aside className="new-editor-rightpanel">
      <h6>Inspector</h6>
      <p>No selection</p>
    </aside>
  );
}

export default function Editor() {
  const iframeRef = useRef(null);
  const [componentsLibrary, setComponentsLibrary] = useState([]);
  const [device, setDevice] = useState('desktop');
  const [collapsed, setCollapsed] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(null);
  const [rightVisible, setRightVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/components');
        const json = await res.json();
        if (json && json.ok) setComponentsLibrary(json.components || []);
      } catch (e) { console.error(e); }
    })();
  }, []);

  useEffect(() => {
    const handler = (ev) => {
      if (!isEditorMessage(ev)) return;
      const { type, payload } = ev.data;
      if (type === Messages.SYNC_STATE) {
        // example: open inspector when selection changes
        setRightVisible(!!payload && !!payload.selection);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const post = (type, payload = {}) => {
    try { postToEditor(iframeRef.current.contentWindow, type, payload); } catch (e) {}
  };

  const saveDraft = () => post(Messages.SAVE_DRAFT);
  const publish = () => post(Messages.PUBLISH);
  const undo = () => post(Messages.UNDO);
  const redo = () => post(Messages.REDO);
  const onAdd = (c) => post(Messages.ADD_COMPONENT, { component: c });

  const exportJSON = async () => {
    post(Messages.SAVE_DRAFT);
    setTimeout(async () => {
      try {
        const res = await fetch('/api/pages/home?mode=draft');
        const json = await res.json();
        if (json && json.ok) {
          const blob = new Blob([JSON.stringify(json.page, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'page-home.json'; a.click(); URL.revokeObjectURL(url);
        }
      } catch (e) { console.error(e); }
    }, 600);
  };

  const importJSON = async (ev) => {
    const file = ev.target.files && ev.target.files[0]; if (!file) return;
    try { const txt = await file.text(); const data = JSON.parse(txt); post(Messages.IMPORT_PAGE, { page: data }); } catch (e) { console.error(e); }
  };

  const computeIframeHeight = () => {
    try {
      const win = iframeRef.current && iframeRef.current.contentWindow;
      const doc = win && (win.document || win.contentDocument);
      if (!doc) return;
      const h = Math.max(doc.body.scrollHeight || 0, doc.documentElement.scrollHeight || 0, doc.body.offsetHeight || 0);
      setIframeHeight(h + 40);
    } catch (e) {}
  };

  useEffect(() => { computeIframeHeight(); }, [device]);
  useEffect(() => { const onResize = () => computeIframeHeight(); window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize); }, []);

  const iframeStyle = { border: 0, width: device === 'desktop' ? '100%' : device === 'tablet' ? 960 : 375, height: iframeHeight ? iframeHeight : '100%', margin: device === 'desktop' ? 0 : '0 auto' };

  const onIframeLoad = () => { try { postToEditor(iframeRef.current.contentWindow, Messages.INIT, { mode: 'draft' }); setIframeReady(true); computeIframeHeight(); setTimeout(computeIframeHeight, 350); } catch (e) { console.error(e); } };

  // handle toggles
  const toggleCollapsed = () => { setCollapsed(!collapsed); try { localStorage.setItem('sidebar-collapsed', !collapsed ? 'true' : 'false'); document.body.classList.toggle('sidebar-collapsed', !collapsed); } catch (e) {} };

  // palette/font placeholders
  const togglePalette = () => alert('Palette');
  const toggleFont = () => alert('Fonts');

  return (
    <div className="new-editor-root">
      <NewToolbar ready={iframeReady} onSave={saveDraft} onPublish={publish} onUndo={undo} onRedo={redo} onExport={exportJSON} onImport={importJSON} onTogglePalette={togglePalette} onToggleFont={toggleFont} />
      <div className="new-editor-body">
        <NewSidebar components={componentsLibrary} onAdd={onAdd} collapsed={collapsed} toggleCollapsed={toggleCollapsed} ready={iframeReady} />
        <main className="new-editor-canvas">
          <div className="canvas-frame" role="region">
            <iframe ref={iframeRef} className="editor-iframe" src="/?edit=1&mode=draft" style={iframeStyle} onLoad={onIframeLoad} />
          </div>
        </main>
        <RightPanel visible={rightVisible} />
      </div>
    </div>
  );
}

Editor.layout = function EditorLayout({ children }) {
  return <Admin hideSidebar>{children}</Admin>;
};
