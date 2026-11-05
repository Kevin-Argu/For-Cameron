(() => {
    'use strict';

    const site = window.CameronSite = {
        entered: !document.body.classList.contains('peanut-lock'),
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
        flowerUI: null
    };
    window.CameronGraphs = {};

    const garden = document.getElementById('gardenStart');
    const calculator = document.getElementById('flowerCalculator');
    const lock = document.getElementById('desmosLock');
    const explore = document.getElementById('exploreButton');
    const done = document.getElementById('doneButton');

    function setExploring(enabled, restoreFocus = false) {
        if (enabled && explore.disabled) return;
        garden.classList.toggle('is-exploring', enabled);
        lock.classList.toggle('unlocked', enabled);
        calculator.inert = !enabled;
        explore.hidden = enabled;
        explore.setAttribute('aria-expanded', String(enabled));
        done.hidden = !enabled;
        if (site.flowerUI) site.flowerUI.setInteractive(enabled);
        if (enabled) done.focus({ preventScroll: true });
        else if (restoreFocus) explore.focus({ preventScroll: true });
    }

    explore.addEventListener('click', () => setExploring(true));
    done.addEventListener('click', () => setExploring(false, true));
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !garden.classList.contains('is-exploring')) return;
        if (!site.flowerUI || !site.flowerUI.closeMath(true)) setExploring(false, true);
        event.preventDefault();
    });

    // Leaving a section should never leave its graph in scroll-catching mode.
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) setExploring(false);
        }).observe(garden);
    }
})();
