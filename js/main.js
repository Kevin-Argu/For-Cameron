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
