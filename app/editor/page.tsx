"use client";

import React, { useRef, useState, useEffect } from 'react';
import Sidebar from '../../app/components/Sidebar';

export default function EditorPage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data) return;
      const { type } = e.data;
      if (type === 'READY') setReady(true);
      if (type === 'SAVE_ACK') console.log('Save acknowledged');
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function postToIframe(msg: any) {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(msg, '*');
    }
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Top toolbar */}
        <div className="flex items-center gap-2 p-3 border-b bg-white">
          <button onClick={() => postToIframe({ type: 'SAVE_DRAFT' })} className="px-3 py-2 bg-indigo-600 text-white rounded">Save Draft</button>
          <button onClick={() => postToIframe({ type: 'PUBLISH' })} className="px-3 py-2 bg-green-600 text-white rounded">Publish</button>
          <button onClick={() => postToIframe({ type: 'UNDO' })} className="px-3 py-2 bg-gray-100 rounded">Undo</button>
          <button onClick={() => postToIframe({ type: 'REDO' })} className="px-3 py-2 bg-gray-100 rounded">Redo</button>

          <div className="ml-4 flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="px-2 py-1 border rounded">-</button>
            <div className="px-3">{Math.round(zoom * 100)}%</div>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="px-2 py-1 border rounded">+</button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <select value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)} className="border px-2 py-1 rounded">
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
        </div>

        <div className="flex-1 relative bg-gray-50">
          <div className="absolute inset-0 flex">
            <div className="flex-1 flex justify-center items-start p-6">
              <iframe
                ref={iframeRef}
                src={`/?edit=1`}
                className="w-full h-full border rounded"
                style={{ width: selectedDevice === 'desktop' ? `100%` : selectedDevice === 'tablet' ? '800px' : '375px', transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                title="Editor Canvas"
              />
            </div>

            <aside className="w-80 bg-white border-l p-4">
              <h4 className="font-semibold mb-2">Components</h4>
              <div draggable onDragStart={e => { e.dataTransfer?.setData('application/json', JSON.stringify({ type: 'hero_banner' })); }} className="mb-2 p-2 border rounded cursor-move">Hero Banner</div>
              <div draggable onDragStart={e => { e.dataTransfer?.setData('application/json', JSON.stringify({ type: 'feature_card' })); }} className="mb-2 p-2 border rounded cursor-move">Feature Card</div>
              <div draggable onDragStart={e => { e.dataTransfer?.setData('application/json', JSON.stringify({ type: 'stats_counter' })); }} className="mb-2 p-2 border rounded cursor-move">Stats</div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
