/**
 * validators.js — Input validation utilities
 */

window.Validators = {
  /**
   * Check if a value is non-empty
   */
  required(value) {
    return typeof value === 'string' ? value.trim().length > 0 : value != null;
  },

  /**
   * Validate a price value
   */
  price(value) {
    if (value === null || value === undefined || value === '') return true; // optional
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  },

  /**
   * Validate a URL
   */
  url(value) {
    if (!value) return true; // optional
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  },

  /**
   * Check if URL points to an image (async - tries to load)
   */
  async imageUrl(url) {
    if (!url) return { valid: true };
    if (!this.url(url)) return { valid: false, error: 'Invalid URL format' };

    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ valid: true });
      img.onerror = () => resolve({ valid: false, error: 'Image could not be loaded' });
      img.src = url;
      setTimeout(() => resolve({ valid: false, error: 'Image load timed out' }), 8000);
    });
  },

  /**
   * Validate a phone number (basic)
   */
  phone(value) {
    if (!value) return true;
    return /^[+\d\s\-()]{6,20}$/.test(value);
  },

  /**
   * Validate JSON string
   */
  json(str) {
    try {
      const data = JSON.parse(str);
      return { valid: true, data };
    } catch (e) {
      return { valid: false, error: e.message };
    }
  },

  /**
   * Validate a MenuData object
   */
  menuData(data) {
    const errors = [];
    if (!data || typeof data !== 'object') return { valid: false, errors: ['Invalid JSON structure'] };
    if (!data.version) errors.push('Missing version field');
    if (!data.restaurant) errors.push('Missing restaurant object');
    else if (!data.restaurant.name) errors.push('Missing restaurant.name');
    if (!data.sections || !Array.isArray(data.sections)) errors.push('Missing sections array');
    return { valid: errors.length === 0, errors };
  }
};
