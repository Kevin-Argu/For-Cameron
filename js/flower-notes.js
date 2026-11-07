// Kevin's notes for Cameron. Add the personal wording between the quotes.
// These are published page contents, not a visitor comment form.
(() => {
    'use strict';
    const entries = {
        lilies:   { title: 'Lilies',   note: '' },
        sakura:   { title: 'Sakura',   note: '' },
        petunia:  { title: 'Petunia',  note: '' },
        plumeria: { title: 'Plumeria', note: '' },
        hibiscus: { title: 'Hibiscus', note: '' },
        lilac:    { title: 'Lilac',    note: '' },
        wisteria: { title: 'Wisteria', note: '' }
    };

    function createCard(container, id, onClose = () => {}) {
        const card = document.createElement('section');
        card.className = 'flower-note-card';
        card.id = id;
        card.hidden = true;
        card.setAttribute('role', 'dialog');
        card.setAttribute('aria-labelledby', id + 'Title');
        card.innerHTML = `
            <button type="button" class="flower-note-close" aria-label="Close flower note">×</button>
            <h2 id="${id}Title"></h2>
            <p class="flower-note-text"></p>
        `;
        container.appendChild(card);
        const closeButton = card.querySelector('button');
        const text = card.querySelector('.flower-note-text');
        let trigger = null;

        function close(restoreFocus = false) {
            if (card.hidden) return false;
            card.hidden = true;
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            onClose();
            if (restoreFocus && trigger) trigger.focus({ preventScroll: true });
            return true;
        }
        function open(key, button) {
            const entry = entries[key];
            if (!entry) return;
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            trigger = button;
            if (trigger) trigger.setAttribute('aria-expanded', 'true');
            card.querySelector('h2').textContent = entry.title;
            const note = entry.note.trim();
            text.textContent = note || 'This one reminds me of…';
            text.classList.toggle('is-placeholder', !note);
            card.scrollTop = 0;
            card.hidden = false;
            card.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
            closeButton.focus({ preventScroll: true });
        }
        closeButton.addEventListener('click', () => close(true));
        card.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            event.stopPropagation();
            close(true);
        });
        return { element: card, open, close };
    }

    const api = window.CameronNotes = { entries, createCard };
    const lilySection = document.getElementById('lilyFinale');
    const lilyCanvas = document.getElementById('asciiLiliesCanvas');
    if (lilySection && lilyCanvas) {
        const lilyCard = createCard(lilySection, 'lilyNotePanel');
        const growthControl = document.createElement('div');
        growthControl.className = 'lily-growth-control';
        growthControl.innerHTML = `
            <label for="lilyGrowth">Bloom</label>
            <input id="lilyGrowth" type="range" min="0" max="20" step="0.1" value="0">
        `;
        lilyCard.element.appendChild(growthControl);
        api.openLilies = () => lilyCard.open('lilies', lilyCanvas);
        lilyCanvas.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            api.openLilies();
        });
        document.getElementById('enterGarden')?.addEventListener('click', () => lilyCard.close());
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                if (!entries[0].isIntersecting) lilyCard.close();
            }).observe(lilySection);
        }
    }
})();
