/**
 * id.js — Unique ID generation utilities
 */

window.IdUtils = {
  /**
   * Generate a short unique ID (e.g. "ab3f9x")
   */
  generate() {
    return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  },

  /**
   * Generate a UUID v4
   */
  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Slug from string
   */
  slug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
};
