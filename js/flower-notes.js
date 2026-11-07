// Flower names and shared detail dialogs. Each popup contains its math or bloom control.
// Personal-message placeholders are intentionally absent from both the data and markup.
(() => {
    'use strict';
    const entries = {
        lilies:   { title: 'Lilies' },
        sakura:   { title: 'Sakura' },
        petunia:  { title: 'Petunia' },
        plumeria: { title: 'Plumeria' },
        hibiscus: { title: 'Hibiscus' },
        lilac:    { title: 'Lilac' },
        wisteria: { title: 'Wisteria' },
        pansy: { title: 'Pansy' },
        sunflower: { title: 'Sunflower' },
        chrysanthemum: { title: 'Chrysanthemum' },
        marigold: { title: 'Marigold' },
        daisy: { title: 'Daisy' },
        forgetmenots: { title: 'Forget-me-nots' }
    };

    function createCard(container, id, onClose = () => {}) {
        const card = document.createElement('section');
        card.className = 'flower-note-card';
        card.id = id;
        card.hidden = true;
        card.setAttribute('role', 'dialog');
        card.setAttribute('aria-labelledby', id + 'Title');
        card.innerHTML = `
            <button type="button" class="flower-note-close" aria-label="Close flower">×</button>
            <h2 id="${id}Title"></h2>
        `;
        container.appendChild(card);
        const closeButton = card.querySelector('button');
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

