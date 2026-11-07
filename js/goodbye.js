(() => {
    'use strict';

    const section = document.getElementById('goodbyeFinale');
    const gift = document.getElementById('takeChocolateMilk');
    const hint = document.getElementById('milkHint');
    const status = document.getElementById('milkStatus');
    if (!section || !gift || !hint || !status) return;

    const meadow = document.getElementById('georgeMeadow');
    const crossing = document.getElementById('georgeCrossing');
    const george = document.getElementById('georgeHop');
    const recall = document.getElementById('recallGeorge');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hasGeorge = meadow && crossing && george && recall;

    function resetGeorge() {
        if (!hasGeorge) return;
        meadow.classList.remove('is-hopping', 'has-hopped');
        george.removeAttribute('aria-disabled');
        george.removeAttribute('tabindex');
        recall.hidden = true;
    }
    function finishHop() {
        if (!hasGeorge) return;
        const restoreFocus = document.activeElement === george;
        meadow.classList.remove('is-hopping');
        meadow.classList.add('has-hopped');
        recall.hidden = false;
        status.textContent = 'George hopped off. You can call him back.';
        if (restoreFocus) recall.focus({ preventScroll: true });
    }
    function hopAway() {
        if (!hasGeorge || meadow.classList.contains('is-hopping') || meadow.classList.contains('has-hopped')) return;
        // Keep George present for visitors who prefer reduced motion.
        if (reducedMotion.matches) {
            status.textContent = 'George is keeping you company. ♡';
            return;
        }
        george.setAttribute('aria-disabled', 'true');
        george.setAttribute('tabindex', '-1');
        meadow.classList.add('is-hopping');
    }
    if (hasGeorge) {
        george.addEventListener('click', hopAway);
        crossing.addEventListener('animationend', event => {
            if (event.target === crossing && event.animationName === 'george-leaves') finishHop();
        });
        recall.addEventListener('click', () => {
            resetGeorge();
            status.textContent = 'George is back. ♡';
            george.focus({ preventScroll: true });
        });
        reducedMotion.addEventListener('change', () => {
            if (reducedMotion.matches) {
                const restoreFocus = document.activeElement === recall;
                resetGeorge();
                if (restoreFocus) george.focus({ preventScroll: true });
            }
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) resetGeorge();
        });
        // A new visit starts with George waiting beside the gift again.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                if (!entries[0].isIntersecting) resetGeorge();
            }).observe(section);
        }
    }

    gift.addEventListener('click', () => {
        const taken = section.classList.toggle('has-milk');
        gift.setAttribute('aria-pressed', String(taken));
        gift.setAttribute('aria-label', taken ? 'Hand the chocolate milk back' : 'Take the chocolate milk');
        hint.textContent = taken ? 'all yours. ♡' : 'take it ↑';
        status.textContent = taken ? 'The chocolate milk is yours. Tap again to hand it back.' : 'Here, chocolate milk.';
        if (taken) hopAway();
        else resetGeorge();
    });
})();
