import React from 'react';

export default function EditableWrapper({ id, children, editMode, onSelect }) {
  const handleClick = (e) => {
    if (!editMode) return;
    e.stopPropagation();
    onSelect && onSelect(id);
  };
  return (
    <div className={`editable-wrapper ${editMode ? 'editor-selected' : ''}`} onClick={handleClick}>
      {children}
    </div>
  );
}
