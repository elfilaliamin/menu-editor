/**
 * projects.js — LocalStorage project management
 */

window.Projects = (() => {
  const STORAGE_KEY = 'dmb_projects';
  const META_KEY    = 'dmb_project_meta';

  function loadAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch { return {}; }
  }

  function loadMeta() {
    try {
      return JSON.parse(localStorage.getItem(META_KEY) || '[]');
    } catch { return []; }
  }

  function saveMeta(meta) {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }

  function saveAll(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  const projects = {
    /**
     * List all project metadata (id, name, updatedAt)
     */
    list() {
      return loadMeta().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    /**
     * Load a specific project's data
     */
    load(id) {
      const all = loadAll();
      return all[id] ? JSON.parse(JSON.stringify(all[id])) : null;
    },

    /**
     * Save a project's data
     */
    saveProject(id, menuData) {
      const all = loadAll();
      all[id] = menuData;
      saveAll(all);

      const meta = loadMeta();
      const idx = meta.findIndex(m => m.id === id);
      const entry = {
        id,
        name: menuData.restaurant?.name || 'Untitled',
        updatedAt: new Date().toISOString(),
        theme: menuData.settings?.theme || 'modern',
        sectionCount: menuData.sections?.length || 0,
        itemCount: menuData.sections?.reduce((acc, s) => acc + (s.items?.length || 0), 0) || 0
      };
      if (idx >= 0) meta[idx] = entry;
      else meta.push(entry);
      saveMeta(meta);
    },

    /**
     * Create a new project
     */
    create(menuData) {
      const id = IdUtils.generate();
      this.saveProject(id, menuData);
      return id;
    },

    /**
     * Rename a project
     */
    rename(id, newName) {
      const data = this.load(id);
      if (!data) return;
      data.restaurant.name = newName;
      this.saveProject(id, data);
    },

    /**
     * Duplicate a project
     */
    duplicate(id) {
      const data = this.load(id);
      if (!data) return null;
      const newId = IdUtils.generate();
      const newData = JSON.parse(JSON.stringify(data));
      newData.restaurant.name = (data.restaurant?.name || 'Untitled') + ' (Copy)';
      this.saveProject(newId, newData);
      return newId;
    },

    /**
     * Delete a project
     */
    delete(id) {
      const all = loadAll();
      delete all[id];
      saveAll(all);

      const meta = loadMeta().filter(m => m.id !== id);
      saveMeta(meta);
    },

    /**
     * Export project as JSON string
     */
    exportJson(menuData) {
      return JSON.stringify(menuData, null, 2);
    },

    /**
     * Import project from JSON string
     */
    importJson(jsonStr) {
      const { valid, data, errors } = Validators.json(jsonStr);
      if (!valid) return { success: false, error: 'Invalid JSON: ' + jsonStr.slice(0, 50) };
      const validation = Validators.menuData(data);
      if (!validation.valid) return { success: false, error: validation.errors.join(', ') };
      const id = this.create(data);
      return { success: true, id, data };
    },

    /**
     * Get the last active project ID
     */
    getLastActive() {
      return localStorage.getItem('dmb_last_project') || null;
    },

    setLastActive(id) {
      localStorage.setItem('dmb_last_project', id);
    }
  };

  return projects;
})();
