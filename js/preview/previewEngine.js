/**
 * previewEngine.js — Live preview generator
 * Renders the menu preview inside the iframe in real time.
 */

window.PreviewEngine = (() => {
  let _debounceTimer = null;
  let _currentMode = 'desktop';

  function getViewport() {
    return document.getElementById('preview-viewport');
  }

  function getDevice() {
    return document.getElementById('preview-device');
  }

  /**
   * Refresh the preview immediately
   */
  function refresh() {
    const viewport = getViewport();
    if (!viewport) return;

    const menuData = Store.getState();
    MenuRenderer.renderToContainer(viewport, menuData);
  }

  /**
   * Schedule a debounced refresh
   */
  function scheduleRefresh(ms = 300) {
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(refresh, ms);

    // Show refresh indicator
    const indicator = document.querySelector('.preview-refresh');
    if (indicator) {
      indicator.classList.add('show');
      setTimeout(() => indicator.classList.remove('show'), 500);
    }
  }

  /**
   * Set preview device mode
   */
  function setMode(mode) {
    _currentMode = mode;
    const device = getDevice();
    if (!device) return;
    device.dataset.mode = mode;

    // Update mode buttons
    document.querySelectorAll('.preview-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  /**
   * Initialize the preview engine
   */
  function init() {
    // Subscribe to store changes
    Store.subscribe(() => {
      scheduleRefresh();
    });

    // Preview mode switcher
    document.querySelectorAll('.preview-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setMode(btn.dataset.mode);
      });
    });

    // Default mode
    setMode('desktop');

    // Initial render
    refresh();
  }

  return { init, refresh, scheduleRefresh, setMode };
})();
