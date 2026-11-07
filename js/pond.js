(() => {
    'use strict';
    const pond = document.getElementById('lilyPond');
    if (!pond) return;

    let visible = false;
    function syncVisibility() {
        pond.classList.toggle('is-visible', visible && !document.hidden);
        if (!visible || document.hidden) pond.classList.remove('is-rippling');
    }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            syncVisibility();
        }).observe(pond);
    } else {
        visible = true;
        syncVisibility();
    }
    document.addEventListener('visibilitychange', syncVisibility);

    pond.addEventListener('click', event => {
        const rect = pond.getBoundingClientRect();
        // Keyboard activation makes a ripple beside the white flower.
        const x = event.detail ? (event.clientX - rect.left) / rect.width * 100 : 52;
        const y = event.detail ? (event.clientY - rect.top) / rect.height * 100 : 63;
        pond.style.setProperty('--ripple-x', `${Math.max(10, Math.min(90, x))}%`);
        pond.style.setProperty('--ripple-y', `${Math.max(20, Math.min(80, y))}%`);
        pond.classList.remove('is-rippling');
        void pond.offsetWidth;
        pond.classList.add('is-rippling');
    });
    pond.addEventListener('animationend', event => {
        if (event.target.classList.contains('ripple-two')) pond.classList.remove('is-rippling');
    });
})();
