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
  const rightWidth = rightCollapsed ? 64 : 320; // collapsed shows small toggle area
  const toolbarHeight = 64; // px

  return (
    <div className='min-h-screen relative'>
      <Sidebar />

      <div style={{ marginLeft: leftWidth }} className='flex-1 flex flex-col min-h-screen'>
        {/* Top toolbar (professional) */}
        <div style={{ height: toolbarHeight }} className='flex items-center gap-4 px-4 border-b bg-white shadow-sm'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => postToIframe({ type: 'SAVE_DRAFT' })}
              className='px-4 py-2 bg-indigo-600 text-white rounded-md font-medium shadow'
            >
              Save Draft
            </button>
            <button
              onClick={() => postToIframe({ type: 'PUBLISH' })}
              className='px-4 py-2 bg-green-600 text-white rounded-md font-medium shadow'
            >
              Publish
            </button>
            <div className='ml-2 h-8 w-px bg-gray-200' />
            <button
              onClick={() => postToIframe({ type: 'UNDO' })}
              className='p-2 rounded-md hover:bg-gray-100'
              title='Undo'
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            <button
              onClick={() => postToIframe({ type: 'REDO' })}
              className='p-2 rounded-md hover:bg-gray-100'
              title='Redo'
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-gray-700' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>

          <div className='flex items-center gap-2 ml-6'>
            <button
              onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))}
              className='px-2 py-1 border rounded'
              aria-label='Zoom out'
            >
              -
            </button>
            <div className='px-3 text-sm text-gray-600'>{Math.round(zoom * 100)}%</div>
            <button
              onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(2)))}
              className='px-2 py-1 border rounded'
              aria-label='Zoom in'
            >
              +
            </button>
          </div>

          <div className='ml-auto flex items-center gap-3'>
            <select
              value={selectedDevice}
              onChange={e => setSelectedDevice(e.target.value)}
              className='border px-2 py-1 rounded'
              aria-label='Device preview'
            >
              <option value='desktop'>Desktop</option>
              <option value='tablet'>Tablet</option>
              <option value='mobile'>Mobile</option>
            </select>
          </div>
        </div>

        {/* Main content area: center canvas + right sidebar as siblings */}
        <div style={{ flex: 1 }} className='flex overflow-hidden'>
          {/* Center canvas */}
          <div
            className='flex-1 flex justify-center items-start p-4 overflow-auto'
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
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', height: `calc(100vh - ${toolbarHeight}px)`, overflow: 'auto' }}>
              <iframe
                ref={iframeRef}
                src={`/?edit=1`}
                className='border rounded shadow'
                style={{
                  width: selectedDevice === 'desktop' ? '100%' : selectedDevice === 'tablet' ? '800px' : '375px',
                  height: `calc(100vh - ${toolbarHeight + 32}px)`,
                  border: '1px solid rgba(0,0,0,0.08)',
                  background: 'white'
                }}
                title='Editor Canvas'
              />
            </div>
          </div>

          {/* Right components sidebar (sibling, aligned to right) */}
          <aside
            style={{
              width: rightWidth,
              transition: 'width 0.2s',
              background: 'white',
              borderLeft: '1px solid rgba(0,0,0,0.08)',
              padding: 12,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className='flex items-center justify-between mb-3'>
              {!rightCollapsed && <h4 className='font-semibold'>Components</h4>}
              <div>
                <button
                  onClick={() => setRightCollapsed(v => !v)}
                  className='px-2 py-1 border rounded'
                  title={rightCollapsed ? 'Open' : 'Collapse'}
                >
                  {rightCollapsed ? '>' : '‹'}
                </button>
              </div>
            </div>

            {!rightCollapsed ? (
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
            ) : (
              <div className='flex-1' />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
