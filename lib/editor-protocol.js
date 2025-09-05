export const Messages = {
  INIT: 'INIT',
  UPDATE_FIELD: 'UPDATE_FIELD',
  ADD_COMPONENT: 'ADD_COMPONENT',
  REMOVE_COMPONENT: 'REMOVE_COMPONENT',
  APPLY_STYLE: 'APPLY_STYLE',
  REORDER_COMPONENT: 'REORDER_COMPONENT',
  IMPORT_PAGE: 'IMPORT_PAGE',
  SAVE_DRAFT: 'SAVE_DRAFT',
  PUBLISH: 'PUBLISH',
  UNDO: 'UNDO',
  REDO: 'REDO',
  SYNC_STATE: 'SYNC_STATE'
};

export function postToEditor(win, type, payload = {}) {
  if (!win || !win.postMessage) return;
  win.postMessage({ __editor__: true, type, payload }, '*');
}

export function isEditorMessage(ev) {
  const d = ev && ev.data;
  return d && d.__editor__ && typeof d.type === 'string';
}
