/**
 * dragDrop.js — Drag-and-drop sorting utility
 * Works for both sections and items lists.
 */

window.DragDrop = (() => {
  /**
   * Make a list container sortable via drag-and-drop.
   *
   * @param {HTMLElement} listEl - The container with draggable children
   * @param {object} opts
   *   - itemSelector {string} - CSS selector for draggable items
   *   - handleSelector {string} - CSS selector for the drag handle
   *   - onReorder {function(newOrder)} - called with array of data-id values in new order
   *   - dragClass {string} - class added to dragging item
   */
  function makeSortable(listEl, opts) {
    const {
      itemSelector = '[data-id]',
      handleSelector = '.drag-handle',
      onReorder = () => {},
      dragClass = 'dragging',
      placeholderClass = 'drag-placeholder'
    } = opts;

    let dragEl = null;
    let placeholder = null;
    let startIndex = -1;

    function getItems() {
      return Array.from(listEl.querySelectorAll(`:scope > ${itemSelector}`));
    }

    function getOrder() {
      return getItems().map(el => el.dataset.id);
    }

    function createPlaceholder(refEl) {
      const ph = document.createElement('div');
      ph.className = placeholderClass;
      ph.style.height = refEl.offsetHeight + 'px';
      return ph;
    }

    function insertBefore(el, ref) {
      listEl.insertBefore(el, ref);
    }

    listEl.addEventListener('mousedown', e => {
      const handle = e.target.closest(handleSelector);
      if (!handle) return;

      const item = handle.closest(itemSelector);
      if (!item) return;

      e.preventDefault();

      dragEl = item;
      startIndex = getItems().indexOf(item);
      placeholder = createPlaceholder(item);

      // Record initial mouse offset within element
      const rect = item.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      // Style the dragging element
      dragEl.classList.add(dragClass);
      dragEl.style.position = 'fixed';
      dragEl.style.zIndex = '999';
      dragEl.style.width = item.offsetWidth + 'px';
      dragEl.style.pointerEvents = 'none';

      listEl.insertBefore(placeholder, item);

      function onMouseMove(e2) {
        dragEl.style.left = (e2.clientX - offsetX) + 'px';
        dragEl.style.top  = (e2.clientY - offsetY) + 'px';

        // Find insertion point
        const items = getItems().filter(el => el !== dragEl);
        let closest = null;
        let closestDist = Infinity;

        items.forEach(el => {
          if (el === placeholder) return;
          const r = el.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const dist = Math.abs(e2.clientY - mid);
          if (dist < closestDist) { closestDist = dist; closest = { el, mid }; }
        });

        if (closest) {
          if (e2.clientY < closest.mid) {
            listEl.insertBefore(placeholder, closest.el);
          } else {
            listEl.insertBefore(placeholder, closest.el.nextSibling);
          }
        }
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // Reset styles
        dragEl.classList.remove(dragClass);
        dragEl.style.position = '';
        dragEl.style.zIndex = '';
        dragEl.style.width = '';
        dragEl.style.left = '';
        dragEl.style.top = '';
        dragEl.style.pointerEvents = '';

        // Move element to placeholder position
        listEl.insertBefore(dragEl, placeholder);
        placeholder.remove();
        placeholder = null;

        const newOrder = getOrder();
        const endIndex = newOrder.indexOf(dragEl.dataset.id);

        if (endIndex !== startIndex) {
          onReorder(newOrder);
        }

        dragEl = null;
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      document.body.appendChild(dragEl);
      dragEl.style.left = rect.left + 'px';
      dragEl.style.top  = rect.top  + 'px';
    });

    // Touch support
    listEl.addEventListener('touchstart', e => {
      const handle = e.target.closest(handleSelector);
      if (!handle) return;
      const item = handle.closest(itemSelector);
      if (!item) return;

      e.preventDefault();
      const touch = e.touches[0];
      const rect = item.getBoundingClientRect();
      const offsetX = touch.clientX - rect.left;
      const offsetY = touch.clientY - rect.top;

      dragEl = item;
      startIndex = getItems().indexOf(item);
      placeholder = createPlaceholder(item);

      dragEl.classList.add(dragClass);
      dragEl.style.position = 'fixed';
      dragEl.style.zIndex = '999';
      dragEl.style.width = item.offsetWidth + 'px';
      dragEl.style.pointerEvents = 'none';
      listEl.insertBefore(placeholder, item);
      document.body.appendChild(dragEl);
      dragEl.style.left = rect.left + 'px';
      dragEl.style.top  = rect.top  + 'px';

      function onTouchMove(e2) {
        const t = e2.touches[0];
        dragEl.style.left = (t.clientX - offsetX) + 'px';
        dragEl.style.top  = (t.clientY - offsetY) + 'px';

        const items = getItems().filter(el => el !== dragEl && el !== placeholder);
        let closest = null, closestDist = Infinity;
        items.forEach(el => {
          const r = el.getBoundingClientRect();
          const mid = r.top + r.height / 2;
          const dist = Math.abs(t.clientY - mid);
          if (dist < closestDist) { closestDist = dist; closest = { el, mid }; }
        });
        if (closest) {
          if (t.clientY < closest.mid) listEl.insertBefore(placeholder, closest.el);
          else listEl.insertBefore(placeholder, closest.el.nextSibling);
        }
      }

      function onTouchEnd() {
        listEl.removeEventListener('touchmove', onTouchMove);
        listEl.removeEventListener('touchend', onTouchEnd);

        dragEl.classList.remove(dragClass);
        dragEl.style.position = '';
        dragEl.style.zIndex = '';
        dragEl.style.width = '';
        dragEl.style.left = '';
        dragEl.style.top = '';
        dragEl.style.pointerEvents = '';

        listEl.insertBefore(dragEl, placeholder);
        placeholder.remove();
        placeholder = null;

        const newOrder = getOrder();
        const endIndex = newOrder.indexOf(dragEl.dataset.id);
        if (endIndex !== startIndex) onReorder(newOrder);
        dragEl = null;
      }

      listEl.addEventListener('touchmove', onTouchMove, { passive: false });
      listEl.addEventListener('touchend', onTouchEnd);
    }, { passive: false });
  }

  return { makeSortable };
})();
