import React from 'react';

export default function PreviewLens() {
  return (
    <div style={{ position: 'absolute', right: 12, bottom: 12, width: 140, height: 84, background: 'rgba(0,0,0,.6)', color: '#fff', borderRadius: 6, padding: 8 }}>
      <div style={{ fontSize: 12 }}>Preview</div>
      <div style={{ fontSize: 10, opacity: .9 }}>Mini map</div>
    </div>
  );
}
