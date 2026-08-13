/**
 * modal.js — Modal dialog system
 */

window.Modal = (() => {
  const overlay = () => document.getElementById('modal-overlay');
  const content = () => document.getElementById('modal-content');

  function show(html, opts = {}) {
    const o = overlay();
    const c = content();
    if (!o || !c) return;

    if (opts.maxWidth) c.style.maxWidth = opts.maxWidth;
    else c.style.maxWidth = '';

    c.innerHTML = html;
    o.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Close on overlay click (if not prevented)
    if (!opts.preventClose) {
      o.onclick = (e) => { if (e.target === o) Modal.close(); };
    }

    // Close on Escape
    const escHandler = (e) => {
      if (e.key === 'Escape' && !opts.preventClose) {
        Modal.close();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Wire close buttons
    c.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => Modal.close());
    });

    return c;
  }

  return {
    show,

    close() {
      const o = overlay();
      if (o) o.classList.add('hidden');
      document.body.style.overflow = '';
    },

    /**
     * Confirmation dialog
     */
    confirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) {
      return new Promise(resolve => {
        const typeIcon = type === 'danger'
          ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
          : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

        const c = show(`
          <div class="modal-header"><div class="modal-title">${title}</div></div>
          <div class="modal-body">
            <div class="confirm-dialog-icon ${type}">${typeIcon}</div>
            <div class="confirm-dialog-title">${title}</div>
            <p class="confirm-dialog-desc">${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" id="modal-cancel">${cancelText}</button>
            <button class="btn-${type === 'danger' ? 'danger' : 'primary'}" id="modal-confirm">${confirmText}</button>
          </div>
        `, { preventClose: false, maxWidth: '400px' });

        c.querySelector('#modal-cancel').addEventListener('click', () => { Modal.close(); resolve(false); });
        c.querySelector('#modal-confirm').addEventListener('click', () => { Modal.close(); resolve(true); });
      });
    },

    /**
     * Input prompt dialog
     */
    prompt({ title, label, defaultValue = '', placeholder = '', confirmText = 'OK' }) {
      return new Promise(resolve => {
        const c = show(`
          <div class="modal-header">
            <div class="modal-title">${title}</div>
            <button class="modal-close" data-modal-close aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">${label}</label>
              <input id="modal-input" class="form-input" type="text" value="${defaultValue}" placeholder="${placeholder}" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" id="modal-cancel">Cancel</button>
            <button class="btn-primary" id="modal-confirm">${confirmText}</button>
          </div>
        `, { maxWidth: '400px' });

        const input = c.querySelector('#modal-input');
        input.focus(); input.select();

        const submit = () => {
          const val = input.value.trim();
          Modal.close();
          resolve(val || null);
        };

        c.querySelector('#modal-confirm').addEventListener('click', submit);
        c.querySelector('#modal-cancel').addEventListener('click', () => { Modal.close(); resolve(null); });
        input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      });
    }
  };
})();
