// Controls the welcome screen independently of the garden / Desmos scripts.
(function () {
    "use strict";

    function initializePeanutGate() {
        const gate = document.getElementById("peanutGate");
        const enterButton = document.getElementById("enterPeanutFree");
        const site = document.querySelector("main");
        if (!gate || !enterButton) return;

        let closing = false;
        let finished = false;

        // Lock the entire document, not just a visible panel. This also
        // prevents the mouse wheel, touch swipes and keyboard from bypassing it.
        document.documentElement.classList.add("peanut-locked");
        document.body.classList.add("peanut-lock");
        window.scrollTo(0, 0);

        if (site) {
            site.inert = true;
            site.setAttribute("aria-hidden", "true");
        }

        function stopScroll(event) {
            if (!finished) event.preventDefault();
        }

        function handleKeys(event) {
            if (finished) return;

            // The welcome button is the only keyboard target until entry.
            if (event.key === "Tab") {
                event.preventDefault();
                enterButton.focus({ preventScroll: true });
                return;
            }
            if ([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp",
                 "Home", "End", "ArrowLeft", "ArrowRight"].includes(event.key)) {
                // Space/arrow keys must not scroll the page.
                // Space/Enter on the focused button remain usable.
                if (event.key === " " && document.activeElement === enterButton) return;
                event.preventDefault();
            }
        }

        const scrollOptions = { passive: false, capture: true };
        document.addEventListener("wheel", stopScroll, scrollOptions);
        document.addEventListener("touchmove", stopScroll, scrollOptions);
        document.addEventListener("keydown", handleKeys, true);

        enterButton.focus({ preventScroll: true });

        function completeEntry() {
            if (finished) return;
            finished = true;
            gate.classList.add("is-dismissed");
            gate.setAttribute("aria-hidden", "true");

            if (site) {
                site.inert = false;
                site.removeAttribute("aria-hidden");
            }

            document.documentElement.classList.remove("peanut-locked");
            document.body.classList.remove("peanut-lock");
            document.removeEventListener("wheel", stopScroll, scrollOptions);
            document.removeEventListener("touchmove", stopScroll, scrollOptions);
            document.removeEventListener("keydown", handleKeys, true);
            window.scrollTo(0, 0);

            const firstGardenButton = document.getElementById("waterLilies");
            if (firstGardenButton) firstGardenButton.focus({ preventScroll: true });
        }

        enterButton.addEventListener("click", function () {
            if (closing) return;
            closing = true;
            gate.classList.add("is-closing");

            gate.addEventListener("transitionend", function (event) {
                if (event.target === gate && event.propertyName === "opacity") {
                    completeEntry();
                }
            }, { once: true });

            // Also works if reduced motion is enabled or transitions are unavailable.
            window.setTimeout(completeEntry, 550);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializePeanutGate, { once: true });
    } else {
        initializePeanutGate();
    }
})();
