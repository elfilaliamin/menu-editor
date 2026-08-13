/**
 * projectsPanel.js — Project Management Panel
 */

window.ProjectsPanel = (() => {
  const PANEL_ID = 'panel-projects';

  function getContainer() {
    return document.getElementById(PANEL_ID);
  }

  function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60)    return 'just now';
    if (seconds < 3600)  return Math.floor(seconds/60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds/3600) + 'h ago';
    return Math.floor(seconds/86400) + 'd ago';
  }

  function render() {
    const projects = Projects.list();
    const currentId = Store.getProjectId();
    const container = getContainer();
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">My Projects</div>
        <div class="panel-desc">Save, manage and switch between your menu projects.</div>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
        <button class="btn-primary" id="btn-new-project">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Project
        </button>
        <button class="btn-secondary" id="btn-import-json">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Import JSON
        </button>
        <button class="btn-secondary" id="btn-export-json">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export JSON
        </button>
        <input type="file" id="import-file-input" accept=".json" style="display:none" />
      </div>

      ${projects.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="empty-state-title">No saved projects</div>
          <div class="empty-state-desc">Create a new project or import an existing menu JSON.</div>
        </div>
      ` : `
        <div class="projects-grid">
          ${projects.map(p => `
            <div class="project-card ${p.id === currentId ? 'active' : ''}" data-project-id="${p.id}">
              <div class="project-card-name">${esc(p.name)}</div>
              <div class="project-card-meta">
                ${p.sectionCount || 0} sections · ${p.itemCount || 0} items<br/>
                <span style="text-transform:capitalize">${p.theme || 'modern'}</span> theme · Updated ${timeAgo(p.updatedAt)}
              </div>
              ${p.id === currentId ? `<div class="badge badge-new" style="margin-top:6px;font-size:0.65rem">Current</div>` : ''}
              <div class="project-card-actions">
                <button class="btn-icon" data-action="rename" data-project-id="${p.id}" title="Rename">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-icon" data-action="duplicate" data-project-id="${p.id}" title="Duplicate">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button class="btn-icon" data-action="delete" data-project-id="${p.id}" title="Delete" style="color:var(--color-danger)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          `).join('')}
          <div class="project-new-card" id="btn-new-project-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </div>
        </div>
      `}
    `;

    bindEvents();
  }

  function esc(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function loadProject(id) {
    const data = Projects.load(id);
    if (!data) { Toast.error('Could not load project'); return; }
    Store.init(data, id);
    Store.setProjectId(id);
    Projects.setLastActive(id);
    UndoRedo.clear();

    // Update UI
    const nameEl = document.getElementById('current-project-name');
    const bcEl = document.getElementById('bc-project');
    if (nameEl) nameEl.textContent = data.restaurant?.name || 'My Menu';
    if (bcEl) bcEl.textContent = data.restaurant?.name || 'My Menu';

    // Apply RTL
    const rtl = data.settings?.rtl;
    const lang = data.settings?.language || 'en';
    document.getElementById('app-root').dir = rtl ? 'rtl' : 'ltr';
    document.getElementById('app-root').lang = lang;

    Toast.success(`Loaded: ${data.restaurant?.name || 'Project'}`);
    render();
  }

  function bindEvents() {
    const container = getContainer();
    if (!container) return;

    // New project
    container.querySelectorAll('#btn-new-project, #btn-new-project-card').forEach(btn => {
      btn.addEventListener('click', async () => {
        const name = await Modal.prompt({
          title: 'New Project',
          label: 'Project Name',
          placeholder: 'My Restaurant Menu',
          defaultValue: 'My Restaurant'
        });
        if (!name) return;

        AutoSave.flush();
        const demo = DemoData.createDemoMenu();
        demo.restaurant.name = name;
        const id = Projects.create(demo);
        Store.init(demo, id);
        Store.setProjectId(id);
        Projects.setLastActive(id);
        UndoRedo.clear();

        const nameEl = document.getElementById('current-project-name');
        const bcEl = document.getElementById('bc-project');
        if (nameEl) nameEl.textContent = name;
        if (bcEl) bcEl.textContent = name;

        Toast.success('New project created!');
        render();

        // Navigate to restaurant panel
        App.navigateTo('restaurant');
      });
    });

    // Project card click (load)
    container.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('[data-action]')) return;
        const id = card.dataset.projectId;
        if (id === Store.getProjectId()) return;
        AutoSave.flush();
        loadProject(id);
      });
    });

    // Project actions
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.projectId;

        if (action === 'rename') {
          const meta = Projects.list().find(p => p.id === id);
          const newName = await Modal.prompt({
            title: 'Rename Project',
            label: 'New Name',
            defaultValue: meta?.name || ''
          });
          if (!newName) return;
          Projects.rename(id, newName);
          if (id === Store.getProjectId()) {
            Store.updateRestaurant({ name: newName });
            const nameEl = document.getElementById('current-project-name');
            if (nameEl) nameEl.textContent = newName;
          }
          render();
          Toast.success('Project renamed');
        }

        else if (action === 'duplicate') {
          const newId = Projects.duplicate(id);
          render();
          Toast.success('Project duplicated');
        }

        else if (action === 'delete') {
          const meta = Projects.list().find(p => p.id === id);
          const ok = await Modal.confirm({
            title: 'Delete Project',
            message: `This will permanently delete "${meta?.name || 'this project'}". This cannot be undone.`,
            confirmText: 'Delete',
            type: 'danger'
          });
          if (!ok) return;
          Projects.delete(id);
          if (id === Store.getProjectId()) {
            // Load another project or create fresh
            const remaining = Projects.list();
            if (remaining.length > 0) {
              loadProject(remaining[0].id);
            } else {
              const demo = DemoData.createDemoMenu();
              const newId = Projects.create(demo);
              Store.init(demo, newId);
              Store.setProjectId(newId);
            }
          }
          render();
          Toast.success('Project deleted');
        }
      });
    });

    // Export JSON
    container.querySelector('#btn-export-json')?.addEventListener('click', () => {
      const json = Projects.exportJson(Store.getState());
      const name = Store.getRestaurant().name || 'menu';
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${IdUtils.slug(name)}-menu.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      Toast.success('JSON exported!');
    });

    // Import JSON
    const importBtn = container.querySelector('#btn-import-json');
    const fileInput = container.querySelector('#import-file-input');

    if (importBtn && fileInput) {
      importBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files[0];
        if (!file) return;
        const text = await file.text();
        const result = Projects.importJson(text);
        if (!result.success) {
          Toast.error(`Import failed: ${result.error}`);
          return;
        }
        AutoSave.flush();
        loadProject(result.id);
        Toast.success('Menu imported successfully!');
        fileInput.value = '';
      });
    }
  }

  return {
    render,
    activate() { render(); },
    loadProject
  };
})();
