/**
 * autoSave.js — Debounced auto-save to LocalStorage
 */

window.AutoSave = (() => {
  const DEBOUNCE_MS = 1200;
  let _timer = null;
  let _statusEl = null;

  function getStatusEl() {
    if (!_statusEl) _statusEl = document.getElementById('save-status');
    return _statusEl;
  }

  function setStatus(text, cls = '') {
    const el = getStatusEl();
    if (!el) return;
    el.textContent = text;
    el.className = 'save-status ' + cls;
  }

  const autoSave = {
    /**
     * Schedule a save (debounced)
     */
    schedule() {
      setStatus('Saving...', 'saving');
      clearTimeout(_timer);
      _timer = setTimeout(() => {
        autoSave.save();
      }, DEBOUNCE_MS);
    },

    /**
     * Save current project immediately
     */
    save() {
      try {
        const projectId = Store.getProjectId();
        if (!projectId) return;
        Projects.saveProject(projectId, Store.getState());
        setStatus('Saved ✓', '');
      } catch (e) {
        console.error('AutoSave error:', e);
        setStatus('Save failed', 'error');
      }
    },

    /**
     * Force save now
     */
    flush() {
      clearTimeout(_timer);
      this.save();
    }
  };

  return autoSave;
})();
