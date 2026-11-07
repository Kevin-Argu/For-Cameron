(() => {
    'use strict';

    // Bind only to the goodbye page; other pages can safely load this script too.
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

    // Clear both movement states and restore the rabbit's keyboard accessibility.
    function resetGeorge() {
        if (!hasGeorge) return;
        meadow.classList.remove('is-hopping', 'has-hopped');
        george.removeAttribute('aria-disabled');
        george.removeAttribute('tabindex');
        recall.hidden = true;
    }
    // Reveal recall when the crossing ends. Move focus only if it was on George,
    // so taking the milk never steals focus from the bottle button.
    function finishHop() {
        if (!hasGeorge) return;
        const restoreFocus = document.activeElement === george;
        meadow.classList.remove('is-hopping');
        meadow.classList.add('has-hopped');
        recall.hidden = false;
        status.textContent = 'George hopped off. You can call him back.';
        if (restoreFocus) recall.focus({ preventScroll: true });
    }
    // Repeated taps cannot restart an active hop or interrupt a completed exit.
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
        // Honor a motion-preference change immediately, including during a hop.
        reducedMotion.addEventListener('change', () => {
            if (reducedMotion.matches) {
                const restoreFocus = document.activeElement === recall;
                resetGeorge();
                if (restoreFocus) george.focus({ preventScroll: true });
            }
        });
        // Return George to a stable position when the visitor switches tabs.
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

    // Toggle the bottle's enlarged view with the same button; shrinking it also brings George back.
    // Keep the visible hint, spoken status, and pressed state consistent with the visual size.
    gift.addEventListener('click', () => {
        const taken = section.classList.toggle('has-milk');
        gift.setAttribute('aria-pressed', String(taken));
        gift.setAttribute('aria-label', taken ? 'Shrink the chocolate milk' : 'Enlarge the chocolate milk');
        hint.textContent = taken ? 'shrink it ↓' : 'take it ↑';
        status.textContent = taken ? 'The chocolate milk is bigger. Tap it again to shrink it.' : 'The chocolate milk is back beside the chair.';
        if (taken) hopAway();
        else resetGeorge();
    });
})();
