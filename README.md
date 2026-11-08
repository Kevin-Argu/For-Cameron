# For Cameron

A little something: peanut-free welcome with George → interactive ASCII lilies → Cameron and mathematical flowers → roaming ASCII whale → birdwatching and lily pads → piano and harmonica → animated Desmos heart → chocolate milk and Dillbillies' goodbye.

The main page unfolds as one short poem: “Cameron,” → “in the silliest moments,” →
“in the smallest things,” → “and in the sweetest sounds,” → “my thoughts always
find their way to you.” → “okay bye”. The whale line sits above BALLENAS and stays
visible after entry; the final heartfelt line sits above the Desmos heart.

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
- The music page is one drawn scene: an upright piano with an open action, a sheet of music, and a small brass harmonica on a bench. “Play together” starts one short duet, with piano accompaniment and harmonica melody on the same clock. Keys, hammers, and reeds follow the notes. Click the piano body or harmonica cover for a solo, or tap individual keys and holes to play. Open “or, play a little yourself” for keyboard shortcuts and harmonica Blow/Draw. Volume can be taken to zero. Escape, leaving the section, tab hiding, and window blur stop every part.

## Scene colors

`css/palette.css` holds the shared night palette: plum for the lilies, dusky blue
for the ocean, a blue-green tone for birdwatching, warm charcoal for the welcome,
muted burgundy for music, and neutral black for goodbye. The two character canvases
stay transparent so their backgrounds always match their sections. The Desmos scenes keep their light paper
and graph backgrounds. Lily watering is the primary pink action; secondary text
controls retain 44px touch targets and visible keyboard focus.

## Flower notes

The garden entrance uses twelve transparent PNG previews exported from the same
Desmos curves. They decode before a 2.35-second staggered CSS fade; revisiting the
garden replays it without changing graph expressions. This replaces 52 batches
of curve-opacity updates per entrance. Explore switches to the original live
equations, and Done returns to the matching previews. Reduced motion or an image
load failure shows the live bouquet directly. The initial geometry is arranged
before its single upload to Desmos.

The preview crop boxes share the flower hitboxes, so wide and tall layouts stay
aligned. When changing flower shapes or their crop sizes, run
`node scripts/export-flower-previews.cjs`, open `/flower-export.html` in the local
preview, and export/download the artwork. Import that file with
`node scripts/export-flower-previews.cjs --import /path/to/flower-previews.json`.
The generated `dist/flower-export.html` is a local development tool and is not
published. The twelve PNG files total about 970 KiB and are reused from cache.

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
harmonica from a periodic waveform with slight vibrato. A short original duet pairs
piano accompaniment with a harmonica melody; two original solo phrases are also
available. Spotify and external song playback are not connected. Audio starts only
after a gesture and needs no download or microphone permission. The ten-hole C
Richter tuning follows [Hohner's tuning chart](https://hohner.de/fileadmin/documents/instruments/harmonicas/HOHNER-Tuningcharts-Marineband-1896.pdf).

The upright piano illustration, open strings and hammers, and two-octave HTML
keyboard share a 760 × 520 stage. The smaller brass harmonica rests on its bench;
on narrow screens the bench moves forward. Flat colors, fine irregular outlines,
and small character marks keep the two objects consistent with the handmade site.
The poem line is retained, while a single shared play button leads the controls.

A duet uses one step schedule for both instruments. The sounding pitches drive the
key, hammer, and reed highlights; solo bass notes below the displayed keyboard are
shown one octave higher. Reduced motion disables automatic key movement while
preserving playback. All queued work and active voices are cleared when a tune
stops, finishes, loses visibility, or is interrupted by a manual note. Pending audio
resumes cannot restart a cancelled tune.

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



