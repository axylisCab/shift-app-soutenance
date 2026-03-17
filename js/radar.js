/* ============================================
   SHIFT — Radar Chart (SVG Pentagon)
   ============================================ */

class RadarChart {
  constructor(svgElement, size = 500) {
    this.svg = svgElement;
    this.size = size;
    this.center = size / 2;
    this.maxRadius = size * 0.36; // ~180 sur 500 (+33% vs 135)
    this.axes = SHIFT_DATA.axes;
    this.levels = 4;
  }

  // Calculate point position on pentagon
  getPoint(axisIndex, value, maxVal = 4) {
    const angle = (Math.PI * 2 * axisIndex) / this.axes.length - Math.PI / 2;
    const radius = (value / maxVal) * this.maxRadius;
    return {
      x: this.center + radius * Math.cos(angle),
      y: this.center + radius * Math.sin(angle)
    };
  }

  // Draw the background grid
  drawGrid() {
    let html = '';

    // Draw level polygons
    for (let level = 1; level <= this.levels; level++) {
      const points = this.axes.map((_, i) => {
        const p = this.getPoint(i, level, this.levels);
        return `${p.x},${p.y}`;
      }).join(' ');

      const opacity = level === this.levels ? 0.3 : 0.12;
      html += `<polygon points="${points}" fill="none" stroke="rgba(255,255,255,${opacity})" stroke-width="2" stroke-dasharray="${level < this.levels ? '6,6' : 'none'}"/>`;
    }

    // Draw axis lines
    this.axes.forEach((axis, i) => {
      const p = this.getPoint(i, this.levels, this.levels);
      html += `<line x1="${this.center}" y1="${this.center}" x2="${p.x}" y2="${p.y}" 
               stroke="rgba(255,255,255,0.15)" stroke-width="2"/>`;
    });

    // Étiquettes des axes (Titres uniquement)
    this.axes.forEach((axis, i) => {
      // Titre en majuscules - Ajusté pour le nouveau rayon
      const pLabel = this.getPoint(i, this.levels + 0.95, this.levels);
      html += `<text x="${pLabel.x}" y="${pLabel.y}" text-anchor="middle" dominant-baseline="middle" 
               fill="var(--text-primary)" font-family="Outfit" font-weight="800" font-size="28" style="letter-spacing: 1px;">
               ${axis.label.toUpperCase()}</text>`;
    });

    return html;
  }

  // Draw the data polygon with animation
  drawData(scores, animate = true, isGhost = false) {
    const points = this.axes.map((_, i) => {
      const p = this.getPoint(i, scores[i]);
      return `${p.x},${p.y}`;
    }).join(' ');

    const id = isGhost ? 'ghost' : 'main';
    const gradientId = `radarGrad_${id}_${Date.now()}`;

    if (isGhost) {
      return `<polygon points="${points}" fill="rgba(255,255,255,0.03)" 
               stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-dasharray="8,8" stroke-linejoin="round"/>`;
    }

    let html = `
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#00A9E0; stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:#007DA1; stop-opacity:0.3"/>
        </linearGradient>
        <filter id="glow_${gradientId}" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
    `;

    // Glow layer
    html += `<polygon points="${points}" fill="rgba(0,169,224,0.15)" 
             stroke="#00A9E0" stroke-width="4" stroke-linejoin="round" filter="url(#glow_${gradientId})"
             style="${animate ? 'opacity:0; animation: radar-appear 1s ease-out 0.2s forwards;' : ''}"/>`;

    // Data area
    html += `<polygon points="${points}" fill="url(#${gradientId})" 
             stroke="#00D2FF" stroke-width="3" stroke-linejoin="round"
             class="radar-data-polygon" style="${animate ? 'opacity:0; animation: radar-appear 1s ease-out 0.3s forwards;' : ''}"/>`;

    // Data points (Doubled)
    this.axes.forEach((axis, i) => {
      const p = this.getPoint(i, scores[i]);
      const delay = 0.5 + i * 0.15;
      html += `<circle cx="${p.x}" cy="${p.y}" r="20" fill="${axis.color}" fill-opacity="0.3" stroke="none"
               style="${animate ? `opacity:0; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards;` : ''}"/>`;
      html += `<circle cx="${p.x}" cy="${p.y}" r="14" fill="${axis.color}" stroke="white" stroke-width="4"
               style="${animate ? `opacity:0; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards;` : ''}"/>`;
      html += `<circle cx="${p.x}" cy="${p.y}" r="6" fill="white"
               style="${animate ? `opacity:0; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards;` : ''}"/>`;
    });

    return html;
  }

  // Render full radar
  render(scores, animate = true, previousScores = null) {
    let html = `
      <style>
        @keyframes radar-appear {
          from { opacity: 0; transform: scale(0.5); transform-origin: center; }
          to { opacity: 1; transform: scale(1); transform-origin: center; }
        }
        @keyframes dot-pop {
          from { opacity: 0; r: 0; }
          to { opacity: 1; }
        }
      </style>
    `;
    html += this.drawGrid();
    if (previousScores) html += this.drawData(previousScores, false, true);
    html += this.drawData(scores, animate);
    this.svg.innerHTML = html;
  }

  // Render mini version (for dashboard)
  renderMini(svgElement, scores, previousScores = null) {
    this.svg = svgElement;
    this.size = 500;
    this.center = 250;
    this.maxRadius = 180;
    this.svg.setAttribute('viewBox', '0 0 500 500');

    let html = `
          <defs>
            <filter id="miniGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
        `;

    // Grid with better visibility
    for (let level = 1; level <= this.levels; level++) {
      const points = this.axes.map((_, i) => {
        const p = this.getPoint(i, level, this.levels);
        return `${p.x},${p.y}`;
      }).join(' ');
      const op = level === this.levels ? 0.25 : 0.1;
      html += `<polygon points="${points}" fill="none" stroke="rgba(255,255,255,${op})" stroke-width="2" stroke-dasharray="${level < this.levels ? '6,6' : 'none'}"/>`;
    }

    // Axis lines
    this.axes.forEach((axis, i) => {
      const p = this.getPoint(i, this.levels, this.levels);
      html += `<line x1="${this.center}" y1="${this.center}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>`;
    });

    // Étiquettes mini (Titres uniquement)
    this.axes.forEach((axis, i) => {
      const pLabel = this.getPoint(i, this.levels + 0.95, this.levels);
      html += `<text x="${pLabel.x}" y="${pLabel.y}" text-anchor="middle" dominant-baseline="middle" fill="var(--text-secondary)" font-family="Outfit" font-weight="800" font-size="24" style="letter-spacing: 1px;">${axis.label.toUpperCase()}</text>`;
    });

    // Previous data polygon (ghost)
    if (previousScores) {
      const pPoints = this.axes.map((_, i) => {
        const p = this.getPoint(i, previousScores[i]);
        return `${p.x},${p.y}`;
      }).join(' ');
      html += `<polygon points="${pPoints}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="4,4" stroke-linejoin="round"/>`;
    }

    // Glow layer
    const points = this.axes.map((_, i) => {
      const p = this.getPoint(i, scores[i]);
      return `${p.x},${p.y}`;
    }).join(' ');

    html += `<polygon points="${points}" fill="rgba(0,169,224,0.12)" stroke="#00A9E0" stroke-width="3" stroke-linejoin="round" filter="url(#miniGlow)"/>`;

    // Data polygon
    html += `<polygon points="${points}" fill="rgba(0,169,224,0.35)" 
             stroke="#00D2FF" stroke-width="2.5" stroke-linejoin="round"/>`;

    // Data points with glow
    this.axes.forEach((axis, i) => {
      const p = this.getPoint(i, scores[i]);
      html += `<circle cx="${p.x}" cy="${p.y}" r="7" fill="${axis.color}" fill-opacity="0.3" stroke="none"/>`;
      html += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="${axis.color}" stroke="white" stroke-width="1.5"/>`;
    });

    svgElement.innerHTML = html;
  }
}
