# For Cameron

A little something: peanut-free welcome with George → interactive ASCII lilies → Cameron and mathematical flowers → roaming ASCII whale → birdwatching and lily pads → piano and harmonica → animated Desmos heart → chocolate milk and Dillbillies' goodbye.

## Run locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The source is a static website with no build step. Desmos requires an internet connection. Publishing and domain configuration are separate from editing these files.

## Controls

- George rests beneath “Okay, let me in” on the peanut-free welcome. Pressing the button sends him through ten little hops: five forward, then he turns around and hops back five times before the welcome fades into the lilies. His ears bounce with each hop; the round trip takes 4.8 seconds. Repeated clicks cannot restart the entrance. Short screens scroll the welcome to keep him visible; reduced motion enters immediately. The warm gray-brown rabbit is drawn entirely from ASCII characters, with a rounded body, dark muzzle, and long drooping ears. His body and ear assets can be rebuilt with `python3 scripts/draw-george-welcome.py`; the reference photos are not included in the website.
- Water the lilies or drag upward to grow them. The smaller Colors and Start again text controls cycle the original palettes and reset growth/rain.
- Scroll to Cameron's flowers or use the small Enter the garden shortcut. Explore enables graph interaction and personal flower notes. Done closes the card and restores page scrolling. Escape closes an open note first, then exits Explore.
- The whale stays inside its ocean section by default and pauses when that section is offscreen. Its blowhole sends up a tall character-art fountain about every 4.2 seconds, with each burst lasting 2.2 seconds. Spray pauses during tricks and is disabled for reduced motion. Successive clicks (or Enter/Space) cycle through a flip that reverses its swimming direction, an upward swoop, and a turn back the other way; each reaction finishes before another can begin. Both the flip and turn continue swimming in their new direction, including on narrow screens. Gesture durations use elapsed time so slow rendering does not prolong them. Reduced motion uses hearts and an instant facing change on the first and third clicks. “Let the whale roam” lets it swim across the main page; the floating “Bring the whale back” button returns it to the ocean. Reloading starts with the whale contained again.
- The glowing character-art binoculars open the Split-Rocker scene with the green hummingbird and red cardinal. The entire illustration is a keyboard-accessible link; “← Back” returns directly to the binoculars section, restores keyboard focus there, and skips the welcome screen.
- Beneath the binoculars, green lily pads and a white water lily bob on a little pond. Tap the water (or focus it and press Enter/Space) to make ripples. The pond pauses offscreen and when the tab is hidden; reduced motion keeps the pads still.
- On “okay bye”, tap the glass bottle of chocolate milk to enlarge it; tap again to shrink it beside Dillbillies' chair. George's original goodbye scene remains commented out, including his meadow and recall button. Its markup, `assets/george.svg`, CSS, and guarded interactions in `js/goodbye.js` are preserved separately from the redesigned welcome rabbit. To restore that older scene, remove the comment wrapper around `georgeMeadow` in `index.html`; its hop and recall controls will resume automatically.
- The heart's equation and slider stay open. Use the slider's native play/pause control to control the animation. The heart pauses offscreen and when the tab is hidden, while preserving an explicit pause choice.
- Reduced motion disables automatic heart playback and uses a stationary whale. The native slider's play control can still explicitly enable the heart. Lily growth responds without the rain animation.
- The music section has a playable piano and a C harmonica. Tap/hold keys or holes. Once focused inside the section, use A–K (W E T Y U for sharps) for piano and 1–0 for harmonica. Blow/Draw changes the reed tuning. Volume can be taken to zero. Escape, leaving the section, tab hiding, and window blur release held notes.

## Scene colors

`css/palette.css` holds the shared night palette: plum for the lilies and goodbye,
dusky blue for the ocean, a blue-green tone for birdwatching, and warm charcoal
for the welcome and music. The two character canvases stay transparent so their
backgrounds always match their sections. The Desmos scenes keep their light paper
and graph backgrounds. Lily watering is the primary pink action; secondary text
controls retain 44px touch targets and visible keyboard focus.

## Flower notes

The thirteen flower names and personal messages live in `js/flower-notes.js` under `entries`.
Fill each `note` string with Kevin's wording. Blank entries show “This one reminds me of…”
as a placeholder. These notes are published text, not a visitor comment form.

In the garden, choose Explore and tap any flower or cluster. For the ASCII lilies,
tap an open bloom, or focus the canvas and press Enter. Dragging still waters the lilies. Close or
Escape dismisses a note and returns focus to its flower.

Each garden flower's card also opens a live Desmos calculator with its original
equations, colors and layers. The math list starts expanded with a `b` slider
that scales the complete flower or cluster. Changes affect the card's preview;
the main garden keeps its original composition. Closing or switching a card
destroys its calculator. The ASCII lilies have a Bloom slider in their note,
linked to the same growth state used by watering and dragging.

## Music

`js/music.js` synthesizes a soft piano from decaying harmonics and a reed-like
harmonica from a periodic waveform with slight vibrato. It uses the browser's
Web Audio API, starts only after a note gesture, and needs no audio download or
microphone permission. The ten-hole C Richter tuning follows
[Hohner's tuning chart](https://hohner.de/fileadmin/documents/instruments/harmonicas/HOHNER-Tuningcharts-Marineband-1896.pdf).
These are synthesized instruments, not recordings. Touch, keyboard, and accessible
button clicks share the same note lifecycle; pending audio resumes cannot start
notes that have already been released.

Each piano note lifts its own hammer and shimmers its strings; multiple held notes
animate independently. The harmonica has metal covers, a wooden comb, and visible
reeds that respond to playing. Reduced motion keeps the color feedback and removes
the moving parts. All note visuals reset on release, tab hiding, or leaving the section.

## Desmos configuration

The API key is configured in the `desmos-api-key` meta tag in `index.html`. This update retains the existing key. Verify its status and personal-project configuration at <https://www.desmos.com/my-api>; the repository cannot establish its account/tier or guarantee removal of a trial-key notice. Provider notices are not hidden by CSS.

`js/graph-loader.js` downloads the pinned v1.12 library asynchronously after entry and initializes each graph near its section. A failed download or 15-second timeout exposes Try again while leaving the rest of the experience usable.

The garden contains twelve flower groups: sakura, petunia, plumeria, hibiscus, lilac, wisteria, pansy, sunflower, chrysanthemum, marigold, daisy and forget-me-nots. The seven imported flower groups and the shared RGB palette come from [The Bouquet](https://www.desmos.com/calculator/n3bgw7hhkd), stored in `js/bouquet-data.js` with their original equations, domains, layer order and transparency. Wisteria preserves all sixteen original rounded blossoms, with its helper variables expanded into the curves. Existing flowers use this same palette, except for the petunia, which keeps its earlier pink gradient with fine, translucent veins. Uniform transforms scatter the flowers at varied heights and sizes around Cameron, with separate asymmetrical arrangements for desktop and phones and equal horizontal and vertical units. All twelve groups fade in on each visit. Flower hitboxes track Desmos coordinates after panning and zooming. The heart uses Desmos's documented `playing` property; the old undocumented `loopMode`/`sliderPeriod` arguments have been removed.

## Checks

With Node.js 18 or later:

```sh
node --test tests/*.test.cjs
```

The dependency-free tests cover expression preservation, responsive math bounds, welcome entry without Desmos, George's hop-before-entry sequence and bounded fallbacks, timeout/retry and lazy loading, Explore/Done/Escape, live flower cards, lily growth controls, repeat reveals, idle/offscreen animation scheduling, reduced-motion resize, and native heart playback. The test doubles do not render HTML/CSS or execute the real Desmos library.

Before sharing, check the actual website in desktop and mobile browsers, including Safari: 320px and 390px portrait, landscape, tablet, and desktop; welcome scrolling on short screens; all lily controls; flower panning and note dismissal; repeated section visits; heart math and play/pause; reduced motion; and a throttled/blocked Desmos request. Confirm the API-key notice against the actual key and domain.


