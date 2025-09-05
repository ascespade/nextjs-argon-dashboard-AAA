import React from 'react';

export default function Toolbar({ onSave, onPublish, onUndo, onRedo }) {
  return (
    <div className="d-flex align-items-center p-2 editor-toolbar">
      <button className="btn btn-sm btn-secondary mr-2" onClick={onSave}>Save draft</button>
      <button className="btn btn-sm btn-primary mr-2" onClick={onPublish}>Publish</button>
      <button className="btn btn-sm btn-light mr-2" onClick={onUndo}>Undo</button>
      <button className="btn btn-sm btn-light mr-2" onClick={onRedo}>Redo</button>
      <div className="ml-auto text-white">Visual Editor</div>
    </div>
  );
}
