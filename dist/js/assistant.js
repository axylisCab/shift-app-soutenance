/* ============================================
   SHIFT — Assistant (Chatbot)
   ============================================ */

class ShiftAssistant {
    constructor() {
        this.panel = document.getElementById('assistant-panel');
        this.messagesContainer = document.getElementById('assistant-messages');
        this.inputField = document.getElementById('assistant-input-field');
        this.knowledge = SHIFT_DATA.assistantKnowledge;
        this.setupEvents();
    }

    setupEvents() {
        document.getElementById('btn-open-assistant')?.addEventListener('click', () => this.open());
        document.getElementById('btn-nav-assistant')?.addEventListener('click', () => this.open());
        document.getElementById('btn-close-assistant')?.addEventListener('click', () => this.close());
        document.getElementById('btn-send-msg')?.addEventListener('click', () => this.sendUserMessage());
        this.inputField?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.sendUserMessage(); });
        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const q = chip.getAttribute('data-q');
                this.addUserMessage(q);
                this.processQuestion(q);
            });
        });
    }

    open() { this.panel.classList.add('open'); setTimeout(() => this.inputField?.focus(), 400); }
    close() { this.panel.classList.remove('open'); }

    sendUserMessage() {
        const text = this.inputField.value.trim();
        if (!text) return;
        this.inputField.value = '';
        this.addUserMessage(text);
        this.processQuestion(text);
    }

    addUserMessage(text) {
        const el = document.createElement('div');
        el.className = 'msg msg-user';
        el.innerHTML = `<div class="msg-avatar"><i class="ph ph-user"></i></div><div class="msg-bubble"><p>${this.esc(text)}</p></div>`;
        this.messagesContainer.appendChild(el);
        this.scrollBottom();
    }

    addBotMessage(html, suggestions = []) {
        const el = document.createElement('div');
        el.className = 'msg msg-bot';
        let sugHtml = suggestions.length ? `<div class="msg-suggestions">${suggestions.map(s => `<button class="suggestion-chip" data-q="${this.esc(s.query)}">${s.label}</button>`).join('')}</div>` : '';
        el.innerHTML = `<div class="msg-avatar"><i class="ph ph-robot"></i></div><div class="msg-bubble">${html}${sugHtml}</div>`;
        this.messagesContainer.appendChild(el);
        el.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => { const q = chip.getAttribute('data-q'); this.addUserMessage(q); this.processQuestion(q); });
        });
        this.scrollBottom();
    }

    processQuestion(question) {
        const typingEl = document.createElement('div');
        typingEl.className = 'msg msg-bot typing-msg';
        typingEl.innerHTML = `<div class="msg-avatar"><i class="ph ph-robot"></i></div><div class="msg-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
        this.messagesContainer.appendChild(typingEl);
        this.scrollBottom();
        setTimeout(() => {
            typingEl.remove();
            const res = this.findAnswer(question);
            this.addBotMessage(res.html, res.suggestions);
        }, 800 + Math.random() * 1200);
    }

    findAnswer(question) {
        const q = question.toLowerCase();
        const map = {
            'temps passé': 'temps passé', 'prix': 'temps passé', 'pricing': 'temps passé', 'tarif': 'temps passé', 'hono': 'temps passé',
            'mission': 'nouvelles missions', 'offre': 'nouvelles missions', 'copilotage': 'nouvelles missions',
            'commenc': 'commencer', 'début': 'commencer', 'roadmap': 'commencer', 'sprint': 'commencer', 'étape': 'commencer',
            'changement': 'changement', 'résistance': 'changement', 'équipe': 'changement', 'collaborat': 'changement', 'adkar': 'changement',
            'facture électronique': 'facture électronique', 'dématérial': 'facture électronique', '2026': 'facture électronique',
            'rse': 'rse', 'durabl': 'rse', 'csrd': 'rse', 'esg': 'rse',
            'pentagone': 'pentagone', 'radar': 'pentagone', 'diagnostic': 'pentagone', 'maturité': 'pentagone'
        };
        let matchedKey = null, maxR = 0;
        for (const [kw, key] of Object.entries(map)) {
            if (q.includes(kw) && kw.length > maxR) { maxR = kw.length; matchedKey = key; }
        }
        if (matchedKey && this.knowledge[matchedKey]) {
            const entry = this.knowledge[matchedKey];
            const html = this.md(entry.response);
            const sug = [];
            if (entry.followUp) sug.push({ label: '👉 ' + entry.followUp, query: entry.followUp });
            return { html, suggestions: sug };
        }
        return {
            html: `<p>Le livre blanc <strong>"Du Chiffre à la Valeur"</strong> couvre ce sujet. Voici les thèmes que je maîtrise :</p>`,
            suggestions: [
                { label: '💰 Sortir du temps passé', query: 'Comment sortir du modèle temps passé ?' },
                { label: '🎯 Nouvelles missions', query: 'Quelles sont les nouvelles missions ?' },
                { label: '🚀 Par où commencer ?', query: 'Par où commencer ma transformation ?' },
                { label: '👥 Conduite du changement', query: 'Comment gérer la résistance au changement ?' },
                { label: '🌱 RSE & Durabilité', query: 'Comment lancer une offre RSE ?' }
            ]
        };
    }

    md(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n- /g, '</p><p>• ').replace(/\n(\d+)\. /g, '</p><p>$1. ').replace(/^/, '<p>').replace(/$/, '</p>');
    }
    esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
    scrollBottom() { setTimeout(() => { this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight; }, 50); }
}
