import React from 'react';

export default function Toolbar({ onSave, onPublish, onUndo, onRedo, onExport, onImport, onTogglePalette, onToggleFont, ready=true }) {
  return (
    <div className="d-flex align-items-center p-2 editor-toolbar">
      <button className="btn btn-sm btn-secondary mr-2" onClick={onSave} disabled={!ready}>Save draft</button>
      <button className="btn btn-sm btn-primary mr-2" onClick={onPublish} disabled={!ready}>Publish</button>
      <button className="btn btn-sm btn-light mr-2" onClick={onUndo} disabled={!ready}>Undo</button>
      <button className="btn btn-sm btn-light mr-2" onClick={onRedo} disabled={!ready}>Redo</button>
      <button className="btn btn-sm btn-outline-light mr-2" onClick={onExport} disabled={!ready}>Export JSON</button>
      <label className={`btn btn-sm btn-outline-light mr-2 mb-0 ${!ready? 'disabled' : ''}`}>
        Import JSON
        <input type="file" accept="application/json" className="file-input-hidden" onChange={onImport} disabled={!ready} />
      </label>
      <button className="btn btn-sm btn-outline-light mr-2" onClick={onTogglePalette} disabled={!ready}>Palette</button>
      <button className="btn btn-sm btn-outline-light mr-2" onClick={onToggleFont} disabled={!ready}>Fonts</button>
      <div className="ml-auto text-white">Visual Editor</div>
    </div>
  );
}
