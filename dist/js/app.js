/* ============================================
   SHIFT — Main App Controller
   ============================================ */

class ShiftApp {
  constructor() {
    this.currentView = 'splash-screen';
    this.scores = null;
    this.user = JSON.parse(localStorage.getItem('shift_user') || 'null');
    this.activeSprint = 0;
    this.checkedItems = JSON.parse(localStorage.getItem('shift_checked') || '{}');

    // Init modules
    this.diagnostic = new DiagnosticEngine();
    this.radar = new RadarChart(document.getElementById('radar-svg'));
    this.assistant = new ShiftAssistant();
    this.simulators = new Simulators();

    // Load saved scores
    const saved = localStorage.getItem('shift_scores');
    if (saved) {
      this.scores = JSON.parse(saved);
      this.activeSprint = parseInt(localStorage.getItem('shift_sprint') || '0');
    }

    this.setupEvents();
    this.initSplashAnimations();
  }

  setupEvents() {
    // Splash -> Diagnostic or Dashboard
    const startBtn = document.getElementById('btn-start-diagnostic');
    if (this.user && this.scores) {
      startBtn.innerHTML = '<i class="ph ph-squares-four"></i> Accéder au Dashboard';
      startBtn.addEventListener('click', () => {
        this.navigateTo('dashboard-view');
        this.renderDashboard();
      });
    } else {
      startBtn.addEventListener('click', () => {
        this.navigateTo('diagnostic-view');
        this.diagnostic.start();
      });
    }

    // Diagnostic back
    document.getElementById('btn-diag-back').addEventListener('click', () => this.diagnostic.goBack());

    // Diagnostic complete -> Radar
    this.diagnostic.onComplete = (scores) => {
      this.scores = scores;
      localStorage.setItem('shift_scores', JSON.stringify(scores));
      this.showRadarResults(scores);
    };

    // Radar -> Registration or Dashboard
    document.getElementById('btn-see-roadmap').addEventListener('click', () => {
      if (this.user) {
        this.navigateTo('dashboard-view');
        this.renderDashboard();
      } else {
        this.navigateTo('registration-view');
      }
    });

    // Registration form submit
    const regForm = document.getElementById('registration-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.user = {
          name: document.getElementById('reg-name').value,
          email: document.getElementById('reg-email').value,
          cabinet: document.getElementById('reg-cabinet').value,
          size: document.getElementById('reg-size').value,
          role: document.getElementById('reg-role').value,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('shift_user', JSON.stringify(this.user));
        this.navigateTo('dashboard-view');
        this.renderDashboard();
      });
    }

    // Retake diagnostic
    document.getElementById('btn-retake').addEventListener('click', () => {
      this.navigateTo('diagnostic-view');
      this.diagnostic.start();
    });

    // View full radar from dashboard
    document.getElementById('btn-view-radar')?.addEventListener('click', () => {
      if (this.scores) this.showRadarResults(this.scores);
    });

    // Bottom nav
    document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.scrollToSection(btn.getAttribute('data-tab'));
      });
    });

    // Simulator cards
    document.querySelectorAll('.sim-card').forEach(card => {
      card.addEventListener('click', () => this.simulators.open(card.getAttribute('data-sim')));
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => btn.closest('.modal').classList.remove('open'));
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', () => overlay.closest('.modal').classList.remove('open'));
    });

    // Reset App
    const resetFn = () => {
      if (confirm('Voulez-vous vraiment réinitialiser tout votre parcours ? Toutes vos données seront effacées.')) {
        localStorage.clear();
        location.reload();
      }
    };
    document.getElementById('btn-reset-app')?.addEventListener('click', resetFn);
    document.getElementById('btn-reset-app-profile')?.addEventListener('click', resetFn);

    // Profile Buttons
    document.getElementById('btn-open-profile-top')?.addEventListener('click', () => this.openProfile());
    document.getElementById('btn-navigate-profile')?.addEventListener('click', () => {
      document.querySelector('.nav-item[data-tab="profile"]')?.click();
    });
  }

  navigateTo(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    this.currentView = viewId;
  }

  openProfile() {
    const userData = this.user || { name: 'Utilisateur', cabinet: 'Cabinet non défini' };
    document.getElementById('profile-user-name').textContent = userData.name;
    document.getElementById('profile-user-cabinet').textContent = userData.cabinet;
    document.getElementById('profile-modal').classList.add('open');
  }

  // ---- SPLASH ANIMATIONS ----
  initSplashAnimations() {
    // Floating particles
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (4 + Math.random() * 8) + 's';
      p.style.animationDelay = Math.random() * 5 + 's';
      p.style.width = (2 + Math.random() * 3) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);
    }

    // Counter animation
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      this.animateCounter(el, target, 2000, 2200);
    });
  }

  animateCounter(el, target, duration, delay) {
    setTimeout(() => {
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
  }

  // ---- RADAR RESULTS ----
  showRadarResults(scores) {
    this.navigateTo('radar-view');

    // Draw radar
    setTimeout(() => {
      this.radar = new RadarChart(document.getElementById('radar-svg'));
      this.radar.render(scores, true);
    }, 200);

    // Calculate overall score
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Find maturity level
    const level = SHIFT_DATA.maturityLevels.find(l => avg >= l.range[0] && avg <= l.range[1])
      || SHIFT_DATA.maturityLevels[0];

    // Verdict
    document.getElementById('radar-verdict').textContent = level.verdict;

    // Score badges
    const scoresContainer = document.getElementById('radar-scores');
    scoresContainer.innerHTML = SHIFT_DATA.axes.map((axis, i) => `
      <div class="radar-score-item">
        <span class="score-dot" style="background:${axis.color}"></span>
        <span class="score-name">${axis.label}</span>
        <span class="score-value" style="color:${axis.color}">${scores[i].toFixed(1)}</span>
      </div>
    `).join('');

    // Level display
    document.getElementById('radar-level').innerHTML = `
      <div class="radar-level-label">Niveau de maturité</div>
      <div class="radar-level-name" style="color:${level.color}">${level.name}</div>
      <div class="radar-level-desc">${level.description}</div>
    `;
  }

  // ---- DASHBOARD ----
  renderDashboard() {
    if (!this.scores) return;

    // Mini radar
    const miniSvg = document.getElementById('mini-radar-svg');
    const miniRadar = new RadarChart(miniSvg, 300);
    miniRadar.renderMini(miniSvg, this.scores);

    const avg = (this.scores.reduce((a, b) => a + b, 0) / this.scores.length).toFixed(1);
    document.getElementById('mini-radar-score').innerHTML = `
      <span class="score-big">${avg}</span>
      <span class="score-label">/ 4.0</span>
    `;

    // Active sprint
    this.renderActiveSprint();

    // Roadmap timeline
    this.renderRoadmap();

    // Mission cards
    this.renderMissions();

    // Update Topbar
    if (this.user) {
      document.getElementById('top-user-name').textContent = this.user.name;
      document.getElementById('top-user-cabinet').textContent = this.user.cabinet;
    }
  }

  renderActiveSprint() {
    const sprint = SHIFT_DATA.sprints[this.activeSprint];
    const card = document.getElementById('active-sprint-card');
    const checked = this.checkedItems[sprint.id] || [];
    const progress = sprint.checklist.length > 0 ? (checked.length / sprint.checklist.length) * 100 : 0;

    card.innerHTML = `
      <div class="sprint-card-title">
        <span class="sprint-icon">${sprint.icon}</span>
        ${sprint.title} — ${sprint.tagline}
      </div>
      <p class="sprint-card-desc">${sprint.description}</p>
      <div class="sprint-checklist">
        ${sprint.checklist.map((item, i) => `
          <div class="sprint-check-item ${checked.includes(i) ? 'checked' : ''}" data-sprint="${sprint.id}" data-idx="${i}">
            <span class="check-box"></span>
            <span>${item}</span>
          </div>
        `).join('')}
      </div>
      <div class="sprint-progress-bar">
        <div class="sprint-progress-fill" style="width:${progress}%"></div>
      </div>
    `;

    document.getElementById('sprint-badge').textContent = `Sprint ${this.activeSprint + 1}/8`;

    // Checklist interactions
    card.querySelectorAll('.sprint-check-item').forEach(item => {
      item.addEventListener('click', () => {
        const sprintId = parseInt(item.getAttribute('data-sprint'));
        const idx = parseInt(item.getAttribute('data-idx'));
        this.toggleCheck(sprintId, idx);
        item.classList.toggle('checked');
        // Update progress
        const c = this.checkedItems[sprintId] || [];
        const p = (c.length / sprint.checklist.length) * 100;
        card.querySelector('.sprint-progress-fill').style.width = p + '%';
      });
    });
  }

  toggleCheck(sprintId, idx) {
    if (!this.checkedItems[sprintId]) this.checkedItems[sprintId] = [];
    const arr = this.checkedItems[sprintId];
    const pos = arr.indexOf(idx);
    if (pos >= 0) arr.splice(pos, 1);
    else arr.push(idx);
    localStorage.setItem('shift_checked', JSON.stringify(this.checkedItems));
  }

  triggerLevelUpAnimation(sprintIdx) {
    return new Promise(resolve => {
      const container = document.createElement('div');
      container.className = 'level-up-container';

      const sprintName = SHIFT_DATA.sprints[sprintIdx]?.title || '';

      container.innerHTML = `
        <div class="level-up-badge">
          <div class="level-up-icon"><i class="ph-fill ph-rocket-launch"></i></div>
          <div class="level-up-title">Sprint Validé !</div>
          ${sprintName ? `<div class="level-up-subtitle">En route vers : ${sprintName}</div>` : ''}
        </div>
      `;
      document.body.appendChild(container);

      // Force reflow
      container.offsetHeight;
      container.classList.add('active');

      // Create confetti
      const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FCD34D'];
      for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
        confetti.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(confetti);
      }

      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

      setTimeout(() => {
        container.classList.remove('active');
        setTimeout(() => {
          container.remove();
          resolve();
        }, 400); // Wait fade out
      }, 3500); // Show for 3.5s
    });
  }

  renderRoadmap() {
    const container = document.getElementById('roadmap-timeline');
    container.innerHTML = SHIFT_DATA.sprints.map((sprint, i) => {
      const status = i < this.activeSprint ? 'completed' : i === this.activeSprint ? 'active' : '';
      const statusLabel = i < this.activeSprint ? 'Terminé' : i === this.activeSprint ? 'En cours' : 'À venir';
      const statusClass = i < this.activeSprint ? 'status-done' : i === this.activeSprint ? 'status-active' : 'status-locked';
      return `
        <div class="timeline-item ${status}" data-sprint-idx="${i}">
          <div class="timeline-dot">${i < this.activeSprint ? '✓' : i + 1}</div>
          <div class="timeline-content">
            <div class="timeline-title">${sprint.icon} ${sprint.title}</div>
            <div class="timeline-subtitle">${sprint.tagline}</div>
            <div class="timeline-status ${statusClass}">${statusLabel} · ${sprint.duration}</div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.timeline-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-sprint-idx'));
        this.openSprintDetail(idx);
      });
    });
  }

  openSprintDetail(idx) {
    const sprint = SHIFT_DATA.sprints[idx];
    const modal = document.getElementById('sprint-modal');
    document.getElementById('sprint-modal-title').textContent = `${sprint.icon} Sprint ${idx + 1} — ${sprint.title}`;
    document.getElementById('sprint-modal-body').innerHTML = `
      <p style="color:var(--text-secondary);margin-bottom:20px;font-size:0.95rem">${sprint.description}</p>
      <h4 style="color:var(--accent-primary);margin-bottom:12px"><i class="ph ph-list-checks"></i> Checklist</h4>
      <div class="sprint-checklist">
        ${sprint.checklist.map((item, i) => {
      const checked = (this.checkedItems[sprint.id] || []).includes(i);
      return `<div class="sprint-check-item ${checked ? 'checked' : ''}" data-sprint="${sprint.id}" data-idx="${i}">
            <span class="check-box"></span><span>${item}</span>
          </div>`;
    }).join('')}
      </div>
      <h4 style="color:var(--accent-primary);margin:20px 0 12px"><i class="ph ph-target"></i> KPIs de succès</h4>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${sprint.kpis.map(k => `<span style="padding:6px 14px;background:var(--success-soft);color:var(--success);border-radius:20px;font-size:0.8rem;font-weight:600">${k}</span>`).join('')}
      </div>
      ${idx === this.activeSprint && idx < 7 ? `<button class="btn-primary" style="margin-top:24px;width:100%" id="btn-next-sprint"><i class="ph ph-skip-forward"></i> Passer au sprint suivant</button>` : ''}
    `;

    modal.querySelector('.sprint-checklist')?.querySelectorAll('.sprint-check-item').forEach(item => {
      item.addEventListener('click', () => {
        const sId = parseInt(item.getAttribute('data-sprint'));
        const i = parseInt(item.getAttribute('data-idx'));
        this.toggleCheck(sId, i);
        item.classList.toggle('checked');
      });
    });

    document.getElementById('btn-next-sprint')?.addEventListener('click', () => {
      this.activeSprint++;
      localStorage.setItem('shift_sprint', this.activeSprint);
      modal.classList.remove('open');

      this.triggerLevelUpAnimation(this.activeSprint).then(() => {
        this.renderActiveSprint();
        this.renderRoadmap();
        this.scrollToSection('dashboard');
      });
    });

    modal.classList.add('open');
  }

  renderMissions() {
    const container = document.getElementById('mission-cards');
    container.innerHTML = SHIFT_DATA.missions.map(m => `
      <div class="mission-card" data-mission="${m.id}" style="--mission-color:${m.color}">
        <div class="mission-card-icon">${m.icon}</div>
        <h3>${m.title}</h3>
        <p>${m.tagline}</p>
      </div>
    `).join('');

    container.querySelectorAll('.mission-card').forEach(card => {
      card.addEventListener('click', () => this.openMissionDetail(card.getAttribute('data-mission')));
    });
  }

  openMissionDetail(id) {
    const m = SHIFT_DATA.missions.find(x => x.id === id);
    if (!m) return;
    const modal = document.getElementById('mission-modal');
    document.getElementById('mission-modal-title').textContent = `${m.icon} ${m.title}`;
    document.getElementById('mission-modal-body').innerHTML = `
      <div class="mission-detail-header">
        <div class="mission-detail-icon">${m.icon}</div>
        <p class="mission-detail-tagline">${m.tagline}</p>
      </div>
      <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px">${m.description}</p>
      <div class="mission-detail-section">
        <h4><i class="ph ph-megaphone"></i> Promesse</h4>
        <p style="color:var(--text-secondary);font-size:0.9rem">${m.promesse}</p>
      </div>
      <div class="mission-detail-section">
        <h4><i class="ph ph-clock"></i> Cadence</h4>
        <p style="color:var(--text-secondary);font-size:0.9rem">${m.cadence}</p>
      </div>
      <div class="mission-detail-section">
        <h4><i class="ph ph-check-circle"></i> Prérequis</h4>
        <ul>${m.prerequis.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
      <div class="mission-detail-section">
        <h4><i class="ph ph-package"></i> Livrables</h4>
        <ul>${m.livrables.map(l => `<li>${l}</li>`).join('')}</ul>
      </div>
      <div class="mission-detail-section">
        <h4><i class="ph ph-warning"></i> Limites</h4>
        <ul>${m.limites.map(l => `<li>${l}</li>`).join('')}</ul>
      </div>
    `;
    modal.classList.add('open');
  }

  scrollToSection(tab) {
    const map = {
      dashboard: '.dash-radar-mini',
      roadmap: '.dash-roadmap',
      simulators: '.dash-simulators',
      profile: '.dash-profile-shortcut'
    };
    const el = document.querySelector(map[tab]);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  window.shiftApp = new ShiftApp();
});
