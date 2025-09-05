import React, { useEffect, useRef } from 'react';
import { postToEditor, Messages } from '../../lib/editor-protocol';

export default function EditableText({ id, text, editMode }) {
  const ref = useRef(null);
  useEffect(() => {
    if (editMode && ref.current) {
      ref.current.setAttribute('contenteditable', 'true');
    } else if (ref.current) {
      ref.current.removeAttribute('contenteditable');
    }
  }, [editMode]);

  const handleInput = () => {
    const value = ref.current ? ref.current.innerText : '';
    postToEditor(window.parent, Messages.UPDATE_FIELD, { id, field: 'text', value });
  };

  return (
    <p ref={ref} onInput={editMode ? handleInput : undefined} className="mb-3">
      {text}
    </p>
  );
}
