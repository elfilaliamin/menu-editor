/**
 * menuRenderer.js — Standalone menu HTML/CSS/JS generator
 * This produces the complete inline index.html for the exported menu.
 * NO React, NO Vite, NO editor dependencies.
 */

window.MenuRenderer = (() => {

  function buildCSS(themeId, appearance) {
    const cssVars = Themes.buildCSSVars(themeId, appearance);
    const fontImport = buildFontImport(appearance?.font);

    const menuWidthMap = { sm: '640px', md: '768px', lg: '900px', full: '100%' };
    const maxWidth = menuWidthMap[appearance?.menuWidth || 'lg'] || '900px';

    const imageShapeMap = {
      square: '0px',
      rounded: '10px',
      circle: '50%'
    };
    const imgRadius = imageShapeMap[appearance?.imageShape || 'rounded'] || '10px';

    const cardRadiusMap = { none:'0', sm:'4px', md:'8px', lg:'12px', xl:'20px' };
    const cardRadius = cardRadiusMap[appearance?.borderRadius || 'lg'] || '12px';

    return `
${fontImport}
:root {
${cssVars}
  --max-width: ${maxWidth};
  --img-radius: ${imgRadius};
  --card-radius: ${cardRadius};
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{
  font-family:var(--menu-font);
  background:var(--menu-bg);
  color:var(--menu-text);
  line-height:1.5;
  min-height:100vh;
}
img{max-width:100%;height:auto;display:block}
a{color:var(--menu-primary);text-decoration:none}

/* ---- Menu Container ---- */
.menu-container{
  max-width:var(--max-width);

/* ---- Header ---- */
.menu-header{
  position:relative;background:var(--menu-header-bg);
  border-bottom:1px solid var(--menu-border);
  overflow:hidden;
}
.menu-cover{
  width:100%;height:180px;object-fit:cover;display:block;
}
.menu-header-content{
  padding:24px 20px;max-width:var(--max-width);margin:0 auto;
}
.menu-logo-row{
  display:flex;align-items:center;gap:16px;margin-bottom:12px;
}
.menu-logo{
  width:72px;height:72px;border-radius:var(--img-radius);
  object-fit:cover;border:3px solid var(--menu-surface);
  box-shadow:0 4px 14px rgba(0,0,0,0.1);flex-shrink:0;
  background:var(--menu-surface);
}
.menu-name{
  font-family:var(--menu-font-display);
  font-size:1.6rem;font-weight:800;color:var(--menu-text);
  line-height:1.2;
}
.menu-description{
  font-size:0.9rem;color:var(--menu-text-muted);
  line-height:1.5;margin-bottom:12px;
}
.menu-meta{
  display:flex;flex-direction:column;gap:4px;font-size:0.82rem;opacity:0.8;
}
.menu-meta-row{display:flex;align-items:center;gap:6px}

/* ---- Search Bar ---- */
.menu-search-bar{
  padding:12px 16px;
  background:var(--menu-nav-bg);
  border-bottom:1px solid var(--menu-nav-border);
  position:sticky;top:0;z-index:50;
  backdrop-filter:blur(10px);
}
.menu-search-input{
  width:100%;padding:10px 14px;
  background:var(--menu-search-bg);
  color:var(--menu-text);
  border:1px solid var(--menu-search-border);
  border-radius:50px;font-size:0.9rem;
  outline:none;transition:border-color 0.2s,box-shadow 0.2s;
}
.menu-search-input:focus{
  border-color:var(--menu-primary);
  box-shadow:0 0 0 3px color-mix(in srgb,var(--menu-primary) 15%,transparent);
}
.menu-search-input::placeholder{color:var(--menu-text-muted)}

/* ---- Section Navigation ---- */
.section-nav{
  display:flex;gap:0;overflow-x:auto;padding:0 12px;
  background:var(--menu-nav-bg);
  border-bottom:1px solid var(--menu-nav-border);
  scrollbar-width:none;
  position:sticky;top:0;z-index:49;
  backdrop-filter:blur(10px);
}
.section-nav-has-search{top:52px}
.section-nav::-webkit-scrollbar{display:none}
.section-nav-btn{
  flex-shrink:0;padding:12px 16px;
  background:none;border:none;cursor:pointer;
  color:var(--menu-text-muted);font-size:0.85rem;font-weight:600;
  border-bottom:2px solid transparent;margin-bottom:-1px;
  transition:color 0.2s,border-color 0.2s;white-space:nowrap;
}
.section-nav-btn:hover{color:var(--menu-text)}
.section-nav-btn.active{
  color:var(--menu-primary);
  border-bottom-color:var(--menu-primary);
}

/* ---- Sections ---- */
.menu-body{padding:0 0 40px}
.menu-section{padding:24px 16px 0;scroll-margin-top:120px}
.menu-section:last-child{padding-bottom:40px}
.section-header{margin-bottom:20px}
.section-title{
  font-family:var(--menu-font-display);
  font-size:1.4rem;font-weight:800;
  color:var(--menu-text);margin-bottom:4px;
}
.section-description{font-size:0.875rem;color:var(--menu-text-muted);line-height:1.5}
.section-cover{
  width:100%;height:120px;object-fit:cover;
  border-radius:var(--card-radius);margin-bottom:12px;
}
.section-divider{height:2px;background:var(--menu-border);margin-bottom:16px}

/* ---- Item List Layout ---- */
.items-list-layout{display:flex;flex-direction:column;gap:12px}

.item-card-list{
  display:flex;align-items:center;gap:14px;
  background:var(--menu-surface);
  border:1px solid var(--menu-border);
  border-radius:var(--card-radius);
  padding:14px;
  box-shadow:var(--menu-card-shadow);
  transition:transform 0.2s,box-shadow 0.2s;
  position:relative;
}
.item-card-list:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.1)}
.item-card-list.unavailable{opacity:0.5}

.item-img-list{
  width:80px;height:80px;border-radius:var(--img-radius);
  object-fit:cover;flex-shrink:0;
  background:var(--menu-border);
}
.item-info-list{flex:1;min-width:0}
.item-name-list{
  font-size:1rem;font-weight:700;color:var(--menu-text);margin-bottom:3px;
  line-height:1.3;
}
.item-desc-list{
  font-size:0.82rem;color:var(--menu-text-muted);line-height:1.5;margin-bottom:6px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
.item-price-list{
  font-size:1rem;font-weight:800;color:var(--menu-price);
}
.item-price-small{font-size:0.8rem;color:var(--menu-text-muted);font-weight:400}

/* ---- Item Grid Layout ---- */
.items-grid-layout{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
  gap:14px;
}
@media(min-width:600px){.items-grid-layout{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}}

.item-card-grid{
  background:var(--menu-surface);
  border:1px solid var(--menu-border);
  border-radius:var(--card-radius);
  overflow:hidden;
  box-shadow:var(--menu-card-shadow);
  transition:transform 0.2s,box-shadow 0.2s;
  position:relative;
}
.item-card-grid:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.12)}
.item-card-grid.unavailable{opacity:0.5}
.item-img-grid{
  width:100%;aspect-ratio:1;object-fit:cover;
  background:var(--menu-border);
}
.item-grid-body{padding:12px}
.item-name-grid{
  font-size:0.9rem;font-weight:700;color:var(--menu-text);margin-bottom:4px;line-height:1.3;
}
.item-desc-grid{
  font-size:0.78rem;color:var(--menu-text-muted);
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
  margin-bottom:8px;
}
.item-price-grid{font-size:0.95rem;font-weight:800;color:var(--menu-price)}

/* ---- Compact Layout ---- */
.items-compact-layout{display:flex;flex-direction:column}
.item-card-compact{
  display:flex;align-items:center;justify-content:space-between;
  padding:10px 0;border-bottom:1px solid var(--menu-border);gap:12px;
}
.item-card-compact:last-child{border-bottom:none}
.item-card-compact.unavailable .item-name-compact{opacity:0.4;text-decoration:line-through}
.item-name-compact{font-size:0.9rem;font-weight:600;color:var(--menu-text);flex:1}
.item-desc-compact{font-size:0.78rem;color:var(--menu-text-muted);margin-top:2px}
.item-price-compact{font-size:0.9rem;font-weight:800;color:var(--menu-price);white-space:nowrap;flex-shrink:0}
.item-img-compact{width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0}

/* ---- Badges & Tags ---- */
.item-badge{
  display:inline-block;padding:3px 8px;border-radius:50px;
  font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;
  background:var(--menu-badge-bg);color:var(--menu-badge-text);
  margin-bottom:5px;
}
.item-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.item-tag{
  display:inline-block;font-size:0.68rem;padding:2px 6px;
  border-radius:50px;border:1px solid var(--menu-border);
  color:var(--menu-text-muted);font-weight:500;
}
.unavailable-label{
  font-size:0.72rem;color:var(--menu-text-muted);font-style:italic;margin-top:2px;
}

/* ---- Language Switcher ---- */
.lang-switcher{
  display:flex;gap:0;padding:8px 16px;
  background:var(--menu-nav-bg);
  border-bottom:1px solid var(--menu-nav-border);
}
.lang-btn{
  padding:6px 12px;border:1px solid var(--menu-border);cursor:pointer;
  font-size:0.8rem;font-weight:600;background:none;color:var(--menu-text-muted);
  transition:all 0.2s;
}
.lang-btn:first-child{border-radius:6px 0 0 6px}
.lang-btn:last-child{border-radius:0 6px 6px 0}
.lang-btn.active{background:var(--menu-primary);color:white;border-color:var(--menu-primary)}
.lang-btn:hover:not(.active){color:var(--menu-text);background:var(--menu-border)}

/* ---- Footer ---- */
.menu-footer{
  padding:24px 16px;text-align:center;
  color:var(--menu-text-muted);font-size:0.8rem;
  border-top:1px solid var(--menu-border);
  margin-top:32px;
}
.menu-footer-links{display:flex;justify-content:center;gap:16px;margin-top:8px;flex-wrap:wrap}
.menu-footer-link{color:var(--menu-text-muted);font-size:0.8rem;transition:color 0.2s}
.menu-footer-link:hover{color:var(--menu-primary)}

/* ---- Search Results ---- */
.search-results-count{
  padding:8px 16px;font-size:0.8rem;color:var(--menu-text-muted);
}
.no-results{
  padding:48px 16px;text-align:center;color:var(--menu-text-muted);
}
.no-results h3{font-size:1rem;font-weight:600;margin-bottom:8px;color:var(--menu-text)}

/* ---- Responsive ---- */
@media(max-width:480px){
  .menu-name{font-size:1.4rem}
  .menu-cover{height:180px}
  .item-img-list{width:64px;height:64px}
  .items-grid-layout{grid-template-columns:1fr 1fr}
}

/* ---- RTL overrides ---- */
[dir=rtl] .menu-logo-row{flex-direction:row-reverse}
[dir=rtl] .item-card-list{flex-direction:row-reverse}
[dir=rtl] .item-card-compact{flex-direction:row-reverse}
[dir=rtl] .section-nav{flex-direction:row-reverse}
[dir=rtl] .lang-switcher{flex-direction:row-reverse}
[dir=rtl] .lang-btn:first-child{border-radius:0 6px 6px 0}
[dir=rtl] .lang-btn:last-child{border-radius:6px 0 0 6px}
`;
  }

  function buildFontImport(font) {
    if (!font || font === 'System') return '';
    const fontMap = {
      'Inter': 'Inter:wght@400;600;700;800',
      'DM Sans': 'DM+Sans:wght@400;500;600;700',
      'Playfair Display': 'Playfair+Display:wght@400;600;700;800'
    };
    const param = fontMap[font];
    if (!param) return '';
    return `@import url('https://fonts.googleapis.com/css2?family=${param}&display=swap');\n`;
  }

  function buildJS(menuData) {
    // All the runtime JS for the exported menu
    return `
(function() {
  'use strict';

  let menuData = null;
  let currentLang = 'en';
  let currentSearch = '';

  // ---- Load menu data ----
  function init() {
    try {
      const jsonEl = document.getElementById('menu-data-json');
      if (jsonEl && jsonEl.textContent) {
        try {
          menuData = JSON.parse(jsonEl.textContent.trim());
        } catch (err) {
          console.error('Failed to parse menu data:', err);
        }
      }

      if (!menuData) {
        throw new Error('Could not load menu data');
      }

      currentLang = menuData.settings?.language || 'en';
      renderMenu();
      initSearch();
      initSectionNav();
      initLangSwitcher();
    } catch (e) {
      console.error('Menu load error:', e);
      document.body.innerHTML = '<div style="padding:40px;text-align:center;color:#ef4444"><h2>Could not load menu</h2><p style="margin-top:8px;color:#94a3b8">'+e.message+'</p></div>';
    }
  }

  // ---- Get translated text ----
  function t(obj, field) {
    if (!obj) return '';
    const trans = obj.translations?.[currentLang]?.[field];
    return trans || obj[field] || '';
  }

  // ---- Get image src ----
  function imgSrc(imageRef) {
    if (!imageRef) return null;
    return imageRef.dataUrl || imageRef.src || null;
  }

  // ---- Format price ----
  function formatPrice(item) {
    const currency = menuData.settings?.currency || '';
    if (item.variants && item.variants.length > 0) {
      return item.variants.map(v => v.label + ': ' + v.price + ' ' + currency).join('<br/>');
    }
    if (item.price !== null && item.price !== undefined) {
      return item.price + ' ' + currency;
    }
    return '';
  }

  // ---- Tag emoji map ----
  const tagEmoji = {
    popular:'🔥', new:'✨', spicy:'🌶', vegetarian:'🌿', chef:'👨‍🍳', recommended:'⭐'
  };

  // ---- Get layout for section ----
  function getLayout(section) {
    const ap = menuData.appearance || {};
    return section.displayStyle || ap.itemLayout || 'list';
  }

  // ---- Render full menu ----
  function renderMenu() {
    if (!menuData) return;
    const r = menuData.restaurant || {};
    const s = menuData.settings || {};
    const ap = menuData.appearance || {};

    // Apply RTL
    if (s.rtl) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = currentLang;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = currentLang;
    }

    const container = document.getElementById('menu-root');
    if (!container) return;

    const sections = menuData.sections || [];
    const showSearch = s.enableSearch !== false;
    const showLangSwitch = s.enableLanguageSelector !== false && (s.languages || []).length > 1;

    // Build header
    const logoSrc = imgSrc(r.logo);
    const coverSrc = imgSrc(r.cover);

    container.innerHTML =
      '<div class="menu-container">' +
        renderHeader(r, coverSrc, logoSrc) +
        (showLangSwitch ? renderLangSwitcher(s) : '') +
        (showSearch ? '<div class="menu-search-bar"><input type="text" class="menu-search-input" id="menu-search" placeholder="Search menu..." aria-label="Search menu" /></div>' : '') +
        '<div id="section-nav-wrapper"></div>' +
        '<div class="menu-body" id="menu-body">' +
          renderSections(sections, s, ap) +
        '</div>' +
        renderFooter(s, r) +
      '</div>';
  }

  function renderHeader(r, coverSrc, logoSrc) {
    const name = t(r, 'name') || r.name || '';
    const desc = t(r, 'description') || r.description || '';
    let html = '<div class="menu-header">';
    if (coverSrc) html += '<img src="' + coverSrc + '" class="menu-cover" alt="Cover" onerror="this.style.display=\'none\'" />';
    html += '<div class="menu-header-content">';
    html += '<div class="menu-logo-row">';
    if (logoSrc) html += '<img src="' + logoSrc + '" class="menu-logo" alt="Logo" onerror="this.style.display=\'none\'" />';
    html += '<div>';
    html += '<div class="menu-name">' + esc(name) + '</div>';
    html += '</div></div>';
    if (desc) html += '<div class="menu-description">' + esc(desc) + '</div>';
    html += '<div class="menu-meta">';
    if (r.address) html += '<div class="menu-meta-row">📍 ' + esc(r.address) + '</div>';
    if (r.hours)   html += '<div class="menu-meta-row">🕐 ' + esc(r.hours) + '</div>';
    html += '</div>';
    html += renderSocialIcons(r);
    html += '</div></div>';
    return html;
  }

  function renderSocialIcons(r) {
    if (!r) return '';
    let buttons = [];

    if (r.facebook) {
      const url = r.facebook.startsWith('http') ? r.facebook : 'https://facebook.com/' + r.facebook.replace(/^@/, '');
      buttons.push('<a href="' + esc(url) + '" target="_blank" rel="noopener" class="social-icon-btn facebook" title="Facebook" aria-label="Facebook">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' +
        '</a>');
    }

    if (r.instagram) {
      const url = r.instagram.startsWith('http') ? r.instagram : 'https://instagram.com/' + r.instagram.replace(/^@/, '');
      buttons.push('<a href="' + esc(url) + '" target="_blank" rel="noopener" class="social-icon-btn instagram" title="Instagram" aria-label="Instagram">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' +
        '</a>');
    }

    if (r.whatsapp) {
      const num = r.whatsapp.replace(/[^0-9+]/g, '');
      const url = 'https://wa.me/' + num;
      buttons.push('<a href="' + esc(url) + '" target="_blank" rel="noopener" class="social-icon-btn whatsapp" title="WhatsApp" aria-label="WhatsApp">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>' +
        '</a>');
    }

    if (r.phone) {
      const num = r.phone.replace(/[^0-9+]/g, '');
      buttons.push('<a href="tel:' + esc(num) + '" class="social-icon-btn phone" title="Call Us" aria-label="Call Us">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l1.36-1.36a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
        '</a>');
    }

    if (r.website) {
      const url = r.website.startsWith('http') ? r.website : 'https://' + r.website;
      buttons.push('<a href="' + esc(url) + '" target="_blank" rel="noopener" class="social-icon-btn website" title="Website" aria-label="Website">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
        '</a>');
    }

    if (buttons.length === 0) return '';
    return '<div class="social-icon-bar">' + buttons.join('') + '</div>';
  }

  function renderLangSwitcher(s) {
    const langNames = { en:'English', fr:'Français', ar:'العربية' };
    const langs = s.languages || [];
    if (langs.length < 2) return '';
    let html = '<div class="lang-switcher">';
    langs.forEach(l => {
      html += '<button class="lang-btn ' + (l === currentLang ? 'active' : '') + '" data-lang="' + l + '">' + (langNames[l] || l) + '</button>';
    });
    html += '</div>';
    return html;
  }

  function renderSections(sections, s, ap) {
    const showUnavail = s.showUnavailable !== false;
    const showDesc = s.showDescriptions !== false;
    const showImgs = s.showImages !== false;
    const showPrices = s.showPrices !== false;

    if (!sections.length) return '<div style="padding:48px;text-align:center;color:var(--menu-text-muted)">Menu coming soon.</div>';

    let html = '';
    sections.forEach(section => {
      const items = section.items || [];
      const visible = showUnavail ? items : items.filter(i => i.available !== false);
      if (visible.length === 0) return;

      html += '<div class="menu-section" id="section-' + section.id + '" data-section-id="' + section.id + '">';
      html += '<div class="section-header">';
      if (section.cover && imgSrc(section.cover)) {
        html += '<img src="' + imgSrc(section.cover) + '" class="section-cover" alt="" onerror="this.style.display=\'none\'" />';
      }
      html += '<div class="section-title">' + esc(t(section, 'title') || section.title) + '</div>';
      if (section.description && showDesc) {
        html += '<div class="section-description">' + esc(t(section, 'description') || section.description) + '</div>';
      }
      html += '</div>';
      html += '<div class="section-divider"></div>';

      const layout = getLayout(section);
      if (layout === 'grid') {
        html += '<div class="items-grid-layout">' + visible.map(item => renderItemGrid(item, showDesc, showImgs, showPrices)).join('') + '</div>';
      } else if (layout === 'compact') {
        html += '<div class="items-compact-layout">' + visible.map(item => renderItemCompact(item, showDesc, showImgs, showPrices)).join('') + '</div>';
      } else {
        html += '<div class="items-list-layout">' + visible.map(item => renderItemList(item, showDesc, showImgs, showPrices)).join('') + '</div>';
      }
      html += '</div>';
    });
    return html;
  }

  function renderItemList(item, showDesc, showImgs, showPrices) {
    const name = t(item, 'name') || item.name || '';
    const desc = t(item, 'description') || item.description || '';
    const src = imgSrc(item.image);
    const unavail = item.available === false;
    let html = '<div class="item-card-list ' + (unavail ? 'unavailable' : '') + '">';
    if (showImgs && src) html += '<img src="' + src + '" class="item-img-list" alt="' + esc(name) + '" loading="lazy" onerror="this.style.display=\'none\'" />';
    html += '<div class="item-info-list">';
    if (item.badge) html += '<div class="item-badge">' + esc(item.badge) + '</div>';
    html += '<div class="item-name-list">' + esc(name) + '</div>';
    if (showDesc && desc) html += '<div class="item-desc-list">' + esc(desc) + '</div>';
    if ((item.tags || []).length > 0) {
      html += '<div class="item-tags">' + item.tags.map(tag => '<span class="item-tag">' + (tagEmoji[tag] || '') + ' ' + tag + '</span>').join('') + '</div>';
    }
    if (showPrices) html += '<div class="item-price-list">' + formatPrice(item) + '</div>';
    if (unavail) html += '<div class="unavailable-label">Currently unavailable</div>';
    html += '</div></div>';
    return html;
  }

  function renderItemGrid(item, showDesc, showImgs, showPrices) {
    const name = t(item, 'name') || item.name || '';
    const desc = t(item, 'description') || item.description || '';
    const src = imgSrc(item.image);
    const unavail = item.available === false;
    let html = '<div class="item-card-grid ' + (unavail ? 'unavailable' : '') + '">';
    if (showImgs && src) html += '<img src="' + src + '" class="item-img-grid" alt="' + esc(name) + '" loading="lazy" onerror="this.style.display=\'none\'" />';
    html += '<div class="item-grid-body">';
    if (item.badge) html += '<div class="item-badge">' + esc(item.badge) + '</div>';
    html += '<div class="item-name-grid">' + esc(name) + '</div>';
    if (showDesc && desc) html += '<div class="item-desc-grid">' + esc(desc) + '</div>';
    if (showPrices) html += '<div class="item-price-grid">' + formatPrice(item) + '</div>';
    if (unavail) html += '<div class="unavailable-label">Unavailable</div>';
    html += '</div></div>';
    return html;
  }

  function renderItemCompact(item, showDesc, showImgs, showPrices) {
    const name = t(item, 'name') || item.name || '';
    const desc = t(item, 'description') || item.description || '';
    const src = imgSrc(item.image);
    const unavail = item.available === false;
    let html = '<div class="item-card-compact ' + (unavail ? 'unavailable' : '') + '">';
    html += '<div style="flex:1">';
    if (item.badge) html += '<div class="item-badge">' + esc(item.badge) + '</div>';
    html += '<div class="item-name-compact">' + esc(name) + '</div>';
    if (showDesc && desc) html += '<div class="item-desc-compact">' + esc(desc) + '</div>';
    html += '</div>';
    if (showPrices) html += '<div class="item-price-compact">' + formatPrice(item) + '</div>';
    if (showImgs && src) html += '<img src="' + src + '" class="item-img-compact" alt="" loading="lazy" onerror="this.style.display=\'none\'" />';
    html += '</div>';
    return html;
  }

  function renderFooter(s, r) {
    const footerText = s.footerText || ('© ' + new Date().getFullYear() + ' ' + (r.name || '') + '. All rights reserved.');
    let html = '<div class="menu-footer">';
    html += '<div>' + esc(footerText) + '</div>';
    html += '<div class="menu-footer-links">';
    if (r.instagram) html += '<a class="menu-footer-link" href="https://instagram.com/' + esc(r.instagram.replace('@','')) + '" target="_blank" rel="noopener">' + esc(r.instagram) + '</a>';
    if (r.website)   html += '<a class="menu-footer-link" href="' + esc(r.website) + '" target="_blank" rel="noopener">Website</a>';
    if (r.phone)     html += '<a class="menu-footer-link" href="tel:' + esc(r.phone) + '">' + esc(r.phone) + '</a>';
    if (r.whatsapp)  html += '<a class="menu-footer-link" href="https://wa.me/' + esc(r.whatsapp.replace(/[^0-9]/g,'')) + '" target="_blank" rel="noopener">WhatsApp</a>';
    html += '</div></div>';
    return html;
  }

  // ---- Section Navigation ----
  function initSectionNav() {
    const sections = (menuData?.sections || []).filter(s => s.items?.length > 0);
    const wrapper = document.getElementById('section-nav-wrapper');
    if (!wrapper || !sections.length) return;

    const showSearch = menuData.settings?.enableSearch !== false;

    let html = '<div class="section-nav ' + (showSearch ? 'section-nav-has-search' : '') + '" id="section-nav">';
    sections.forEach(section => {
      html += '<button class="section-nav-btn" data-section="' + section.id + '">' + esc(t(section, 'title') || section.title) + '</button>';
    });
    html += '</div>';
    wrapper.innerHTML = html;

    // Bind clicks
    document.querySelectorAll('.section-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const el = document.getElementById('section-' + btn.dataset.section);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveNav(btn.dataset.section);
      });
    });

    // Intersection observer to highlight active section
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.dataset.sectionId);
        }
      });
    }, { threshold: 0.3, rootMargin: '-60px 0px -60% 0px' });

    document.querySelectorAll('.menu-section').forEach(el => observer.observe(el));

    // Set first active
    if (sections.length) setActiveNav(sections[0].id);
  }

  function setActiveNav(id) {
    document.querySelectorAll('.section-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === id);
    });
  }

  // ---- Search ----
  function initSearch() {
    if (menuData.settings?.enableSearch === false) return;
    const searchInput = document.getElementById('menu-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.trim().toLowerCase();
      applySearch();
    });
  }

  function applySearch() {
    const sections = menuData?.sections || [];
    if (!currentSearch) {
      renderAllSections();
      return;
    }

    const body = document.getElementById('menu-body');
    if (!body) return;

    let allMatches = [];
    sections.forEach(section => {
      (section.items || []).forEach(item => {
        const name = (t(item,'name') || item.name || '').toLowerCase();
        const desc = (t(item,'description') || item.description || '').toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        if (name.includes(currentSearch) || desc.includes(currentSearch) || tags.includes(currentSearch)) {
          allMatches.push({ item, section });
        }
      });
    });

    const s = menuData.settings || {};
    const ap = menuData.appearance || {};
    const showDesc = s.showDescriptions !== false;
    const showImgs = s.showImages !== false;
    const showPrices = s.showPrices !== false;

    if (!allMatches.length) {
      body.innerHTML = '<div class="no-results"><h3>No results found</h3><p>Try a different search term.</p></div>';
      return;
    }

    body.innerHTML = '<div class="search-results-count">' + allMatches.length + ' result' + (allMatches.length !== 1 ? 's' : '') + ' for "' + esc(currentSearch) + '"</div>' +
      '<div class="menu-section"><div class="items-list-layout">' +
      allMatches.map(m => renderItemList(m.item, showDesc, showImgs, showPrices)).join('') +
      '</div></div>';
  }

  function renderAllSections() {
    const body = document.getElementById('menu-body');
    if (!body) return;
    const s = menuData.settings || {};
    const ap = menuData.appearance || {};
    body.innerHTML = renderSections(menuData.sections || [], s, ap);
  }

  // ---- Language Switcher ----
  function initLangSwitcher() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-lang]');
      if (!btn) return;
      const lang = btn.dataset.lang;
      if (!lang || lang === currentLang) return;

      currentLang = lang;

      // Update RTL
      const s = menuData.settings || {};
      const isRTL = lang === 'ar' || (lang !== 'en' && lang !== 'fr' && s.rtl);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;

      // Re-render
      renderMenu();
      initSearch();
      initSectionNav();
      initLangSwitcher();
    });
  }

  // ---- Escape HTML ----
  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ---- Start ----
  init();
})();
`;
  }

  function escapeJsonForScriptTag(jsonStr) {
    return jsonStr.replace(/</g, '\\u003c').replace(/-->/g, '--\\>');
  }

  /**
   * Generate the complete standalone index.html content
   */
  function generateHTML(menuData) {
    const themeId = menuData.settings?.theme || 'modern';
    const appearance = menuData.appearance || {};
    const isRTL = menuData.settings?.rtl || false;
    const lang = menuData.settings?.language || 'en';

    const css = buildCSS(themeId, appearance);
    const js  = buildJS(menuData);

    const restaurantName = menuData.restaurant?.name || 'Digital Menu';
    const safeJson = escapeJsonForScriptTag(JSON.stringify(menuData));

    return '<!DOCTYPE html>\n' +
'<html lang="' + escHtml(lang) + '" dir="' + (isRTL ? 'rtl' : 'ltr') + '">\n' +
'<head>\n' +
'  <meta charset="UTF-8" />\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
'  <title>' + escHtml(restaurantName) + ' — Menu</title>\n' +
'  <meta name="description" content="View our menu at ' + escHtml(restaurantName) + '. Browse our food menu." />\n' +
'  <meta name="theme-color" content="' + (appearance.primaryColor || '#6366f1') + '" />\n' +
'  <style>\n' + css + '\n  </style>\n' +
'</head>\n' +
'<body>\n' +
'  <div id="menu-root"></div>\n' +
'  <script id="menu-data-json" type="application/json">\n' + safeJson + '\n  </script>\n' +
'  <script>\n' + js + '\n  </script>\n' +
'</body>\n' +
'</html>';
  }

  /**
   * Render menu live directly into a DOM container element (used for real-time editor preview)
   */
  function renderToContainer(container, menuData) {
    if (!container || !menuData) return;

    const themeId = menuData.settings?.theme || 'modern';
    const appearance = menuData.appearance || {};
    const css = buildCSS(themeId, appearance);

    // Inject/update preview theme CSS
    let styleEl = document.getElementById('preview-theme-css');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'preview-theme-css';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;

    const r = menuData.restaurant || {};
    const s = menuData.settings || {};
    const ap = menuData.appearance || {};
    const sections = menuData.sections || [];
    const isRTL = s.rtl || false;
    const currentLang = s.language || 'en';

    container.dir = isRTL ? 'rtl' : 'ltr';

    const logoSrc = imgSrc(r.logo);
    const coverSrc = imgSrc(r.cover);
    const showSearch = s.enableSearch !== false;
    const showLangSwitch = s.enableLanguageSelector !== false && (s.languages || []).length > 1;

    container.innerHTML =
      '<div class="menu-container">' +
        renderHeader(r, coverSrc, logoSrc, currentLang) +
        (showLangSwitch ? renderLangSwitcher(s, currentLang) : '') +
        (showSearch ? '<div class="menu-search-bar"><input type="text" class="menu-search-input" id="menu-preview-search" placeholder="Search menu..." aria-label="Search menu" /></div>' : '') +
        '<div id="section-nav-wrapper"></div>' +
        '<div class="menu-body" id="menu-body">' +
          renderSections(sections, s, ap, currentLang) +
        '</div>' +
        renderFooter(s, r, currentLang) +
      '</div>';
  }

  function renderHeader(r, coverSrc, logoSrc, currentLang = 'en') {
    const name = t(r, 'name', currentLang) || r.name || '';
    const desc = t(r, 'description', currentLang) || r.description || '';
    let html = '<div class="menu-header">';
    if (coverSrc) html += '<img src="' + coverSrc + '" class="menu-cover" alt="Cover" onerror="this.style.display=\'none\'" />';
    html += '<div class="menu-header-content">';
    html += '<div class="menu-logo-row">';
    if (logoSrc) html += '<img src="' + logoSrc + '" class="menu-logo" alt="Logo" onerror="this.style.display=\'none\'" />';
    html += '<div>';
    html += '<div class="menu-name">' + esc(name) + '</div>';
    html += '</div></div>';
    if (desc) html += '<div class="menu-description">' + esc(desc) + '</div>';
    html += '<div class="menu-meta">';
    if (r.address) html += '<div class="menu-meta-row">📍 ' + esc(r.address) + '</div>';
    if (r.hours)   html += '<div class="menu-meta-row">🕐 ' + esc(r.hours) + '</div>';
    html += '</div>';
    html += renderSocialIcons(r);
    html += '</div></div>';
    return html;
  }

  function renderSocialIcons(r) {
    if (!r) return '';
    let buttons = [];

    if (r.facebook) {
      const url = r.facebook.startsWith('http') ? r.facebook : 'https://facebook.com/' + r.facebook.replace(/^@/, '');
      buttons.push('<a href="' + esc(url) + '" target="_blank" rel="noopener" class="social-icon-btn facebook" title="Facebook" aria-label="Facebook">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' +
        '</a>');
    }

    if (r.instagram) {
      const url = r.instagram.startsWith('http') ? r.instagram : 'https://instagram.com/' + r.instagram.replace(/^@/, '');
      buttons.push('<a href="' + esc(url) + '" target="_blank" rel="noopener" class="social-icon-btn instagram" title="Instagram" aria-label="Instagram">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' +
        '</a>');
    }

    if (r.whatsapp) {
      const num = r.whatsapp.replace(/[^0-9+]/g, '');
      const url = 'https://wa.me/' + num;
      buttons.push('<a href="' + esc(url) + '" target="_blank" rel="noopener" class="social-icon-btn whatsapp" title="WhatsApp" aria-label="WhatsApp">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>' +
        '</a>');
    }

    if (r.phone) {
      const num = r.phone.replace(/[^0-9+]/g, '');
      buttons.push('<a href="tel:' + esc(num) + '" class="social-icon-btn phone" title="Call Us" aria-label="Call Us">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l1.36-1.36a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
        '</a>');
    }

    if (r.website) {
      const url = r.website.startsWith('http') ? r.website : 'https://' + r.website;
      buttons.push('<a href="' + esc(url) + '" target="_blank" rel="noopener" class="social-icon-btn website" title="Website" aria-label="Website">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>' +
        '</a>');
    }

    if (buttons.length === 0) return '';
    return '<div class="social-icon-bar">' + buttons.join('') + '</div>';
  }

  function renderLangSwitcher(s, currentLang = 'en') {
    const langNames = { en:'English', fr:'Français', ar:'العربية' };
    const langs = s.languages || [];
    if (langs.length < 2) return '';
    let html = '<div class="lang-switcher">';
    langs.forEach(l => {
      html += '<button class="lang-btn ' + (l === currentLang ? 'active' : '') + '" data-lang="' + l + '">' + (langNames[l] || l) + '</button>';
    });
    html += '</div>';
    return html;
  }

  function renderSections(sections, s, ap, currentLang = 'en') {
    const showUnavail = s.showUnavailable !== false;
    const showDesc = s.showDescriptions !== false;
    const showImgs = s.showImages !== false;
    const showPrices = s.showPrices !== false;

    if (!sections.length) return '<div style="padding:48px;text-align:center;color:var(--menu-text-muted)">Menu coming soon.</div>';

    let html = '';
    sections.forEach(section => {
      const items = section.items || [];
      const visible = showUnavail ? items : items.filter(i => i.available !== false);
      if (visible.length === 0) return;

      html += '<div class="menu-section" id="section-' + section.id + '" data-section-id="' + section.id + '">';
      html += '<div class="section-header">';
      if (section.cover && imgSrc(section.cover)) {
        html += '<img src="' + imgSrc(section.cover) + '" class="section-cover" alt="" onerror="this.style.display=\'none\'" />';
      }
      html += '<div class="section-title">' + esc(t(section, 'title', currentLang) || section.title) + '</div>';
      if (section.description && showDesc) {
        html += '<div class="section-description">' + esc(t(section, 'description', currentLang) || section.description) + '</div>';
      }
      html += '</div>';
      html += '<div class="section-divider"></div>';

      const layout = section.displayStyle || ap.itemLayout || 'list';
      if (layout === 'grid') {
        html += '<div class="items-grid-layout">' + visible.map(item => renderItemGrid(item, showDesc, showImgs, showPrices, currentLang, s)).join('') + '</div>';
      } else if (layout === 'compact') {
        html += '<div class="items-compact-layout">' + visible.map(item => renderItemCompact(item, showDesc, showImgs, showPrices, currentLang, s)).join('') + '</div>';
      } else {
        html += '<div class="items-list-layout">' + visible.map(item => renderItemList(item, showDesc, showImgs, showPrices, currentLang, s)).join('') + '</div>';
      }
      html += '</div>';
    });
    return html;
  }

  function renderItemList(item, showDesc, showImgs, showPrices, currentLang = 'en', s = {}) {
    const name = t(item, 'name', currentLang) || item.name || '';
    const desc = t(item, 'description', currentLang) || item.description || '';
    const src = imgSrc(item.image);
    const unavail = item.available === false;
    const tagEmoji = { popular:'🔥', new:'✨', spicy:'🌶', vegetarian:'🌿', chef:'👨‍🍳', recommended:'⭐' };
    let html = '<div class="item-card-list ' + (unavail ? 'unavailable' : '') + '">';
    if (showImgs && src) html += '<img src="' + src + '" class="item-img-list" alt="' + esc(name) + '" loading="lazy" onerror="this.style.display=\'none\'" />';
    html += '<div class="item-info-list">';
    if (item.badge) html += '<div class="item-badge">' + esc(item.badge) + '</div>';
    html += '<div class="item-name-list">' + esc(name) + '</div>';
    if (showDesc && desc) html += '<div class="item-desc-list">' + esc(desc) + '</div>';
    if ((item.tags || []).length > 0) {
      html += '<div class="item-tags">' + item.tags.map(tag => '<span class="item-tag">' + (tagEmoji[tag] || '') + ' ' + tag + '</span>').join('') + '</div>';
    }
    if (showPrices) html += '<div class="item-price-list">' + formatPriceItem(item, s.currency || '') + '</div>';
    if (unavail) html += '<div class="unavailable-label">Currently unavailable</div>';
    html += '</div></div>';
    return html;
  }

  function renderItemGrid(item, showDesc, showImgs, showPrices, currentLang = 'en', s = {}) {
    const name = t(item, 'name', currentLang) || item.name || '';
    const desc = t(item, 'description', currentLang) || item.description || '';
    const src = imgSrc(item.image);
    const unavail = item.available === false;
    const tagEmoji = { popular:'🔥', new:'✨', spicy:'🌶', vegetarian:'🌿', chef:'👨‍🍳', recommended:'⭐' };
    let html = '<div class="item-card-grid ' + (unavail ? 'unavailable' : '') + '">';
    if (showImgs && src) html += '<img src="' + src + '" class="item-img-grid" alt="' + esc(name) + '" loading="lazy" onerror="this.style.display=\'none\'" />';
    html += '<div class="item-info-grid">';
    if (item.badge) html += '<div class="item-badge">' + esc(item.badge) + '</div>';
    html += '<div class="item-name-grid">' + esc(name) + '</div>';
    if (showDesc && desc) html += '<div class="item-desc-grid">' + esc(desc) + '</div>';
    if ((item.tags || []).length > 0) {
      html += '<div class="item-tags">' + item.tags.map(tag => '<span class="item-tag">' + (tagEmoji[tag] || '') + ' ' + tag + '</span>').join('') + '</div>';
    }
    if (showPrices) html += '<div class="item-price-grid">' + formatPriceItem(item, s.currency || '') + '</div>';
    if (unavail) html += '<div class="unavailable-label">Currently unavailable</div>';
    html += '</div></div>';
    return html;
  }

  function renderItemCompact(item, showDesc, showImgs, showPrices, currentLang = 'en', s = {}) {
    const name = t(item, 'name', currentLang) || item.name || '';
    const desc = t(item, 'description', currentLang) || item.description || '';
    const unavail = item.available === false;
    let html = '<div class="item-card-compact ' + (unavail ? 'unavailable' : '') + '">';
    html += '<div class="item-compact-left">';
    html += '<div class="item-name-compact">' + esc(name) + '</div>';
    if (showDesc && desc) html += '<div class="item-desc-compact">' + esc(desc) + '</div>';
    html += '</div>';
    if (showPrices) html += '<div class="item-price-compact">' + formatPriceItem(item, s.currency || '') + '</div>';
    html += '</div>';
    return html;
  }

  function renderFooter(s, r, currentLang = 'en') {
    let html = '<div class="menu-footer">';
    if (s.footerText) html += '<div class="menu-footer-text">' + esc(s.footerText) + '</div>';
    if (r.instagram || r.facebook || r.website) {
      html += '<div class="social-links">';
      if (r.instagram) html += '<a href="' + esc(r.instagram) + '" target="_blank" rel="noopener" class="social-link">Instagram</a>';
      if (r.facebook)  html += '<a href="' + esc(r.facebook) + '" target="_blank" rel="noopener" class="social-link">Facebook</a>';
      if (r.website)   html += '<a href="' + esc(r.website) + '" target="_blank" rel="noopener" class="social-link">Website</a>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function formatPriceItem(item, currency) {
    if (item.variants && item.variants.length > 0) {
      return item.variants.map(v => esc(v.label) + ': ' + esc(v.price) + ' ' + esc(currency)).join('<br/>');
    }
    if (item.price !== null && item.price !== undefined) {
      return esc(item.price) + ' ' + esc(currency);
    }
    return '';
  }

  function t(obj, field, lang = 'en') {
    if (!obj) return '';
    const trans = obj.translations?.[lang]?.[field];
    return trans || obj[field] || '';
  }

  function imgSrc(imageRef) {
    if (!imageRef) return null;
    return imageRef.dataUrl || imageRef.src || null;
  }

  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function escHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { generateHTML, buildCSS, buildJS, renderToContainer };
})();
