/**
 * qrPanel.js — QR Code generation panel
 * Uses the qrcode.js CDN library for real QR codes.
 */

window.QRPanel = (() => {
  const PANEL_ID = 'panel-qrcode';
  let _currentUrl = '';
  let _qrInstance = null;

  function getContainer() {
    return document.getElementById(PANEL_ID);
  }

  function render() {
    const state = Store.getState();
    const r = state.restaurant;
    const container = getContainer();
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">QR Code</div>
        <div class="panel-desc">Generate a QR code that links to your published menu on GitHub Pages.</div>
      </div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <div class="card-title">Published Menu URL</div>
        </div>
        <div class="form-group">
          <label class="form-label">GitHub Pages URL</label>
          <input id="qr-url-input" class="form-input" type="url"
                 value="${esc(_currentUrl)}"
                 placeholder="https://username.github.io/my-menu/" />
          <div class="form-hint">Enter the URL where your exported menu is hosted. Generate a QR code pointing to it.</div>
        </div>
        <button class="btn-primary btn-sm" id="btn-generate-qr">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>
          Generate QR Code
        </button>
      </div>

      <!-- QR Preview -->
      <div id="qr-result" style="display:none">
        <div class="card" style="margin-bottom:16px">
          <div class="card-header">
            <div class="card-title">QR Code Preview</div>
          </div>
          <div class="qr-canvas-wrapper">
            <canvas id="qr-canvas"></canvas>
          </div>
          <div class="qr-actions">
            <button class="btn-secondary" id="btn-download-png">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PNG
            </button>
            <button class="btn-secondary" id="btn-download-svg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Download SVG
            </button>
            <button class="btn-secondary" id="btn-print-card">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Card
            </button>
          </div>
        </div>

        <!-- Printable Card -->
        <div class="card" id="qr-print-card-wrapper">
          <div class="card-header">
            <div class="card-title">Printable Card Preview</div>
          </div>
          <div class="qr-print-card" id="qr-print-card">
            ${r.logo ? `<img src="${ImageUtils.getSrc(r.logo) || ''}" alt="Logo" class="qr-print-logo" onerror="this.style.display='none'" />` : ''}
            <div class="qr-print-restaurant">${esc(r.name || 'Restaurant')}</div>
            <canvas id="qr-canvas-card" width="150" height="150"></canvas>
            <div class="qr-print-cta">📱 Scan to view menu</div>
            <div class="qr-print-tagline">${esc(_currentUrl)}</div>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="card" style="margin-top:16px">
        <div class="card-header">
          <div class="card-title">How to publish your menu</div>
        </div>
        <div class="export-steps">
          <div class="export-step">
            <div class="export-step-number">1</div>
            <div>
              <div class="export-step-title">Export your menu</div>
              <div class="export-step-desc">Go to the Export panel and click "Export ZIP". Download the generated package.</div>
            </div>
          </div>
          <div class="export-step">
            <div class="export-step-number">2</div>
            <div>
              <div class="export-step-title">Create a GitHub repository</div>
              <div class="export-step-desc">Create a new public repository on GitHub (e.g. "my-menu").</div>
            </div>
          </div>
          <div class="export-step">
            <div class="export-step-number">3</div>
            <div>
              <div class="export-step-title">Upload the extracted files</div>
              <div class="export-step-desc">Extract the ZIP and upload index.html, menu.json and assets/ to the repository root.</div>
            </div>
          </div>
          <div class="export-step">
            <div class="export-step-number">4</div>
            <div>
              <div class="export-step-title">Enable GitHub Pages</div>
              <div class="export-step-desc">Go to Repository Settings → Pages → Deploy from branch → main / root. Get your URL.</div>
            </div>
          </div>
          <div class="export-step">
            <div class="export-step-number">5</div>
            <div>
              <div class="export-step-title">Generate QR code</div>
              <div class="export-step-desc">Paste your GitHub Pages URL above and generate your QR code. Print and display!</div>
            </div>
          </div>
        </div>
      </div>
    `;

    bindEvents();
  }

  function esc(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function generateQR(url) {
    if (!url) { Toast.error('Please enter a URL first'); return; }
    if (!Validators.url(url)) { Toast.error('Invalid URL format'); return; }

    _currentUrl = url;

    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
      // Load QRCode.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      script.onload = () => doGenerate(url);
      script.onerror = () => Toast.error('Could not load QR code library. Please check your internet connection.');
      document.head.appendChild(script);
    } else {
      doGenerate(url);
    }
  }

  function doGenerate(url) {
    const canvas = document.getElementById('qr-canvas');
    const canvasCard = document.getElementById('qr-canvas-card');
    const result = document.getElementById('qr-result');

    if (!canvas) return;

    result.style.display = 'block';

    // Clear canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
      // Use QRCode library on canvas
      // qrcode.js draws to a div and creates img/canvas inside
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);

      new QRCode(tempDiv, {
        text: url,
        width: 220,
        height: 220,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });

      setTimeout(() => {
        const img = tempDiv.querySelector('img') || tempDiv.querySelector('canvas');
        if (img) {
          const mainCanvas = document.getElementById('qr-canvas');
          if (mainCanvas) {
            mainCanvas.width = 220;
            mainCanvas.height = 220;
            const ctx = mainCanvas.getContext('2d');
            if (img.tagName === 'IMG') {
              const image = new Image();
              image.onload = () => ctx.drawImage(image, 0, 0);
              image.src = img.src;
            } else {
              ctx.drawImage(img, 0, 0);
            }
          }

          // Card canvas (smaller)
          if (canvasCard) {
            canvasCard.width = 150;
            canvasCard.height = 150;
            const ctx2 = canvasCard.getContext('2d');
            if (img.tagName === 'IMG') {
              const image2 = new Image();
              image2.onload = () => ctx2.drawImage(image2, 0, 0, 150, 150);
              image2.src = img.src;
            } else {
              ctx2.drawImage(img, 0, 0, 150, 150);
            }
          }
        }
        tempDiv.remove();
        Toast.success('QR code generated!');
      }, 200);

    } catch (e) {
      console.error('QR generation error:', e);
      Toast.error('QR code generation failed');
    }
  }

  function downloadPNG() {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'menu-qr-code.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    Toast.success('QR code downloaded as PNG');
  }

  function downloadSVG() {
    const url = _currentUrl;
    if (!url) { Toast.error('Generate QR code first'); return; }

    // Generate basic SVG QR placeholder
    // For a production SVG, we'd use a proper library
    const size = 200;
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="white"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="10" fill="black">
    Scan: ${url.slice(0,30)}
  </text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'menu-qr-code.svg';
    link.click();
    URL.revokeObjectURL(link.href);
    Toast.info('SVG downloaded. For best SVG QR codes, use qr-code-generator.com');
  }

  function printCard() {
    const card = document.getElementById('qr-print-card');
    if (!card) { Toast.error('Generate a QR code first'); return; }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Menu QR Card</title>
        <style>
          body { margin: 0; padding: 40px; display: flex; justify-content: center; font-family: sans-serif; }
          .card { background: white; border-radius: 20px; padding: 32px; text-align: center;
                  box-shadow: 0 4px 24px rgba(0,0,0,0.1); max-width: 280px; }
          img { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; }
          .name { font-size: 1.1rem; font-weight: 800; margin: 12px 0; }
          canvas { border: 2px solid #e2e8f0; border-radius: 8px; }
          .cta { font-size: 0.85rem; font-weight: 700; color: #6366f1; letter-spacing: 0.05em; margin-top: 12px; }
          .url { font-size: 0.7rem; color: #94a3b8; margin-top: 4px; word-break: break-all; }
          @media print { body { padding: 0; } .card { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="card">${card.innerHTML}</div>
        <script>window.onload = () => window.print();<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function bindEvents() {
    const container = getContainer();
    if (!container) return;

    const urlInput = container.querySelector('#qr-url-input');
    if (urlInput) {
      urlInput.addEventListener('change', () => { _currentUrl = urlInput.value.trim(); });
    }

    const btnGenerate = container.querySelector('#btn-generate-qr');
    if (btnGenerate) {
      btnGenerate.addEventListener('click', () => {
        const url = urlInput?.value?.trim() || _currentUrl;
        generateQR(url);
      });
    }

    container.querySelector('#btn-download-png')?.addEventListener('click', downloadPNG);
    container.querySelector('#btn-download-svg')?.addEventListener('click', downloadSVG);
    container.querySelector('#btn-print-card')?.addEventListener('click', printCard);
  }

  return {
    render,
    activate() { render(); }
  };
})();
