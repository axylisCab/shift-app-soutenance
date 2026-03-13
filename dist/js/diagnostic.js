/* ============================================
   SHIFT — Diagnostic Engine
   ============================================ */

class DiagnosticEngine {
    constructor() {
        this.questions = SHIFT_DATA.questions;
        this.currentIndex = 0;
        this.answers = new Array(this.questions.length).fill(null);
        this.onComplete = null;

        this.elements = {
            progressFill: document.getElementById('diag-progress-fill'),
            progressText: document.getElementById('diag-progress-text'),
            axisBadge: document.getElementById('diag-axis-badge'),
            questionNumber: document.getElementById('question-number'),
            questionText: document.getElementById('question-text'),
            questionContext: document.getElementById('question-context'),
            answersGrid: document.getElementById('answers-grid'),
            questionCard: document.getElementById('question-card')
        };
    }

    start() {
        this.currentIndex = 0;
        this.answers = new Array(this.questions.length).fill(null);
        this.renderQuestion();
    }

    renderQuestion() {
        const q = this.questions[this.currentIndex];
        const axis = SHIFT_DATA.axes.find(a => a.id === q.axis);
        const total = this.questions.length;

        // Update progress
        const progress = ((this.currentIndex) / total) * 100;
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressText.textContent = `${this.currentIndex + 1} / ${total}`;

        // Update axis badge
        this.elements.axisBadge.textContent = axis.label;
        this.elements.axisBadge.style.background = `${axis.color}20`;
        this.elements.axisBadge.style.color = axis.color;

        // Update question
        this.elements.questionNumber.textContent = String(this.currentIndex + 1).padStart(2, '0');
        this.elements.questionText.textContent = q.text;
        this.elements.questionContext.textContent = q.context;

        // Render answer buttons
        this.elements.answersGrid.innerHTML = '';
        q.answers.forEach((answer, i) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.innerHTML = `
        <span class="answer-score">${i + 1}</span>
        <span class="answer-label">${answer.label}</span>
      `;
            btn.addEventListener('click', () => this.selectAnswer(i, answer.score));
            this.elements.answersGrid.appendChild(btn);
        });

        // Animate card entrance
        this.elements.questionCard.style.animation = 'none';
        this.elements.questionCard.offsetHeight; // trigger reflow
        this.elements.questionCard.style.animation = 'card-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    selectAnswer(index, score) {
        // Visual feedback
        const buttons = this.elements.answersGrid.querySelectorAll('.answer-btn');
        buttons.forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });

        // Store answer
        this.answers[this.currentIndex] = score;

        // Auto-advance after short delay
        setTimeout(() => {
            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex++;
                this.renderQuestion();
            } else {
                // Complete!
                this.elements.progressFill.style.width = '100%';
                this.complete();
            }
        }, 400);
    }

    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderQuestion();
        } else {
            // Go back to splash
            window.shiftApp.navigateTo('splash-screen');
        }
    }

    complete() {
        const scores = this.calculateScores();
        if (this.onComplete) {
            this.onComplete(scores);
        }
    }

    calculateScores() {
        const axisScores = {};
        const axisQuestionCount = {};

        SHIFT_DATA.axes.forEach(axis => {
            axisScores[axis.id] = 0;
            axisQuestionCount[axis.id] = 0;
        });

        this.questions.forEach((q, i) => {
            if (this.answers[i] !== null) {
                axisScores[q.axis] += this.answers[i];
                axisQuestionCount[q.axis]++;
            }
        });

        // Average score per axis (1-4 scale)
        const scores = SHIFT_DATA.axes.map(axis => {
            if (axisQuestionCount[axis.id] === 0) return 1;
            return axisScores[axis.id] / axisQuestionCount[axis.id];
        });

        return scores;
    }
}
