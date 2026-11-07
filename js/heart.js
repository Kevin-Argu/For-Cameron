(() => {
    'use strict';
    window.CameronGraphs.heart = function initializeHeart() {
        const site = window.CameronSite;
        const section = document.getElementById('heartFinale');
        const element = document.getElementById('heartCalculator');
        const calculator = Desmos.GraphingCalculator(element, {
            expressions: true,
            expressionsCollapsed: false,
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
        let visible = false;
        let wantsPlaying = !site.reducedMotion.matches;
        let playing = false;
        let previousSize = '';

        function updatePlayback() {
            const next = wantsPlaying && visible && !document.hidden;
            if (next !== playing) {
                playing = next;
                calculator.setExpression({ id: 'slider', playing });
            }
        }
        function fitHeart() {
            const { width, height } = calculator.graphpaperBounds.pixelCoordinates;
            const size = width + ':' + height;
            if (!width || !height || size === previousSize) return;
            previousSize = size;
            const scale = Math.max(7 / width, 7 / height);
            calculator.setMathBounds({ left: -width * scale / 2, right: width * scale / 2,
                bottom: 1.5 - height * scale / 2, top: 1.5 + height * scale / 2 });
        }
        // The slider's own play/pause control is the only animation control.
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
                updatePlayback();
            }, { threshold: [0, .1] }).observe(section);
        } else { visible = true; }
        calculator.observe('graphpaperBounds', fitHeart);
        document.addEventListener('visibilitychange', updatePlayback);
        site.reducedMotion.addEventListener('change', () => {
            wantsPlaying = !site.reducedMotion.matches;
            updatePlayback();
        });
        fitHeart();
        updatePlayback();
    };
})();

