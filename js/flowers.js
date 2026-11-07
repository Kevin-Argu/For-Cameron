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
    graphDescription: "Sakura, petunia, plumeria, hibiscus, lilac and wisteria surround Cameron."
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

// Store the original opacity of each individual Desmos curve.
// The actual equations remain unchanged. We animate only their visibility.
const flowerRevealGroups = {
    sakura: [],
    petunia: [],
    plumeria: [],
    hibiscus: [],
    lilac: [],
    wisteria: []
};

function registerFlowerReveal(id, kind, opacity) {
    const group = id.startsWith("lilac_")
        ? "lilac"
        : Object.keys(flowerRevealGroups).find(name => id.startsWith(name));

    if (group) {
        flowerRevealGroups[group].push({ id, kind, opacity });
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
    4
);

addLineCurve(
    "petuniaInner2",
    String.raw`(P_{tu}\sqrt{\log_{1.7}(-\tan(2.5(t-1.9))-2)}\cos(t)+X_{pet},P_{tu}\sqrt{\log_{1.7}(-\tan(2.5(t-1.9))-2)}\sin(t)+Y_{pet})`,
    "#8d246d",
    4
);

addLineCurve(
    "petuniaInner3",
    String.raw`(P_{tu}\sqrt{\log_{3}(\tan(10(t-1.9))+1)}\cos(t)+X_{pet},P_{tu}\sqrt{\log_{3}(\tan(10(t-1.9))+1)}\sin(t)+Y_{pet})`,
    "#7b1f62",
    4
);

addLineCurve(
    "petuniaInner4",
    String.raw`(P_{tu}\sqrt{\log_{3}(-\tan(10(t-1.9))+1)}\cos(t)+X_{pet},P_{tu}\sqrt{\log_{3}(-\tan(10(t-1.9))+1)}\sin(t)+Y_{pet})`,
    "#7b1f62",
    4
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
// WISTERIA 1–16 — a tapered hanging cluster above Cameron.
// Each bloom is a four-petal parametric flower, not concentric circles.
// Wisteria stays a single reveal group, like the Lilac.
// ============================================================

// Each entry is [x, y, radius, rotation in radians] in Desmos coordinates.
// The staggered positions taper toward the hanging tip.
const wisteriaBlooms = [
    [-0.78, 5.14, 0.48, 0.10], [ 0.04, 5.31, 0.52, 0.32],
    [ 0.87, 5.12, 0.48, 0.02], [-1.15, 4.66, 0.48, 0.27],
    [-0.33, 4.71, 0.52, 0.08], [ 0.49, 4.65, 0.50, 0.24],
    [ 1.15, 4.55, 0.44, 0.19], [-0.86, 4.13, 0.46, 0.22],
    [-0.03, 4.16, 0.48, 0.04], [ 0.78, 4.02, 0.45, 0.35],
    [-0.54, 3.59, 0.42, 0.13], [ 0.27, 3.56, 0.43, 0.31],
    [ 0.82, 3.41, 0.36, 0.16], [-0.24, 3.05, 0.37, 0.35],
    [ 0.37, 2.94, 0.35, 0.03], [ 0.07, 2.55, 0.30, 0.25]
];

function wisteriaOffset(value) {
    // Desmos accepts +0.5 and -0.5, but not '+-0.5'.
    return value < 0 ? value.toFixed(3) : "+" + value.toFixed(3);
}

function wisteriaEllipse(x, y, rx, ry) {
    return "(" + rx.toFixed(3) + "\\cos(t)" + wisteriaOffset(x) +
        "," + ry.toFixed(3) + "\\sin(t)" + wisteriaOffset(y) + ")";
}

// A gently curved vine, plotted behind the flowers.
addLineCurve("wisteria_vine",
    "(0.08+0.13\\sin(1.3t),5.80-t)",
    "#76936b", 2.2, "3.35", 0.70);

function addWisteriaBloom(number, x, y, r, phase) {
    const id = "wisteria_" + number;

    // Join every blossom back to the vine with a short, thin stalk.
    const vineX = 0.08 + 0.13 * Math.sin(1.3 * (5.80 - y));
    const stalk = "(" + (x - vineX).toFixed(3) + "t" +
        wisteriaOffset(vineX) + "," +
        (y - (y + 0.24)).toFixed(3) + "t" +
        wisteriaOffset(y + 0.24) + ")";
    addLineCurve(id + "_stalk", stalk, "#82a078", 1.25, "1", 0.8);

    // A radial quatrefoil with deep indentations between the petals.
    // This produces a recognizable blossom, not a circular disk.
    function petal(factor, rotation) {
        const radial = (r * factor).toFixed(3) +
            "(0.54+0.46\\cos(4(t-" + rotation.toFixed(3) + ")))";
        return "(" + radial + "\\cos(t)" + wisteriaOffset(x) +
            "," + radial + "\\sin(t)" + wisteriaOffset(y) + ")";
    }

    const outerColor = number % 4 === 0 ? "#9964be" : "#ae7bd1";
    const innerColor = number % 3 === 0 ? "#e1bff1" : "#cfa7e8";

    addFilledCurve(id + "_petals", petal(1, phase), outerColor, "2\\pi");
    addFilledCurve(id + "_inner", petal(0.72, phase), innerColor, "2\\pi", 0.96);

    // Soft centers: tiny circles, not rings around the flowers.
    addFilledCurve(id + "_throat", wisteriaEllipse(x, y, r * 0.14, r * 0.14),
        "#fff7df", "2\\pi");
    addFilledCurve(id + "_pollen", wisteriaEllipse(x, y, r * 0.066, r * 0.066),
        "#ecd57e", "2\\pi");
}

// Make each of the sixteen blossoms a little fuller, keeping the
// same positions, equations, vine, and synchronized fade animation.
const wisteriaSizeBoost = 1.17;
wisteriaBlooms.forEach(([x, y, radius, rotation], index) => {
    addWisteriaBloom(index + 1, x, y, radius * wisteriaSizeBoost, rotation);
});


// ============================================================
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
    },

    {
        id: "wisteria",
        cx: 0,
        cy: 4.0,
        width: 3.7,
        height: 4.0
    }

];



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
    const parameters = {
        petunia: ['Xpet', 'Ypet', 'Pet', 'Ptu', 'Ppetunia', 'Ps'],
        hibiscus: ['Xhib', 'Yhib', 'Hlove', 'Hlover', 'Hlovers'],
        plumeria: ['Xplum', 'Yplum', 'Pplum']
    };
    const curves = new Map(flowerRevealGroups[flower.id].map(curve => [curve.id, curve]));
    const expressions = initialExpressions
        .filter(expression => curves.has(expression.id) || parameters[flower.id]?.includes(expression.id))
        .map(expression => {
            const curve = curves.get(expression.id);
            return curve ? { ...expression, [curve.kind === 'fill' ? 'fillOpacity' : 'lineOpacity']: curve.opacity } : { ...expression };
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
    // Contain the original composition with equal horizontal and vertical units.
    const unitsPerPixel = Math.max(20 / width, 12 / height);
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

// Preserve the six groups and replay order; only changed opacities are sent to Desmos.
const revealOrder = ['sakura', 'petunia', 'plumeria', 'hibiscus', 'lilac', 'wisteria'];
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
            [curve.kind === 'fill' ? 'fillOpacity' : 'lineOpacity']: curve.opacity * progress
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
    const duration = 860, stagger = 540;
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

