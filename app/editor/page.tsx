'use client';

import React, { useRef, useState, useEffect } from 'react';
import Sidebar from '../../app/components/Sidebar';
import { useSidebar } from '../../app/components/SidebarContext';

export default function EditorPage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const { collapsed: leftCollapsed, setCollapsed } = useSidebar();
  const [ready, setReady] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [zoom, setZoom] = useState(1);
  const [rightCollapsed, setRightCollapsed] = useState(false);

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

  useEffect(() => {
    // send zoom update to iframe content (zoom the page inside iframe)
    postToIframe({ type: 'SET_ZOOM', zoom });
  }, [zoom]);

  useEffect(() => {
    // inform iframe about device width so content can adapt
    const deviceWidth = selectedDevice === 'desktop' ? '100%' : selectedDevice === 'tablet' ? '800px' : '375px';
    postToIframe({ type: 'SET_DEVICE', width: deviceWidth });
  }, [selectedDevice]);

  // sidebar widths must mirror app/components/Sidebar.tsx w-20 (80px) and w-64 (256px)
  const leftWidth = leftCollapsed ? 80 : 256;
  const rightWidth = rightCollapsed ? 0 : 320; // approx w-80 + padding
  const toolbarHeight = 64; // px

  return (
    <div className='min-h-screen relative'>
      <Sidebar />

      <div style={{ marginLeft: leftWidth }} className='flex-1'>
        {/* Top toolbar */}
        <div style={{ height: toolbarHeight }} className='flex items-center gap-2 p-3 border-b bg-white fixed left-0 right-0 z-30'>
          <div className='ml-4'>
            <button
              onClick={() => postToIframe({ type: 'SAVE_DRAFT' })}
              className='px-3 py-2 bg-indigo-600 text-white rounded'
            >
              Save Draft
            </button>
            <button
              onClick={() => postToIframe({ type: 'PUBLISH' })}
              className='px-3 py-2 bg-green-600 text-white rounded ml-2'
            >
              Publish
            </button>
            <button
              onClick={() => postToIframe({ type: 'UNDO' })}
              className='px-3 py-2 bg-gray-100 rounded ml-2'
            >
              Undo
            </button>
            <button
              onClick={() => postToIframe({ type: 'REDO' })}
              className='px-3 py-2 bg-gray-100 rounded ml-2'
            >
              Redo
            </button>
          </div>

          <div className='ml-6 flex items-center gap-2'>
            <button
              onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))}
              className='px-2 py-1 border rounded'
            >
              -
            </button>
            <div className='px-3'>{Math.round(zoom * 100)}%</div>
            <button
              onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)))}
              className='px-2 py-1 border rounded'
            >
              +
            </button>
          </div>

          <div className='ml-auto flex items-center gap-2'>
            <select
              value={selectedDevice}
              onChange={e => setSelectedDevice(e.target.value)}
              className='border px-2 py-1 rounded'
            >
              <option value='desktop'>Desktop</option>
              <option value='tablet'>Tablet</option>
              <option value='mobile'>Mobile</option>
            </select>

            <button
              onClick={() => setRightCollapsed(v => !v)}
              className='px-3 py-2 border rounded ml-2'
              title={rightCollapsed ? 'Open components' : 'Collapse components'}
            >
              {rightCollapsed ? 'Open Components' : 'Components'}
            </button>

            <button
              onClick={() => setCollapsed(v => !v)}
              className='px-3 py-2 border rounded ml-2'
              title={leftCollapsed ? 'Open sidebar' : 'Collapse sidebar'}
            >
              {leftCollapsed ? 'Open Sidebar' : 'Sidebar'}
            </button>
          </div>
        </div>

        {/* Canvas area - fixed so it occupies available viewport between sidebars */}
        <div style={{ paddingTop: toolbarHeight }}>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              try {
                const data = e.dataTransfer?.getData('application/json');
                if (data) {
                  const payload = JSON.parse(data);
                  postToIframe({ type: 'ADD_COMPONENT', payload });
                }
              } catch (err) {
                console.error(err);
              }
            }}
            style={{
              position: 'fixed',
              zIndex: 20,
              top: toolbarHeight,
              left: leftWidth,
              right: rightWidth,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: 16,
              background: 'var(--bg, transparent)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
                height: '100%',
                overflow: 'auto'
              }}
            >
              <iframe
                ref={iframeRef}
                src={`/?edit=1`}
                className='border rounded shadow'
                style={{
                  width: selectedDevice === 'desktop' ? '100%' : selectedDevice === 'tablet' ? '800px' : '375px',
                  height: 'calc(100vh - ' + (toolbarHeight + 32) + 'px)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: 'white'
                }}
                title='Editor Canvas'
              />
            </div>

            {/* Right components sidebar */}
            <aside
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: rightCollapsed ? 56 : 320,
                transition: 'width 0.2s',
                background: 'white',
                borderLeft: '1px solid rgba(0,0,0,0.08)',
                padding: 12,
                overflow: 'auto'
              }}
            >
              {!rightCollapsed ? (
                <div>
                  <h4 className='font-semibold mb-2'>Components</h4>
                  <div className='grid grid-cols-2 gap-3'>
                    <div
                      draggable
                      onDragStart={e => {
                        e.dataTransfer?.setData('application/json', JSON.stringify({ type: 'hero_banner' }));
                      }}
                      className='aspect-square w-full flex items-center justify-center border rounded cursor-move bg-white'
                    >
                      Hero
                    </div>
                    <div
                      draggable
                      onDragStart={e => {
                        e.dataTransfer?.setData('application/json', JSON.stringify({ type: 'feature_card' }));
                      }}
                      className='aspect-square w-full flex items-center justify-center border rounded cursor-move bg-white'
                    >
                      Feature
                    </div>
                    <div
                      draggable
                      onDragStart={e => {
                        e.dataTransfer?.setData('application/json', JSON.stringify({ type: 'stats_counter' }));
                      }}
                      className='aspect-square w-full flex items-center justify-center border rounded cursor-move bg-white'
                    >
                      Stats
                    </div>
                    <div
                      draggable
                      onDragStart={e => {
                        e.dataTransfer?.setData('application/json', JSON.stringify({ type: 'testimonial' }));
                      }}
                      className='aspect-square w-full flex items-center justify-center border rounded cursor-move bg-white'
                    >
                      Testimonial
                    </div>
                  </div>
                </div>
              ) : (
                <div className='h-full flex items-center justify-center'>
                  <button onClick={() => setRightCollapsed(false)} className='px-2 py-1 border rounded'>Open</button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
