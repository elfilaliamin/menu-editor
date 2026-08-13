/**
 * exportPanel.js — Export Panel UI
 */

window.ExportPanel = (() => {
  const PANEL_ID = 'panel-export';
  let _exporting = false;

  function getContainer() {
    return document.getElementById(PANEL_ID);
  }

  function render() {
    const state = Store.getState();
    const r = state.restaurant;
    const sections = state.sections;
    const itemCount = sections.reduce((acc, s) => acc + s.items.length, 0);
    const localImages = HtmlExporter.collectLocalImages(state);
    const container = getContainer();
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">Export Menu</div>
        <div class="panel-desc">Generate a standalone ZIP package ready for GitHub Pages hosting.</div>
      </div>

      <!-- Summary -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <div class="card-title">Export Summary</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${summaryCard('Restaurant', r.name || 'Unnamed', '🏠')}
          ${summaryCard('Theme', (state.settings.theme || 'modern').charAt(0).toUpperCase() + (state.settings.theme || 'modern').slice(1), '🎨')}
          ${summaryCard('Sections', sections.length + ' sections', '📋')}
          ${summaryCard('Items', itemCount + ' items', '🍽')}
          ${summaryCard('Currency', state.settings.currency || 'MAD', '💰')}
          ${summaryCard('Images', localImages.length + ' local / URL images', '🖼')}
        </div>
      </div>

      <!-- Export output -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <div class="card-title">Output Structure</div>
        </div>
        <div class="code-block">menu/
├── index.html    ← Standalone single-file HTML (embedded data + inline CSS & JS)
├── assets/       ← Local uploaded images${localImages.length > 0 ? '\n│   ' + localImages.map(i => '└── ' + i.filename).join('\n│   ') : ' (none)'}
└── README.md     ← Deployment instructions</div>
      </div>

      <!-- Export steps -->
      <div class="export-steps">
        <div class="export-step">
          <div class="export-step-number">1</div>
          <div>
            <div class="export-step-title">Click "Export ZIP"</div>
            <div class="export-step-desc">Generates standalone index.html with all HTML, CSS, JS, and menu content fully embedded.</div>
          </div>
        </div>
        <div class="export-step">
          <div class="export-step-number">2</div>
          <div>
            <div class="export-step-title">Extract the ZIP</div>
            <div class="export-step-desc">Extract all files. Open index.html directly in any browser — no HTTP server needed!</div>
          </div>
        </div>
        <div class="export-step">
          <div class="export-step-number">3</div>
          <div>
            <div class="export-step-title">Upload to GitHub Pages</div>
            <div class="export-step-desc">Push all files to a public GitHub repository root. Enable Pages in repository settings.</div>
          </div>
        </div>
        <div class="export-step">
          <div class="export-step-number">4</div>
          <div>
            <div class="export-step-title">Generate QR Code</div>
            <div class="export-step-desc">Go to the QR Code panel and enter your GitHub Pages URL to generate a printable QR code.</div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="export-actions">
        <button class="btn-primary btn-lg btn-full" id="btn-do-export" ${_exporting ? 'disabled' : ''}>
          ${_exporting ? '<div class="preview-loading-spinner" style="width:18px;height:18px;border-width:2px;display:inline-block;margin-right:8px;vertical-align:middle"></div> Generating...' : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export ZIP
          `}
        </button>
        <button class="btn-secondary btn-full" id="btn-preview-json">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Preview menu.json
        </button>
      </div>

      <div id="json-preview-wrapper" style="display:none;margin-top:12px">
        <div class="code-block" id="json-preview" style="max-height:300px;overflow:auto;font-size:0.72rem"></div>
      </div>

      <!-- Validation warnings -->
      ${buildValidationWarnings(state)}
    `;

    bindEvents();
  }

  function summaryCard(label, value, emoji) {
    return `
      <div style="background:var(--surface-bg);border:1px solid var(--surface-border);border-radius:var(--radius-md);padding:12px">
        <div style="font-size:1.2rem;margin-bottom:4px">${emoji}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em">${label}</div>
        <div style="font-size:0.9rem;font-weight:700;color:var(--text-primary);margin-top:2px">${esc(value)}</div>
      </div>
    `;
  }

  function buildValidationWarnings(state) {
    const warns = [];
    if (!state.restaurant.name) warns.push('Restaurant name is required');
    if (!state.sections.length) warns.push('No sections — add at least one menu section');
    const emptySection = state.sections.find(s => !s.items.length);
    if (emptySection) warns.push(`Section "${emptySection.title}" has no items`);

    if (!warns.length) return '';
    return `
      <div class="inline-notice warning" style="margin-top:16px">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
        <div>
          <strong>Before exporting:</strong>
          <ul style="margin-top:4px;padding-left:16px">
            ${warns.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  function esc(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function bindEvents() {
    const container = getContainer();
    if (!container) return;

    container.querySelector('#btn-do-export')?.addEventListener('click', async () => {
      if (_exporting) return;
      _exporting = true;
      render();

      const dismiss = Toast.info('Generating ZIP...', 'info', 0);
      try {
        const result = await ZipExporter.exportZip(Store.getState());
        dismiss && dismiss();
        Toast.success(`ZIP exported: ${result.filename}${result.hasLocalImages ? ` (${result.imageCount} image${result.imageCount !== 1 ? 's' : ''} included)` : ''}`);
      } catch (e) {
        dismiss && dismiss();
        console.error('Export error:', e);
        Toast.error('Export failed: ' + e.message);
      } finally {
        _exporting = false;
        render();
      }
    });

    container.querySelector('#btn-preview-json')?.addEventListener('click', () => {
      const wrapper = container.querySelector('#json-preview-wrapper');
      const preview = container.querySelector('#json-preview');
      if (!wrapper || !preview) return;

      if (wrapper.style.display === 'none') {
        const json = HtmlExporter.generateMenuJson(Store.getState());
        preview.textContent = json;
        wrapper.style.display = 'block';
        container.querySelector('#btn-preview-json').textContent = '↑ Hide JSON';
      } else {
        wrapper.style.display = 'none';
        container.querySelector('#btn-preview-json').innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Preview menu.json
        `;
      }
    });
  }

  return {
    render,
    activate() { render(); }
  };
})();
