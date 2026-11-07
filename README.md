# For Cameron

A little something: peanut-free welcome → interactive ASCII lilies → Cameron and mathematical flowers → roaming ASCII whale → animated Desmos heart.

## Run locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. The source is a static website with no build step. Desmos requires an internet connection. Publishing and domain configuration are separate from editing these files.

## Controls

- Water the lilies or drag upward to grow them. Colors cycles through the original palettes; Start again resets growth and rain.
- Enter the garden moves to Cameron's flowers. Explore enables graph interaction and personal flower notes. Done closes the card and restores page scrolling. Escape closes an open note first, then exits Explore.
- The whale enters after the welcome screen closes and continues roaming. Tapping it away from other controls preserves its heart reaction.
- The heart's equation and slider stay open. Use the slider's native play/pause control to control the animation. The heart pauses offscreen and when the tab is hidden, while preserving an explicit pause choice.
- Reduced motion disables automatic heart playback and uses a stationary whale. The native slider's play control can still explicitly enable the heart. Lily growth responds without the rain animation.

## Flower notes

The seven flower names and personal messages live in `js/flower-notes.js` under `entries`.
Fill each `note` string with Kevin's wording. Blank entries show “This one reminds me of…”
as a placeholder. These notes are published text, not a visitor comment form.

In the garden, choose Explore and tap any flower or cluster. For the ASCII lilies,
tap an open bloom or the Lilies label. Dragging still waters the lilies. Close or
Escape dismisses a note and returns focus to its flower.

Each garden flower's card also opens a live Desmos calculator with its original
equations, colors and layers. The math list starts expanded with a `b` slider
that scales the complete flower or cluster. Changes affect the card's preview;
the main garden keeps its original composition. Closing or switching a card
destroys its calculator. The ASCII lilies have a Bloom slider in their note,
linked to the same growth state used by watering and dragging.

## Desmos configuration

The API key is configured in the `desmos-api-key` meta tag in `index.html`. This update retains the existing key. Verify its status and personal-project configuration at <https://www.desmos.com/my-api>; the repository cannot establish its account/tier or guarantee removal of a trial-key notice. Provider notices are not hidden by CSS.

`js/graph-loader.js` downloads the pinned v1.12 library asynchronously after entry and initializes each graph near its section. A failed download or 15-second timeout exposes Try again while leaving the rest of the experience usable.

The flower equations, colors, domains, layer opacities, and six reveal groups are preserved. Framing changes to contain the composition with equal horizontal and vertical units. Flower hitboxes track Desmos coordinates after panning and zooming. The heart uses Desmos's documented `playing` property; the old undocumented `loopMode`/`sliderPeriod` arguments have been removed.

## Checks

With Node.js 18 or later:

```sh
node --test tests/experience.test.cjs
```

The dependency-free tests cover expression preservation, responsive math bounds, welcome entry without Desmos, timeout/retry and lazy loading, Explore/Done/Escape, live flower cards, lily growth controls, repeat reveals, idle/offscreen animation scheduling, reduced-motion resize, and native heart playback. The test doubles do not render HTML/CSS or execute the real Desmos library.

Before sharing, check the actual website in desktop and mobile browsers, including Safari: 320px and 390px portrait, landscape, tablet, and desktop; welcome scrolling on short screens; all lily controls; flower panning and note dismissal; repeated section visits; heart math and play/pause; reduced motion; and a throttled/blocked Desmos request. Confirm the API-key notice against the actual key and domain.

