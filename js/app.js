/**
 * app.js — Main application orchestrator
 * Initializes everything and wires up the navigation.
 */

window.App = (() => {
  let _currentPanel = 'restaurant';

  const PANELS = {
    restaurant: { module: RestaurantPanel, label: 'Restaurant Info' },
    sections:   { module: SectionsPanel,   label: 'Sections & Items' },
    appearance: { module: AppearancePanel, label: 'Appearance' },
    settings:   { module: SettingsPanel,   label: 'Menu Settings' },
    qrcode:     { module: QRPanel,         label: 'QR Code' },
    export:     { module: ExportPanel,     label: 'Export' },
    projects:   { module: ProjectsPanel,   label: 'My Projects' }
  };

  function navigateTo(panelId) {
    if (!PANELS[panelId]) return;

    _currentPanel = panelId;

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.panel === panelId);
    });

    // Show correct panel
    document.querySelectorAll('.panel').forEach(panel => {
      panel.classList.remove('active');
    });
    const target = document.getElementById(`panel-${panelId}`);
    if (target) target.classList.add('active');

    // Update breadcrumb
    const bcPanel = document.getElementById('bc-panel');
    if (bcPanel) bcPanel.textContent = PANELS[panelId].label;

    // Activate the panel module
    const panelModule = PANELS[panelId].module;
    if (panelModule && typeof panelModule.activate === 'function') {
      panelModule.activate();
    }

    // On mobile: switch to editor tab
    if (window.innerWidth <= 768) {
      showMobileTab('editor-panel');
      closeMobileSidebar();
    }
  }

  function initSidebar() {
    // Nav items
    document.querySelectorAll('.nav-item[data-panel]').forEach(item => {
      item.addEventListener('click', () => navigateTo(item.dataset.panel));
    });

    // Sidebar toggle (collapse/expand)
    const toggleBtn = document.getElementById('sidebar-toggle');
    const app = document.getElementById('app');
    if (toggleBtn && app) {
      toggleBtn.addEventListener('click', () => {
        app.classList.toggle('sidebar-collapsed');
      });
    }

    // Mobile sidebar
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function openMobileSidebar() {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('visible');
    }

    function closeMobileSidebarInternal() {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
    }

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) closeMobileSidebarInternal();
        else openMobileSidebar();
      });

      if (overlay) {
        overlay.addEventListener('click', closeMobileSidebarInternal);
      }
    }

    // Save button
    document.getElementById('btn-save-project')?.addEventListener('click', () => {
      AutoSave.flush();
    });

    // Undo/Redo buttons
    document.getElementById('btn-undo')?.addEventListener('click', () => UndoRedo.undo());
    document.getElementById('btn-redo')?.addEventListener('click', () => UndoRedo.redo());

    // Quick export button (topbar)
    document.getElementById('btn-export-quick')?.addEventListener('click', async () => {
      const dismiss = Toast.info('Generating ZIP...', 'info', 0);
      try {
        const result = await ZipExporter.exportZip(Store.getState());
        dismiss && dismiss();
        Toast.success(`Exported: ${result.filename}`);
      } catch (e) {
        dismiss && dismiss();
        Toast.error('Export failed: ' + e.message);
      }
    });
  }

  function initMobileTabs() {
    document.querySelectorAll('.mobile-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;
        showMobileTab(target);
        document.querySelectorAll('.mobile-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }

  function showMobileTab(target) {
    const editorPanel = document.getElementById('editor-panel');
    const previewPanel = document.getElementById('preview-panel');

    if (target === 'editor-panel') {
      if (editorPanel) { editorPanel.style.display = 'block'; }
      if (previewPanel) { previewPanel.classList.remove('mobile-visible'); }
      const tab = document.querySelector('[data-target="editor-panel"]');
      if (tab) tab.classList.add('active');
      const ptab = document.querySelector('[data-target="preview-panel"]');
      if (ptab) ptab.classList.remove('active');
    } else {
      if (editorPanel) { editorPanel.style.display = 'none'; }
      if (previewPanel) { previewPanel.classList.add('mobile-visible'); }
      const tab = document.querySelector('[data-target="preview-panel"]');
      if (tab) tab.classList.add('active');
      const etab = document.querySelector('[data-target="editor-panel"]');
      if (etab) etab.classList.remove('active');
    }
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  }

  function initProject() {
    // Try to load the last active project
    const lastId = Projects.getLastActive();
    let data = null;

    if (lastId) {
      data = Projects.load(lastId);
      if (data) {
        Store.init(data, lastId);
        Store.setProjectId(lastId);
      }
    }

    if (!data) {
      // Create first demo project
      const demo = DemoData.createDemoMenu();
      const id = Projects.create(demo);
      Store.init(demo, id);
      Store.setProjectId(id);
      Projects.setLastActive(id);
    }

    // Update UI with project name
    const state = Store.getState();
    const name = state.restaurant?.name || 'My Menu';
    const nameEl = document.getElementById('current-project-name');
    const bcEl = document.getElementById('bc-project');
    if (nameEl) nameEl.textContent = name;
    if (bcEl) bcEl.textContent = name;

    // Apply RTL from settings
    const rtl = state.settings?.rtl;
    const lang = state.settings?.language || 'en';
    document.getElementById('app-root').dir = rtl ? 'rtl' : 'ltr';
    document.getElementById('app-root').lang = lang;
  }

  function hideLoading() {
    const loading = document.getElementById('app-loading');
    const appEl = document.getElementById('app');
    if (loading) {
      loading.classList.add('fade-out');
      setTimeout(() => {
        loading.style.display = 'none';
      }, 500);
    }
    if (appEl) appEl.classList.remove('hidden');
  }

  async function init() {
    try {
      // Initialize project first
      initProject();

      // Initialize UI
      initSidebar();
      initMobileTabs();

      // Navigate to default panel
      navigateTo('restaurant');

      // Initialize preview (after store is ready)
      PreviewEngine.init();

      // Hide loading screen immediately
      hideLoading();

    } catch (e) {
      console.error('App init error:', e);
      const loading = document.getElementById('app-loading');
      if (loading) {
        loading.innerHTML = `
          <div style="text-align:center;padding:20px;color:#ef4444">
            <div style="font-size:1.5rem;margin-bottom:8px">⚠</div>
            <div style="font-weight:700">Failed to initialize</div>
            <div style="margin-top:8px;color:#94a3b8;font-size:0.875rem">${e.message}</div>
            <button onclick="location.reload()" style="margin-top:16px;padding:8px 20px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.875rem">Reload</button>
          </div>
        `;
      }
    }
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { navigateTo };
})();
