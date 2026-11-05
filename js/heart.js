(() => {
    'use strict';
    window.CameronGraphs.heart = function initializeHeart() {
        const site = window.CameronSite;
        const section = document.getElementById('heartFinale');
        const element = document.getElementById('heartCalculator');
        const lock = document.getElementById('heartLock');
        const mathButton = document.getElementById('toggleHeartMath');
        const animationButton = document.getElementById('toggleHeartAnimation');
        const calculator = Desmos.GraphingCalculator(element, {
            expressions: false,
            keypad: false,
            settingsMenu: false,
            expressionsTopbar: false,
            zoomButtons: false,
            lockViewport: true,
            pointsOfInterest: false,
            trace: false,
            border: false,
            showGrid: true,
            showXAxis: false,
            showYAxis: false,
            xAxisNumbers: false,
            yAxisNumbers: false,
            graphDescription: 'A heart formed by an animated mathematical curve.'
        });
        // Keep the original equation, color, range and starting value.
        calculator.setExpressions([
            { id: 'heart', latex: String.raw`f(x)=x^{\frac{2}{3}}+\sqrt{5-x^2}\sin(a\pi x)`, color: '#9b4d5b', lineWidth: 4 },
            { id: 'slider', latex: 'a=-10', sliderBounds: { min: '-10', max: '10', step: '0.01' }, playing: false }
        ]);
        let showingMath = false;
        let visible = false;
        let wantsPlaying = !site.reducedMotion.matches;
        let playing = false;
        let resizeFrame = 0;

        function updatePlayback() {
            const next = wantsPlaying && visible && !document.hidden;
            if (next !== playing) {
                playing = next;
                calculator.setExpression({ id: 'slider', playing });
            }
            animationButton.textContent = wantsPlaying ? 'Pause' : 'Play';
            animationButton.setAttribute('aria-label', wantsPlaying ? 'Pause the heart animation' : 'Play the heart animation');
        }
        function fitHeart() {
            if (showingMath) return;
            const { width, height } = element.getBoundingClientRect();
            if (!width || !height) return;
            const scale = Math.max(7 / width, 7 / height);
            calculator.setMathBounds({ left: -width * scale / 2, right: width * scale / 2,
                bottom: 1.5 - height * scale / 2, top: 1.5 + height * scale / 2 });
        }
        function queueFit() {
            cancelAnimationFrame(resizeFrame);
            resizeFrame = requestAnimationFrame(fitHeart);
        }
        function showMath(show, restoreFocus = false) {
            showingMath = show;
            section.classList.toggle('showing-math', show);
            lock.hidden = show;
            element.inert = !show;
            mathButton.textContent = show ? 'Hide math' : 'Show math';
            mathButton.setAttribute('aria-expanded', String(show));
            calculator.updateSettings({ expressions: show, zoomButtons: show, lockViewport: !show });
            queueFit();
            if (restoreFocus) mathButton.focus({ preventScroll: true });
        }
        mathButton.addEventListener('click', () => showMath(!showingMath));
        animationButton.addEventListener('click', () => { wantsPlaying = !wantsPlaying; updatePlayback(); });
        section.addEventListener('keydown', event => {
            if (event.key === 'Escape' && showingMath) {
                showMath(false, true);
                event.preventDefault();
            }
        });
        // Keep the custom control in sync with the slider's own play/pause button.
        calculator.observeEvent('change', (_, event) => {
            if (!event.isUserInitiated) return;
            const slider = calculator.getExpressions().find(expression => expression.id === 'slider');
            if (!slider || typeof slider.playing !== 'boolean') return;
            playing = slider.playing;
            wantsPlaying = playing;
            updatePlayback();
        });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(entries => {
                visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .1;
                if (!entries[0].isIntersecting) showMath(false);
                updatePlayback();
            }, { threshold: [0, .1] }).observe(section);
        } else { visible = true; }
        if ('ResizeObserver' in window) new ResizeObserver(queueFit).observe(element);
        else window.addEventListener('resize', queueFit, { passive: true });
        document.addEventListener('visibilitychange', updatePlayback);
        site.reducedMotion.addEventListener('change', () => {
            wantsPlaying = !site.reducedMotion.matches;
            updatePlayback();
        });
        fitHeart();
        updatePlayback();
    };
})();
