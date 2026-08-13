/**
 * appearancePanel.js — Theme & Appearance Customization Panel
 */

window.AppearancePanel = (() => {
  const PANEL_ID = 'panel-appearance';

  function getContainer() {
    return document.getElementById(PANEL_ID);
  }

  const FONTS = [
    { id: 'Inter',           name: 'Inter',           sample: 'Modern & clean' },
    { id: 'DM Sans',         name: 'DM Sans',         sample: 'Friendly & clear' },
    { id: 'Playfair Display',name: 'Playfair Display', sample: 'Elegant & classic' },
    { id: 'System',          name: 'System UI',        sample: 'Native & fast' }
  ];

  const LAYOUTS = [
    { id: 'list', label: 'List', icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
    { id: 'grid', label: 'Grid', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' },
    { id: 'compact', label: 'Compact', icon: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>' }
  ];

  const RADII = ['none', 'sm', 'md', 'lg', 'xl'];
  const IMAGE_SHAPES = [
    { id: 'square',  label: 'Square' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'circle',  label: 'Circle' }
  ];

  function renderThemePreview(theme) {
    const p = theme.preview;
    return `
      <div class="theme-preview" style="background:${p.cardBg}">
        <div class="theme-preview-header" style="background:${p.headerBg}"></div>
        <div class="theme-preview-card" style="background:${p.cardBg}">
          <div class="theme-preview-dot" style="background:${p.accent}"></div>
          <div class="theme-preview-lines">
            <div class="theme-preview-line" style="background:${p.text};width:80%"></div>
            <div class="theme-preview-line" style="background:${p.text};width:50%;opacity:0.4"></div>
          </div>
        </div>
        <div class="theme-preview-card" style="background:${p.cardBg}">
          <div class="theme-preview-dot" style="background:${p.accent}"></div>
          <div class="theme-preview-lines">
            <div class="theme-preview-line" style="background:${p.text};width:70%"></div>
            <div class="theme-preview-line" style="background:${p.text};width:40%;opacity:0.4"></div>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    const state = Store.getState();
    const ap = state.appearance;
    const container = getContainer();
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">Appearance</div>
        <div class="panel-desc">Choose a theme and customize colors, fonts, and layout.</div>
      </div>

      <!-- Themes -->
      <div style="margin-bottom:8px">
        <div class="form-label">Theme</div>
      </div>
      <div class="theme-grid">
        ${Themes.getAll().map(theme => `
          <div class="theme-card ${state.settings.theme === theme.id ? 'active' : ''}" data-theme="${theme.id}" tabindex="0" role="button" aria-label="Select ${theme.name} theme">
            ${renderThemePreview(theme)}
            <div class="theme-card-label">${theme.name}</div>
          </div>
        `).join('')}
      </div>

      <div class="divider"></div>

      <!-- Colors -->
      <div class="form-label" style="margin-bottom:12px">Custom Colors</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        ${renderColorRow('primaryColor', 'Primary Color', ap.primaryColor)}
        ${renderColorRow('secondaryColor', 'Secondary Color', ap.secondaryColor)}
        ${renderColorRow('backgroundColor', 'Background', ap.backgroundColor)}
        ${renderColorRow('textColor', 'Text Color', ap.textColor)}
      </div>

      <div class="divider"></div>

      <!-- Font -->
      <div class="form-label" style="margin-bottom:10px">Typography</div>
      <div class="font-grid">
        ${FONTS.map(f => `
          <div class="font-option ${ap.font === f.id ? 'active' : ''}" data-font="${f.id}" role="button" tabindex="0">
            <div class="font-option-name" style="font-family:'${f.id}',sans-serif">${f.name}</div>
            <div class="font-option-sample">${f.sample}</div>
          </div>
        `).join('')}
      </div>

      <div class="divider"></div>

      <!-- Layout -->
      <div class="form-label" style="margin-bottom:10px">Item Layout</div>
      <div class="layout-options">
        ${LAYOUTS.map(l => `
          <div class="layout-option ${ap.itemLayout === l.id ? 'active' : ''}" data-layout="${l.id}" role="button" tabindex="0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${l.icon}</svg>
            <div class="layout-option-label">${l.label}</div>
          </div>
        `).join('')}
      </div>

      <div class="divider"></div>

      <!-- Shape & Radius -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <div class="form-label" style="margin-bottom:8px">Image Shape</div>
          <select class="form-select" id="select-img-shape">
            ${IMAGE_SHAPES.map(s => `<option value="${s.id}" ${ap.imageShape === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}
          </select>
        </div>
        <div>
          <div class="form-label" style="margin-bottom:8px">Border Radius</div>
          <select class="form-select" id="select-border-radius">
            ${RADII.map(r => `<option value="${r}" ${ap.borderRadius === r ? 'selected' : ''}>${r.charAt(0).toUpperCase() + r.slice(1)}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Presets -->
      <div class="form-label" style="margin-bottom:10px">Quick Presets</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn-secondary btn-sm" data-preset="modern">Modern Dark</button>
        <button class="btn-secondary btn-sm" data-preset="warm">Warm Tones</button>
        <button class="btn-secondary btn-sm" data-preset="midnight">Midnight</button>
        <button class="btn-secondary btn-sm" data-preset="fresh">Fresh Green</button>
      </div>
    `;

    bindEvents();
  }

  function renderColorRow(field, label, value) {
    return `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <div class="color-input-row">
          <div class="color-swatch" style="background:${value}" data-color-field="${field}" title="Click to open color picker"></div>
          <input type="color" id="color-${field}" value="${value}" style="display:none" data-color-field="${field}" />
          <input type="text" class="color-text-input" value="${value}" data-color-text="${field}" placeholder="#000000" maxlength="7" />
        </div>
      </div>
    `;
  }

  const PRESETS = {
    modern:   { primaryColor: '#6366f1', secondaryColor: '#8b5cf6', backgroundColor: '#ffffff', textColor: '#1e293b' },
    warm:     { primaryColor: '#d97706', secondaryColor: '#ea580c', backgroundColor: '#fffbeb', textColor: '#451a03' },
    midnight: { primaryColor: '#818cf8', secondaryColor: '#c084fc', backgroundColor: '#0f172a', textColor: '#f1f5f9' },
    fresh:    { primaryColor: '#10b981', secondaryColor: '#059669', backgroundColor: '#f0fdf4', textColor: '#052e16' }
  };

  function bindEvents() {
    const container = getContainer();
    if (!container) return;

    // Theme selection
    container.querySelectorAll('[data-theme]').forEach(card => {
      card.addEventListener('click', () => {
        const themeId = card.dataset.theme;
        Store.updateSettings({ theme: themeId });
        container.querySelectorAll('[data-theme]').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        Toast.info(`Theme: ${themeId.charAt(0).toUpperCase() + themeId.slice(1)}`);
      });
      card.addEventListener('keydown', e => { if (e.key === 'Enter') card.click(); });
    });

    // Color pickers
    container.querySelectorAll('[data-color-field]').forEach(el => {
      const field = el.dataset.colorField;
      if (el.classList.contains('color-swatch')) {
        el.addEventListener('click', () => {
          const colorInput = container.querySelector(`#color-${field}`);
          if (colorInput) colorInput.click();
        });
      }
      if (el.type === 'color') {
        el.addEventListener('input', () => {
          const val = el.value;
          const swatch = container.querySelector(`.color-swatch[data-color-field="${field}"]`);
          const text = container.querySelector(`[data-color-text="${field}"]`);
          if (swatch) swatch.style.background = val;
          if (text) text.value = val;
          Store.updateAppearance({ [field]: val });
        });
      }
    });

    container.querySelectorAll('[data-color-text]').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.dataset.colorText;
        const val = el.value;
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          const swatch = container.querySelector(`.color-swatch[data-color-field="${field}"]`);
          const colorInput = container.querySelector(`#color-${field}`);
          if (swatch) swatch.style.background = val;
          if (colorInput) colorInput.value = val;
          Store.updateAppearance({ [field]: val });
        }
      });
    });

    // Font selection
    container.querySelectorAll('[data-font]').forEach(el => {
      el.addEventListener('click', () => {
        Store.updateAppearance({ font: el.dataset.font });
        container.querySelectorAll('[data-font]').forEach(f => f.classList.remove('active'));
        el.classList.add('active');
      });
      el.addEventListener('keydown', e => { if (e.key === 'Enter') el.click(); });
    });

    // Layout selection
    container.querySelectorAll('[data-layout]').forEach(el => {
      el.addEventListener('click', () => {
        Store.updateAppearance({ itemLayout: el.dataset.layout });
        container.querySelectorAll('[data-layout]').forEach(l => l.classList.remove('active'));
        el.classList.add('active');
      });
      el.addEventListener('keydown', e => { if (e.key === 'Enter') el.click(); });
    });

    // Image shape
    const imgShape = container.querySelector('#select-img-shape');
    if (imgShape) {
      imgShape.addEventListener('change', () => Store.updateAppearance({ imageShape: imgShape.value }));
    }

    // Border radius
    const borderRadius = container.querySelector('#select-border-radius');
    if (borderRadius) {
      borderRadius.addEventListener('change', () => Store.updateAppearance({ borderRadius: borderRadius.value }));
    }

    // Presets
    container.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = PRESETS[btn.dataset.preset];
        if (preset) {
          Store.updateAppearance(preset);
          render(); // Re-render to show new values
          Toast.success('Preset applied');
        }
      });
    });
  }

  return {
    render,
    activate() { render(); }
  };
})();
