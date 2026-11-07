# For Cameron

A little something: peanut-free welcome → interactive ASCII lilies → Cameron and mathematical flowers → roaming ASCII whale → birdwatching → animated Desmos heart → piano and harmonica.

## Run locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The source is a static website with no build step. Desmos requires an internet connection. Publishing and domain configuration are separate from editing these files.

## Controls

- Water the lilies or drag upward to grow them. Colors cycles through the original palettes; Start again resets growth and rain.
- Enter the garden moves to Cameron's flowers. Explore enables graph interaction and personal flower notes. Done closes the card and restores page scrolling. Escape closes an open note first, then exits Explore.
- The whale stays inside its ocean section by default and pauses when that section is offscreen. “Let the whale roam” lets it swim across the main page; the floating “Bring the whale back” button returns it to the ocean. Reloading starts with the whale contained again. Tapping it away from other controls preserves its heart reaction.
- The glowing character-art binoculars open the Split-Rocker scene with the green hummingbird and red cardinal. The entire illustration is a keyboard-accessible link; the scene's back link returns directly to the garden.
- The heart's equation and slider stay open. Use the slider's native play/pause control to control the animation. The heart pauses offscreen and when the tab is hidden, while preserving an explicit pause choice.
- Reduced motion disables automatic heart playback and uses a stationary whale. The native slider's play control can still explicitly enable the heart. Lily growth responds without the rain animation.
- The final music section has a playable piano and a C harmonica. Tap/hold keys or holes. Once focused inside the section, use A–K (W E T Y U for sharps) for piano and 1–0 for harmonica. Blow/Draw changes the reed tuning. Volume can be taken to zero. Escape, leaving the section, tab hiding, and window blur release held notes.

## Flower notes

The twelve flower names and personal messages live in `js/flower-notes.js` under `entries`.
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

The garden contains eleven flower groups: sakura, petunia, plumeria, hibiscus, lilac, wisteria, pansy, sunflower, chrysanthemum, marigold and daisy. The five newer flowers and the shared RGB palette come from [The Bouquet](https://www.desmos.com/calculator/n3bgw7hhkd), stored in `js/bouquet-data.js` with their original equations, domains, layer order and transparency. Existing flowers use this same palette, except for the petunia, which keeps its earlier pink gradient with fine, translucent veins. Uniform transforms scatter the flowers at varied heights and sizes around Cameron, with separate asymmetrical arrangements for desktop and phones and equal horizontal and vertical units. All eleven groups fade in on each visit. Flower hitboxes track Desmos coordinates after panning and zooming. The heart uses Desmos's documented `playing` property; the old undocumented `loopMode`/`sliderPeriod` arguments have been removed.

## Checks

With Node.js 18 or later:

```sh
node --test tests/*.test.cjs
```

The dependency-free tests cover expression preservation, responsive math bounds, welcome entry without Desmos, timeout/retry and lazy loading, Explore/Done/Escape, live flower cards, lily growth controls, repeat reveals, idle/offscreen animation scheduling, reduced-motion resize, and native heart playback. The test doubles do not render HTML/CSS or execute the real Desmos library.

Before sharing, check the actual website in desktop and mobile browsers, including Safari: 320px and 390px portrait, landscape, tablet, and desktop; welcome scrolling on short screens; all lily controls; flower panning and note dismissal; repeated section visits; heart math and play/pause; reduced motion; and a throttled/blocked Desmos request. Confirm the API-key notice against the actual key and domain.


