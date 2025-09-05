import React, { useRef } from 'react';

export default function EditableWrapper({ id, children, editMode, onSelect, onStyleChange }) {
  const wrapperRef = useRef(null);
  const handleClick = (e) => {
    if (!editMode) return;
    e.stopPropagation();
    onSelect && onSelect(id);
  };

  // simple resize handler (bottom-right handle)
  const handleResizeMouseDown = (e) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const el = wrapperRef.current;
    if (!el) return;
    const startRect = el.getBoundingClientRect();
    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newW = Math.max(40, startRect.width + dx);
      const newH = Math.max(20, startRect.height + dy);
      onStyleChange && onStyleChange({ width: newW + 'px', height: newH + 'px' });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div ref={wrapperRef} className={`editable-wrapper ${editMode ? 'editor-selected' : ''}`} onClick={handleClick} style={{ position: 'relative' }}>
      {children}
      {editMode ? (
        <div onMouseDown={handleResizeMouseDown} style={{ position: 'absolute', right: 6, bottom: 6, width: 12, height: 12, background: 'rgba(0,0,0,0.6)', cursor: 'nwse-resize', borderRadius: 2 }} />
      ) : null}
    </div>
  );
}
