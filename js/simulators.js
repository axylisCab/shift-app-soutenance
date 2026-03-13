/* ============================================
   SHIFT — Simulators
   ============================================ */

class Simulators {
  constructor() {
    this.modal = document.getElementById('simulator-modal');
    this.modalTitle = document.getElementById('sim-modal-title');
    this.modalBody = document.getElementById('sim-modal-body');
  }

  open(type) {
    switch (type) {
      case 'pricing': this.renderPricing(); break;
      case 'ia': this.renderIA(); break;
      case 'roi': this.renderROI(); break;
    }
    this.modal.classList.add('open');
  }

  close() { this.modal.classList.remove('open'); }

  renderPricing() {
    this.modalTitle.textContent = '💰 Simulateur de Prix à la Valeur';
    this.modalBody.innerHTML = `
      <div class="sim-section">
        <h3><i class="ph ph-warning-circle"></i> Le piège du temps passé</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:15px">
          Quand vous automatisez, votre productivité <strong style="color:var(--danger)">détruit votre CA</strong> si vous facturez au temps passé.
        </p>
        <div class="pricing-ref-grid">
          <div class="ref-item"><span>🎯 Copilote</span><strong>5k€</strong></div>
          <div class="ref-item"><span>🏢 Full Serv.</span><strong>8k€</strong></div>
          <div class="ref-item"><span>🤖 Data/IA</span><strong>7.5k€</strong></div>
          <div class="ref-item"><span>🌱 RSE</span><strong>4k€</strong></div>
        </div>
      </div>
      <div class="sim-section">
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>Nombre de clients</span><span class="sim-slider-value" id="val-clients">50</span></div>
          <input type="range" id="sl-clients" min="10" max="200" value="50" step="5">
        </div>
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>Honoraire moyen actuel (€/an)</span><span class="sim-slider-value" id="val-honoraire">3000</span></div>
          <input type="range" id="sl-honoraire" min="500" max="10000" value="3000" step="100">
        </div>
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>Gain de temps via automatisation (%)</span><span class="sim-slider-value" id="val-auto">40</span></div>
          <input type="range" id="sl-auto" min="10" max="80" value="40" step="5">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px">
        <div class="sim-result" style="border-left:3px solid var(--danger)">
          <div class="sim-result-label">❌ Modèle temps passé</div>
          <div class="sim-result-value" id="res-temps" style="color:var(--danger)">90 000 €</div>
          <div class="sim-result-detail" id="res-temps-detail">Perte: -60 000 €</div>
        </div>
        <div class="sim-result" style="border-left:3px solid var(--success)">
          <div class="sim-result-label">✅ Modèle valeur (3 niveaux)</div>
          <div class="sim-result-value" id="res-valeur" style="color:var(--success)">225 000 €</div>
          <div class="sim-result-detail" id="res-valeur-detail">Gain: +75 000 €</div>
        </div>
      </div>
    `;
    const update = () => {
      const clients = +document.getElementById('sl-clients').value;
      const honoraire = +document.getElementById('sl-honoraire').value;
      const auto = +document.getElementById('sl-auto').value;
      document.getElementById('val-clients').textContent = clients;
      document.getElementById('val-honoraire').textContent = clients <= 200 ? honoraire.toLocaleString('fr-FR') : honoraire;
      document.getElementById('val-auto').textContent = auto + '%';
      const caActuel = clients * honoraire;
      const caTemps = caActuel * (1 - auto / 100);
      const caValeur = caActuel * 1.5;
      document.getElementById('res-temps').textContent = Math.round(caTemps).toLocaleString('fr-FR') + ' €';
      document.getElementById('res-temps-detail').textContent = `Perte: ${Math.round(caTemps - caActuel).toLocaleString('fr-FR')} €`;
      document.getElementById('res-valeur').textContent = Math.round(caValeur).toLocaleString('fr-FR') + ' €';
      document.getElementById('res-valeur-detail').textContent = `Gain: +${Math.round(caValeur - caActuel).toLocaleString('fr-FR')} €`;
    };
    ['sl-clients', 'sl-honoraire', 'sl-auto'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', update);
    });
    update();
  }

  renderIA() {
    this.modalTitle.textContent = '🤖 Simulateur Impact IA';
    this.modalBody.innerHTML = `
      <div class="sim-section">
        <h3>Quel temps pouvez-vous libérer avec l'IA ?</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px">
          60 à 80% des écritures comptables sont automatisables. Simulez l'impact sur votre cabinet.
        </p>
      </div>
      <div class="sim-section">
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>Collaborateurs</span><span class="sim-slider-value" id="val-collabs">8</span></div>
          <input type="range" id="sl-collabs" min="2" max="50" value="8">
        </div>
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>Heures/semaine en saisie par collab.</span><span class="sim-slider-value" id="val-saisie">20</span></div>
          <input type="range" id="sl-saisie" min="5" max="35" value="20">
        </div>
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>Taux automatisation cible (%)</span><span class="sim-slider-value" id="val-taux">70</span></div>
          <input type="range" id="sl-taux" min="20" max="90" value="70" step="5">
        </div>
      </div>
      <div class="sim-result" style="margin-top:20px">
        <div class="sim-result-label">⏱️ Heures libérées par semaine</div>
        <div class="sim-result-value" id="res-heures">112h</div>
        <div class="sim-result-detail" id="res-heures-detail">Soit 2,8 ETP réaffectables aux missions à valeur</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
        <div class="sim-result">
          <div class="sim-result-label">📅 Heures/an libérées</div>
          <div class="sim-result-value" id="res-annuel" style="font-size:1.8rem">5 376h</div>
        </div>
        <div class="sim-result">
          <div class="sim-result-label">💶 Valeur potentielle</div>
          <div class="sim-result-value" id="res-valeur-ia" style="font-size:1.8rem;color:var(--success)">268 800 €</div>
        </div>
      </div>
    `;
    const update = () => {
      const collabs = +document.getElementById('sl-collabs').value;
      const saisie = +document.getElementById('sl-saisie').value;
      const taux = +document.getElementById('sl-taux').value;
      document.getElementById('val-collabs').textContent = collabs;
      document.getElementById('val-saisie').textContent = saisie + 'h';
      document.getElementById('val-taux').textContent = taux + '%';
      const heuresLib = Math.round(collabs * saisie * (taux / 100));
      const etp = (heuresLib / 35).toFixed(1);
      const annuel = heuresLib * 48;
      const valeur = annuel * 50;
      document.getElementById('res-heures').textContent = heuresLib + 'h';
      document.getElementById('res-heures-detail').textContent = `Soit ${etp} ETP réaffectables aux missions à valeur`;
      document.getElementById('res-annuel').textContent = annuel.toLocaleString('fr-FR') + 'h';
      document.getElementById('res-valeur-ia').textContent = valeur.toLocaleString('fr-FR') + ' €';
    };
    ['sl-collabs', 'sl-saisie', 'sl-taux'].forEach(id => document.getElementById(id)?.addEventListener('input', update));
    update();
  }

  renderROI() {
    this.modalTitle.textContent = '📈 Simulateur ROI Missions';
    this.modalBody.innerHTML = `
      <div class="sim-section">
        <h3>ROI des nouvelles missions</h3>
        <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:20px">Estimez le revenu additionnel en déployant les 4 nouvelles missions.</p>
      </div>
      <div class="sim-section">
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>🎯 Clients en Co-pilotage</span><span class="sim-slider-value" id="val-copil">10</span></div>
          <input type="range" id="sl-copil" min="0" max="50" value="10">
        </div>
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>🏢 Clients en Full Service</span><span class="sim-slider-value" id="val-full">5</span></div>
          <input type="range" id="sl-full" min="0" max="30" value="5">
        </div>
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>🤖 Clients en Data & IA</span><span class="sim-slider-value" id="val-data">3</span></div>
          <input type="range" id="sl-data" min="0" max="20" value="3">
        </div>
        <div class="sim-slider-group">
          <div class="sim-slider-label"><span>🌱 Clients en RSE</span><span class="sim-slider-value" id="val-rse">5</span></div>
          <input type="range" id="sl-rse" min="0" max="30" value="5">
        </div>
      </div>
      <div class="sim-result" style="margin-top:20px">
        <div class="sim-result-label">💶 Revenu additionnel annuel estimé</div>
        <div class="sim-result-value" id="res-roi-total" style="color:var(--success)">132 500 €</div>
        <div class="sim-result-detail" id="res-roi-detail">Co-pilotage: 50k | Full Service: 40k | Data: 22.5k | RSE: 20k</div>
      </div>
    `;
    const prices = { copil: 5000, full: 8000, data: 7500, rse: 4000 };
    const update = () => {
      const copil = +document.getElementById('sl-copil').value;
      const full = +document.getElementById('sl-full').value;
      const data = +document.getElementById('sl-data').value;
      const rse = +document.getElementById('sl-rse').value;
      document.getElementById('val-copil').textContent = copil;
      document.getElementById('val-full').textContent = full;
      document.getElementById('val-data').textContent = data;
      document.getElementById('val-rse').textContent = rse;
      const revCopil = copil * prices.copil, revFull = full * prices.full, revData = data * prices.data, revRse = rse * prices.rse;
      const total = revCopil + revFull + revData + revRse;
      document.getElementById('res-roi-total').textContent = total.toLocaleString('fr-FR') + ' €';
      document.getElementById('res-roi-detail').textContent = `Co-pilotage: ${(revCopil / 1000).toFixed(0)}k | Full Service: ${(revFull / 1000).toFixed(0)}k | Data: ${(revData / 1000).toFixed(1)}k | RSE: ${(revRse / 1000).toFixed(0)}k`;
    };
    ['sl-copil', 'sl-full', 'sl-data', 'sl-rse'].forEach(id => document.getElementById(id)?.addEventListener('input', update));
    update();
  }
}
