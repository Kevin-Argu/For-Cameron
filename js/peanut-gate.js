(() => {
    'use strict';

    const gate = document.getElementById('peanutGate');
    const enter = document.getElementById('enterPeanutFree');
    const main = document.querySelector('main');
    if (!gate || !enter || !main) return;
    const george = document.getElementById('welcomeGeorge');
    const georgeScene = document.getElementById('welcomeGeorgeScene');
    const reducedMotion = window.CameronSite.reducedMotion;
    let closing = false;
    let fading = false;
    let finished = false;
    let fallbackTimer;
    let hopTimer;

    // The document stays locked, but a short-screen welcome can scroll itself.
    function preventBackgroundScroll(event) {
        if (!gate.contains(event.target)) event.preventDefault();
    }
    function trapFocus(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            enter.focus({ preventScroll: true });
        }
    }
    const options = { passive: false, capture: true };
    // Returning from birdwatching restores its binoculars section without replaying the welcome.
    // Keep existing direct garden links working as well.
    const returnSection = ['#birdwatchEntry', '#gardenStart'].includes(window.location.hash)
        ? document.getElementById(window.location.hash.slice(1)) : null;
    if (returnSection) {
        completeEntry(returnSection);
        return;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    document.addEventListener('wheel', preventBackgroundScroll, options);
    document.addEventListener('touchmove', preventBackgroundScroll, options);
    document.addEventListener('keydown', trapFocus, true);
    reducedMotion.addEventListener('change', onMotionChange);
    enter.focus({ preventScroll: true });

    function completeEntry(target = null) {
        if (finished) return;
        finished = true;
        clearTimeout(fallbackTimer);
        clearTimeout(hopTimer);
        if (george) george.removeEventListener('animationend', onHopEnd);
        reducedMotion.removeEventListener('change', onMotionChange);
        gate.removeEventListener('transitionend', onTransitionEnd);
        gate.hidden = true;
        gate.setAttribute('aria-hidden', 'true');
        main.inert = false;
        main.removeAttribute('aria-hidden');
        document.documentElement.classList.remove('peanut-locked');
        document.body.classList.remove('peanut-lock');
        document.removeEventListener('wheel', preventBackgroundScroll, options);
        document.removeEventListener('touchmove', preventBackgroundScroll, options);
        document.removeEventListener('keydown', trapFocus, true);
        window.CameronSite.entered = true;
        if (target) {
            target.scrollIntoView({ behavior: 'instant', block: 'start' });
            target.focus({ preventScroll: true });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
            document.getElementById('waterLilies').focus({ preventScroll: true });
        }
        document.dispatchEvent(new CustomEvent('cameron:entered'));
    }
    function onTransitionEnd(event) {
        if (event.target === gate && event.propertyName === 'opacity') completeEntry();
    }
    function onMotionChange() {
        // Enabling reduced motion during either the hop or fade must never trap entry.
        if (closing && reducedMotion.matches) completeEntry();
    }
    function beginFade() {
        if (fading || finished) return;
        fading = true;
        clearTimeout(hopTimer);
        if (george) george.removeEventListener('animationend', onHopEnd);
        gate.addEventListener('transitionend', onTransitionEnd);
        gate.classList.add('is-closing');
        fallbackTimer = setTimeout(completeEntry, 550);
    }
    function onHopEnd(event) {
        // Only the complete sideways journey finishes the two hops. Ear and body
        // animation events bubble through the same element and must be ignored.
        if (event.target === george && event.animationName === 'george-welcome-travel') beginFade();
    }
    enter.addEventListener('click', () => {
        if (closing) return;
        closing = true;
        enter.setAttribute('aria-disabled', 'true');
        if (reducedMotion.matches) {
            completeEntry();
            return;
        }
        if (!george || !georgeScene) {
            beginFade();
            return;
        }
        // On short screens, reveal George within the scrollable gate before he
        // moves. Preserve the existing button focus until entry is complete.
        georgeScene.scrollIntoView({ behavior: 'instant', block: 'nearest' });
        george.addEventListener('animationend', onHopEnd);
        gate.classList.add('is-george-hopping');
        // CSS ends after 960ms; this bound also opens the site if animation events
        // are suppressed or the tab was backgrounded during the welcome.
        hopTimer = setTimeout(beginFade, 1120);
    });
})();

