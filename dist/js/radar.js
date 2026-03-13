/* ============================================
   SHIFT — Radar Chart (SVG Pentagon)
   ============================================ */

class RadarChart {
    constructor(svgElement, size = 500) {
        this.svg = svgElement;
        this.size = size;
        this.center = size / 2;
        this.maxRadius = size * 0.38;
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
            html += `<polygon points="${points}" fill="none" stroke="rgba(255,255,255,${opacity})" stroke-width="1.5" stroke-dasharray="${level < this.levels ? '4,4' : 'none'}"/>`;
        }

        // Draw axis lines
        this.axes.forEach((axis, i) => {
            const p = this.getPoint(i, this.levels, this.levels);
            html += `<line x1="${this.center}" y1="${this.center}" x2="${p.x}" y2="${p.y}" 
               stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
        });

        // Draw axis labels
        this.axes.forEach((axis, i) => {
            const p = this.getPoint(i, this.levels + 0.7, this.levels);
            html += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" 
               fill="${axis.color}" font-family="Outfit" font-weight="700" font-size="14">
               ${axis.icon} ${axis.label}</text>`;
        });

        return html;
    }

    // Draw the data polygon with animation
    drawData(scores, animate = true) {
        const points = this.axes.map((_, i) => {
            const p = this.getPoint(i, scores[i]);
            return `${p.x},${p.y}`;
        }).join(' ');

        const gradientId = `radarGrad_${Date.now()}`;

        let html = `
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F59E0B; stop-opacity:0.6"/>
          <stop offset="100%" style="stop-color:#D97706; stop-opacity:0.3"/>
        </linearGradient>
        <filter id="glow_${gradientId}" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
    `;

        // Glow layer
        html += `<polygon points="${points}" fill="rgba(245,158,11,0.15)" 
             stroke="#F59E0B" stroke-width="4" stroke-linejoin="round" filter="url(#glow_${gradientId})"
             style="${animate ? 'opacity:0; animation: radar-appear 1s ease-out 0.2s forwards;' : ''}"/>`;

        // Data area
        html += `<polygon points="${points}" fill="url(#${gradientId})" 
             stroke="#FCD34D" stroke-width="3" stroke-linejoin="round"
             class="radar-data-polygon" style="${animate ? 'opacity:0; animation: radar-appear 1s ease-out 0.3s forwards;' : ''}"/>`;

        // Data points
        this.axes.forEach((axis, i) => {
            const p = this.getPoint(i, scores[i]);
            const delay = 0.5 + i * 0.15;
            html += `<circle cx="${p.x}" cy="${p.y}" r="10" fill="${axis.color}" fill-opacity="0.3" stroke="none"
               style="${animate ? `opacity:0; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards;` : ''}"/>`;
            html += `<circle cx="${p.x}" cy="${p.y}" r="7" fill="${axis.color}" stroke="white" stroke-width="2"
               style="${animate ? `opacity:0; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards;` : ''}"/>`;
            html += `<circle cx="${p.x}" cy="${p.y}" r="3" fill="white"
               style="${animate ? `opacity:0; animation: dot-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s forwards;` : ''}"/>`;
        });

        return html;
    }

    // Render full radar
    render(scores, animate = true) {
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
        html += this.drawData(scores, animate);
        this.svg.innerHTML = html;
    }

    // Render mini version (for dashboard)
    renderMini(svgElement, scores) {
        this.svg = svgElement;
        this.size = 300;
        this.center = 150;
        this.maxRadius = 120;

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
            html += `<polygon points="${points}" fill="none" stroke="rgba(255,255,255,${op})" stroke-width="1" stroke-dasharray="${level < this.levels ? '3,3' : 'none'}"/>`;
        }

        // Axis lines
        this.axes.forEach((axis, i) => {
            const p = this.getPoint(i, this.levels, this.levels);
            html += `<line x1="${this.center}" y1="${this.center}" x2="${p.x}" y2="${p.y}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
        });

        // Axis labels (small)
        this.axes.forEach((axis, i) => {
            const p = this.getPoint(i, this.levels + 0.55, this.levels);
            html += `<text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="middle" fill="${axis.color}" font-family="Outfit" font-weight="700" font-size="10">${axis.icon}</text>`;
        });

        // Glow layer
        const points = this.axes.map((_, i) => {
            const p = this.getPoint(i, scores[i]);
            return `${p.x},${p.y}`;
        }).join(' ');

        html += `<polygon points="${points}" fill="rgba(245,158,11,0.12)" stroke="#F59E0B" stroke-width="3" stroke-linejoin="round" filter="url(#miniGlow)"/>`;

        // Data polygon
        html += `<polygon points="${points}" fill="rgba(245,158,11,0.35)" 
             stroke="#FCD34D" stroke-width="2.5" stroke-linejoin="round"/>`;

        // Data points with glow
        this.axes.forEach((axis, i) => {
            const p = this.getPoint(i, scores[i]);
            html += `<circle cx="${p.x}" cy="${p.y}" r="7" fill="${axis.color}" fill-opacity="0.3" stroke="none"/>`;
            html += `<circle cx="${p.x}" cy="${p.y}" r="5" fill="${axis.color}" stroke="white" stroke-width="1.5"/>`;
        });

        svgElement.innerHTML = html;
    }
}
