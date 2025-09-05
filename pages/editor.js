import React, { useState, useEffect, useRef } from 'react';
import Admin from 'layouts/Admin.js';
import { Messages, isEditorMessage, postToEditor } from '../lib/editor-protocol';

function Toolbar({ ready, onSave, onPublish, onUndo, onRedo, onZoomIn, onZoomOut, setDevice, device, onExport, onImport }) {
  return (
    <div className="sticky top-[70px] z-50 bg-slate-800 text-white border-b border-slate-700 px-4 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button onClick={onSave} disabled={!ready} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm">
          <i className="ni ni-cloud-upload-96" />
          <span>Save</span>
        </button>
        <button onClick={onPublish} disabled={!ready} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-sm">
          <i className="ni ni-paper-diploma" />
          <span>Publish</span>
        </button>
        <button onClick={onUndo} className="flex items-center gap-2 bg-transparent hover:bg-slate-700 px-2 py-1 rounded text-sm">
          <i className="ni ni-curved-next" />
        </button>
        <button onClick={onRedo} className="flex items-center gap-2 bg-transparent hover:bg-slate-700 px-2 py-1 rounded text-sm">
          <i className="ni ni-fat-add" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <button onClick={onZoomOut} className="px-2 py-1 rounded bg-slate-700">-</button>
          <button onClick={onZoomIn} className="px-2 py-1 rounded bg-slate-700">+</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDevice('desktop')} className={`px-3 py-1 rounded ${device==='desktop' ? 'bg-indigo-600':'bg-slate-700'}`} title="Desktop"><i className="ni ni-tv-2"/></button>
          <button onClick={() => setDevice('tablet')} className={`px-3 py-1 rounded ${device==='tablet' ? 'bg-indigo-600':'bg-slate-700'}`} title="Tablet"><i className="ni ni-tablet-button"/></button>
          <button onClick={() => setDevice('mobile')} className={`px-3 py-1 rounded ${device==='mobile' ? 'bg-indigo-600':'bg-slate-700'}`} title="Mobile"><i className="ni ni-mobile-button"/></button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onExport} className="px-3 py-1 rounded bg-transparent hover:bg-slate-700"><i className="ni ni-ungroup"/></button>
        <label className="px-3 py-1 rounded bg-transparent hover:bg-slate-700 cursor-pointer">
          <i className="ni ni-fat-add"/>
          <input type="file" className="hidden" onChange={onImport} />
        </label>
      </div>
    </div>
  );
}

function ComponentsCard({ c, onAdd }) {
  return (
    <div draggable onDragStart={(e)=>{ e.dataTransfer.setData('application/json', JSON.stringify(c)); e.dataTransfer.effectAllowed = 'copy'; }} className="p-3 rounded border bg-white hover:shadow cursor-grab">
      <div className="flex items-center gap-3">
        <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
          <i className={`ni ${c.type && c.type.indexOf('image')!==-1 ? 'ni-image' : 'ni-ui-04'}`} />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">{c.type}</div>
          <div className="text-xs text-slate-500">Preview</div>
        </div>
        <button onClick={()=>onAdd(c)} className="text-xs px-2 py-1 bg-indigo-600 text-white rounded">Add</button>
      </div>
    </div>
  );
}

export default function Editor() {
  const iframeRef = useRef(null);
  const [componentsLibrary, setComponentsLibrary] = useState([]);
  const [device, setDevice] = useState('desktop');
  const [collapsed, setCollapsed] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [scale, setScale] = useState(1);

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
      // handle sync responses or selection
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const post = (type, payload = {}) => {
    try { postToEditor(iframeRef.current?.contentWindow, type, payload); } catch (e) { console.error(e); }
  };

  const saveDraft = () => post(Messages.SAVE_DRAFT);
  const publish = () => post(Messages.PUBLISH);
  const undo = () => post(Messages.UNDO);
  const redo = () => post(Messages.REDO);

  const onAdd = (c) => post(Messages.ADD_COMPONENT, { component: c });

  const onExport = async () => {
    post(Messages.SAVE_DRAFT);
    setTimeout(async ()=>{
      try{
        const res = await fetch('/api/pages/home?mode=draft');
        const json = await res.json();
        if (json && json.ok) {
          const blob = new Blob([JSON.stringify(json.page, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'page-home.json'; a.click(); URL.revokeObjectURL(url);
        }
      }catch(e){ console.error(e); }
    },500);
  };

  const onImport = async (ev) => {
    const file = ev.target.files && ev.target.files[0]; if (!file) return; try { const txt = await file.text(); const data = JSON.parse(txt); post(Messages.IMPORT_PAGE, { page: data }); } catch (e) { console.error(e); }
  };

  const onIframeLoad = () => { try { postToEditor(iframeRef.current.contentWindow, Messages.INIT, { mode: 'draft' }); setIframeReady(true); } catch (e) { console.error(e); } };

  const handleDropFromLibrary = (e) => {
    e.preventDefault();
    const json = e.dataTransfer.getData('application/json');
    if (!json) return;
    try {
      const component = JSON.parse(json);
      post(Messages.ADD_COMPONENT, { component });
    } catch (e) { console.error(e); }
  };

  const onDragOver = (e) => e.preventDefault();

  const zoomIn = () => setScale(s => Math.min(2, +(s + 0.1).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(0.5, +(s - 0.1).toFixed(2)));

  // compute iframe classes for device preview
  const iframeWrapperClass = device === 'desktop' ? 'w-full max-w-none' : device === 'tablet' ? 'max-w-[960px] w-full' : 'max-w-[375px] w-full';

  return (
    <div className="flex h-[calc(100vh-70px)] flex-col">
      <Toolbar ready={iframeReady} onSave={saveDraft} onPublish={publish} onUndo={undo} onRedo={redo} onZoomIn={zoomIn} onZoomOut={zoomOut} setDevice={setDevice} device={device} onExport={onExport} onImport={onImport} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex items-start justify-center bg-slate-50 p-4" onDrop={handleDropFromLibrary} onDragOver={onDragOver}>
          <div className={`${iframeWrapperClass} canvas-frame transform origin-top`} style={{ transform: `scale(${scale})` }}>
            <iframe ref={iframeRef} src="/?edit=1" title="editor-canvas" className="w-full h-[calc(100vh-140px)] bg-white border" onLoad={onIframeLoad} />
          </div>
        </main>
        <aside className={`w-80 bg-white border-l p-4 overflow-auto ${collapsed ? 'hidden lg:block' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Components Library</h3>
            <button onClick={()=>{ setCollapsed(s=>!s); try{ document.body.classList.toggle('sidebar-collapsed'); }catch(e){} }} className="px-2 py-1 text-sm bg-slate-100 rounded">{collapsed ? 'Expand' : 'Collapse'}</button>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {componentsLibrary.map(c => <ComponentsCard key={c.id} c={c} onAdd={onAdd} />)}
          </div>
        </aside>
      </div>
    </div>
  );
}

Editor.layout = function EditorLayout({ children }) {
  // hide the main Argon sidebar for the editor to allow full-width canvas
  return <Admin hideSidebar={true}>{children}</Admin>;
};
