import React from 'react';

export default function Sidebar({ components, onAdd }) {
  return (
    <aside className="editor-sidebar-panel editor-sidebar p-3">
      <h6 className="editor-sidebar-title">Components</h6>
      <div>
        {components.map(c => (
          <div key={c.id} className="mb-2">
            <button className="btn btn-block btn-sm btn-outline-primary" onClick={() => onAdd(c)}>{c.type}</button>
          </div>
        ))}
      </div>
    </aside>
  );
}
