import React from 'react';

export default function Sidebar({ components, onAdd }) {
  return (
    <div className="p-3 editor-sidebar" style={{ width: 260 }}>
      <h6>Components</h6>
      <div>
        {components.map(c => (
          <div key={c.id} className="mb-2">
            <button className="btn btn-block btn-sm btn-outline-primary" onClick={() => onAdd(c)}>{c.type}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
