import React, { useState, useEffect, useRef } from 'react';
import Admin from 'layouts/Admin.js';
import Toolbar from 'components/Editor/Toolbar';
import Sidebar from 'components/Editor/Sidebar';
import DeviceControls from 'components/Editor/DeviceControls';
import PreviewLens from 'components/Editor/PreviewLens';
import { Messages, isEditorMessage, postToEditor } from '../lib/editor-protocol';
import { getComponentsLibrary } from '../lib/db';

export default function Editor() {
  const iframeRef = useRef(null);
  const [componentsLibrary, setComponentsLibrary] = useState([]);
  const [device, setDevice] = useState('desktop');
  useEffect(() => {
    setComponentsLibrary(getComponentsLibrary());
  }, []);

  useEffect(() => {
    const handler = (ev) => {
      if (!isEditorMessage(ev)) return;
      // handle messages from iframe
      const { type, payload } = ev.data;
      console.log('Editor received', type, payload);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const saveDraft = () => {
    postToEditor(iframeRef.current.contentWindow, Messages.SAVE_DRAFT, {});
  };
  const publish = () => {
    postToEditor(iframeRef.current.contentWindow, Messages.PUBLISH, {});
  };
  const undo = () => postToEditor(iframeRef.current.contentWindow, Messages.UNDO, {});
  const redo = () => postToEditor(iframeRef.current.contentWindow, Messages.REDO, {});
  const onAdd = (c) => postToEditor(iframeRef.current.contentWindow, Messages.ADD_COMPONENT, { component: c });

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar components={componentsLibrary} onAdd={onAdd} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Toolbar onSave={saveDraft} onPublish={publish} onUndo={undo} onRedo={redo} />
        <DeviceControls device={device} setDevice={setDevice} />
        <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
          <iframe ref={iframeRef} className="editor-iframe" src="/?edit=1&mode=draft" />
          <PreviewLens />
        </div>
      </div>
    </div>
  );
}

Editor.layout = Admin;
