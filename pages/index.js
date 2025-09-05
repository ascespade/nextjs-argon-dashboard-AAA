import React, { useEffect, useState, useRef } from 'react';
import { HistoryStack } from '../lib/editor-history';
import EditableText from 'components/Editable/EditableText';
import EditableImage from 'components/Editable/EditableImage';
import EditableWrapper from 'components/Editable/EditableWrapper';
import { isEditorMessage, Messages, postToEditor } from '../lib/editor-protocol';

import ErrorBoundary from 'components/ErrorBoundary';

export default function Index() {
  const [page, setPage] = useState({ components: [] });
  const pageRef = useRef(page);
  const editModeRef = useRef(false);
  const history = useRef(new HistoryStack(100));
  useEffect(() => { pageRef.current = page; }, [page]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const edit = params.get('edit') === '1';
    editModeRef.current = edit;
    // load published or draft based on mode
    const mode = edit ? 'draft' : 'published';
    fetch(`/api/pages/home?mode=${mode}`).then(r=>r.json()).then(json=>{
      if (json && json.ok) {
        const initial = { components: json.page.components || [] };
        setPage(initial);
        history.current.push(initial);
      }
    }).catch(()=>{});

    const handler = (ev) => {
      if (!isEditorMessage(ev)) return;
      const { type, payload } = ev.data;
      if (type === Messages.INIT) {
        // editor requests initial page state
        postToEditor(window.parent, Messages.SYNC_STATE, { page: pageRef.current });
        return;
      }
      if (type === Messages.UPDATE_FIELD) {
        const { id, field, value } = payload;
        setPage(prev => {
          const comps = prev.components.map(c => c.id === id ? { ...c, props: { ...c.props, [field]: value } } : c );
          const next = { ...prev, components: comps };
          history.current.push(next);
          pageRef.current = next;
          return next;
        });
      }
      if (type === Messages.ADD_COMPONENT) {
        const { component } = payload;
        setPage(prev => {
          const next = { ...prev, components: [...prev.components, { id: component.id || `c-${Date.now()}`, type: component.type, props: component.props || {} } ] };
          history.current.push(next);
          pageRef.current = next;
          return next;
        });
      }
      if (type === Messages.REORDER_COMPONENT) {
        const { from, to } = payload;
        setPage(prev => {
          const comps = [...prev.components];
          if (from < 0 || to < 0 || from >= comps.length || to >= comps.length) return prev;
          const [item] = comps.splice(from,1);
          comps.splice(to,0,item);
          const next = { ...prev, components: comps };
          history.current.push(next);
          pageRef.current = next;
          return next;
        });
      }
      if (type === Messages.IMPORT_PAGE) {
        const { page: imported } = payload;
        if (imported && imported.components) {
          const next = { components: imported.components };
          setPage(next);
          history.current.push(next);
          pageRef.current = next;
        }
      }
      if (type === Messages.SAVE_DRAFT) {
        // save draft server-side with current state
        fetch('/api/pages/home/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageRef.current) }).then(()=>{
          postToEditor(window.parent, Messages.SYNC_STATE, { ok: true });
        }).catch(()=>{
          postToEditor(window.parent, Messages.SYNC_STATE, { ok: false });
        });
      }
      if (type === Messages.PUBLISH) {
        fetch('/api/pages/home/publish', { method: 'POST' }).then(()=>{
          postToEditor(window.parent, Messages.SYNC_STATE, { ok: true });
        }).catch(()=>{
          postToEditor(window.parent, Messages.SYNC_STATE, { ok: false });
        });
      }
      if (type === Messages.UNDO) {
        const prev = history.current.undo();
        if (prev) {
          setPage(prev);
          pageRef.current = prev;
          postToEditor(window.parent, Messages.SYNC_STATE, { ok: true });
        }
      }
      if (type === Messages.REDO) {
        const nextState = history.current.redo();
        if (nextState) {
          setPage(nextState);
          pageRef.current = nextState;
          postToEditor(window.parent, Messages.SYNC_STATE, { ok: true });
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // autosave draft when in edit mode
  useEffect(()=>{
    let timer = null;
    const check = () => {
      const params = new URLSearchParams(window.location.search);
      const edit = params.get('edit') === '1';
      if (!edit) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(()=>{
        fetch('/api/pages/home/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pageRef.current) }).catch(()=>{});
      }, 1000);
    };
    check();
    return ()=>{ if (timer) clearTimeout(timer); };
  }, [page]);

  // Drag & drop handlers for reordering
  const onDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDrop = (e, toIndex) => {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(from)) return;
    // apply reorder
    const comps = [...pageRef.current.components];
    const [item] = comps.splice(from,1);
    comps.splice(toIndex,0,item);
    const next = { components: comps };
    setPage(next);
    history.current.push(next);
    pageRef.current = next;
  };
  const onDragOver = (e) => e.preventDefault();

  const renderComponent = (c, idx) => {
    const commonProps = { id: c.id, editMode: editModeRef.current };
    const content = (() => {
      switch(c.type) {
        case 'hero_banner':
          return (
            <section className="bg-white py-12">
              <div className="container mx-auto px-4 md:px-8 grid gap-8 md:grid-cols-2 items-center">
                <div>
                  {c.props.badge ? <div className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded mb-3 text-sm">{c.props.badge}</div> : null}
                  <h1 className="text-3xl md:text-5xl font-bold mb-4"><EditableText id={c.id + '-title'} text={c.props.title} editMode={editModeRef.current} /></h1>
                  <p className="text-slate-700 mb-6"><EditableText id={c.id + '-subtitle'} text={c.props.subtitle} editMode={editModeRef.current} /></p>
                  <div className="flex gap-3">
                    <a href={c.props.buttonHref || '#'} className="px-4 py-2 bg-indigo-600 text-white rounded"><EditableText id={c.id + '-btn'} text={c.props.buttonText} editMode={editModeRef.current} /></a>
                    <a href="#" className="px-4 py-2 border rounded text-slate-700">Learn more</a>
                  </div>
                </div>
                <div className="flex justify-center">
                  {c.props.image ? <EditableImage id={c.id + '-img'} src={c.props.image} alt={c.props.title} editMode={editModeRef.current} /> : <div className="w-80 h-48 bg-slate-100" />}
                </div>
              </div>
            </section>
          );
        case 'features':
          return (
            <section className="py-12">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid gap-6 md:grid-cols-3">
                  {(c.props.items||[]).map(item => (
                    <div key={item.id} className="p-6 bg-white rounded shadow-sm">
                      <div className="text-indigo-600 text-2xl mb-3"><i className={`${item.icon}`}></i></div>
                      <h3 className="font-semibold mb-2"><EditableText id={`${c.id}-${item.id}-title`} text={item.title} editMode={editModeRef.current} /></h3>
                      <p className="text-slate-600"><EditableText id={`${c.id}-${item.id}-text`} text={item.text} editMode={editModeRef.current} /></p>
                      <div className="mt-4">
                        <a className="text-indigo-600 text-sm" href="#">Learn more →</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        case 'stats_counter':
          return (
            <section className="py-8 bg-slate-50">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  {(c.props.items||[]).map(it => (
                    <div key={it.id}>
                      <div className="text-3xl font-bold"><EditableText id={`${c.id}-${it.id}-value`} text={it.value} editMode={editModeRef.current} /></div>
                      <div className="text-sm text-slate-600"><EditableText id={`${c.id}-${it.id}-label`} text={it.label} editMode={editModeRef.current} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        case 'gallery':
          return (
            <section className="py-12">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {(c.props.images||[]).map((src, i) => (
                    <div key={i} className="overflow-hidden rounded">
                      <img src={src} alt={`Gallery ${i}`} className="w-full h-48 object-cover cursor-pointer" onClick={() => window.open(src, '_blank')} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        case 'testimonials':
          return (
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4 md:px-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {(c.props.items||[]).map(it => (
                    <div key={it.id} className="p-6 border rounded">
                      <div className="flex items-center gap-4 mb-3">
                        <img src={it.avatar} alt={it.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold">{it.name}</div>
                          <div className="text-sm text-slate-500">{it.role}</div>
                        </div>
                      </div>
                      <div className="text-slate-700"><EditableText id={`${c.id}-${it.id}-quote`} text={it.quote} editMode={editModeRef.current} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        case 'cta_section':
          return (
            <section className="py-12">
              <div className="container mx-auto px-4 md:px-8">
                <div className="bg-indigo-600 text-white rounded p-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2"><EditableText id={`${c.id}-title`} text={c.props.title} editMode={editModeRef.current} /></h3>
                    <p className="text-sm"><EditableText id={`${c.id}-subtitle`} text={c.props.subtitle || ''} editMode={editModeRef.current} /></p>
                  </div>
                  <div>
                    <a href={c.props.buttonHref || '#'} className="px-4 py-2 bg-white text-indigo-600 rounded"><EditableText id={`${c.id}-btn`} text={c.props.buttonText} editMode={editModeRef.current} /></a>
                  </div>
                </div>
              </div>
            </section>
          );
        case 'faq':
          return (
            <section className="py-12 bg-slate-50">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-2xl mx-auto">
                  {(c.props.items||[]).map(it => (
                    <details key={it.id} className="mb-3 border rounded">
                      <summary className="px-4 py-3 cursor-pointer font-medium">{it.q}</summary>
                      <div className="px-4 py-3 text-slate-700"><EditableText id={`${c.id}-${it.id}-a`} text={it.a} editMode={editModeRef.current} /></div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          );
        case 'text_block':
          return (
            <section className="py-6">
              <div className="container mx-auto px-4 md:px-8"><EditableText id={c.id} text={c.props.text} editMode={editModeRef.current} /></div>
            </section>
          );
        default:
          return <pre className="p-4 bg-white rounded">{JSON.stringify(c, null, 2)}</pre>;
      }
    })();

    return (
      <div key={c.id} draggable={editModeRef.current} onDragStart={(e)=>onDragStart(e, idx)} onDragOver={onDragOver} onDrop={(e)=>onDrop(e, idx)} style={c.style || {}}>
        <EditableWrapper id={c.id} editMode={editModeRef.current} onStyleChange={(style)=>{
          setPage(prev=>{
            const comps = prev.components.map(x=> x.id===c.id ? { ...x, style: { ...(x.style||{}), ...style } } : x);
            const next = { ...prev, components: comps };
            history.current.push(next);
            pageRef.current = next;
            return next;
          });
        }}>
          {content}
        </EditableWrapper>
      </div>
    );
  };

  const showFallback = !editModeRef.current && (!page || !page.components || page.components.length === 0);

  return (
    <ErrorBoundary>
      <div>
        {showFallback ? (
          <section className="section section-shaped pt-5">
            <div className="container py-md">
              <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                  <h1 className="display-3">Welcome to Argon Editable</h1>
                  <p className="lead">The homepage has no published content yet. Sign in to the dashboard to create content.</p>
                  <a href="/admin/dashboard" className="btn btn-primary">Go to Dashboard</a>
                </div>
              </div>
            </div>
          </section>
        ) : (
          page.components.map((c, idx) => renderComponent(c, idx))
        )}
      </div>
    </ErrorBoundary>
  );
}
