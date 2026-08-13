/**
 * restaurantPanel.js — Restaurant Information Editor Panel
 */

window.RestaurantPanel = (() => {
  const PANEL_ID = 'panel-restaurant';

  function getContainer() {
    return document.getElementById(PANEL_ID);
  }

  function render() {
    const state = Store.getState();
    const r = state.restaurant;
    const container = getContainer();
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">Restaurant Info</div>
        <div class="panel-desc">Set up your restaurant's identity and contact information.</div>
      </div>

      <!-- Basic Info -->
      <div class="info-section-header">
        <div class="info-section-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        </div>
        <div class="info-section-label">Basic Information</div>
      </div>
      <div class="form-group">
        <label class="form-label">Restaurant Name <span class="required">*</span></label>
        <input id="rest-name" class="form-input" type="text" value="${esc(r.name)}" placeholder="Your restaurant name" />
        <div class="form-error">Restaurant name is required</div>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea id="rest-desc" class="form-textarea" placeholder="A short description of your restaurant...">${esc(r.description || '')}</textarea>
      </div>

      <!-- Logo -->
      <div class="info-section-header">
        <div class="info-section-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </div>
        <div class="info-section-label">Logo & Cover Image</div>
      </div>
      <div class="form-group">
        <div id="logo-picker" data-field="logo"></div>
      </div>
      <div class="form-group">
        <div id="cover-picker" data-field="cover"></div>
      </div>

      <!-- Contact -->
      <div class="info-section-header">
        <div class="info-section-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l1.36-1.36a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <div class="info-section-label">Contact Details</div>
      </div>
      <div class="form-group">
        <label class="form-label">Address</label>
        <input id="rest-address" class="form-input" type="text" value="${esc(r.address || '')}" placeholder="123 Main Street, City" />
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Phone</label>
          <input id="rest-phone" class="form-input" type="tel" value="${esc(r.phone || '')}" placeholder="+212 522 xxx xxx" />
        </div>
        <div class="form-group">
          <label class="form-label">WhatsApp</label>
          <input id="rest-whatsapp" class="form-input" type="tel" value="${esc(r.whatsapp || '')}" placeholder="+212 6xx xxx xxx" />
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Instagram</label>
          <input id="rest-instagram" class="form-input" type="text" value="${esc(r.instagram || '')}" placeholder="@yourhandle" />
        </div>
        <div class="form-group">
          <label class="form-label">Facebook</label>
          <input id="rest-facebook" class="form-input" type="text" value="${esc(r.facebook || '')}" placeholder="facebook.com/yourpage" />
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Website</label>
          <input id="rest-website" class="form-input" type="url" value="${esc(r.website || '')}" placeholder="https://..." />
        </div>
        <div class="form-group">
          <label class="form-label">Opening Hours</label>
          <input id="rest-hours" class="form-input" type="text" value="${esc(r.hours || '')}" placeholder="Mon–Fri: 9:00–22:00" />
        </div>
      </div>

      <!-- Multi-language -->
      <div class="info-section-header" style="margin-top:16px">
        <div class="info-section-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div class="info-section-label">Name Translations</div>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div class="form-hint" style="margin-bottom:12px">Add translations for the restaurant name and description. Languages must be enabled in Menu Settings.</div>
        <div class="form-group">
          <label class="form-label">🇫🇷 French Name</label>
          <input id="rest-name-fr" class="form-input" type="text" value="${esc(r.translations?.fr?.name || '')}" placeholder="French name..." />
        </div>
        <div class="form-group">
          <label class="form-label">🇸🇦 Arabic Name (right-to-left)</label>
          <input id="rest-name-ar" class="form-input" type="text" dir="rtl" value="${esc(r.translations?.ar?.name || '')}" placeholder="الاسم بالعربية" />
        </div>
      </div>
    `;

    bindEvents();
    initImagePickers(r);
  }

  function esc(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function initImagePickers(r) {
    const logoPicker = document.getElementById('logo-picker');
    if (logoPicker) {
      ImagePicker.render(logoPicker, {
        imageRef: r.logo,
        label: 'Logo (Square)',
        aspectRatio: 'square',
        onChange: (imageRef) => {
          Store.updateRestaurant({ logo: imageRef });
        }
      });
    }

    const coverPicker = document.getElementById('cover-picker');
    if (coverPicker) {
      ImagePicker.render(coverPicker, {
        imageRef: r.cover,
        label: 'Cover Image (Wide)',
        aspectRatio: '16/9',
        onChange: (imageRef) => {
          Store.updateRestaurant({ cover: imageRef });
        }
      });
    }
  }

  function bindEvents() {
    // Debounced field updates
    function bindField(id, field, opts = {}) {
      const el = document.getElementById(id);
      if (!el) return;
      const delay = opts.delay !== undefined ? opts.delay : 300;
      let timer;
      const event = opts.event || 'input';
      el.addEventListener(event, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          let value = el.value;
          if (opts.trim !== false) value = value.trim();
          const patch = {};

          if (opts.nested) {
            // nested translation field
            const state = Store.getState();
            const translations = JSON.parse(JSON.stringify(state.restaurant.translations || {}));
            if (!translations[opts.nested]) translations[opts.nested] = {};
            translations[opts.nested][field] = value;
            Store.updateRestaurant({ translations });
          } else {
            patch[field] = value;
            Store.updateRestaurant(patch);
          }

          // Update breadcrumb project name if restaurant name changed
          if (field === 'name') {
            const el1 = document.getElementById('current-project-name');
            const el2 = document.getElementById('bc-project');
            if (el1) el1.textContent = value || 'My Menu';
            if (el2) el2.textContent = value || 'My Menu';
          }

          // Validate required
          if (opts.required) {
            const group = el.closest('.form-group');
            if (group) group.classList.toggle('has-error', !value);
          }
        }, delay);
      });
    }

    bindField('rest-name',      'name',        { required: true });
    bindField('rest-desc',      'description');
    bindField('rest-address',   'address');
    bindField('rest-phone',     'phone');
    bindField('rest-whatsapp',  'whatsapp');
    bindField('rest-instagram', 'instagram');
    bindField('rest-facebook',  'facebook');
    bindField('rest-website',   'website');
    bindField('rest-hours',     'hours');
    bindField('rest-name-fr',   'name',        { nested: 'fr' });
    bindField('rest-name-ar',   'name',        { nested: 'ar' });
  }

  // Subscribe to re-render on relevant state changes
  Store.subscribe(() => {
    const container = getContainer();
    if (!container || !container.classList.contains('active')) return;
    // Only re-render image pickers if needed (to avoid cursor jump)
    // Full re-render happens on panel activation
  });

  return {
    render,
    activate() {
      render();
    }
  };
})();
