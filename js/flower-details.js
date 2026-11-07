(() => {
    'use strict';

    // The flower cards use the garden's actual curves, colors and layers.
    // A separate calculator lets Cameron play without moving the garden itself.
    window.CameronFlowerDetails = function createFlowerDetails(card, flower, expressions) {
        const element = document.createElement('div');
        element.className = 'flower-detail-calculator';
        element.setAttribute('aria-label', flower.title + ' equations and sliders');
        card.classList.add('has-flower-math');
        card.appendChild(element);
        const calculator = Desmos.GraphingCalculator(element, {
            expressions: true,
            expressionsCollapsed: false,
            expressionsTopbar: false,
            keypad: false,
            settingsMenu: false,
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
            graphDescription: flower.title + ', with its equations and a bloom-size slider.'
        });
        const center = String.raw`\left(${flower.cx},${flower.cy}\right)`;
        calculator.setExpressions([
            { id: 'bloom-size', latex: 'b=1', sliderBounds: { min: '0.5', max: '1.4', step: '0.01' } },
            ...expressions.map(expression => ({
                ...expression,
                // Scale every layer together around the flower or cluster's center.
                latex: expression.parametricDomain
                    ? String.raw`${center}+b\left(${expression.latex.trim()}-${center}\right)`
                    : expression.latex
            }))
        ]);
        let previousSize = '';
        function fit() {
            const { width, height } = calculator.graphpaperBounds.pixelCoordinates;
            const size = width + ':' + height;
            if (!width || !height || size === previousSize) return;
            previousSize = size;
            const scale = Math.max(flower.width * 1.55 / width, flower.height * 1.55 / height);
            calculator.setMathBounds({
                left: flower.cx - width * scale / 2, right: flower.cx + width * scale / 2,
                bottom: flower.cy - height * scale / 2, top: flower.cy + height * scale / 2
            });
        }
        calculator.observe('graphpaperBounds', fit);
        fit();
        return {
            destroy() {
                calculator.destroy();
                element.remove();
                card.classList.remove('has-flower-math');
            }
        };
    };
})();
