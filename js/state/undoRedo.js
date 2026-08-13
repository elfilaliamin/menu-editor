/**
 * undoRedo.js — Undo/Redo history management
 */

window.UndoRedo = (() => {
  const MAX_HISTORY = 50;
  let _history = [];   // past states
  let _future  = [];   // redo stack

  function updateButtons() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');
    if (btnUndo) btnUndo.disabled = _history.length === 0;
    if (btnRedo) btnRedo.disabled = _future.length === 0;
  }

  const undoRedo = {
    /**
     * Push current state to history (called before mutation)
     */
    push(prevState) {
      _history.push(prevState);
      if (_history.length > MAX_HISTORY) _history.shift();
      _future = []; // clear redo when new action happens
      updateButtons();
    },

    /**
     * Undo last action
     */
    undo() {
      if (_history.length === 0) return;
      const current = Store.getState();
      _future.push(current);
      const prev = _history.pop();
      Store.replace(prev);
      updateButtons();
      Toast.show('Undo', 'info', 1500);
    },

    /**
     * Redo last undone action
     */
    redo() {
      if (_future.length === 0) return;
      const current = Store.getState();
      _history.push(current);
      const next = _future.pop();
      Store.replace(next);
      updateButtons();
      Toast.show('Redo', 'info', 1500);
    },

    /**
     * Clear history (on new project load)
     */
    clear() {
      _history = [];
      _future  = [];
      updateButtons();
    },

    canUndo() { return _history.length > 0; },
    canRedo() { return _future.length > 0; }
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const ctrl = isMac ? e.metaKey : e.ctrlKey;
    if (!ctrl) return;

    // Don't intercept in inputs/textareas
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

    if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoRedo.undo();
    } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
      e.preventDefault();
      undoRedo.redo();
    }
  });

  return undoRedo;
})();
