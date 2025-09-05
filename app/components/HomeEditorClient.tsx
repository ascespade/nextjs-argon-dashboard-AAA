'use client';

import React, { useEffect, useState } from 'react';

export default function HomeEditorClient({
  initialComponents,
}: {
  initialComponents?: any[];
}) {
  const [components, setComponents] = useState<any[]>(initialComponents || []);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function applyZoom(z: number) {
      try {
        // Prefer non-standard CSS zoom when available (acts like browser zoom) for crisper scaling
        (document.body as any).style.zoom = String(z);
        // Fallback: use transform scale on the root element
        const el = document.documentElement || document.body;
        el.style.transformOrigin = 'top left';
        el.style.transform = `scale(${z})`;
      } catch (e) {
        // ignore
      }
    }

    function setDeviceWidth(width: string) {
      try {
        const el = document.documentElement || document.body;
        if (width === '100%') {
          (el as HTMLElement).style.width = '100%';
        } else {
          (el as HTMLElement).style.width = width;
        }
      } catch (e) {
        // ignore
      }
    }

    function onMessage(e: MessageEvent) {
      const { data } = e;
      if (!data || !data.type) return;
      switch (data.type) {
        case 'INIT':
          // parent initiated
          window.parent.postMessage({ type: 'READY' }, '*');
          setReady(true);
          break;
        case 'SAVE_DRAFT':
          // post to API
          (async () => {
            try {
              const url = `${location.origin}/api/pages/home/save`;
              const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  components_json: components,
                  updated_by: 'editor',
                }),
                credentials: 'same-origin',
                mode: 'cors',
              });
              if (!res.ok) {
                const text = await res.text().catch(() => '');
                window.parent.postMessage(
                  {
                    type: 'SAVE_ERROR',
                    error: `Save failed: ${res.status} ${res.statusText} ${text}`,
                  },
                  '*'
                );
                return;
              }
              await res.json().catch(() => null);
              window.parent.postMessage({ type: 'SAVE_ACK' }, '*');
            } catch (err: any) {
              window.parent.postMessage(
                { type: 'SAVE_ERROR', error: err?.message || String(err) },
                '*'
              );
            }
          })();
          break;
        case 'PUBLISH':
          (async () => {
            try {
              const url = `${location.origin}/api/pages/home/publish`;
              const res = await fetch(url, {
                method: 'POST',
                credentials: 'same-origin',
                mode: 'cors',
              });
              if (!res.ok) {
                const text = await res.text().catch(() => '');
                window.parent.postMessage(
                  {
                    type: 'PUBLISH_ERROR',
                    error: `Publish failed: ${res.status} ${res.statusText} ${text}`,
                  },
                  '*'
                );
                return;
              }
              window.parent.postMessage({ type: 'PUBLISH_ACK' }, '*');
            } catch (err: any) {
              window.parent.postMessage(
                { type: 'PUBLISH_ERROR', error: err?.message || String(err) },
                '*'
              );
            }
          })();
          break;
        case 'ADD_COMPONENT':
          setComponents(c => [...c, data.payload]);
          break;
        case 'SET_ZOOM':
          if (typeof data.zoom === 'number') applyZoom(data.zoom);
          break;
        case 'SET_DEVICE':
          if (data.width) setDeviceWidth(data.width);
          break;
        default:
          break;
      }
    }
    window.addEventListener('message', onMessage);
    // notify parent when iframe is ready
    window.parent?.postMessage({ type: 'READY' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, [components]);

  // expose editable rendering
  return (
    <div className='max-w-6xl mx-auto px-4'>
      {components.map((c, idx) => {
        if (c.type === 'hero_banner') {
          return (
            <section key={idx} className='py-12 text-center'>
              <h1
                contentEditable
                suppressContentEditableWarning
                className='text-4xl font-bold'
                onBlur={e => {
                  const newTitle = e.currentTarget.textContent || '';
                  setComponents(prev =>
                    prev.map((p, i) =>
                      i === idx
                        ? {
                            ...p,
                            props: { ...(p.props || {}), title: newTitle },
                          }
                        : p
                    )
                  );
                }}
              >
                {c.props?.title || 'Hero Title'}
              </h1>
              <p
                contentEditable
                suppressContentEditableWarning
                className='mt-3 text-gray-600'
                onBlur={e => {
                  const newSub = e.currentTarget.textContent || '';
                  setComponents(prev =>
                    prev.map((p, i) =>
                      i === idx
                        ? {
                            ...p,
                            props: { ...(p.props || {}), subtitle: newSub },
                          }
                        : p
                    )
                  );
                }}
              >
                {c.props?.subtitle || 'Subtitle text'}
              </p>
              {c.props?.ctaText && (
                <a
                  href={c.props?.ctaHref || '#'}
                  className='inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded'
                >
                  {c.props?.ctaText}
                </a>
              )}
            </section>
          );
        }
        if (c.type === 'feature_card') {
          return (
            <div key={idx} className='p-4 bg-white rounded shadow my-4'>
              Feature Card
            </div>
          );
        }
        if (c.type === 'stats_counter') {
          return (
            <div key={idx} className='grid grid-cols-3 gap-4 my-8'>
              {[1, 2, 3].map(n => (
                <div key={n} className='p-4 bg-white rounded shadow'>
                  Stat {n}
                </div>
              ))}
            </div>
          );
        }
        return <div key={idx} />;
      })}
    </div>
  );
}
