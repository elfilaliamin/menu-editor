/**
 * settingsPanel.js — Menu Settings Panel
 */

window.SettingsPanel = (() => {
  const PANEL_ID = 'panel-settings';

  function getContainer() {
    return document.getElementById(PANEL_ID);
  }

  const CURRENCIES = [
    { id: 'MAD', label: 'MAD — Moroccan Dirham' },
    { id: 'EUR', label: 'EUR — Euro (€)' },
    { id: 'USD', label: 'USD — US Dollar ($)' },
    { id: 'GBP', label: 'GBP — British Pound (£)' },
    { id: 'SAR', label: 'SAR — Saudi Riyal' },
    { id: 'AED', label: 'AED — UAE Dirham' },
    { id: 'TND', label: 'TND — Tunisian Dinar' },
    { id: 'DZD', label: 'DZD — Algerian Dinar' }
  ];

  const LANGUAGES = [
    { id: 'en', label: '🇬🇧 English', rtl: false },
    { id: 'fr', label: '🇫🇷 French',  rtl: false },
    { id: 'ar', label: '🇸🇦 Arabic',  rtl: true  }
  ];

  function renderToggleRow(id, label, hint, checked, field) {
    return `
      <div class="settings-row">
        <div>
          <div class="settings-row-label">${label}</div>
          ${hint ? `<div class="settings-row-desc">${hint}</div>` : ''}
        </div>
        <label class="toggle-switch" title="${label}">
          <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} data-setting="${field}" />
          <div class="toggle-track"></div>
          <div class="toggle-thumb"></div>
        </label>
      </div>
    `;
  }

  function render() {
    const state = Store.getState();
    const s = state.settings;
    const container = getContainer();
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">Menu Settings</div>
        <div class="panel-desc">Configure your menu's behavior and display options.</div>
      </div>

      <!-- Currency & Language -->
      <div class="settings-group">
        <div class="settings-group-header">Currency & Language</div>
        <div class="settings-row">
          <div>
            <div class="settings-row-label">Default Currency</div>
          </div>
          <select class="form-select" style="width:auto;min-width:180px" id="setting-currency">
            ${CURRENCIES.map(c => `<option value="${c.id}" ${s.currency === c.id ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-row-label">Default Language</div>
          </div>
          <select class="form-select" style="width:auto;min-width:140px" id="setting-language">
            ${LANGUAGES.map(l => `<option value="${l.id}" ${s.language === l.id ? 'selected' : ''}>${l.label}</option>`).join('')}
          </select>
        </div>
        <div class="settings-row">
          <div>
            <div class="settings-row-label">Enabled Languages</div>
            <div class="settings-row-desc">Languages available in the menu switcher</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${LANGUAGES.map(l => `
              <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:0.875rem">
                <input type="checkbox" data-lang="${l.id}" ${(s.languages || []).includes(l.id) ? 'checked' : ''} />
                ${l.label}
              </label>
            `).join('')}
          </div>
        </div>
        ${renderToggleRow('setting-rtl', 'Right-to-Left (RTL)', 'Enable for Arabic menus. Sets dir="rtl" on the menu.', s.rtl, 'rtl')}
      </div>

      <!-- Display Options -->
      <div class="settings-group">
        <div class="settings-group-header">Display Options</div>
        ${renderToggleRow('setting-showPrices', 'Show Prices', null, s.showPrices, 'showPrices')}
        ${renderToggleRow('setting-showDescriptions', 'Show Descriptions', null, s.showDescriptions, 'showDescriptions')}
        ${renderToggleRow('setting-showImages', 'Show Images', null, s.showImages, 'showImages')}
        ${renderToggleRow('setting-showUnavailable', 'Show Unavailable Items', 'Show items marked as unavailable with a disabled style', s.showUnavailable, 'showUnavailable')}
      </div>

      <!-- Features -->
      <div class="settings-group">
        <div class="settings-group-header">Features</div>
        ${renderToggleRow('setting-enableSearch', 'Enable Search', 'Allow customers to search for items by name, description or tags', s.enableSearch, 'enableSearch')}
        ${renderToggleRow('setting-enableLanguageSelector', 'Language Switcher', 'Show a language switcher in the menu (requires multiple languages)', s.enableLanguageSelector, 'enableLanguageSelector')}
      </div>

      <!-- Footer -->
      <div class="settings-group">
        <div class="settings-group-header">Footer</div>
        <div class="settings-row" style="flex-direction:column;align-items:stretch">
          <div class="settings-row-label" style="margin-bottom:8px">Footer Text</div>
          <input id="setting-footerText" class="form-input" type="text"
                 value="${esc(s.footerText || '')}"
                 placeholder="© 2025 Your Restaurant. All rights reserved." />
        </div>
      </div>

      <!-- Menu Width -->
      <div class="settings-group">
        <div class="settings-group-header">Layout</div>
        <div class="settings-row">
          <div>
            <div class="settings-row-label">Menu Width</div>
            <div class="settings-row-desc">Maximum width of the menu container</div>
          </div>
          <select class="form-select" style="width:auto;min-width:130px" id="setting-menuWidth">
            <option value="sm"   ${state.appearance.menuWidth === 'sm'   ? 'selected':''}>Small (640px)</option>
            <option value="md"   ${state.appearance.menuWidth === 'md'   ? 'selected':''}>Medium (768px)</option>
            <option value="lg"   ${state.appearance.menuWidth === 'lg'   ? 'selected':''}>Large (900px)</option>
            <option value="full" ${state.appearance.menuWidth === 'full' ? 'selected':''}>Full Width</option>
          </select>
        </div>
      </div>
    `;

    bindEvents();
  }

  function esc(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  }

  function bindEvents() {
    const container = getContainer();
    if (!container) return;

    // Currency
    const currencyEl = container.querySelector('#setting-currency');
    if (currencyEl) {
      currencyEl.addEventListener('change', () => Store.updateSettings({ currency: currencyEl.value }));
    }

    // Language
    const langEl = container.querySelector('#setting-language');
    if (langEl) {
      langEl.addEventListener('change', () => {
        const lang = langEl.value;
        const rtl = LANGUAGES.find(l => l.id === lang)?.rtl || false;
        Store.updateSettings({ language: lang, rtl });
        // Apply RTL to editor
        document.getElementById('app-root').dir = rtl ? 'rtl' : 'ltr';
        document.getElementById('app-root').lang = lang;
      });
    }

    // Enabled languages
    container.querySelectorAll('[data-lang]').forEach(cb => {
      cb.addEventListener('change', () => {
        const langs = Array.from(container.querySelectorAll('[data-lang]:checked')).map(c => c.dataset.lang);
        Store.updateSettings({ languages: langs });
      });
    });

    // Toggle settings
    container.querySelectorAll('[data-setting]').forEach(el => {
      el.addEventListener('change', () => {
        const field = el.dataset.setting;
        const val = el.checked;
        Store.updateSettings({ [field]: val });

        // Apply RTL immediately
        if (field === 'rtl') {
          document.getElementById('app-root').dir = val ? 'rtl' : 'ltr';
        }
      });
    });

    // Footer text
    const footerEl = container.querySelector('#setting-footerText');
    if (footerEl) {
      let timer;
      footerEl.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => Store.updateSettings({ footerText: footerEl.value }), 400);
      });
    }

    // Menu width
    const widthEl = container.querySelector('#setting-menuWidth');
    if (widthEl) {
      widthEl.addEventListener('change', () => Store.updateAppearance({ menuWidth: widthEl.value }));
    }
  }

  return {
    render,
    activate() { render(); }
  };
})();
