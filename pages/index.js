import React, { useEffect, useState, useRef } from 'react';
import { HistoryStack } from '../lib/editor-history';
import EditableText from 'components/Editable/EditableText';
import EditableImage from 'components/Editable/EditableImage';
import EditableWrapper from 'components/Editable/EditableWrapper';
import { isEditorMessage, Messages, postToEditor } from '../lib/editor-protocol';

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
    const content = (() => {
      switch(c.type) {
        case 'hero_banner':
          return (
            <>
              {c.props.image ? <EditableImage id={c.id} src={c.props.image} alt={c.props.title} editMode={editModeRef.current} /> : null}
              <h1>{c.props.title}</h1>
              <p>{c.props.subtitle}</p>
              <a className="btn btn-primary" href={c.props.buttonHref}>{c.props.buttonText}</a>
            </>
          );
        case 'text_block':
          return <EditableText id={c.id} text={c.props.text} editMode={editModeRef.current} />;
        case 'image':
          return <EditableImage id={c.id} src={c.props.src} alt={c.props.alt} editMode={editModeRef.current} />;
        default:
          return <div>{JSON.stringify(c)}</div>;
      }
    })();

    return (
      <div key={c.id} draggable={editModeRef.current} onDragStart={(e)=>onDragStart(e, idx)} onDragOver={onDragOver} onDrop={(e)=>onDrop(e, idx)}>
        <EditableWrapper id={c.id} editMode={editModeRef.current}>
          {content}
        </EditableWrapper>
      </div>
    );
  };

  return (
    <div>
      {page.components.map((c, idx) => renderComponent(c, idx))}
    </div>
  );
}
