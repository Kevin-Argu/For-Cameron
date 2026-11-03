// ----------------------------------------
// DESMOS ANIMATED HEART
// ----------------------------------------

const heartElement = document.getElementById("heartCalculator");


// Create Desmos calculator
const calculator = Desmos.GraphingCalculator(heartElement, {

    // Show the expression panel
    expressions: true,

    // Hide unnecessary controls
    keypad: false,
    settingsMenu: false,
    expressionsTopbar: false,

    // Keep zoom controls
    zoomButtons: true,

    pointsOfInterest: false,
    trace: false,
    border: false
});


// ----------------------------------------
// HEART EQUATION
// ----------------------------------------
//
// f(x) = x^(2/3)
//        + sqrt(5 - x^2)
//        * sin(a*pi*x)
//
// Changing "a" makes the heart move.
// ----------------------------------------

calculator.setExpression({

    id: "heart",

    latex: String.raw`f(x)=x^{\frac{2}{3}}+\sqrt{5-x^2}\sin(a\pi x)`,

    color: "#9b4d5b",

    lineWidth: 4
});


// ----------------------------------------
// ANIMATED SLIDER
// ----------------------------------------

calculator.setExpression({

    id: "slider",

    // Starting value
    latex: "a=-10",

    // Slider range
    sliderBounds: {
        min: "-10",
        max: "10",
        step: "0.01"
    },

    // Start automatically
    playing: true,

    // Move forward, then backward
    loopMode: "LOOP_FORWARD_REVERSE",

    // Milliseconds for one trip
    sliderPeriod: 12000
});


// ----------------------------------------
// GRAPH WINDOW
// ----------------------------------------

calculator.setMathBounds({

    left: -3.5,
    right: 3.5,

    bottom: -2,
    top: 5
});