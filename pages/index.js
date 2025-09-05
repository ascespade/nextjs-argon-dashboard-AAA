import React, { useEffect, useState } from 'react';
import { getPage, saveDraft } from '../lib/db';
import EditableText from 'components/Editable/EditableText';
import EditableImage from 'components/Editable/EditableImage';
import EditableWrapper from 'components/Editable/EditableWrapper';
import { isEditorMessage, Messages, postToEditor } from '../lib/editor-protocol';

export default function Index() {
  const [page, setPage] = useState({ components: [] });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const edit = params.get('edit') === '1';
    setEditMode(edit);
    // load published or draft based on mode
    const mode = edit ? 'draft' : 'published';
    fetch(`/api/pages/home?mode=${mode}`).then(r=>r.json()).then(json=>{
      if (json && json.ok) setPage({ components: json.page.components });
    }).catch(()=>{});

    const handler = (ev) => {
      if (!isEditorMessage(ev)) return;
      const { type, payload } = ev.data;
      if (type === Messages.UPDATE_FIELD) {
        const { id, field, value } = payload;
        setPage(prev => {
          const comps = prev.components.map(c => c.id === id ? { ...c, props: { ...c.props, [field]: value } } : c );
          return { ...prev, components: comps };
        });
      }
      if (type === Messages.ADD_COMPONENT) {
        const { component } = payload;
        setPage(prev => ({ ...prev, components: [...prev.components, { id: component.id || `c-${Date.now()}`, type: component.type, props: component.props || {} } ] }));
      }
      if (type === Messages.SAVE_DRAFT) {
        // save draft server-side
        fetch('/api/pages/home/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(page) }).then(()=>{
          postToEditor(window.parent, Messages.SYNC_STATE, { ok: true });
        }).catch(()=>{});
      }
      if (type === Messages.PUBLISH) {
        fetch('/api/pages/home/publish', { method: 'POST' }).then(()=>{
          postToEditor(window.parent, Messages.SYNC_STATE, { ok: true });
        }).catch(()=>{});
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(()=>{
    // autosave draft when in edit mode
    if (!editMode) return;
    const t = setTimeout(()=>{
      fetch('/api/pages/home/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(page) }).catch(()=>{});
    }, 1000);
    return ()=>clearTimeout(t);
  }, [page, editMode]);

  const renderComponent = (c) => {
    switch(c.type) {
      case 'hero_banner':
        return (
          <EditableWrapper key={c.id} id={c.id} editMode={editMode}>
            {c.props.image ? <EditableImage id={c.id} src={c.props.image} alt={c.props.title} editMode={editMode} /> : null}
            <h1>{c.props.title}</h1>
            <p>{c.props.subtitle}</p>
            <a className="btn btn-primary" href={c.props.buttonHref}>{c.props.buttonText}</a>
          </EditableWrapper>
        );
      case 'text_block':
        return (
          <EditableWrapper key={c.id} id={c.id} editMode={editMode}>
            <EditableText id={c.id} text={c.props.text} editMode={editMode} />
          </EditableWrapper>
        );
      case 'image':
        return (
          <EditableWrapper key={c.id} id={c.id} editMode={editMode}>
            <EditableImage id={c.id} src={c.props.src} alt={c.props.alt} editMode={editMode} />
          </EditableWrapper>
        );
      default:
        return <div key={c.id}>{JSON.stringify(c)}</div>;
    }
  };

  return (
    <div>
      {page.components.map(renderComponent)}
      {editMode ? <div style={{position:'fixed',right:12,bottom:12}}><small className="text-muted">Editing mode</small></div> : null}
    </div>
  );
}
