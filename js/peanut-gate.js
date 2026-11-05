(() => {
    'use strict';

    const gate = document.getElementById('peanutGate');
    const enter = document.getElementById('enterPeanutFree');
    const main = document.querySelector('main');
    if (!gate || !enter) return;
    let closing = false;
    let finished = false;
    let fallbackTimer;
    window.scrollTo({ top: 0, behavior: 'instant' });

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
    document.addEventListener('wheel', preventBackgroundScroll, options);
    document.addEventListener('touchmove', preventBackgroundScroll, options);
    document.addEventListener('keydown', trapFocus, true);
    enter.focus({ preventScroll: true });

    function completeEntry() {
        if (finished) return;
        finished = true;
        clearTimeout(fallbackTimer);
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
        window.scrollTo({ top: 0, behavior: 'instant' });
        window.CameronSite.entered = true;
        document.dispatchEvent(new CustomEvent('cameron:entered'));
        document.getElementById('waterLilies').focus({ preventScroll: true });
    }
    function onTransitionEnd(event) {
        if (event.target === gate && event.propertyName === 'opacity') completeEntry();
    }
    enter.addEventListener('click', () => {
        if (closing) return;
        closing = true;
        if (window.CameronSite.reducedMotion.matches) {
            completeEntry();
            return;
        }
        gate.addEventListener('transitionend', onTransitionEnd);
        gate.classList.add('is-closing');
        fallbackTimer = setTimeout(completeEntry, 550);
    });
})();
