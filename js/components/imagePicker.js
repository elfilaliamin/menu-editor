/**
 * imagePicker.js — Reusable image picker component
 * Supports URL input, local upload, or no image.
 */

window.ImagePicker = (() => {
  /**
   * Render an image picker widget into a container element.
   *
   * @param {HTMLElement} container - Where to render
   * @param {object} opts
   *   - imageRef {object|null} - current ImageRef
   *   - onChange {function} - called with new ImageRef or null
   *   - aspectRatio {'16/9'|'square'} - preview ratio
   *   - label {string} - optional label
   *   - showRemove {boolean}
   */
  function render(container, opts) {
    const {
      imageRef = null,
      onChange = () => {},
      aspectRatio = '16/9',
      label = '',
      showRemove = true
    } = opts;

    let currentRef = imageRef ? JSON.parse(JSON.stringify(imageRef)) : null;
    let activeTab = currentRef?.type || 'url';

    function getPreviewSrc() {
      return ImageUtils.getSrc(currentRef);
    }

    function update(newRef) {
      currentRef = newRef;
      onChange(newRef);
      renderUI();
    }

    function renderUI() {
      const previewSrc = getPreviewSrc();
      const isSquare = aspectRatio === 'square';

      container.innerHTML = `
        ${label ? `<label class="form-label">${label}</label>` : ''}
        <div class="image-picker">
          <div class="image-picker-tabs">
            <button class="image-tab-btn ${activeTab === 'url' ? 'active' : ''}" data-tab="url">URL</button>
            <button class="image-tab-btn ${activeTab === 'upload' ? 'active' : ''}" data-tab="upload">Upload</button>
            <button class="image-tab-btn ${activeTab === 'none' ? 'active' : ''}" data-tab="none">None</button>
          </div>

          ${activeTab === 'url' ? `
            <div class="url-tab-content">
              <input
                class="form-input"
                type="url"
                id="img-url-input-${container.dataset.pickerId}"
                placeholder="https://example.com/image.jpg"
                value="${currentRef?.type === 'url' ? (currentRef.src || '') : ''}"
              />
              <div class="form-hint">Paste a direct image URL (HTTPS recommended)</div>
              <div id="url-validation-${container.dataset.pickerId}" class="form-hint" style="margin-top:4px;"></div>
            </div>
          ` : ''}

          ${activeTab === 'upload' ? `
            <div class="upload-tab-content">
              <div class="image-upload-area" id="upload-area-${container.dataset.pickerId}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--text-muted);margin:0 auto 8px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px">Drag & drop or click to upload</div>
                <div style="font-size:0.7rem;color:var(--text-muted)">JPG, PNG, WEBP — max 5MB</div>
                <input type="file" id="file-input-${container.dataset.pickerId}" accept="image/jpeg,image/jpg,image/png,image/webp" style="display:none" />
              </div>
            </div>
          ` : ''}

          ${activeTab === 'none' ? `
            <div class="form-hint" style="margin-top:4px">No image will be shown.</div>
          ` : ''}

          ${previewSrc ? `
            <div class="image-preview-box ${isSquare ? 'square' : ''}" style="margin-top:10px">
              <img
                id="img-preview-${container.dataset.pickerId}"
                src="${previewSrc}"
                alt="Preview"
                onerror="this.src='${ImageUtils.placeholder()}';this.style.padding='16px';this.style.opacity='0.5'"
              />
              ${showRemove ? `
                <button class="image-remove-btn" id="img-remove-${container.dataset.pickerId}" aria-label="Remove image">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              ` : ''}
            </div>
          ` : ''}
        </div>
      `;

      bindEvents();
    }

    function bindEvents() {
      const pid = container.dataset.pickerId;

      // Tab switching
      container.querySelectorAll('.image-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTab = btn.dataset.tab;
          if (activeTab === 'none') {
            update(null);
          } else {
            renderUI();
          }
        });
      });

      // URL input
      const urlInput = container.querySelector(`#img-url-input-${pid}`);
      if (urlInput) {
        let urlTimer = null;
        urlInput.addEventListener('input', () => {
          clearTimeout(urlTimer);
          const url = urlInput.value.trim();
          if (!url) { update(null); return; }
          const validationEl = container.querySelector(`#url-validation-${pid}`);

          urlTimer = setTimeout(async () => {
            if (!Validators.url(url)) {
              if (validationEl) validationEl.textContent = '⚠ Invalid URL format';
              return;
            }
            if (validationEl) validationEl.textContent = '↻ Validating...';

            const result = await Validators.imageUrl(url);
            if (result.valid) {
              if (validationEl) validationEl.textContent = '✓ Image loaded successfully';
              update(ImageUtils.fromUrl(url));
            } else {
              if (validationEl) validationEl.textContent = `⚠ ${result.error}`;
              // Still store the URL so user can save it
              update(ImageUtils.fromUrl(url));
            }
          }, 600);
        });
      }

      // File upload
      const uploadArea = container.querySelector(`#upload-area-${pid}`);
      const fileInput = container.querySelector(`#file-input-${pid}`);

      if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());

        uploadArea.addEventListener('dragover', e => {
          e.preventDefault();
          uploadArea.classList.add('drag-over');
        });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
        uploadArea.addEventListener('drop', async e => {
          e.preventDefault();
          uploadArea.classList.remove('drag-over');
          const file = e.dataTransfer?.files?.[0];
          if (file) await handleFile(file);
        });

        fileInput.addEventListener('change', async () => {
          const file = fileInput.files?.[0];
          if (file) await handleFile(file);
        });
      }

      // Remove button
      const removeBtn = container.querySelector(`#img-remove-${pid}`);
      if (removeBtn) {
        removeBtn.addEventListener('click', e => {
          e.stopPropagation();
          update(null);
          activeTab = 'url';
          renderUI();
        });
      }
    }

    async function handleFile(file) {
      if (!ImageUtils.isValidType(file)) {
        Toast.error('Invalid file type. Please use JPG, PNG, or WEBP.');
        return;
      }
      if (!ImageUtils.isValidSize(file)) {
        Toast.error('File too large. Maximum size is 5MB.');
        return;
      }
      const dataUrl = await ImageUtils.fileToDataUrl(file);
      const filename = ImageUtils.sanitizeFilename(file.name);
      update(ImageUtils.fromLocal(filename, dataUrl));
    }

    // Assign unique ID for DOM targeting
    container.dataset.pickerId = IdUtils.generate();
    renderUI();
  }

  return { render };
})();
