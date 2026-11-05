// ========================================
// DESMOS INTERACTION MODE
// ========================================

const desmosLock = document.getElementById("desmosLock");
const exploreButton = document.getElementById("exploreButton");
const doneButton = document.getElementById("doneButton");


// ========================================
// EXPLORE BUTTON
// ========================================

exploreButton.addEventListener("click", function () {

    // Unlock Desmos
    desmosLock.classList.add("unlocked");

    // Hide Explore completely
    exploreButton.classList.add("hidden");

    // Show Done
    doneButton.classList.add("visible");

});


// ========================================
// DONE BUTTON
// ========================================

doneButton.addEventListener("click", function () {

    // Lock Desmos
    desmosLock.classList.remove("unlocked");

    // Hide Done
    doneButton.classList.remove("visible");

    // Bring Explore back
    exploreButton.classList.remove("hidden");

});


// ========================================
// PEANUT-FREE WELCOME SCREEN
// ========================================
(function () {
    const gate = document.getElementById("peanutGate");
    const enterButton = document.getElementById("enterPeanutFree");

    if (!gate || !enterButton) return;

    // Keep the welcome button keyboard-accessible while the site is covered.
    enterButton.focus({ preventScroll: true });

    gate.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            event.preventDefault();
            enterButton.focus({ preventScroll: true });
        }
    });

    enterButton.addEventListener("click", function () {
        gate.classList.add("hidden");
        gate.setAttribute("aria-hidden", "true");
        document.body.classList.remove("peanut-lock");

        // Return keyboard focus to the first existing garden action.
        const gardenButton = document.getElementById("waterLilies");
        if (gardenButton) gardenButton.focus({ preventScroll: true });
    });
})();
