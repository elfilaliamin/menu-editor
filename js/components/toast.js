/**
 * toast.js — Toast notification system
 */

window.Toast = (() => {
  function getContainer() {
    return document.getElementById('toast-container');
  }

  function iconSvg(type) {
    const icons = {
      success: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
      error:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    };
    return icons[type] || icons.info;
  }

  return {
    /**
     * Show a toast notification
     * @param {string} message
     * @param {'success'|'error'|'warning'|'info'} type
     * @param {number} duration ms (default 3500)
     */
    show(message, type = 'info', duration = 3500) {
      const container = getContainer();
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div class="toast-icon">${iconSvg(type)}</div>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      const remove = () => {
        toast.classList.add('leaving');
        setTimeout(() => toast.remove(), 280);
      };

      toast.querySelector('.toast-close').addEventListener('click', remove);
      container.appendChild(toast);

      if (duration > 0) setTimeout(remove, duration);
      return remove;
    },

    success(msg, duration)  { return this.show(msg, 'success', duration); },
    error(msg, duration)    { return this.show(msg, 'error', duration); },
    warning(msg, duration)  { return this.show(msg, 'warning', duration); },
    info(msg, duration)     { return this.show(msg, 'info', duration); }
  };
})();
