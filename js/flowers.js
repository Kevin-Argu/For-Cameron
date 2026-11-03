// ========================================
// DESMOS FLOWER BACKGROUND
// ========================================

const flowerElement = document.getElementById("flowerCalculator");

const flowerCalculator = Desmos.GraphingCalculator(
    flowerElement,
    {
        expressions: false,
        keypad: false,
        settingsMenu: false,
        zoomButtons: false,
        expressionsTopbar: false,
        pointsOfInterest: false,
        trace: false,
        border: false
    }
);


// ========================================
// GRAPH APPEARANCE
// ========================================

flowerCalculator.updateSettings({
    showGrid: true,

    // Remove black center axes
    xAxis: false,
    yAxis: false,

    xAxisNumbers: false,
    yAxisNumbers: false
});


// ========================================
// GRAPH WINDOW
// ========================================

flowerCalculator.setMathBounds({
    left: -10,
    right: 10,
    bottom: -6,
    top: 6
});


// ========================================
// SAKURA POSITION
// ========================================

flowerCalculator.setExpression({
    id: "X",
    latex: "X=-5"
});

flowerCalculator.setExpression({
    id: "Y",
    latex: "Y=3"
});


// ========================================
// SAKURA - OUTER PETALS
// ========================================

flowerCalculator.setExpression({
    id: "outer",

    latex: String.raw`
    (
        -2.4\sqrt{\sin(\cos(5t)-5)}\cos(t)-5,
        2.4\sqrt{\sin(\cos(5t)-5)}\sin(t)+3
    )
    `,

    color: "#f8cfe3",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "2\\pi"
    }
});


// ========================================
// SAKURA - SECOND LAYER
// ========================================

flowerCalculator.setExpression({
    id: "middle1",

    latex: String.raw`
    (
        -1.55\sqrt{\sin(\cos(5t)-5)}\cos(t)-5,
        1.55\sqrt{\sin(\cos(5t)-5)}\sin(t)+3
    )
    `,

    color: "#f5a6cf",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "2\\pi"
    }
});


// ========================================
// SAKURA - THIRD LAYER
// ========================================

flowerCalculator.setExpression({
    id: "middle2",

    latex: String.raw`
    (
        -0.95\sqrt{\sin(\cos(5t)-5)}\cos(t)-5,
        0.95\sqrt{\sin(\cos(5t)-5)}\sin(t)+3
    )
    `,

    color: "#ef7fba",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "2\\pi"
    }
});


// ========================================
// SAKURA - DARK CENTER
// ========================================

flowerCalculator.setExpression({
    id: "center",

    latex: String.raw`
    (
        -0.48\sqrt{\sin(\cos(5t)-5)}\cos(t)-5,
        0.48\sqrt{\sin(\cos(5t)-5)}\sin(t)+3
    )
    `,

    color: "#df3f91",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "2\\pi"
    }
});


// ========================================
// PETUNIA POSITION + SCALE
// ========================================
//
// These are translated from the original
// Petunia's huge Desmos coordinate system
// into our website's -10 to 10 graph.
//
// Change Xpet to move left/right.
// Change Ypet to move up/down.
// Change Pet to change overall size.
//

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


// ========================================
// PETUNIA DERIVED VALUES
// ========================================

flowerCalculator.setExpression({
    id: "Ptu",
    latex: "P_{tu}=P_{et}\\cdot0.3"
});

flowerCalculator.setExpression({
    id: "Ppetunia",
    latex: "P_{petunia}=P_{et}\\cdot0.9"
});

flowerCalculator.setExpression({
    id: "Pnia",
    latex: "P_{nia}=[0.8,0.6,0.4,0.2]"
});

flowerCalculator.setExpression({
    id: "Ps",
    latex: "P_s=P_{et}\\cdot0.1"
});


// ========================================
// PETUNIA BASE SHAPES
// ========================================


// ----------------------------------------
// LARGE OUTER PETAL SHAPE
// ----------------------------------------

flowerCalculator.setExpression({
    id: "petuniaOuter",

    latex: String.raw`
    (
        P_{et}\sqrt{\log_{2}(\cos(5t)+3)}\cos(t)+X_{pet},
        P_{et}\sqrt{\log_{2}(\cos(5t)+3)}\sin(t)+Y_{pet}
    )
    `,

    color: "#f7b6dc",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});


// ----------------------------------------
// SECOND PETAL LAYER
// ----------------------------------------

flowerCalculator.setExpression({
    id: "petuniaSecond",

    latex: String.raw`
    (
        P_{petunia}\sqrt{\log_{2}(\cos(5t)+3)}\cos(t)+X_{pet},
        P_{petunia}\sqrt{\log_{2}(\cos(5t)+3)}\sin(t)+Y_{pet}
    )
    `,

    color: "#ef8bc7",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});


// ----------------------------------------
// THIRD PETAL LAYER
// ----------------------------------------

flowerCalculator.setExpression({
    id: "petuniaThird",

    latex: String.raw`
    (
        P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\cos(t)+X_{pet},
        P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\sin(t)+Y_{pet}
    )
    `,

    color: "#e864ad",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});


// ========================================
// PETUNIA INNER PETALS
// ========================================


// ----------------------------------------
// INNER PETAL 1
// ----------------------------------------

flowerCalculator.setExpression({
    id: "petuniaInner1",

    latex: String.raw`
    (
        P_{tu}\sqrt{\log_{1.7}(\tan(2.5(t-1.9))-2)}\cos(t)+X_{pet},
        P_{tu}\sqrt{\log_{1.7}(\tan(2.5(t-1.9))-2)}\sin(t)+Y_{pet}
    )
    `,

    color: "#8d246d",

    lineWidth: 4,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});


// ----------------------------------------
// INNER PETAL 2
// ----------------------------------------

flowerCalculator.setExpression({
    id: "petuniaInner2",

    latex: String.raw`
    (
        P_{tu}\sqrt{\log_{1.7}(-\tan(2.5(t-1.9))-2)}\cos(t)+X_{pet},
        P_{tu}\sqrt{\log_{1.7}(-\tan(2.5(t-1.9))-2)}\sin(t)+Y_{pet}
    )
    `,

    color: "#8d246d",

    lineWidth: 4,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});


// ----------------------------------------
// INNER PETAL 3
// ----------------------------------------

flowerCalculator.setExpression({
    id: "petuniaInner3",

    latex: String.raw`
    (
        P_{tu}\sqrt{\log_{3}(\tan(10(t-1.9))+1)}\cos(t)+X_{pet},
        P_{tu}\sqrt{\log_{3}(\tan(10(t-1.9))+1)}\sin(t)+Y_{pet}
    )
    `,

    color: "#7b1f62",

    lineWidth: 4,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});


// ----------------------------------------
// INNER PETAL 4
// ----------------------------------------

flowerCalculator.setExpression({
    id: "petuniaInner4",

    latex: String.raw`
    (
        P_{tu}\sqrt{\log_{3}(-\tan(10(t-1.9))+1)}\cos(t)+X_{pet},
        P_{tu}\sqrt{\log_{3}(-\tan(10(t-1.9))+1)}\sin(t)+Y_{pet}
    )
    `,

    color: "#7b1f62",

    lineWidth: 4,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});


// ========================================
// PETUNIA CENTER
// ========================================

flowerCalculator.setExpression({
    id: "petuniaCenter",

    latex: String.raw`
    (
        (P_s\sin(t))\cos(t)+X_{pet},
        (P_s\sin(t))\sin(t)+Y_{pet}
    )
    `,

    color: "#701653",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});


// ========================================
// PETUNIA SMALL CENTER LAYERS
// ========================================

flowerCalculator.setExpression({
    id: "petuniaCenterLayer1",

    latex: String.raw`
    (
        0.8P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\cos(t)+X_{pet},
        0.8P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\sin(t)+Y_{pet}
    )
    `,

    color: "#d84c9e",

    fill: true,
    fillOpacity: 0.55,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});

flowerCalculator.setExpression({
    id: "petuniaCenterLayer2",

    latex: String.raw`
    (
        0.6P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\cos(t)+X_{pet},
        0.6P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\sin(t)+Y_{pet}
    )
    `,

    color: "#bf367f",

    fill: true,
    fillOpacity: 0.7,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});

flowerCalculator.setExpression({
    id: "petuniaCenterLayer3",

    latex: String.raw`
    (
        0.4P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\cos(t)+X_{pet},
        0.4P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\sin(t)+Y_{pet}
    )
    `,

    color: "#9e286b",

    fill: true,
    fillOpacity: 0.85,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});

flowerCalculator.setExpression({
    id: "petuniaCenterLayer4",

    latex: String.raw`
    (
        0.2P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\cos(t)+X_{pet},
        0.2P_{et}\sqrt{\log_{2}(\cos(5t)+2)}\sin(t)+Y_{pet}
    )
    `,

    color: "#77194f",

    fill: true,
    fillOpacity: 1,

    lineOpacity: 0,

    parametricDomain: {
        min: "0",
        max: "12\\pi"
    }
});