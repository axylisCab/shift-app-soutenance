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
    this.initialScores = JSON.parse(localStorage.getItem('shift_initial_scores') || 'null');

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

      // Save initial scores if not exists
      if (!this.initialScores) {
        this.initialScores = scores;
        localStorage.setItem('shift_initial_scores', JSON.stringify(scores));
      }

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

    // Update diagnostic from dashboard
    document.getElementById('btn-update-diag')?.addEventListener('click', () => {
      this.navigateTo('diagnostic-view');
      this.diagnostic.start();
    });

    // Bottom nav
    document.querySelectorAll('.nav-item[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === 'profile') {
          this.openProfile();
          return;
        }
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.scrollToSection(tab);
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

    // Profile & Resources Buttons
    document.getElementById('btn-open-profile-top')?.addEventListener('click', () => this.openProfile());
    document.getElementById('btn-open-resources-top')?.addEventListener('click', () => {
      document.getElementById('resources-modal').classList.add('open');
    });

    // Profile auto-save
    document.getElementById('profile-edit-name')?.addEventListener('input', (e) => this.updateProfileInfo('name', e.target.value));
    document.getElementById('profile-edit-cabinet')?.addEventListener('input', (e) => this.updateProfileInfo('cabinet', e.target.value));

    // Presentation Mode
    document.getElementById('res-deck')?.addEventListener('click', (e) => {
      if (!e.currentTarget.classList.contains('disabled')) {
        e.preventDefault();
        this.openPresentation();
      }
    });

    document.getElementById('next-slide')?.addEventListener('click', () => this.changeSlide(1));
    document.getElementById('prev-slide')?.addEventListener('click', () => this.changeSlide(-1));
  }

  navigateTo(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    this.currentView = viewId;
  }

  openProfile() {
    const userData = this.user || { name: 'Utilisateur', cabinet: 'Cabinet' };
    const nameInput = document.getElementById('profile-edit-name');
    const cabinetInput = document.getElementById('profile-edit-cabinet');

    if (nameInput) nameInput.value = userData.name || '';
    if (cabinetInput) cabinetInput.value = userData.cabinet || '';

    document.getElementById('profile-modal').classList.add('open');
  }



  updateProfileInfo(key, value) {
    if (!this.user) this.user = {};
    this.user[key] = value;
    localStorage.setItem('shift_user', JSON.stringify(this.user));

    // Update UI elements that show name/cabinet
    if (key === 'name') {
      document.getElementById('top-user-name').textContent = value;
    } else if (key === 'cabinet') {
      document.getElementById('top-user-cabinet').textContent = value;
    }
  }

  // ---- PRESENTATION MODE ----
  openPresentation() {
    this.currentSlide = 0;
    this.slides = [
      {
        title: "Du Chiffre à la Valeur",
        desc: "Mutation Stratégique & Réponse Opérationnelle SHIFT.",
        content: `<div class="slide-visual"><i class="ph ph-presentation-chart" style="font-size:5rem;color:var(--accent-primary)"></i></div>`
      },
      {
        title: "Le Diagnostic : La Fin d'un Monde",
        desc: "Pourquoi le modèle historique est condamné.",
        content: `<div class="slide-grid">
          <div class="slide-card"><i class="ph ph-clock-countdown"></i><h3>Obsolescence</h3><p>Fin du 'Temps Passé'.</p></div>
          <div class="slide-card"><i class="ph ph-link-break"></i><h3>Déconnexion</h3><p>Production vs Valeur.</p></div>
        </div>`
      },
      {
        title: "La Triple Disruption 2026",
        desc: "Un tsunami réglementaire et technologique.",
        content: `<div class="slide-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="slide-card"><i class="ph-fill ph-file-text"></i><h3>Légal</h3><p>Facture Élec.</p></div>
          <div class="slide-card"><i class="ph-fill ph-cpu"></i><h3>Tech</h3><p>IA & Automatisation.</p></div>
          <div class="slide-card"><i class="ph-fill ph-users-three"></i><h3>Marché</h3><p>Nouveaux entrants.</p></div>
        </div>`
      },
      {
        title: "Érosion Économique",
        desc: "Le paradoxe de la productivité.",
        content: `<div class="slide-visual" style="background:linear-gradient(rgba(239,68,68,0.1), transparent)">
          <div style="font-size:1.5rem;font-weight:700;color:var(--error)">Marges en Danger</div>
          <p style="margin-top:10px">Moins d'heures = Moins de CA (Modèle Horaire).</p>
        </div>`
      },
      {
        title: "La Solution : SHIFT App",
        desc: "Piloter le pivot stratégique vers le conseil.",
        content: `<div class="slide-visual">
          <div class="app-mockup-mini">
            <i class="ph ph-rocket-launch" style="font-size:3rem;color:var(--accent-secondary)"></i>
            <div style="font-weight:800;font-size:1.2rem;margin-top:10px">SHIFT</div>
          </div>
          <p style="margin-top:20px">Transformer la conformité en moteur de croissance.</p>
        </div>`
      },
      {
        title: "Radar de Maturité",
        desc: "Évaluer les 6 piliers critiques du cabinet.",
        content: `<div class="slide-grid">
          <div class="slide-card"><i class="ph ph-target"></i><h3>Scoring</h3><p>Audit interactif 360°.</p></div>
          <div class="slide-card"><i class="ph ph-lightbulb"></i><h3>Valeur</h3><p>Leviers de croissance.</p></div>
        </div>`
      },
      {
        title: "Roadmap : Les 8 Sprints",
        desc: "Parcours guidé vers le nouveau modèle.",
        content: `<div class="slide-visual">
          <div style="display:flex;gap:8px;justify-content:center;margin-bottom:20px;flex-wrap:wrap">
            <span class="badge" style="background:var(--accent-primary)">1. Mindset</span>
            <span class="badge" style="background:var(--accent-secondary)">3. Audit</span>
            <span class="badge" style="background:var(--success)">5. Pricing</span>
            <span class="badge" style="background:var(--warning)">7. Déploiement</span>
          </div>
          <p>Une transformation structurée en 90 jours.</p>
        </div>`
      },
      {
        title: "Catalogue de Missions",
        desc: "Offres 'Full Service' prêtes à l'emploi.",
        content: `<div class="slide-grid">
          <div class="slide-card"><i class="ph ph-chart-pie"></i><h3>Pilotage</h3><p>Reporting & Stratégie.</p></div>
          <div class="slide-card"><i class="ph ph-users"></i><h3>RH</h3><p>Missions à forte valeur.</p></div>
        </div>`
      },
      {
        title: "Business Model : Valeur",
        desc: "Sortir définitivement du chronomètre.",
        content: `<div class="slide-visual">
          <div style="font-size:1.8rem;font-weight:800;color:var(--success)">IMPACT ➔ PRIX</div>
          <p style="margin-top:10px">Facturer l'économie ou le gain généré.</p>
        </div>`
      },
      {
        title: "L'Avenir du Cabinet",
        desc: "Sens, Utilité et Pérennité.",
        content: `<div class="slide-grid">
          <div class="slide-card"><h3>Talents</h3><p>Attractivité & Sens</p></div>
          <div class="slide-card"><h3>Patrimoine</h3><p>Valeur de revente</p></div>
        </div>`
      },
      {
        title: "Démonstration Interface",
        desc: "Simplicité et pilotage en temps réel.",
        content: `<div class="slide-visual">
          <button class="btn-primary modal-close" onclick="window.shiftApp.navigateTo('dashboard-view');window.shiftApp.renderDashboard();" style="padding: 12px 24px;">Lancer la démo</button>
        </div>`
      },
      {
        title: "Conclusion",
        desc: "SHIFT : Votre levier de réussite.",
        content: `<div class="slide-visual">
          <h2 style="font-size:2rem;color:var(--accent-primary)">Transformer ou Disparaître</h2>
          <p style="margin-top:20px">Le changement est une opportunité.</p>
        </div>`
      }
    ];

    const container = document.getElementById('slides-container');
    container.innerHTML = this.slides.map((s, i) => `
      <div class="slide ${i === 0 ? 'active' : ''}" data-idx="${i}">
        <div class="slide-content">
          <h2>${s.title}</h2>
          <p>${s.desc}</p>
          ${s.content}
        </div>
      </div>
    `).join('');

    document.getElementById('total-slides').textContent = this.slides.length;
    this.updateSlideUI();
    document.getElementById('presentation-modal').classList.add('open');
  }

  changeSlide(direction) {
    const next = this.currentSlide + direction;
    if (next < 0 || next >= this.slides.length) return;

    const currentEl = document.querySelector(`.slide[data-idx="${this.currentSlide}"]`);
    const nextEl = document.querySelector(`.slide[data-idx="${next}"]`);

    currentEl.classList.remove('active');
    if (direction > 0) currentEl.classList.add('prev');
    else nextEl.classList.remove('prev');

    nextEl.classList.add('active');
    this.currentSlide = next;
    this.updateSlideUI();
  }

  updateSlideUI() {
    document.getElementById('current-slide').textContent = this.currentSlide + 1;
    document.getElementById('prev-slide').disabled = this.currentSlide === 0;
    document.getElementById('next-slide').disabled = this.currentSlide === this.slides.length - 1;
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
      this.radar.render(scores, true, this.initialScores);
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
    miniRadar.renderMini(miniSvg, this.scores, this.initialScores);

    const avg = (this.scores.reduce((a, b) => a + b, 0) / this.scores.length).toFixed(1);
    document.getElementById('mini-radar-score').innerHTML = `
      <span class="score-val">${avg}</span>
      <span class="score-max">/ 4.0</span>
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
            <div class="check-box-wrapper">
              <span class="check-box"></span>
            </div>
            <div class="check-item-content">
              <span class="check-item-task">${item.task}</span>
              <p class="check-item-how">${item.how}</p>
            </div>
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
      item.addEventListener('click', (e) => {
        const sprintId = parseInt(item.getAttribute('data-sprint'));
        const idx = parseInt(item.getAttribute('data-idx'));

        this.toggleCheck(sprintId, idx);
        item.classList.toggle('checked');

        // Update progress UI
        const currentChecked = this.checkedItems[sprintId] || [];
        const p = (currentChecked.length / sprint.checklist.length) * 100;
        card.querySelector('.sprint-progress-fill').style.width = p + '%';

        // Auto-advance if sprint completed
        if (currentChecked.length === sprint.checklist.length && this.activeSprint < SHIFT_DATA.sprints.length - 1) {
          // Check if it's the current active sprint being completed
          const activeSprintId = SHIFT_DATA.sprints[this.activeSprint].id;
          if (sprintId === activeSprintId) {
            this.activeSprint++;
            localStorage.setItem('shift_sprint', this.activeSprint);

            setTimeout(() => {
              this.triggerLevelUpAnimation(this.activeSprint).then(() => {
                this.renderDashboard();
              });
            }, 600);
          }
        }
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
            <div class="check-box-wrapper">
              <span class="check-box"></span>
            </div>
            <div class="check-item-content">
              <span class="check-item-task">${item.task}</span>
              <p class="check-item-how">${item.how}</p>
            </div>
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

        // Auto-advance if active sprint completed in modal
        const currentChecked = this.checkedItems[sId] || [];
        const sprintData = SHIFT_DATA.sprints.find(s => s.id === sId);

        if (currentChecked.length === sprintData.checklist.length && idx === this.activeSprint && this.activeSprint < SHIFT_DATA.sprints.length - 1) {
          this.activeSprint++;
          localStorage.setItem('shift_sprint', this.activeSprint);
          modal.classList.remove('open');

          setTimeout(() => {
            this.triggerLevelUpAnimation(this.activeSprint).then(() => {
              this.renderActiveSprint();
              this.renderRoadmap();
            });
          }, 600);
        }
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
      
      <div class="mission-detail-grid">
        <div class="mission-detail-section">
          <h4><i class="ph ph-megaphone"></i> Promesse</h4>
          <p style="color:var(--text-secondary);font-size:0.9rem">${m.promesse}</p>
        </div>
        <div class="mission-detail-section">
          <h4><i class="ph ph-coins"></i> Honoraires conseillés</h4>
          <p style="color:var(--accent-primary);font-size:1.1rem;font-weight:800">${m.honoraires}</p>
        </div>
      </div>

      <div class="mission-detail-section highlight-section">
        <h4><i class="ph ph-list-numbers"></i> Plan d'action : Comment faire ?</h4>
        <ul class="action-list">${m.plan_action.map(step => `<li><i class="ph ph-caret-right"></i> ${step}</li>`).join('')}</ul>
      </div>

      <div class="mission-detail-grid">
        <div class="mission-detail-section">
          <h4><i class="ph ph-clock"></i> Cadence</h4>
          <p style="color:var(--text-secondary);font-size:0.9rem">${m.cadence}</p>
        </div>
        <div class="mission-detail-section">
          <h4><i class="ph ph-package"></i> Livrables</h4>
          <ul>${m.livrables.map(l => `<li>${l}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="mission-detail-section">
        <h4><i class="ph ph-check-circle"></i> Prérequis</h4>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${m.prerequis.map(p => `<span style="padding:4px 12px;background:var(--bg-card);border:1px solid var(--bg-glass-border);border-radius:20px;font-size:0.8rem">${p}</span>`).join('')}
        </div>
      </div>

      <div class="mission-pro-tip">
        <strong><i class="ph ph-lightbulb"></i> Conseil Pro :</strong> ${m.conseil_pro}
      </div>

      <div class="mission-gain">
        <strong><i class="ph ph-trend-up"></i> Gain Potentiel :</strong> ${m.gain_potentiel}
      </div>

      <div class="mission-detail-section">
        <h4><i class="ph ph-warning"></i> Limites</h4>
        <ul style="opacity:0.7">${m.limites.map(l => `<li>${l}</li>`).join('')}</ul>
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
