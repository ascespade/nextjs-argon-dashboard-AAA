import React from 'react';

export default function DeviceControls({ device, setDevice }) {
  return (
    <div className="editor-device-controls">
      <button className={`btn btn-sm ${device==='desktop'?'btn-primary':'btn-outline-secondary'}`} onClick={()=>setDevice('desktop')}>Desktop</button>
      <button className={`btn btn-sm ${device==='tablet'?'btn-primary':'btn-outline-secondary'}`} onClick={()=>setDevice('tablet')}>Tablet</button>
      <button className={`btn btn-sm ${device==='mobile'?'btn-primary':'btn-outline-secondary'}`} onClick={()=>setDevice('mobile')}>Mobile</button>
    </div>
  );
}
