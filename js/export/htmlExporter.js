/**
 * htmlExporter.js — Generates exportable menu.json
 * Strips internal editor-only fields (dataUrl) from the exported JSON.
 */

window.HtmlExporter = (() => {

  /**
   * Generate the clean menu.json content (string)
   * - Removes dataUrl from local images (those go into assets/)
   * - Keeps src paths relative (assets/image.webp)
   */
  function generateMenuJson(menuData) {
    const clean = JSON.parse(JSON.stringify(menuData));

    // Clean image refs
    function cleanImageRef(ref) {
      if (!ref) return ref;
      if (ref.type === 'local') {
        // Remove dataUrl — assets are stored separately
        return { type: 'local', src: ref.src, filename: ref.filename };
      }
      return ref; // URL refs are unchanged
    }

    // Restaurant images
    clean.restaurant.logo  = cleanImageRef(clean.restaurant.logo);
    clean.restaurant.cover = cleanImageRef(clean.restaurant.cover);

    // Section and item images
    (clean.sections || []).forEach(section => {
      section.cover = cleanImageRef(section.cover);
      (section.items || []).forEach(item => {
        item.image = cleanImageRef(item.image);
      });
    });

    return JSON.stringify(clean, null, 2);
  }

  /**
   * Collect all local image blobs from menu data
   * Returns: [{ filename: 'assets/burger.webp', dataUrl: '...' }]
   */
  function collectLocalImages(menuData) {
    const images = [];
    const seen = new Set();

    function collect(ref) {
      if (!ref || ref.type !== 'local' || !ref.dataUrl) return;
      if (seen.has(ref.src)) return;
      seen.add(ref.src);
      images.push({
        path: ref.src,           // e.g. 'assets/burger.webp'
        filename: ref.filename,  // e.g. 'burger.webp'
        dataUrl: ref.dataUrl
      });
    }

    collect(menuData.restaurant?.logo);
    collect(menuData.restaurant?.cover);

    (menuData.sections || []).forEach(section => {
      collect(section.cover);
      (section.items || []).forEach(item => {
        collect(item.image);
      });
    });

    return images;
  }

  /**
   * Convert base64 data URL to a Uint8Array blob
   */
  function dataUrlToUint8Array(dataUrl) {
    const parts = dataUrl.split(',');
    const base64 = parts[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  return {
    generateMenuJson,
    collectLocalImages,
    dataUrlToUint8Array
  };
})();
