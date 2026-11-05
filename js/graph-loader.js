(() => {
    'use strict';
    const site = window.CameronSite;
    let libraryPromise;
    const scenes = [
        { name: 'flowers', section: 'gardenStart', element: 'flowerCalculator', status: 'flowerStatus', controls: ['exploreButton'] },
        { name: 'heart', section: 'heartFinale', element: 'heartCalculator', status: 'heartStatus', controls: ['toggleHeartMath', 'toggleHeartAnimation'] }
    ].map(scene => ({ ...scene, near: false, state: 'idle' }));

    function loadLibrary() {
        if (window.Desmos && typeof window.Desmos.GraphingCalculator === 'function') return Promise.resolve();
        if (libraryPromise) return libraryPromise;
        libraryPromise = new Promise((resolve, reject) => {
            const key = document.querySelector('meta[name="desmos-api-key"]').content.trim();
            const script = document.createElement('script');
            let settled = false;
            const timer = setTimeout(() => finish(new Error('Desmos loading timed out')), 15000);
            function finish(error) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                script.onload = script.onerror = null;
                if (error) { script.remove(); reject(error); }
                else resolve();
            }
            script.async = true;
            script.src = 'https://www.desmos.com/api/v1.12/calculator.js?apiKey=' + encodeURIComponent(key);
            script.onload = () => finish(window.Desmos && typeof window.Desmos.GraphingCalculator === 'function'
                ? null : new Error('Desmos is unavailable'));
            script.onerror = () => finish(new Error('Desmos could not load'));
            document.head.appendChild(script);
        }).catch(error => {
            libraryPromise = null;
            throw error;
        });
        return libraryPromise;
    }

    async function initialize(scene) {
        if (!site.entered || scene.state === 'loading' || scene.state === 'ready') return;
        scene.state = 'loading';
        const status = document.getElementById(scene.status);
        const retry = status.querySelector('button');
        status.hidden = false;
        retry.hidden = true;
        status.querySelector('p').textContent = scene.name === 'flowers' ? 'Opening the garden…' : 'Opening the heart…';
        try {
            await loadLibrary();
            window.CameronGraphs[scene.name]();
            scene.state = 'ready';
            status.hidden = true;
            scene.controls.forEach(id => { document.getElementById(id).disabled = false; });
        } catch (error) {
            scene.state = 'error';
            status.querySelector('p').textContent = 'The graph couldn’t load. You can try again or keep exploring.';
            retry.hidden = false;
            console.warn('Unable to open ' + scene.name + ':', error.message);
        }
    }

    scenes.forEach(scene => {
        document.querySelector('[data-retry="' + scene.name + '"]').addEventListener('click', () => initialize(scene));
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                scene.near = entries[0].isIntersecting;
                if (scene.near && scene.state === 'idle') initialize(scene);
            }, { rootMargin: '600px 0px' }).observe(document.getElementById(scene.section));
        } else scene.near = true;
    });
    function enter() {
        // Begin fetching while she plays with the lilies; instantiate each graph near its section.
        loadLibrary().catch(() => {});
        scenes.forEach(scene => { if (scene.near) initialize(scene); });
    }
    document.addEventListener('cameron:entered', enter, { once: true });
    if (site.entered) enter();
})();
