import React from 'react';
import { postToEditor, Messages } from '../../lib/editor-protocol';

export default function EditableImage({ id, src, alt, editMode }) {
  const onClickUpload = async () => {
    if (!editMode) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        // send to API
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl, filename: file.name })
          });
          const json = await res.json();
          if (json.ok) {
            postToEditor(window.parent, Messages.UPDATE_FIELD, { id, field: 'src', value: json.url });
          }
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <img src={src} alt={alt} style={{ maxWidth: '100%', cursor: editMode ? 'pointer' : 'auto' }} onClick={onClickUpload} />
    </div>
  );
}
