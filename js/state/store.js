/**
 * store.js — Central application state management
 * Single source of truth for the editor state.
 */

window.Store = (() => {
  let _state = null;
  const _listeners = new Set();
  let _currentProjectId = null;

  function notify() {
    _listeners.forEach(fn => {
      try { fn(_state); } catch(e) { console.error('Store listener error:', e); }
    });
  }

  const store = {
    /**
     * Initialize the store with a MenuData object
     */
    init(menuData, projectId) {
      _state = JSON.parse(JSON.stringify(menuData)); // deep clone
      _currentProjectId = projectId;
      notify();
    },

    /**
     * Get current state (deep clone)
     */
    getState() {
      return JSON.parse(JSON.stringify(_state));
    },

    /**
     * Get raw state reference (for reading only, don't mutate)
     */
    getRaw() {
      return _state;
    },

    /**
     * Update state with a patch function
     * patchFn receives a mutable draft and should return it or nothing
     */
    update(patchFn, skipHistory = false) {
      const prev = JSON.parse(JSON.stringify(_state));
      const draft = JSON.parse(JSON.stringify(_state));
      patchFn(draft);
      _state = draft;

      if (!skipHistory) {
        UndoRedo.push(prev);
      }

      notify();
      AutoSave.schedule();
    },

    /**
     * Replace state entirely (used by undo/redo)
     */
    replace(newState) {
      _state = JSON.parse(JSON.stringify(newState));
      notify();
      AutoSave.schedule();
    },

    /**
     * Subscribe to state changes
     */
    subscribe(fn) {
      _listeners.add(fn);
      return () => _listeners.delete(fn);
    },

    /**
     * Get current project ID
     */
    getProjectId() {
      return _currentProjectId;
    },

    setProjectId(id) {
      _currentProjectId = id;
    },

    // ---- Convenience state accessors ----

    getRestaurant() { return _state.restaurant; },
    getSettings()   { return _state.settings; },
    getAppearance() { return _state.appearance; },
    getSections()   { return _state.sections; },

    getSectionById(id) {
      return _state.sections.find(s => s.id === id);
    },
    getItemById(sectionId, itemId) {
      const section = this.getSectionById(sectionId);
      return section ? section.items.find(i => i.id === itemId) : null;
    },

    // ---- Restaurant updates ----
    updateRestaurant(patch) {
      this.update(draft => { Object.assign(draft.restaurant, patch); });
    },

    // ---- Settings updates ----
    updateSettings(patch) {
      this.update(draft => { Object.assign(draft.settings, patch); });
    },

    // ---- Appearance updates ----
    updateAppearance(patch) {
      this.update(draft => { Object.assign(draft.appearance, patch); });
    },

    // ---- Section CRUD ----
    addSection(sectionData) {
      const section = {
        id: IdUtils.generate(),
        title: sectionData.title || 'New Section',
        description: sectionData.description || '',
        cover: null,
        displayStyle: 'list',
        translations: {},
        items: [],
        ...sectionData
      };
      this.update(draft => { draft.sections.push(section); });
      return section.id;
    },

    updateSection(sectionId, patch) {
      this.update(draft => {
        const idx = draft.sections.findIndex(s => s.id === sectionId);
        if (idx >= 0) Object.assign(draft.sections[idx], patch);
      });
    },

    deleteSection(sectionId) {
      this.update(draft => {
        draft.sections = draft.sections.filter(s => s.id !== sectionId);
      });
    },

    duplicateSection(sectionId) {
      const section = this.getSectionById(sectionId);
      if (!section) return;
      const newSection = JSON.parse(JSON.stringify(section));
      newSection.id = IdUtils.generate();
      newSection.title = section.title + ' (Copy)';
      newSection.items = newSection.items.map(item => ({
        ...item, id: IdUtils.generate()
      }));
      this.update(draft => {
        const idx = draft.sections.findIndex(s => s.id === sectionId);
        draft.sections.splice(idx + 1, 0, newSection);
      });
      return newSection.id;
    },

    reorderSections(newOrder) {
      this.update(draft => {
        draft.sections = newOrder.map(id => draft.sections.find(s => s.id === id)).filter(Boolean);
      });
    },

    // ---- Item CRUD ----
    addItem(sectionId, itemData) {
      const item = {
        id: IdUtils.generate(),
        name: itemData.name || 'New Item',
        description: itemData.description || '',
        price: itemData.price ?? null,
        variants: itemData.variants || null,
        image: null,
        available: true,
        badge: null,
        tags: [],
        translations: {},
        ...itemData
      };
      this.update(draft => {
        const section = draft.sections.find(s => s.id === sectionId);
        if (section) section.items.push(item);
      });
      return item.id;
    },

    updateItem(sectionId, itemId, patch) {
      this.update(draft => {
        const section = draft.sections.find(s => s.id === sectionId);
        if (!section) return;
        const idx = section.items.findIndex(i => i.id === itemId);
        if (idx >= 0) Object.assign(section.items[idx], patch);
      });
    },

    deleteItem(sectionId, itemId) {
      this.update(draft => {
        const section = draft.sections.find(s => s.id === sectionId);
        if (section) section.items = section.items.filter(i => i.id !== itemId);
      });
    },

    duplicateItem(sectionId, itemId) {
      const section = this.getSectionById(sectionId);
      if (!section) return;
      const item = section.items.find(i => i.id === itemId);
      if (!item) return;
      const newItem = JSON.parse(JSON.stringify(item));
      newItem.id = IdUtils.generate();
      newItem.name = item.name + ' (Copy)';
      this.update(draft => {
        const sec = draft.sections.find(s => s.id === sectionId);
        const idx = sec.items.findIndex(i => i.id === itemId);
        sec.items.splice(idx + 1, 0, newItem);
      });
      return newItem.id;
    },

    reorderItems(sectionId, newOrder) {
      this.update(draft => {
        const section = draft.sections.find(s => s.id === sectionId);
        if (section) {
          section.items = newOrder.map(id => section.items.find(i => i.id === id)).filter(Boolean);
        }
      });
    },

    toggleItemAvailability(sectionId, itemId) {
      const item = this.getItemById(sectionId, itemId);
      if (item) this.updateItem(sectionId, itemId, { available: !item.available });
    }
  };

  return store;
})();
