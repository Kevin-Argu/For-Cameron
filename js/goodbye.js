(() => {
    'use strict';

    const section = document.getElementById('goodbyeFinale');
    const gift = document.getElementById('takeChocolateMilk');
    const hint = document.getElementById('milkHint');
    const status = document.getElementById('milkStatus');
    if (!section || !gift || !hint || !status) return;

    gift.addEventListener('click', () => {
        const taken = section.classList.toggle('has-milk');
        gift.setAttribute('aria-pressed', String(taken));
        gift.setAttribute('aria-label', taken ? 'Hand the chocolate milk back' : 'Take the chocolate milk');
        hint.textContent = taken ? 'all yours. ♡' : 'take it ↑';
        status.textContent = taken ? 'The chocolate milk is yours. Tap again to hand it back.' : 'Here, chocolate milk.';
    });
})();
