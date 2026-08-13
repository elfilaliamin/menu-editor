/**
 * themes.js — Theme definitions for the 5 polished themes
 */

window.Themes = {
  definitions: {
    modern: {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional',
      preview: {
        headerBg: '#6366f1',
        cardBg: '#f1f5f9',
        accent: '#6366f1',
        text: '#1e293b'
      },
      css: {
        '--menu-bg': '#f8fafc',
        '--menu-surface': '#ffffff',
        '--menu-border': '#e2e8f0',
        '--menu-primary': '#6366f1',
        '--menu-primary-dark': '#4f46e5',
        '--menu-text': '#1e293b',
        '--menu-text-muted': '#64748b',
        '--menu-price': '#6366f1',
        '--menu-header-bg': 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        '--menu-header-text': '#ffffff',
        '--menu-section-bg': '#ffffff',
        '--menu-section-border': '#e2e8f0',
        '--menu-card-shadow': '0 2px 12px rgba(0,0,0,0.06)',
        '--menu-card-radius': '12px',
        '--menu-nav-bg': 'rgba(255,255,255,0.95)',
        '--menu-nav-border': 'rgba(226,232,240,0.8)',
        '--menu-font': '"Inter", sans-serif',
        '--menu-font-display': '"Inter", sans-serif',
        '--menu-badge-bg': 'rgba(99,102,241,0.1)',
        '--menu-badge-text': '#6366f1',
        '--menu-tag-available': '#10b981',
        '--menu-tag-unavailable': '#94a3b8',
        '--menu-search-bg': '#ffffff',
        '--menu-search-border': '#e2e8f0',
      }
    },

    minimal: {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean whitespace & typography',
      preview: {
        headerBg: '#111827',
        cardBg: '#f9fafb',
        accent: '#111827',
        text: '#111827'
      },
      css: {
        '--menu-bg': '#fafafa',
        '--menu-surface': '#ffffff',
        '--menu-border': '#f0f0f0',
        '--menu-primary': '#111827',
        '--menu-primary-dark': '#000000',
        '--menu-text': '#111827',
        '--menu-text-muted': '#9ca3af',
        '--menu-price': '#111827',
        '--menu-header-bg': '#111827',
        '--menu-header-text': '#ffffff',
        '--menu-section-bg': '#ffffff',
        '--menu-section-border': '#f0f0f0',
        '--menu-card-shadow': 'none',
        '--menu-card-radius': '4px',
        '--menu-nav-bg': 'rgba(250,250,250,0.98)',
        '--menu-nav-border': '#f0f0f0',
        '--menu-font': '"DM Sans", sans-serif',
        '--menu-font-display': '"Playfair Display", serif',
        '--menu-badge-bg': '#f3f4f6',
        '--menu-badge-text': '#374151',
        '--menu-tag-available': '#111827',
        '--menu-tag-unavailable': '#d1d5db',
        '--menu-search-bg': '#f3f4f6',
        '--menu-search-border': '#e5e7eb',
      }
    },

    luxury: {
      id: 'luxury',
      name: 'Luxury',
      description: 'Dark gold premium feel',
      preview: {
        headerBg: '#0c0a09',
        cardBg: '#1c1a16',
        accent: '#d4a843',
        text: '#fef3c7'
      },
      css: {
        '--menu-bg': '#0c0a09',
        '--menu-surface': '#1c1a16',
        '--menu-border': '#2d2a22',
        '--menu-primary': '#d4a843',
        '--menu-primary-dark': '#b8912f',
        '--menu-text': '#fef3c7',
        '--menu-text-muted': '#9b8c6e',
        '--menu-price': '#d4a843',
        '--menu-header-bg': 'linear-gradient(180deg,#1c1a16,#0c0a09)',
        '--menu-header-text': '#fef3c7',
        '--menu-section-bg': '#1c1a16',
        '--menu-section-border': '#2d2a22',
        '--menu-card-shadow': '0 4px 24px rgba(0,0,0,0.5)',
        '--menu-card-radius': '8px',
        '--menu-nav-bg': 'rgba(12,10,9,0.95)',
        '--menu-nav-border': '#2d2a22',
        '--menu-font': '"Playfair Display", serif',
        '--menu-font-display': '"Playfair Display", serif',
        '--menu-badge-bg': 'rgba(212,168,67,0.15)',
        '--menu-badge-text': '#d4a843',
        '--menu-tag-available': '#d4a843',
        '--menu-tag-unavailable': '#4a4035',
        '--menu-search-bg': '#1c1a16',
        '--menu-search-border': '#2d2a22',
      }
    },

    cafe: {
      id: 'cafe',
      name: 'Café',
      description: 'Warm browns, cozy feel',
      preview: {
        headerBg: '#92400e',
        cardBg: '#fef9f2',
        accent: '#d97706',
        text: '#451a03'
      },
      css: {
        '--menu-bg': '#fef9f2',
        '--menu-surface': '#ffffff',
        '--menu-border': '#fed7aa',
        '--menu-primary': '#d97706',
        '--menu-primary-dark': '#b45309',
        '--menu-text': '#451a03',
        '--menu-text-muted': '#92400e',
        '--menu-price': '#b45309',
        '--menu-header-bg': 'linear-gradient(135deg,#92400e,#d97706)',
        '--menu-header-text': '#fffbeb',
        '--menu-section-bg': '#fffbeb',
        '--menu-section-border': '#fde68a',
        '--menu-card-shadow': '0 2px 16px rgba(180,83,9,0.1)',
        '--menu-card-radius': '16px',
        '--menu-nav-bg': 'rgba(255,251,235,0.95)',
        '--menu-nav-border': 'rgba(253,230,138,0.8)',
        '--menu-font': '"DM Sans", sans-serif',
        '--menu-font-display': '"Playfair Display", serif',
        '--menu-badge-bg': 'rgba(217,119,6,0.1)',
        '--menu-badge-text': '#b45309',
        '--menu-tag-available': '#d97706',
        '--menu-tag-unavailable': '#d1fae5',
        '--menu-search-bg': '#fffbeb',
        '--menu-search-border': '#fed7aa',
      }
    },

    fastfood: {
      id: 'fastfood',
      name: 'Fast Food',
      description: 'Bold colors, high energy',
      preview: {
        headerBg: '#dc2626',
        cardBg: '#1f2937',
        accent: '#fbbf24',
        text: '#ffffff'
      },
      css: {
        '--menu-bg': '#111827',
        '--menu-surface': '#1f2937',
        '--menu-border': '#374151',
        '--menu-primary': '#fbbf24',
        '--menu-primary-dark': '#f59e0b',
        '--menu-text': '#f9fafb',
        '--menu-text-muted': '#9ca3af',
        '--menu-price': '#fbbf24',
        '--menu-header-bg': 'linear-gradient(135deg,#dc2626,#ef4444)',
        '--menu-header-text': '#ffffff',
        '--menu-section-bg': '#1f2937',
        '--menu-section-border': '#374151',
        '--menu-card-shadow': '0 4px 16px rgba(0,0,0,0.4)',
        '--menu-card-radius': '8px',
        '--menu-nav-bg': 'rgba(17,24,39,0.97)',
        '--menu-nav-border': '#374151',
        '--menu-font': '"Inter", sans-serif',
        '--menu-font-display': '"Inter", sans-serif',
        '--menu-badge-bg': 'rgba(251,191,36,0.15)',
        '--menu-badge-text': '#fbbf24',
        '--menu-tag-available': '#22c55e',
        '--menu-tag-unavailable': '#4b5563',
        '--menu-search-bg': '#1f2937',
        '--menu-search-border': '#374151',
      }
    }
  },

  get(themeId) {
    return this.definitions[themeId] || this.definitions.modern;
  },

  getAll() {
    return Object.values(this.definitions);
  },

  /**
   * Build CSS variables string for a theme + appearance overrides
   */
  buildCSSVars(themeId, appearance) {
    const theme = this.get(themeId);
    const vars = { ...theme.css };

    // Apply appearance overrides
    if (appearance) {
      if (appearance.primaryColor)    vars['--menu-primary'] = appearance.primaryColor;
      if (appearance.secondaryColor)  vars['--menu-primary-dark'] = appearance.secondaryColor;
      if (appearance.backgroundColor) vars['--menu-bg'] = appearance.backgroundColor;
      if (appearance.textColor)       vars['--menu-text'] = appearance.textColor;
      if (appearance.font) {
        const fontMap = {
          'Inter': '"Inter", sans-serif',
          'DM Sans': '"DM Sans", sans-serif',
          'Playfair Display': '"Playfair Display", serif',
          'System': 'system-ui, sans-serif'
        };
        vars['--menu-font'] = fontMap[appearance.font] || vars['--menu-font'];
      }

      const radiusMap = {
        'none': '0px', 'sm': '4px', 'md': '8px', 'lg': '12px', 'xl': '20px'
      };
      if (appearance.borderRadius) {
        vars['--menu-card-radius'] = radiusMap[appearance.borderRadius] || vars['--menu-card-radius'];
      }
    }

    return Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
  }
};
