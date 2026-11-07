(() => {
'use strict';
window.CameronGraphs.flowers = function initializeFlowers() {
// ============================================================
// DESMOS FLOWER BACKGROUND + PERSONAL NOTES
// ============================================================

const flowerElement = document.getElementById("flowerCalculator");

const flowerCalculator = Desmos.GraphingCalculator(flowerElement, {
    expressions: false,
    keypad: false,
    settingsMenu: false,
    zoomButtons: false,
    expressionsTopbar: false,
    pointsOfInterest: false,
    trace: false,
    border: false,
    graphDescription: "Twelve flowers surround Cameron: sakura, pansy, sunflower, petunia, plumeria, hibiscus, lilac, wisteria, chrysanthemum, marigold, daisy and forget-me-nots."
});

flowerCalculator.updateSettings({
    showGrid: true,
    showXAxis: false,
    showYAxis: false,
    xAxisNumbers: false,
    yAxisNumbers: false
});

flowerCalculator.setMathBounds({
    left: -10,
    right: 10,
    bottom: -6,
    top: 6
});

const initialExpressions = [];

// Preserve each layer's intended transparency during the reveal animation.
const flowerRevealGroups = {
    sakura: [],
    petunia: [],
    plumeria: [],
    hibiscus: [],
    lilac: [],
    wisteria: [],
    pansy: [],
    sunflower: [],
    chrysanthemum: [],
    marigold: [],
    daisy: [],
    forgetmenots: []
};

function registerFlowerReveal(id, kind, opacity) {
    const group = id.startsWith("lilac_")
        ? "lilac"
        : Object.keys(flowerRevealGroups).find(name => id.startsWith(name));

    if (group) {
        let curve = flowerRevealGroups[group].find(entry => entry.id === id);
        if (!curve) {
            curve = { id, opacities: {} };
            flowerRevealGroups[group].push(curve);
        }
        curve.opacities[kind === 'fill' ? 'fillOpacity' : 'lineOpacity'] = opacity;
    }
}

function addFilledCurve(id, latex, color, max = "12\\pi", fillOpacity = 1) {
    registerFlowerReveal(id, "fill", fillOpacity);

    initialExpressions.push({
        id,
        latex,
        color,
        fill: true,
        fillOpacity: 0,
        lineOpacity: 0,
        parametricDomain: { min: "0", max }
    });
}

function addLineCurve(id, latex, color, lineWidth = 2, max = "12\\pi", lineOpacity = 1) {
    registerFlowerReveal(id, "line", lineOpacity);

    initialExpressions.push({
        id,
        latex,
        color,
        lineWidth,
        lineOpacity: 0,
        parametricDomain: { min: "0", max }
    });
}


// ============================================================
// SAKURA - TOP LEFT
// ============================================================

addFilledCurve(
    "sakuraOuter",
    String.raw`(-2.4\sqrt{\sin(\cos(5t)-5)}\cos(t)-5,2.4\sqrt{\sin(\cos(5t)-5)}\sin(t)+3)`,
    "#f8cfe3",
    "2\\pi"
);

addFilledCurve(
    "sakuraMiddle1",
    String.raw`(-1.55\sqrt{\sin(\cos(5t)-5)}\cos(t)-5,1.55\sqrt{\sin(\cos(5t)-5)}\sin(t)+3)`,
    "#f5a6cf",
    "2\\pi"
);

addFilledCurve(
    "sakuraMiddle2",
    String.raw`(-0.95\sqrt{\sin(\cos(5t)-5)}\cos(t)-5,0.95\sqrt{\sin(\cos(5t)-5)}\sin(t)+3)`,
    "#ef7fba",
    "2\\pi"
);

addFilledCurve(
    "sakuraCenter",
    String.raw`(-0.48\sqrt{\sin(\cos(5t)-5)}\cos(t)-5,0.48\sqrt{\sin(\cos(5t)-5)}\sin(t)+3)`,
    "#df3f91",
    "2\\pi"
);


// ============================================================
// PETUNIA - TOP RIGHT
// ============================================================

initialExpressions.push({
    id: "Xpet",
    latex: "X_{pet}=5"
});

initialExpressions.push({
    id: "Ypet",
    latex: "Y_{pet}=2.7"
});

initialExpressions.push({
    id: "Pet",
    latex: "P_{et}=1.15"
});

initialExpressions.push({
    id: "Ptu",
    latex: "P_{tu}=P_{et}\\cdot0.3"
});

initialExpressions.push({
    id: "Ppetunia",
    latex: "P_{petunia}=P_{et}\\cdot0.9"
});

initialExpressions.push({
    id: "Ps",
    latex: "P_s=P_{et}\\cdot0.1"
});

addFilledCurve(
    "petuniaOuter",
    String.raw`(P_{et}\sqrt{\log_{2}(\cos(5t)+3)}\cos(t)+X_{pet},P_{et}\sqrt{\log_{2}(\cos(5t)+3)}\sin(t)+Y_{pet})`,
    "#f7b6dc"
);

addFilledCurve(
    "petuniaSecond",
    String.raw`(P_{petunia}\sqrt{\log_{2}(\cos(5t)+3)}\cos(t)+X_{pet},P_{petunia}\sqrt{\log_{2}(\cos(5t)+3)}\sin(t)+Y_{pet})`,
    "#ef8bc7"
);

addFilledCurve(
    "petuniaThird",
    String.raw`(P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\cos(t)+X_{pet},P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\sin(t)+Y_{pet})`,
    "#e864ad"
);

addLineCurve(
    "petuniaInner1",
    String.raw`(P_{tu}\sqrt{\log_{1.7}(\tan(2.5(t-1.9))-2)}\cos(t)+X_{pet},P_{tu}\sqrt{\log_{1.7}(\tan(2.5(t-1.9))-2)}\sin(t)+Y_{pet})`,
    "#8d246d",
    1.35,
    "12\\pi",
    0.38
);

addLineCurve(
    "petuniaInner2",
    String.raw`(P_{tu}\sqrt{\log_{1.7}(-\tan(2.5(t-1.9))-2)}\cos(t)+X_{pet},P_{tu}\sqrt{\log_{1.7}(-\tan(2.5(t-1.9))-2)}\sin(t)+Y_{pet})`,
    "#8d246d",
    1.35,
    "12\\pi",
    0.38
);

addLineCurve(
    "petuniaInner3",
    String.raw`(P_{tu}\sqrt{\log_{3}(\tan(10(t-1.9))+1)}\cos(t)+X_{pet},P_{tu}\sqrt{\log_{3}(\tan(10(t-1.9))+1)}\sin(t)+Y_{pet})`,
    "#7b1f62",
    1.15,
    "12\\pi",
    0.28
);

addLineCurve(
    "petuniaInner4",
    String.raw`(P_{tu}\sqrt{\log_{3}(-\tan(10(t-1.9))+1)}\cos(t)+X_{pet},P_{tu}\sqrt{\log_{3}(-\tan(10(t-1.9))+1)}\sin(t)+Y_{pet})`,
    "#7b1f62",
    1.15,
    "12\\pi",
    0.28
);

addFilledCurve(
    "petuniaCenter",
    String.raw`((P_s\sin(t))\cos(t)+X_{pet},(P_s\sin(t))\sin(t)+Y_{pet})`,
    "#701653"
);

[
    [0.8, "#d84c9e", 0.55],
    [0.6, "#bf367f", 0.70],
    [0.4, "#9e286b", 0.85],
    [0.2, "#77194f", 1.00]
].forEach(([scale, color, opacity], index) => {

    addFilledCurve(
        `petuniaCenterLayer${index + 1}`,
        String.raw`(${scale}P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\cos(t)+X_{pet},${scale}P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\sin(t)+Y_{pet})`,
        color,
        "12\\pi",
        opacity
    );

});


// ============================================================
// HIBISCUS - BOTTOM CENTER
// ============================================================

initialExpressions.push({
    id: "Xhib",
    latex: "X_{hib}=0"
});

initialExpressions.push({
    id: "Yhib",
    latex: "Y_{hib}=-3"
});

initialExpressions.push({
    id: "Hlove",
    latex: "H_{love}=-1.25"
});

initialExpressions.push({
    id: "Hlover",
    latex: "H_{lover}=\\frac{H_{love}}{4}"
});

initialExpressions.push({
    id: "Hlovers",
    latex: "H_{lovers}=\\frac{H_{love}}{10}"
});

[
    ["hibiscusNice", 4, "#8f72cf", 1.0],
    ["hibiscusSpice", 3, "#9878d6", 0.9],
    ["hibiscusPrice", 2, "#a17fdd", 0.9],
    ["hibiscusDice", 1, "#aa86e3", 0.9]
].forEach(([id, shift, color, opacity]) => {

    addFilledCurve(
        id,
        String.raw`(H_{love}\sqrt{\cos(\sin(5(t-${shift}))-1)}\cos(t)+X_{hib},H_{love}\sqrt{\cos(\sin(5(t-${shift}))-1)}\sin(t)+Y_{hib})`,
        color,
        "12\\pi",
        opacity
    );

});

addLineCurve(
    "hibiscusHi",
    String.raw`(H_{lover}\sqrt{\log_{3}(\tan(5t)+0.1)}\cos(t)+X_{hib},H_{lover}\sqrt{\log_{3}(\tan(5t)+0.1)}\sin(t)+Y_{hib})`,
    "#941553"
);

addLineCurve(
    "hibiscusBi",
    String.raw`(H_{lover}\sqrt{\log_{3}(-\tan(5t)+0.1)}\cos(t)+X_{hib},H_{lover}\sqrt{\log_{3}(-\tan(5t)+0.1)}\sin(t)+Y_{hib})`,
    "#941553"
);

addLineCurve(
    "hibiscusLie",
    String.raw`(H_{lover}\sqrt{\log_{2.3}(\tan(2.5(t/2))-5)}\cos(t)+X_{hib},H_{lover}\sqrt{\log_{2.3}(\tan(2.5(t/2))-5)}\sin(t)+Y_{hib})`,
    "#941553"
);

addLineCurve(
    "hibiscusSigh",
    String.raw`(H_{lover}\sqrt{\log_{2.3}(-\tan(2.5(t/2))-5)}\cos(t)+X_{hib},H_{lover}\sqrt{\log_{2.3}(-\tan(2.5(t/2))-5)}\sin(t)+Y_{hib})`,
    "#941553"
);

addLineCurve(
    "hibiscusPie",
    String.raw`(H_{lover}\sqrt{\log_{4}(-\tan(2.5t)-5)}\cos(t)+X_{hib},H_{lover}\sqrt{\log_{4}(-\tan(2.5t)-5)}\sin(t)+Y_{hib})`,
    "#941553"
);

addLineCurve(
    "hibiscusHigh",
    String.raw`(H_{lover}\sqrt{\log_{4}(\tan(2.5t)-5)}\cos(t)+X_{hib},H_{lover}\sqrt{\log_{4}(\tan(2.5t)-5)}\sin(t)+Y_{hib})`,
    "#941553"
);

addFilledCurve(
    "hibiscusHello",
    String.raw`(H_{lovers}\sqrt{\log_{2}(\cos(1.25t)+1)}\cos(t)+X_{hib},H_{lovers}\sqrt{\log_{2}(\cos(1.25t)+1)}\sin(t)+Y_{hib})`,
    "#f6d867"
);

addFilledCurve(
    "hibiscusBye",
    String.raw`(H_{lovers}\sqrt{\log_{2}(\cos(2.5t)+1)}\cos(t)+X_{hib},H_{lovers}\sqrt{\log_{2}(\cos(2.5t)+1)}\sin(t)+Y_{hib})`,
    "#ffe89a"
);


// ============================================================
// PLUMERIA - BOTTOM LEFT
// ============================================================

initialExpressions.push({
    id: "Xplum",
    latex: "X_{plum}=-6.2"
});

initialExpressions.push({
    id: "Yplum",
    latex: "Y_{plum}=-3.2"
});

initialExpressions.push({
    id: "Pplum",
    latex: "P_{plum}=-1.35"
});

[
    ["plumeriaOuter", 1.00, "#d3367a"],
    ["plumeriaPink", 0.82, "#df6c83"],
    ["plumeriaCoral", 0.62, "#e78b6d"],
    ["plumeriaOrange", 0.43, "#eea34f"],
    ["plumeriaYellow", 0.27, "#f2c23d"],
    ["plumeriaCenter", 0.12, "#f6d55c"]
].forEach(([id, scale, color]) => {

    addFilledCurve(
        id,
        String.raw`(${scale}P_{plum}\sqrt{\tan(\cos(2.5t))}\cos(t)+X_{plum},${scale}P_{plum}\sqrt{\tan(\cos(2.5t))}\sin(t)+Y_{plum})`,
        color
    );

});


// ============================================================
// LILAC CLUSTER - BOTTOM RIGHT
// ============================================================

const lilacClusterCenterX = 5.4;
const lilacClusterCenterY = -2.3;

const lilacCoordinateScale = 0.10;
const lilacFlowerScale = 0.10;

function addLilacBloom({
    id,
    originalX,
    originalY,
    size,
    phase,
    detail1,
    detail2,
    detail3,
    detail4
}) {

    const x =
        lilacClusterCenterX +
        (originalX - 260) * lilacCoordinateScale;

    const y =
        lilacClusterCenterY +
        (originalY - 270) * lilacCoordinateScale;

    const outerScale =
        size * lilacFlowerScale;

    const petalFormula = (scale) => String.raw`
    (
        ${scale}\sqrt{\log_{2}(1.05-\cos(4(t-${phase}))+1)}\cos(t)+${x},
        ${scale}\sqrt{\log_{2}(1.05-\cos(4(t-${phase}))+1)}\sin(t)+${y}
    )
    `;

    [
        ["outer", 1.0, "#be68c8"],
        ["p80", 0.8, "#cf8ddd"],
        ["p60", 0.6, "#dca9e5"],
        ["p40", 0.4, "#e8c7eb"],
        ["p20", 0.2, "#f1dced"]
    ].forEach(([suffix, scale, color]) => {

        addFilledCurve(
            `lilac_${id}_${suffix}`,
            petalFormula(outerScale * scale),
            color
        );

    });

    const detailScale =
        (size / 5) * lilacFlowerScale;

    [
        ["detail1", 10, "", detail1],
        ["detail2", 10, "-", detail2],
        ["detail3", 12, "", detail3],
        ["detail4", 12, "-", detail4]
    ].forEach(([suffix, base, sign, shift]) => {

        const shiftText =
            shift === 0
                ? "t"
                : `(t-${shift})`;

        addLineCurve(
            `lilac_${id}_${suffix}`,

            String.raw`
            (
                ${detailScale}\log_{${base}}(${sign}\tan(0.5${shiftText}))\cos(t)+${x},
                ${detailScale}\log_{${base}}(${sign}\tan(0.5${shiftText}))\sin(t)+${y}
            )
            `,

            "#f0d8eb",
            1.8,
            "12\\pi",
            0.85
        );

    });

}

addLilacBloom({
    id: "1",
    originalX: 250,
    originalY: 255,
    size: 10,
    phase: 0.8,
    detail1: 0,
    detail2: 3.1,
    detail3: 4.7,
    detail4: 1.6
});

addLilacBloom({
    id: "2",
    originalX: 245,
    originalY: 270,
    size: 11,
    phase: 0.4,
    detail1: 5.9,
    detail2: 2.7,
    detail3: 4.3,
    detail4: 1.2
});

addLilacBloom({
    id: "3",
    originalX: 260,
    originalY: 270,
    size: 9,
    phase: 1.2,
    detail1: 0.4,
    detail2: 3.5,
    detail3: 5.1,
    detail4: 2.0
});

addLilacBloom({
    id: "4",
    originalX: 265,
    originalY: 255,
    size: 12,
    phase: 3.2,
    detail1: 0.9,
    detail2: 4.0,
    detail3: 5.6,
    detail4: 2.5
});

addLilacBloom({
    id: "5",
    originalX: 260,
    originalY: 280,
    size: 8,
    phase: 0.0,
    detail1: 0.8,
    detail2: 3.9,
    detail3: 5.5,
    detail4: 2.4
});

addLilacBloom({
    id: "6",
    originalX: 275,
    originalY: 270,
    size: 10,
    phase: 1.0,
    detail1: 0.2,
    detail2: 3.3,
    detail3: 4.9,
    detail4: 1.8
});




// ============================================================
// CLICKABLE FLOWER NOTES
// ============================================================

const flowerNotes = window.CameronNotes.entries;


// ============================================================
// CLICKABLE AREAS
// ============================================================

const flowerClickAreas = [

    {
        id: "sakura",
        cx: -5.0,
        cy: 3.0,
        width: 5.0,
        height: 5.1
    },

    {
        id: "petunia",
        cx: 5.0,
        cy: 2.7,
        width: 4.0,
        height: 4.0
    },

    {
        id: "plumeria",
        cx: -6.2,
        cy: -3.2,
        width: 4.2,
        height: 4.2
    },

    {
        id: "hibiscus",
        cx: 0.0,
        cy: -3.0,
        width: 3.8,
        height: 3.8
    },

    {
        id: "lilac",
        cx: 5.4,
        cy: -2.3,
        width: 6.0,
        height: 5.1
    }

];



// Match the source graph's RGB definitions, including translucent shading.
// Petunia keeps its earlier pink gradient, with softer, finer veins above.
const palette = window.CameronBouquet.palette;
const colorKeys = {
    sakuraOuter: '2', sakuraMiddle1: '1', sakuraMiddle2: '1', sakuraCenter: '1',
    hibiscusNice: 'hi', hibiscusSpice: 'hi6', hibiscusPrice: 'hi1', hibiscusDice: 'hi2',
    hibiscusHi: 'hi3', hibiscusBi: 'hi3', hibiscusLie: 'hi3', hibiscusSigh: 'hi3',
    hibiscusPie: 'hi3', hibiscusHigh: 'hi3', hibiscusHello: 'hi4', hibiscusBye: 'hi5',
    plumeriaOuter: 'plum1', plumeriaPink: '2', plumeriaCoral: '2',
    plumeriaOrange: 'plum3', plumeriaYellow: 'plum2', plumeriaCenter: 'plum2'
};
initialExpressions.forEach(expression => {
    const id = expression.id;
    let key = colorKeys[id];
    if (id.startsWith('lilac_')) key = id.endsWith('_outer') ? 'lil' : /_detail/.test(id) || id.endsWith('_p20') ? 'lil2' : 'lil1';
    if (key) expression.color = palette[key];
    let opacity;
    if (/^sakuraMiddle/.test(id)) opacity = .2;
    if (id === 'plumeriaPink') opacity = .25;
    if (id === 'plumeriaOrange') opacity = .4;
    if (opacity !== undefined) registerFlowerReveal(id, 'fill', opacity);
});

const flowerParameters = {
    petunia: ['Xpet', 'Ypet', 'Pet', 'Ptu', 'Ppetunia', 'Ps'],
    hibiscus: ['Xhib', 'Yhib', 'Hlove', 'Hlover', 'Hlovers'],
    plumeria: ['Xplum', 'Yplum', 'Pplum']
};
// Keep the seven imported flower groups' layer order, domains and dependencies.
// Normalize only their position and uniform scale.
window.CameronBouquet.flowers.forEach(flower => {
    flowerParameters[flower.id] = [];
    flower.expressions.forEach(source => {
        const expression = { ...source };
        if (source.parametricDomain) {
            const [x, y] = flower.sourceCenter;
            expression.latex = String.raw`${flower.scale}\left(${source.latex}-\left(${x},${y}\right)\right)`;
            if (source.fill) registerFlowerReveal(source.id, 'fill', source.fillOpacity);
            if (source.lines) registerFlowerReveal(source.id, 'line', source.lineOpacity);
            expression.fillOpacity = 0;
            expression.lineOpacity = 0;
        } else {
            flowerParameters[flower.id].push(source.id);
        }
        initialExpressions.push(expression);
    });
    flowerClickAreas.push({ id: flower.id, cx: 0, cy: 0, width: flower.width, height: flower.height });
});

// Stable, asymmetrical placements feel scattered without jumping on refresh.
// Vary heights and sizes, leave room around the name, and keep tap targets
// attached to their curves in both the wide and tall compositions.
const gardenLayouts = {
    wide: {
        sakura: [-8.9, 5.7, .78], pansy: [-10.3, .2, .85], wisteria: [-.1, 5.4, .95],
        petunia: [4.45, 4.5, 1.10], sunflower: [9.8, 3.2, 1.05],
        plumeria: [-4.9, 3.15, .93], marigold: [-3.4, -6, .88], hibiscus: [-7.4, -3.55, 1.08],
        chrysanthemum: [1, -4.5, 1.13], daisy: [6, -5.5, .96], lilac: [10, -2, .8],
        forgetmenots: [-10.3, -6.35, .95]
    },
    tall: {
        pansy: [-3.9, 8, .75], wisteria: [.3, 7.7, .72], sunflower: [4.1, 5.7, .82],
        sakura: [-3.8, 4.5, .80], petunia: [.2, 3.3, .82],
        plumeria: [-4.6, -.9, .65], hibiscus: [4.5, -1.5, .72], daisy: [.7, -4.2, .91],
        lilac: [-.8, -8, .75], chrysanthemum: [4, -7.1, 1.05], marigold: [-3.7, -4.7, .9],
        forgetmenots: [-4.8, -8.2, .7]
    }
};
const originalAreas = new Map(flowerClickAreas.map(flower => [flower.id, { ...flower }]));
const originalCurves = new Map(initialExpressions.filter(expression => expression.parametricDomain)
    .map(expression => [expression.id, expression.latex]));
let currentLayout = '';
function arrangeFlowers(layoutName) {
    if (layoutName === currentLayout) return;
    currentLayout = layoutName;
    const updates = [];
    flowerClickAreas.forEach(flower => {
        const original = originalAreas.get(flower.id);
        const [cx, cy, scale] = gardenLayouts[layoutName][flower.id];
        Object.assign(flower, { cx, cy, width: original.width * scale, height: original.height * scale });
        const ids = new Set(flowerRevealGroups[flower.id].map(curve => curve.id));
        initialExpressions.filter(expression => ids.has(expression.id)).forEach(expression => {
            expression.latex = String.raw`\left(${cx},${cy}\right)+${scale}\left(${originalCurves.get(expression.id)}-\left(${original.cx},${original.cy}\right)\right)`;
            updates.push({ id: expression.id, latex: expression.latex });
        });
    });
    flowerCalculator.setExpressions(updates);
}

flowerCalculator.setExpressions(initialExpressions);
const site = window.CameronSite;
const section = document.getElementById('gardenStart');
const wrapper = section.querySelector('.desmos-wrapper');
const layer = document.createElement('div');
layer.className = 'flower-click-layer';
layer.hidden = true;
wrapper.appendChild(layer);

const hint = document.createElement('div');
hint.className = 'flower-note-hint';
hint.textContent = 'Tap a flower for its note and math';
hint.hidden = true;
wrapper.appendChild(hint);
let interactive = false;
let flowerDetail = null;
const notePanel = window.CameronNotes.createCard(wrapper, 'flowerNotePanel', () => {
    flowerDetail?.destroy();
    flowerDetail = null;
    hint.hidden = !interactive;
});

function openNote(flower, button) {
    flowerDetail?.destroy();
    notePanel.open(flower.id, button);
    const curves = new Map(flowerRevealGroups[flower.id].map(curve => [curve.id, curve]));
    const expressions = initialExpressions
        .filter(expression => curves.has(expression.id) || flowerParameters[flower.id]?.includes(expression.id))
        .map(expression => {
            const curve = curves.get(expression.id);
            return curve ? { ...expression, ...curve.opacities } : { ...expression };
        });
    flowerDetail = window.CameronFlowerDetails(notePanel.element,
        { ...flower, title: flowerNotes[flower.id].title }, expressions);
    notePanel.element.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    hint.hidden = true;
}
function closeNote(restoreFocus = false) {
    return notePanel.close(restoreFocus);
}
const zones = flowerClickAreas.map(flower => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'flower-click-zone';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'flowerNotePanel');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Read the note for ' + flowerNotes[flower.id].title);
    button.title = 'Read the note for ' + flowerNotes[flower.id].title;
    button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        openNote(flower, button);
    });
    layer.appendChild(button);
    return { flower, button };
});
function updateClickPositions() {
    zones.forEach(({ flower, button }) => {
        const a = flowerCalculator.mathToPixels({ x: flower.cx - flower.width / 2, y: flower.cy + flower.height / 2 });
        const b = flowerCalculator.mathToPixels({ x: flower.cx + flower.width / 2, y: flower.cy - flower.height / 2 });
        if (![a.x, a.y, b.x, b.y].every(Number.isFinite)) return;
        Object.assign(button.style, {
            left: a.x + 'px', top: a.y + 'px',
            width: Math.max(0, b.x - a.x) + 'px', height: Math.max(0, b.y - a.y) + 'px'
        });
    });
}
function fitGarden() {
    if (interactive) return;
    const { width, height } = flowerElement.getBoundingClientRect();
    if (!width || !height) return;
    const tall = width / height < .85;
    arrangeFlowers(tall ? 'tall' : 'wide');
    const unitsPerPixel = Math.max((tall ? 13 : 26) / width, (tall ? 20 : 16) / height);
    flowerCalculator.setMathBounds({
        left: -width * unitsPerPixel / 2, right: width * unitsPerPixel / 2,
        bottom: -height * unitsPerPixel / 2, top: height * unitsPerPixel / 2
    });
    updateClickPositions();
}
flowerCalculator.observe('graphpaperBounds', updateClickPositions);
let resizeFrame = 0;
function queueResize() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => { fitGarden(); updateClickPositions(); });
}
if ('ResizeObserver' in window) new ResizeObserver(queueResize).observe(flowerElement);
else window.addEventListener('resize', queueResize, { passive: true });
fitGarden();
site.flowerUI = {
    closeNote,
    setInteractive(enabled) {
        interactive = enabled;
        layer.hidden = !enabled;
        hint.hidden = !enabled;
        if (!enabled) { closeNote(); fitGarden(); }
    }
};

// Reveal all twelve groups in a short sequence; stop sending updates when done.
const revealOrder = ['sakura', 'pansy', 'wisteria', 'petunia', 'sunflower',
    'plumeria', 'marigold', 'hibiscus', 'forgetmenots', 'chrysanthemum', 'daisy', 'lilac'];
const lastProgress = new Map();
let revealFrame = 0;
let visible = false;
let ratio = 0;
function updateReveal(values) {
    const updates = [];
    revealOrder.forEach((name, i) => {
        const progress = Math.max(0, Math.min(1, values[i]));
        if (lastProgress.get(name) === progress) return;
        lastProgress.set(name, progress);
        flowerRevealGroups[name].forEach(curve => updates.push({
            id: curve.id,
            ...Object.fromEntries(Object.entries(curve.opacities).map(([key, opacity]) => [key, opacity * progress]))
        }));
    });
    if (updates.length) flowerCalculator.setExpressions(updates);
}
function stopReveal() {
    cancelAnimationFrame(revealFrame);
    revealFrame = 0;
    visible = false;
    updateReveal(revealOrder.map(() => 0));
    hint.style.opacity = '0';
}
function startReveal() {
    if (visible || document.hidden) return;
    visible = true;
    updateReveal(revealOrder.map(() => 0));
    hint.style.opacity = '0';
    if (site.reducedMotion.matches) {
        updateReveal(revealOrder.map(() => 1));
        hint.style.opacity = '1';
        return;
    }
    let started = null;
    let lastTick = -1;
    const duration = 760, stagger = 250;
    const total = duration + stagger * (revealOrder.length - 1);
    function frame(now) {
        if (!visible) return;
        if (started === null) started = now;
        const elapsed = now - started;
        const tick = Math.floor(elapsed / 70);
        if (tick !== lastTick || elapsed >= total) {
            lastTick = tick;
            updateReveal(revealOrder.map((_, i) => {
                const t = Math.max(0, Math.min(1, (elapsed - i * stagger) / duration));
                return t * t * (3 - 2 * t);
            }));
        }
        if (elapsed < total) revealFrame = requestAnimationFrame(frame);
        else { revealFrame = 0; hint.style.opacity = '1'; }
    }
    revealFrame = requestAnimationFrame(frame);
}
function updateVisibility() {
    if (document.hidden || ratio <= .08) stopReveal();
    else if (ratio >= .35) startReveal();
}
if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
        ratio = entries[0].intersectionRatio;
        updateVisibility();
    }, { threshold: [0, .08, .35, 1] }).observe(section);
} else {
    function check() {
        const rect = section.getBoundingClientRect();
        ratio = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0)) / Math.min(rect.height, innerHeight);
        updateVisibility();
    }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    check();
}
document.addEventListener('visibilitychange', updateVisibility);
site.reducedMotion.addEventListener('change', () => {
    if (visible) { stopReveal(); startReveal(); }
});
};
})();


