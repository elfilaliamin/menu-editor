/**
 * imageUtils.js — Image handling utilities
 */

window.ImageUtils = {
  /**
   * Create an ImageRef from a URL
   */
  fromUrl(src) {
    if (!src) return null;
    return { type: 'url', src };
  },

  /**
   * Create an ImageRef from a local upload
   */
  fromLocal(filename, dataUrl) {
    return { type: 'local', src: `assets/${filename}`, dataUrl, filename };
  },

  /**
   * Get the display src for an ImageRef (for use in editor/preview)
   */
  getSrc(imageRef) {
    if (!imageRef) return null;
    if (imageRef.type === 'url') return imageRef.src;
    if (imageRef.type === 'local') return imageRef.dataUrl || imageRef.src;
    return null;
  },

  /**
   * Determine if imageRef is empty
   */
  isEmpty(imageRef) {
    return !imageRef || !imageRef.src;
  },

  /**
   * Convert a File to base64 data URL
   */
  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Sanitize a filename (for assets folder)
   */
  sanitizeFilename(name) {
    return name.toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-');
  },

  /**
   * Validate file type
   */
  isValidType(file) {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return allowed.includes(file.type);
  },

  /**
   * Validate file size (max 5MB)
   */
  isValidSize(file, maxMB = 5) {
    return file.size <= maxMB * 1024 * 1024;
  },

  /**
   * Get a fallback placeholder SVG data URL
   */
  placeholder(width = 400, height = 300, text = 'No Image') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#1e293b"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="14">${text}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
};
