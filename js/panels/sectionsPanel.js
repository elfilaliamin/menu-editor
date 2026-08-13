/**
 * sectionsPanel.js — Sections & Items Editor Panel
 * Full CRUD with drag-and-drop reordering
 */

window.SectionsPanel = (() => {
  const PANEL_ID = 'panel-sections';
  let _expandedSections = new Set();
  let _expandedItems = new Set();

  function esc(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function getContainer() {
    return document.getElementById(PANEL_ID);
  }

  const TAGS = [
    { id: 'popular',     label: '🔥 Popular' },
    { id: 'new',         label: '✨ New' },
    { id: 'spicy',       label: '🌶 Spicy' },
    { id: 'vegetarian',  label: '🌿 Vegetarian' },
    { id: 'chef',        label: '👨‍🍳 Chef\'s Choice' },
    { id: 'recommended', label: '⭐ Recommended' }
  ];

  const CURRENCIES = { MAD:'MAD', EUR:'€', USD:'$', GBP:'£' };

  function render() {
    const state = Store.getState();
    const sections = state.sections;
    const currency = state.settings.currency || 'MAD';
    const container = getContainer();
    if (!container) return;

    // Update badge count
    const badge = document.getElementById('sections-count');
    if (badge) badge.textContent = sections.length;

    container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">Sections & Items</div>
        <div class="panel-desc">Organize your menu into sections and add food items.</div>
      </div>
      <div class="sections-toolbar">
        <div class="text-sm text-secondary">${sections.length} section${sections.length !== 1 ? 's' : ''}</div>
        <button class="btn-primary btn-sm" id="btn-add-section">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Section
        </button>
      </div>

      ${sections.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </div>
          <div class="empty-state-title">No sections yet</div>
          <div class="empty-state-desc">Create your first menu section to start adding food items.</div>
          <button class="btn-primary" id="btn-add-section-empty">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create First Section
          </button>
        </div>
      ` : `
        <div id="sections-list">
          ${sections.map(section => renderSection(section, currency)).join('')}
        </div>
      `}
    `;

    bindSectionEvents();

    // Init drag-and-drop for sections
    const listEl = document.getElementById('sections-list');
    if (listEl && sections.length > 1) {
      DragDrop.makeSortable(listEl, {
        itemSelector: '.section-card',
        handleSelector: '.section-drag-handle',
        onReorder: (newOrder) => {
          Store.reorderSections(newOrder);
          Toast.success('Sections reordered');
        }
      });
    }

    // Init drag-and-drop for each section's items
    sections.forEach(section => {
      const itemsList = document.getElementById(`items-list-${section.id}`);
      if (itemsList && section.items.length > 1) {
        DragDrop.makeSortable(itemsList, {
          itemSelector: '.item-card',
          handleSelector: '.item-drag-handle',
          onReorder: (newOrder) => {
            Store.reorderItems(section.id, newOrder);
          }
        });
      }
    });
  }

  function renderSection(section, currency) {
    const isExpanded = _expandedSections.has(section.id);
    const itemCount = section.items.length;

    return `
      <div class="section-card ${isExpanded ? 'expanded' : ''}" data-id="${section.id}">
        <div class="section-card-header" data-section-toggle="${section.id}">
          <div class="section-drag-handle drag-handle" title="Drag to reorder">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></svg>
          </div>
          <div class="section-card-info">
            <div class="section-card-title">${esc(section.title)}</div>
            <div class="section-card-meta">${itemCount} item${itemCount !== 1 ? 's' : ''}${section.description ? ' · ' + esc(section.description.slice(0,40)) : ''}</div>
          </div>
          <div class="section-card-actions">
            <button class="btn-icon" data-section-action="duplicate" data-section-id="${section.id}" title="Duplicate section">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="btn-icon" data-section-action="delete" data-section-id="${section.id}" title="Delete section" style="color:var(--color-danger)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
            <button class="section-expand-btn ${isExpanded ? 'expanded' : ''}" data-section-toggle="${section.id}" aria-label="Toggle section">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>

        <div class="section-card-body">
          ${renderSectionForm(section)}
          ${renderItemsList(section, currency)}
        </div>
      </div>
    `;
  }

  function renderSectionForm(section) {
    return `
      <div class="form-group">
        <label class="form-label">Section Title <span class="required">*</span></label>
        <input class="form-input" type="text" data-section-field="title" data-section-id="${section.id}"
               value="${esc(section.title)}" placeholder="Section name" />
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <input class="form-input" type="text" data-section-field="description" data-section-id="${section.id}"
               value="${esc(section.description || '')}" placeholder="Optional description..." />
      </div>
      <div class="form-group">
        <label class="form-label">Translations</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <input class="form-input" type="text" data-section-field="title-fr" data-section-id="${section.id}"
                 value="${esc(section.translations?.fr?.title || '')}" placeholder="🇫🇷 French title" />
          <input class="form-input" type="text" dir="rtl" data-section-field="title-ar" data-section-id="${section.id}"
                 value="${esc(section.translations?.ar?.title || '')}" placeholder="🇸🇦 العنوان" />
        </div>
      </div>
    `;
  }

  function renderItemsList(section, currency) {
    return `
      <div class="items-list">
        <div class="items-toolbar">
          <div class="items-label">Items (${section.items.length})</div>
          <button class="btn-ghost btn-sm" data-add-item="${section.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Item
          </button>
        </div>

        ${section.items.length === 0 ? `
          <div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.8rem;border:1px dashed var(--surface-border);border-radius:var(--radius-md)">
            No items yet.
            <button class="btn-ghost btn-sm" data-add-item="${section.id}" style="display:inline;padding:0;margin-left:4px;color:var(--brand-primary)">Add first item</button>
          </div>
        ` : `
          <div id="items-list-${section.id}">
            ${section.items.map(item => renderItem(item, section.id, currency)).join('')}
          </div>
        `}
      </div>
    `;
  }

  function renderItem(item, sectionId, currency) {
    const isExpanded = _expandedItems.has(item.id);
    const price = item.variants?.length
      ? `${item.variants[0].label}: ${item.variants[0].price} ${currency}`
      : (item.price !== null && item.price !== undefined ? `${item.price} ${currency}` : 'No price');

    const thumb = ImageUtils.getSrc(item.image) || '';

    return `
      <div class="item-card ${isExpanded ? 'expanded' : ''} ${!item.available ? 'item-unavailable' : ''}"
           data-id="${item.id}" data-section-id="${sectionId}">
        <div class="item-card-header" data-item-toggle="${item.id}">
          <div class="item-drag-handle drag-handle" title="Drag to reorder">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></svg>
          </div>
          <div class="item-card-thumb">
            ${thumb ? `<img src="${thumb}" alt="${esc(item.name)}" onerror="this.style.display='none'" />` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text-muted)"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`}
          </div>
          <div class="item-card-info">
            <div class="item-card-name">${esc(item.name)}</div>
            <div class="item-card-price">${price}</div>
            ${item.tags.length > 0 ? `<div class="item-card-tags">${item.tags.slice(0,3).map(t => `<span class="badge badge-${t === 'chef' ? 'chef' : t === 'popular' ? 'popular' : t === 'new' ? 'new' : t === 'spicy' ? 'spicy' : t === 'vegetarian' ? 'veg' : 'rec'}">${t}</span>`).join('')}</div>` : ''}
          </div>
          <div class="item-card-actions">
            <button class="btn-icon" data-item-action="toggle" data-section-id="${sectionId}" data-item-id="${item.id}"
                    title="${item.available ? 'Mark unavailable' : 'Mark available'}"
                    style="color:${item.available ? 'var(--color-success)' : 'var(--text-muted)'}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.available ? '<polyline points="20 6 9 17 4 12"/>' : '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'}</svg>
            </button>
            <button class="btn-icon" data-item-action="duplicate" data-section-id="${sectionId}" data-item-id="${item.id}" title="Duplicate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button class="btn-icon" data-item-action="delete" data-section-id="${sectionId}" data-item-id="${item.id}" title="Delete" style="color:var(--color-danger)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
            <button class="section-expand-btn ${isExpanded ? 'expanded' : ''}" data-item-toggle="${item.id}" aria-label="Expand item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
        </div>

        <div class="item-card-body">
          ${renderItemForm(item, sectionId, currency)}
        </div>
      </div>
    `;
  }

  function renderItemForm(item, sectionId, currency) {
    const hasVariants = item.variants && item.variants.length > 0;

    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="form-group">
          <label class="form-label">Item Name <span class="required">*</span></label>
          <input class="form-input" type="text" data-item-field="name" data-section-id="${sectionId}" data-item-id="${item.id}"
                 value="${esc(item.name)}" placeholder="Item name" />
        </div>
        <div class="form-group">
          <label class="form-label">Badge</label>
          <select class="form-select" data-item-field="badge" data-section-id="${sectionId}" data-item-id="${item.id}">
            <option value="">No badge</option>
            <option value="Popular"    ${item.badge === 'Popular'    ? 'selected' : ''}>Popular</option>
            <option value="New"        ${item.badge === 'New'        ? 'selected' : ''}>New</option>
            <option value="Spicy"      ${item.badge === 'Spicy'      ? 'selected' : ''}>Spicy</option>
            <option value="Chef's Choice" ${item.badge === "Chef's Choice" ? 'selected' : ''}>Chef's Choice</option>
            <option value="Recommended" ${item.badge === 'Recommended' ? 'selected' : ''}>Recommended</option>
            <option value="Vegetarian" ${item.badge === 'Vegetarian' ? 'selected' : ''}>Vegetarian</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" style="min-height:60px" data-item-field="description" data-section-id="${sectionId}" data-item-id="${item.id}"
                  placeholder="Item description...">${esc(item.description || '')}</textarea>
      </div>

      <!-- Price -->
      <div class="form-group">
        <label class="form-label">
          Price
          <label style="font-weight:400;margin-left:8px;font-size:0.75rem;color:var(--text-muted)">
            <input type="checkbox" data-item-field="hasVariants" data-section-id="${sectionId}" data-item-id="${item.id}"
                   ${hasVariants ? 'checked' : ''} style="margin-right:4px" />
            Multiple price variants
          </label>
        </label>

        ${!hasVariants ? `
          <div style="display:flex;gap:8px">
            <input class="form-input" type="number" min="0" step="0.01"
                   data-item-field="price" data-section-id="${sectionId}" data-item-id="${item.id}"
                   value="${item.price !== null && item.price !== undefined ? item.price : ''}"
                   placeholder="0.00" style="flex:1" />
            <select class="form-select" style="width:90px" data-item-field="currency-display">
              <option>${currency}</option>
            </select>
          </div>
        ` : `
          <div class="variants-list" id="variants-list-${item.id}">
            ${(item.variants || []).map((v, i) => `
              <div class="variant-row" data-variant-index="${i}">
                <input class="form-input" type="text" data-variant-field="label" data-section-id="${sectionId}" data-item-id="${item.id}" data-idx="${i}"
                       value="${esc(v.label)}" placeholder="Size (e.g. Small)" />
                <input class="form-input" type="number" min="0" step="0.01" data-variant-field="price" data-section-id="${sectionId}" data-item-id="${item.id}" data-idx="${i}"
                       value="${v.price}" placeholder="Price" />
                <span style="color:var(--text-muted);font-size:0.8rem;white-space:nowrap">${currency}</span>
                <button class="btn-remove-variant" data-remove-variant="${i}" data-section-id="${sectionId}" data-item-id="${item.id}" aria-label="Remove">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            `).join('')}
          </div>
          <button class="btn-ghost btn-sm" style="margin-top:4px" data-add-variant data-section-id="${sectionId}" data-item-id="${item.id}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Variant
          </button>
        `}
      </div>

      <!-- Tags -->
      <div class="form-group">
        <label class="form-label">Tags</label>
        <div class="tag-selector">
          ${TAGS.map(tag => `
            <div class="tag-chip ${tag.id} ${(item.tags || []).includes(tag.id) ? 'active' : ''}"
                 data-item-tag="${tag.id}" data-section-id="${sectionId}" data-item-id="${item.id}">
              ${tag.label}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Image -->
      <div class="form-group">
        <div id="item-img-${item.id}" data-section-id="${sectionId}" data-item-id="${item.id}"></div>
      </div>

      <!-- Translations -->
      <div class="form-group">
        <label class="form-label">Translations</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <input class="form-input" type="text"
                 data-item-field="name-fr" data-section-id="${sectionId}" data-item-id="${item.id}"
                 value="${esc(item.translations?.fr?.name || '')}" placeholder="🇫🇷 French name" />
          <input class="form-input" type="text" dir="rtl"
                 data-item-field="name-ar" data-section-id="${sectionId}" data-item-id="${item.id}"
                 value="${esc(item.translations?.ar?.name || '')}" placeholder="🇸🇦 الاسم" />
        </div>
      </div>

      <!-- Availability -->
      <div class="form-toggle-row">
        <div>
          <div class="toggle-label">Available</div>
          <div class="toggle-hint">Toggle off to show item as unavailable</div>
        </div>
        <label class="toggle-switch" title="Toggle availability">
          <input type="checkbox" data-item-field="available" data-section-id="${sectionId}" data-item-id="${item.id}"
                 ${item.available ? 'checked' : ''} />
          <div class="toggle-track"></div>
          <div class="toggle-thumb"></div>
        </label>
      </div>
    `;
  }

  function bindSectionEvents() {
    const container = getContainer();
    if (!container) return;

    // Add section
    container.querySelectorAll('#btn-add-section, #btn-add-section-empty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Store.addSection({ title: 'New Section' });
        _expandedSections.add(id);
        render();
        // Focus title input
        const input = container.querySelector(`[data-section-id="${id}"][data-section-field="title"]`);
        if (input) { input.focus(); input.select(); }
        Toast.success('Section added');
      });
    });

    // Section toggle
    container.querySelectorAll('[data-section-toggle]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const id = el.dataset.sectionToggle;
        if (_expandedSections.has(id)) _expandedSections.delete(id);
        else _expandedSections.add(id);
        render();
        // Init image pickers for newly expanded items
        initItemImagePickers();
      });
    });

    // Section actions
    container.querySelectorAll('[data-section-action]').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        const action = btn.dataset.sectionAction;
        const id = btn.dataset.sectionId;

        if (action === 'delete') {
          const ok = await Modal.confirm({
            title: 'Delete Section',
            message: 'This will permanently delete the section and all its items. This cannot be undone.',
            confirmText: 'Delete',
            type: 'danger'
          });
          if (!ok) return;
          Store.deleteSection(id);
          _expandedSections.delete(id);
          render();
          Toast.success('Section deleted');
        } else if (action === 'duplicate') {
          const newId = Store.duplicateSection(id);
          _expandedSections.add(newId);
          render();
          Toast.success('Section duplicated');
        }
      });
    });

    // Section field updates
    container.querySelectorAll('[data-section-field]').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.dataset.sectionField;
        const sectionId = el.dataset.sectionId;
        const value = el.value;

        if (field === 'title' || field === 'description') {
          Store.updateSection(sectionId, { [field]: value });
        } else if (field.startsWith('title-') || field.startsWith('desc-')) {
          const [key, lang] = field.split('-');
          const section = Store.getSectionById(sectionId);
          const translations = JSON.parse(JSON.stringify(section.translations || {}));
          if (!translations[lang]) translations[lang] = {};
          translations[lang][key] = value;
          Store.updateSection(sectionId, { translations });
        }

        // Update card title in header without full re-render
        if (field === 'title') {
          const card = container.querySelector(`.section-card[data-id="${sectionId}"] .section-card-title`);
          if (card) card.textContent = value;
        }
      });
    });

    // Add item
    container.querySelectorAll('[data-add-item]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const sectionId = btn.dataset.addItem;
        const id = Store.addItem(sectionId, { name: 'New Item', price: 0 });
        _expandedSections.add(sectionId);
        _expandedItems.add(id);
        render();
        initItemImagePickers();
        const input = container.querySelector(`[data-item-id="${id}"][data-item-field="name"]`);
        if (input) { input.focus(); input.select(); }
        Toast.success('Item added');
      });
    });

    // Item toggle
    container.querySelectorAll('[data-item-toggle]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const id = el.dataset.itemToggle;
        if (_expandedItems.has(id)) _expandedItems.delete(id);
        else _expandedItems.add(id);
        render();
        initItemImagePickers();
      });
    });

    // Item actions
    container.querySelectorAll('[data-item-action]').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        const action = btn.dataset.itemAction;
        const sectionId = btn.dataset.sectionId;
        const itemId = btn.dataset.itemId;

        if (action === 'delete') {
          const ok = await Modal.confirm({
            title: 'Delete Item',
            message: 'This will permanently delete this item.',
            confirmText: 'Delete',
            type: 'danger'
          });
          if (!ok) return;
          Store.deleteItem(sectionId, itemId);
          _expandedItems.delete(itemId);
          render();
          Toast.success('Item deleted');
        } else if (action === 'duplicate') {
          const newId = Store.duplicateItem(sectionId, itemId);
          _expandedItems.add(newId);
          render();
          initItemImagePickers();
          Toast.success('Item duplicated');
        } else if (action === 'toggle') {
          Store.toggleItemAvailability(sectionId, itemId);
          render();
        }
      });
    });

    // Item field updates
    container.querySelectorAll('[data-item-field]').forEach(el => {
      const field = el.dataset.itemField;
      const sectionId = el.dataset.sectionId;
      const itemId = el.dataset.itemId;

      const event = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';

      el.addEventListener(event, () => {
        const item = Store.getItemById(sectionId, itemId);
        if (!item) return;

        if (field === 'name' || field === 'description' || field === 'badge') {
          Store.updateItem(sectionId, itemId, { [field]: el.value });
        } else if (field === 'price') {
          const val = el.value === '' ? null : parseFloat(el.value);
          Store.updateItem(sectionId, itemId, { price: isNaN(val) ? null : val });
        } else if (field === 'available') {
          Store.updateItem(sectionId, itemId, { available: el.checked });
        } else if (field === 'hasVariants') {
          if (el.checked) {
            Store.updateItem(sectionId, itemId, { variants: [{ label: 'Regular', price: item.price || 0 }], price: null });
          } else {
            Store.updateItem(sectionId, itemId, { variants: null, price: 0 });
          }
          render();
          initItemImagePickers();
        } else if (field.startsWith('name-')) {
          const lang = field.split('-')[1];
          const translations = JSON.parse(JSON.stringify(item.translations || {}));
          if (!translations[lang]) translations[lang] = {};
          translations[lang].name = el.value;
          Store.updateItem(sectionId, itemId, { translations });
        }

        // Update card name
        if (field === 'name') {
          const card = container.querySelector(`.item-card[data-id="${itemId}"] .item-card-name`);
          if (card) card.textContent = el.value;
        }
      });
    });

    // Tag chips
    container.querySelectorAll('[data-item-tag]').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.itemTag;
        const sectionId = chip.dataset.sectionId;
        const itemId = chip.dataset.itemId;
        const item = Store.getItemById(sectionId, itemId);
        if (!item) return;
        const tags = [...(item.tags || [])];
        const idx = tags.indexOf(tag);
        if (idx >= 0) tags.splice(idx, 1);
        else tags.push(tag);
        Store.updateItem(sectionId, itemId, { tags });
        chip.classList.toggle('active', tags.includes(tag));
      });
    });

    // Variant fields
    container.querySelectorAll('[data-variant-field]').forEach(el => {
      el.addEventListener('input', () => {
        const field = el.dataset.variantField;
        const sectionId = el.dataset.sectionId;
        const itemId = el.dataset.itemId;
        const idx = parseInt(el.dataset.idx);
        const item = Store.getItemById(sectionId, itemId);
        if (!item || !item.variants) return;
        const variants = JSON.parse(JSON.stringify(item.variants));
        if (field === 'label') variants[idx].label = el.value;
        if (field === 'price') variants[idx].price = parseFloat(el.value) || 0;
        Store.updateItem(sectionId, itemId, { variants });
      });
    });

    // Add variant
    container.querySelectorAll('[data-add-variant]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sectionId = btn.dataset.sectionId;
        const itemId = btn.dataset.itemId;
        const item = Store.getItemById(sectionId, itemId);
        if (!item) return;
        const variants = JSON.parse(JSON.stringify(item.variants || []));
        variants.push({ label: 'New Size', price: 0 });
        Store.updateItem(sectionId, itemId, { variants });
        render();
        initItemImagePickers();
      });
    });

    // Remove variant
    container.querySelectorAll('[data-remove-variant]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.removeVariant);
        const sectionId = btn.dataset.sectionId;
        const itemId = btn.dataset.itemId;
        const item = Store.getItemById(sectionId, itemId);
        if (!item || !item.variants) return;
        const variants = JSON.parse(JSON.stringify(item.variants)).filter((_, i) => i !== idx);
        Store.updateItem(sectionId, itemId, { variants });
        render();
        initItemImagePickers();
      });
    });

    initItemImagePickers();
  }

  function initItemImagePickers() {
    const container = getContainer();
    if (!container) return;

    container.querySelectorAll('[id^="item-img-"]').forEach(el => {
      const itemId = el.dataset.itemId;
      const sectionId = el.dataset.sectionId;
      if (!itemId || !sectionId) return;
      const item = Store.getItemById(sectionId, itemId);
      if (!item) return;
      if (el.querySelector('.image-picker')) return; // already initialized

      ImagePicker.render(el, {
        imageRef: item.image,
        label: 'Item Image',
        aspectRatio: 'square',
        onChange: (imageRef) => {
          Store.updateItem(sectionId, itemId, { image: imageRef });
        }
      });
    });
  }

  return {
    render,
    activate() {
      render();
    }
  };
})();
