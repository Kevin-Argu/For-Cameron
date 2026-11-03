// ============================================================
// DESMOS FLOWER BACKGROUND + CLICKABLE MATH
// Replace your entire current flower JavaScript with this file.
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
    border: false
});

flowerCalculator.updateSettings({
    showGrid: true,
    xAxis: false,
    yAxis: false,
    xAxisNumbers: false,
    yAxisNumbers: false
});

flowerCalculator.setMathBounds({
    left: -10,
    right: 10,
    bottom: -6,
    top: 6
});

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

    flowerCalculator.setExpression({
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

    flowerCalculator.setExpression({
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

flowerCalculator.setExpression({
    id: "Xpet",
    latex: "X_{pet}=5"
});

flowerCalculator.setExpression({
    id: "Ypet",
    latex: "Y_{pet}=2.7"
});

flowerCalculator.setExpression({
    id: "Pet",
    latex: "P_{et}=1.15"
});

flowerCalculator.setExpression({
    id: "Ptu",
    latex: "P_{tu}=P_{et}\\cdot0.3"
});

flowerCalculator.setExpression({
    id: "Ppetunia",
    latex: "P_{petunia}=P_{et}\\cdot0.9"
});

flowerCalculator.setExpression({
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

flowerCalculator.setExpression({
    id: "Xhib",
    latex: "X_{hib}=0"
});

flowerCalculator.setExpression({
    id: "Yhib",
    latex: "Y_{hib}=-3"
});

flowerCalculator.setExpression({
    id: "Hlove",
    latex: "H_{love}=-1.25"
});

flowerCalculator.setExpression({
    id: "Hlover",
    latex: "H_{lover}=\\frac{H_{love}}{4}"
});

flowerCalculator.setExpression({
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

flowerCalculator.setExpression({
    id: "Xplum",
    latex: "X_{plum}=-6.2"
});

flowerCalculator.setExpression({
    id: "Yplum",
    latex: "Y_{plum}=-3.2"
});

flowerCalculator.setExpression({
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

wisteriaBlooms.forEach(([x, y, radius, rotation], index) => {
    addWisteriaBloom(index + 1, x, y, radius, rotation);
});


// ============================================================
// ============================================================
// CLICKABLE FLOWER MATH
// ============================================================

const flowerMathInfo = {

    sakura: {
        title: "Sakura",

        note:
            "The same trigonometric petal curve is drawn several times at smaller scales to create the nested pink blossom.",

        equation:
`x(t) = -2.4√[sin(cos(5t) - 5)] cos(t) - 5

y(t) =  2.4√[sin(cos(5t) - 5)] sin(t) + 3`,

        details:
`Center: (-5, 3)
Main scale: 2.4
Other scales: 1.55, 0.95, 0.48
Domain: 0 ≤ t ≤ 2π`
    },


    petunia: {
        title: "Petunia",

        note:
            "The cos(5t) term creates five-fold symmetry while the logarithm shapes the petals.",

        equation:
`x(t) = P√[log₂(cos(5t) + 3)] cos(t) + X

y(t) = P√[log₂(cos(5t) + 3)] sin(t) + Y`,

        details:
`P = 1.15
X = 5
Y = 2.7
The inner details use additional logarithmic and tangent curves.`
    },


    plumeria: {
        title: "Plumeria",

        note:
            "One compact parametric curve is repeated at smaller scales to create the pink, coral, orange, and yellow layers.",

        equation:
`x(t) = P√[tan(cos(2.5t))] cos(t) + X

y(t) = P√[tan(cos(2.5t))] sin(t) + Y`,

        details:
`P = -1.35
X = -6.2
Y = -3.2
Layer scales:
1.00, 0.82, 0.62, 0.43, 0.27, 0.12`
    },


    hibiscus: {
        title: "Hibiscus",

        note:
            "Four phase-shifted versions of the same curve overlap to make the purple petals. Logarithmic tangent curves make the dark radial details.",

        equation:
`x(t) = H√[cos(sin(5(t - 4)) - 1)] cos(t) + X

y(t) = H√[cos(sin(5(t - 4)) - 1)] sin(t) + Y`,

        details:
`H = -1.25
X = 0
Y = -3
Main phase shifts:
t - 4
t - 3
t - 2
t - 1`
    },


    wisteria: {
        title: "Wisteria",
        note: "Sixteen four-petaled blossoms form a soft, tapered hanging cluster. Each flower uses a parametric petal curve, with different sizes, positions, and rotations.",
        equation: "r(t) = R[0.54 + 0.46 cos(4(t − φ))]\n\nx(t) = r(t) cos(t) + X\n\ny(t) = r(t) sin(t) + Y",
        details: "Wisteria 1–16\nR controls blossom size\nφ rotates the four petals\nX and Y position each blossom\nAn inner 0.72R layer adds shading\nSmall ellipse curves form the pale flower centers."
    },

    lilac: {
        title: "Lilac",

        note:
            "The lilac is a cluster of six related blossoms. Each changes its size, position, and phase while keeping the same basic equation.",

        equation:
`x(t) = L√[log₂(1.05 - cos(4(t - φ)) + 1)] cos(t) + X

y(t) = L√[log₂(1.05 - cos(4(t - φ)) + 1)] sin(t) + Y`,

        details:
`L controls size
X and Y control position
φ controls rotation

Each bloom also uses:

0.80L
0.60L
0.40L
0.20L`
    }

};


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


// ============================================================
// INTERACTION STYLES
// ============================================================

flowerElement.style.position = "relative";

const flowerMathStyle =
    document.createElement("style");

flowerMathStyle.textContent = `

    .flower-click-layer {
        position: absolute;
        inset: 0;
        z-index: 20;
        pointer-events: none;
    }


    .flower-click-zone {
        position: absolute;

        border: 2px solid transparent;
        border-radius: 50%;

        background: transparent;

        cursor: pointer;
        pointer-events: auto;

        transition:
            background .18s ease,
            border-color .18s ease,
            box-shadow .18s ease,
            transform .18s ease;
    }


    .flower-click-zone:hover,
    .flower-click-zone:focus-visible {

        background:
            rgba(255,255,255,.08);

        border-color:
            rgba(166,88,174,.35);

        box-shadow:
            0 0 0 5px rgba(166,88,174,.08),
            0 0 28px rgba(166,88,174,.22);

        transform:
            scale(1.025);

        outline:
            none;
    }


    .flower-math-hint {
        position: absolute;

        top: 16px;
        left: 50%;

        transform:
            translateX(-50%);

        z-index: 25;

        padding:
            8px 14px;

        border:
            1px solid rgba(85,55,80,.15);

        border-radius:
            999px;

        background:
            rgba(255,255,255,.90);

        color:
            #65445f;

        font:
            600 13px/1.2
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

        box-shadow:
            0 5px 18px
            rgba(60,35,55,.08);

        pointer-events:
            none;

        white-space:
            nowrap;
    }


    .flower-math-card {
        position: absolute;

        top: 22px;
        right: 22px;

        z-index: 40;

        width:
            min(
                410px,
                calc(100% - 44px)
            );

        max-height:
            calc(100% - 44px);

        overflow-y:
            auto;

        box-sizing:
            border-box;

        padding:
            24px;

        border:
            1px solid
            rgba(90,60,85,.16);

        border-radius:
            20px;

        background:
            rgba(255,252,255,.97);

        box-shadow:
            0 18px 55px
            rgba(59,33,56,.18);

        color:
            #30222e;

        font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
    }


    .flower-math-card[hidden] {
        display:
            none;
    }


    .flower-math-close {
        position:
            absolute;

        top:
            12px;

        right:
            12px;

        width:
            38px;

        height:
            38px;

        border:
            0;

        border-radius:
            50%;

        background:
            rgba(99,68,95,.08);

        color:
            #5b4056;

        cursor:
            pointer;

        font-size:
            24px;
    }


    .flower-math-card h2 {
        margin:
            0 42px 5px 0;

        font:
            500 32px/1.1
            Georgia,
            "Times New Roman",
            serif;
    }


    .math-kicker {
        margin-bottom:
            7px;

        color:
            #9b5a92;

        font-size:
            11px;

        font-weight:
            800;

        letter-spacing:
            .12em;

        text-transform:
            uppercase;
    }


    .math-note {
        margin:
            12px 0 17px;

        color:
            #594653;

        font-size:
            14px;

        line-height:
            1.55;
    }


    .math-equation {
        margin:
            0;

        padding:
            15px;

        border-radius:
            13px;

        background:
            #f6edf6;

        color:
            #382532;

        white-space:
            pre-wrap;

        overflow-wrap:
            anywhere;

        font:
            16px/1.65
            Georgia,
            "Times New Roman",
            serif;
    }


    .flower-math-card details {
        margin-top:
            15px;

        padding-top:
            14px;

        border-top:
            1px solid
            rgba(90,60,85,.12);
    }


    .flower-math-card summary {
        cursor:
            pointer;

        color:
            #8f4e85;

        font-size:
            14px;

        font-weight:
            700;
    }


    .flower-math-details {
        margin-top:
            11px;

        padding:
            13px;

        border-radius:
            12px;

        background:
            #faf6fa;

        white-space:
            pre-wrap;

        font:
            14px/1.6
            Georgia,
            "Times New Roman",
            serif;
    }


    @media (max-width: 700px) {

        .flower-math-card {
            top:
                12px;

            right:
                12px;

            width:
                calc(100% - 24px);

            max-height:
                calc(100% - 24px);

            padding:
                20px;
        }


        .flower-math-card h2 {
            font-size:
                27px;
        }


        .flower-math-hint {
            top:
                9px;

            font-size:
                12px;
        }

    }

`;

document.head.appendChild(
    flowerMathStyle
);


// ============================================================
// CLICK LAYER
// ============================================================

const flowerClickLayer =
    document.createElement("div");

flowerClickLayer.className =
    "flower-click-layer";

flowerElement.appendChild(
    flowerClickLayer
);


// ============================================================
// CONVERT DESMOS COORDINATES TO SCREEN POSITION
// ============================================================

function graphBoxToPercent(
    cx,
    cy,
    width,
    height
) {

    const leftBound = -10;
    const rightBound = 10;

    const bottomBound = -6;
    const topBound = 6;

    return {

        left:
            (
                (
                    cx -
                    width / 2 -
                    leftBound
                )
                /
                (
                    rightBound -
                    leftBound
                )
            )
            * 100,

        top:
            (
                (
                    topBound -
                    (
                        cy +
                        height / 2
                    )
                )
                /
                (
                    topBound -
                    bottomBound
                )
            )
            * 100,

        width:
            (
                width
                /
                (
                    rightBound -
                    leftBound
                )
            )
            * 100,

        height:
            (
                height
                /
                (
                    topBound -
                    bottomBound
                )
            )
            * 100

    };

}


// ============================================================
// MATH CARD
// ============================================================

const flowerMathCard =
    document.createElement(
        "section"
    );

flowerMathCard.className =
    "flower-math-card";

flowerMathCard.hidden =
    true;

flowerMathCard.innerHTML = `

    <button
        type="button"
        class="flower-math-close"
        aria-label="Close math panel"
    >
        ×
    </button>


    <div class="math-kicker">
        Math behind the flower
    </div>


    <h2></h2>


    <p class="math-note"></p>


    <pre class="math-equation"></pre>


    <details>

        <summary>
            View parameters and layers
        </summary>

        <div class="flower-math-details"></div>

    </details>

`;

flowerElement.appendChild(
    flowerMathCard
);


// ============================================================
// CLICK A FLOWER MESSAGE
// ============================================================

const flowerMathHint =
    document.createElement(
        "div"
    );

flowerMathHint.className =
    "flower-math-hint";

flowerMathHint.textContent =
    "✦ Click a flower to explore its math";

flowerElement.appendChild(
    flowerMathHint
);


// ============================================================
// OPEN FLOWER MATH
// ============================================================

function openFlowerMath(id) {

    const info =
        flowerMathInfo[id];

    if (!info) {
        return;
    }

    flowerMathCard
        .querySelector("h2")
        .textContent =
        info.title;

    flowerMathCard
        .querySelector(".math-note")
        .textContent =
        info.note;

    flowerMathCard
        .querySelector(".math-equation")
        .textContent =
        info.equation;

    flowerMathCard
        .querySelector(".flower-math-details")
        .textContent =
        info.details;

    flowerMathCard
        .querySelector("details")
        .open =
        false;

    flowerMathCard.hidden =
        false;

    flowerMathHint.style.display =
        "none";

}


// ============================================================
// CLOSE FLOWER MATH
// ============================================================

function closeFlowerMath() {

    flowerMathCard.hidden =
        true;

}


// ============================================================
// CREATE THE CLICKABLE FLOWER AREAS
// ============================================================

const flowerZoneButtons = [];

flowerClickAreas.forEach(
    (flower) => {

        const box =
            graphBoxToPercent(
                flower.cx,
                flower.cy,
                flower.width,
                flower.height
            );

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "flower-click-zone";

        button.setAttribute(
            "aria-label",
            `Explore the math behind ${flowerMathInfo[flower.id].title}`
        );

        button.title =
            `Explore ${flowerMathInfo[flower.id].title} math`;

        button.style.left =
            `${box.left}%`;

        button.style.top =
            `${box.top}%`;

        button.style.width =
            `${box.width}%`;

        button.style.height =
            `${box.height}%`;

        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();

                openFlowerMath(
                    flower.id
                );

            }
        );

        flowerClickLayer.appendChild(
            button
        );
        flowerZoneButtons.push({ flower, button });

    }
);

// Keep each clickable region on its actual Desmos flower, even
// when the graph is moved or zoomed.
function updateFlowerClickPositions() {
    if (typeof flowerCalculator.mathToPixels !== "function") return;
    flowerZoneButtons.forEach(({ flower, button }) => {
        const a = flowerCalculator.mathToPixels({
            x: flower.cx - flower.width / 2,
            y: flower.cy + flower.height / 2
        });
        const b = flowerCalculator.mathToPixels({
            x: flower.cx + flower.width / 2,
            y: flower.cy - flower.height / 2
        });
        if (![a.x, a.y, b.x, b.y].every(Number.isFinite)) return;
        button.style.left = a.x + "px";
        button.style.top = a.y + "px";
        button.style.width = Math.max(0, b.x - a.x) + "px";
        button.style.height = Math.max(0, b.y - a.y) + "px";
    });
}
if (typeof flowerCalculator.observe === "function") {
    flowerCalculator.observe("graphpaperBounds", updateFlowerClickPositions);
}
window.addEventListener("resize", updateFlowerClickPositions);
updateFlowerClickPositions();


// ============================================================
// CLOSE BUTTON
// ============================================================

flowerMathCard
    .querySelector(
        ".flower-math-close"
    )
    .addEventListener(
        "click",
        closeFlowerMath
    );


// ============================================================
// ESCAPE KEY ALSO CLOSES THE PANEL
// ============================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            !flowerMathCard.hidden
        ) {

            closeFlowerMath();

        }

    }
);

// ============================================================
// ONE-BY-ONE FLOWER REVEAL — replay on each re-entry.
// Sakura, Petunia, Plumeria, Hibiscus, Lilac cluster, Wisteria cluster.
// Both flower clusters fade in together as their own groups.
// ============================================================

const flowerRevealOrder = ["sakura", "petunia", "plumeria", "hibiscus", "lilac", "wisteria"];
const flowerRevealReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const flowerFadeDuration = 860;
const flowerStagger = 540;

function updateFlowerReveal(name, progress) {
    const p = Math.max(0, Math.min(1, progress));
    const updates = flowerRevealGroups[name].map(curve => ({
        id: curve.id,
        [curve.kind === "fill" ? "fillOpacity" : "lineOpacity"]:
            Math.min(1, curve.opacity * p)
    }));
    if (updates.length) flowerCalculator.setExpressions(updates);
}

function resetFlowerReveal() {
    flowerRevealOrder.forEach(name => updateFlowerReveal(name, 0));
    flowerMathHint.style.opacity = "0";
}

function completeFlowerReveal() {
    flowerRevealOrder.forEach(name => updateFlowerReveal(name, 1));
    flowerMathHint.style.opacity = "1";
}

let flowerRevealVisible = false;
let flowerRevealGeneration = 0;

function revealFlowersAgain() {
    if (flowerRevealVisible) return;
    flowerRevealVisible = true;

    // Invalidate any animation belonging to an earlier visit.
    const generation = ++flowerRevealGeneration;
    resetFlowerReveal();

    if (flowerRevealReducedMotion.matches) {
        completeFlowerReveal();
        return;
    }

    let startTime = null;
    let lastTick = -1;
    const total = (flowerRevealOrder.length - 1) * flowerStagger + flowerFadeDuration;

    function step(now) {
        if (!flowerRevealVisible || generation !== flowerRevealGeneration) return;
        if (startTime === null) startTime = now;

        const elapsed = now - startTime;
        const tick = Math.floor(elapsed / 70); // limit Desmos redraws

        if (tick !== lastTick) {
            lastTick = tick;
            flowerRevealOrder.forEach((name, i) => {
                const progress = (elapsed - i * flowerStagger) / flowerFadeDuration;
                if (progress <= 0) return;
                const t = Math.max(0, Math.min(1, progress));
                updateFlowerReveal(name, t * t * (3 - 2 * t));
            });
        }

        if (elapsed < total) {
            window.requestAnimationFrame(step);
        } else {
            completeFlowerReveal();
        }
    }

    window.requestAnimationFrame(step);
}

function leaveFlowerSection() {
    if (!flowerRevealVisible) return;
    flowerRevealVisible = false;
    flowerRevealGeneration++; // cancel outstanding animation frames
    resetFlowerReveal();      // prepare for the next scroll into view
}

flowerMathHint.style.opacity = "0";
flowerMathHint.style.transition = "opacity 400ms ease";

const cameronSection = document.getElementById("gardenStart") || flowerElement;

// A small exit/entry gap prevents accidental repeated restarts as the
// section crosses one threshold during slow scrolling.
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (entry.intersectionRatio >= 0.35) {
            revealFlowersAgain();
        } else if (entry.intersectionRatio <= 0.08) {
            leaveFlowerSection();
        }
    }, { threshold: [0, 0.08, 0.35, 1] });

    observer.observe(cameronSection);
} else {
    const onScrollCheck = () => {
        const rect = cameronSection.getBoundingClientRect();
        const visible = Math.max(0,
            Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        const fraction = visible / Math.max(1, Math.min(rect.height, window.innerHeight));

        if (fraction >= 0.35) revealFlowersAgain();
        else if (fraction <= 0.08) leaveFlowerSection();
    };
    window.addEventListener("scroll", onScrollCheck, { passive: true });
    window.addEventListener("resize", onScrollCheck);
    onScrollCheck();
}

// Accessibility: reveal immediately when reduced-motion is enabled.
if (flowerRevealReducedMotion.addEventListener) {
    flowerRevealReducedMotion.addEventListener("change", event => {
        if (event.matches && flowerRevealVisible) {
            flowerRevealGeneration++;
            completeFlowerReveal();
        }
    });
}
