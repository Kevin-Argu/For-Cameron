const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { harness } = require('./harness.cjs');
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function start(options) { const h = harness(options); h.run('main.js'); h.run('flower-notes.js'); h.run('bouquet-data.js'); return h; }
function flowers(h) { h.run('flower-details.js'); h.run('flowers.js'); h.context.CameronGraphs.flowers(); h.get('exploreButton').disabled = false; }
function heart(h) { h.run('heart.js'); h.context.CameronGraphs.heart(); }

test('bouquet imports preserve source geometry, colors, layers and domains', () => {
    const h = start({ reduced: true }); flowers(h); h.intersect('gardenStart', 1);
    const calc = h.calculators[0];
    assert.equal(calc.getExpressions().length, 398);
    const expectedLayers = { pansy: 15, sunflower: 6, chrysanthemum: 20, marigold: 18, daisy: 4, forgetmenots: 7, wisteria: 96 };
    const definitions = new Set();
    for (const flower of h.context.CameronBouquet.flowers) {
        const curves = flower.expressions.filter(e => e.parametricDomain);
        assert.equal(curves.length, expectedLayers[flower.id]);
        for (const source of flower.expressions) {
            const actual = calc.expressions.get(source.id);
            assert.ok(actual.latex.includes(source.latex));
            if (source.parametricDomain) {
                assert.deepEqual(actual.parametricDomain, source.parametricDomain);
                assert.equal(actual.color, source.color);
                assert.equal(actual.fillOpacity, source.fillOpacity);
                assert.equal(actual.lineOpacity, source.lines ? source.lineOpacity : 0);
            } else {
                const variable = source.latex.split('=')[0].replace(/\\ /g, '').trim();
                assert.ok(!definitions.has(variable), 'No conflicting definition: ' + variable);
                definitions.add(variable);
            }
        }
    }
    // Exact RGB values from the graph's Colors folder, not Desmos fallback colors.
    assert.equal(calc.expressions.get('pansy_257').color, '#473499');
    assert.equal(calc.expressions.get('sunflower_403').color, '#7d6e43');
    assert.equal(calc.expressions.get('chrysanthemum_989').color, '#f7d839');
    assert.equal(calc.expressions.get('marigold_1182').color, '#f5771d');
    assert.equal(calc.expressions.get('daisy_1233').color, '#fcf8eb');
    assert.equal(calc.expressions.get('forgetmenots_599').color, '#5a94d1');
    // Petunia retains its earlier pink gradient after the visual refinement.
    assert.equal(calc.expressions.get('petuniaOuter').color, '#f7b6dc');
    assert.equal(calc.expressions.get('hibiscusNice').color, '#8f70c4');
    assert.equal(calc.expressions.get('sakuraMiddle1').fillOpacity, .2);
    assert.equal(calc.settings.showXAxis, false);
    assert.equal(calc.settings.showYAxis, false);
});

test('every flower fits the viewport with equal axis scale on phones, tablets and desktops', () => {
    for (const [width, height] of [[320,568],[390,844],[844,390],[768,1024],[1440,900]]) {
        const h = start(); h.resize('flowerCalculator', width, height); flowers(h);
        const b = h.calculators[0].bounds;
        assert.ok(Math.abs(width / (b.right - b.left) - height / (b.top - b.bottom)) < .00001);
        const zones = h.document.querySelector('.flower-click-layer').querySelectorAll('button');
        assert.equal(zones.length, 12);
        for (const zone of zones) {
            const left = parseFloat(zone.style.left), top = parseFloat(zone.style.top);
            assert.ok(left >= 0 && top >= 0, zone.title + ' begins inside the viewport');
            assert.ok(left + parseFloat(zone.style.width) <= width + .01, zone.title + ' fits horizontally');
            assert.ok(top + parseFloat(zone.style.height) <= height + .01, zone.title + ' fits vertically');
        }
    }
});

test('Done closes flower notes and restores scroll mode and focus; repeated visits restore the hint', () => {
    const h = start(); flowers(h);
    const card = h.get('flowerNotePanel');
    const layer = h.document.querySelector('.flower-click-layer');
    const hint = h.document.querySelector('.flower-note-hint');
    const zone = layer.querySelector('button');
    h.get('exploreButton').click(); zone.click();
    assert.equal(card.hidden, false);
    assert.equal(card.scrolledIntoView, true);
    assert.equal(h.document.activeElement, card.querySelector('button'));
    h.get('doneButton').click();
    assert.equal(card.hidden, true); assert.equal(layer.hidden, true);
    assert.equal(h.get('flowerCalculator').inert, true);
    assert.equal(h.get('desmosLock').classList.contains('unlocked'), false);
    assert.equal(h.document.activeElement, h.get('exploreButton'));
    h.get('exploreButton').click(); zone.click();
    h.document.dispatchEvent({ type: 'keydown', key: 'Escape' });
    assert.equal(card.hidden, true); assert.equal(hint.hidden, false);
    assert.equal(h.document.activeElement, zone);
    h.document.dispatchEvent({ type: 'keydown', key: 'Escape' });
    assert.equal(h.get('doneButton').hidden, true);
});

test('flower reveals replay on re-entry and stop after finishing', () => {
    const h = start(); flowers(h); h.intersect('gardenStart', 1); h.advance(4000);
    const calc = h.calculators[0];
    assert.equal(calc.expressions.get('wisteria_1297').fillOpacity, 1);
    const batches = calc.batches; h.advance(1000); assert.equal(calc.batches, batches);
    h.intersect('gardenStart', 0); assert.equal(calc.expressions.get('sakuraOuter').fillOpacity, 0);
    h.intersect('gardenStart', 1); h.advance(4000);
    assert.equal(calc.expressions.get('wisteria_1297').fillOpacity, 1);
    h.hidden(true); assert.equal(h.frames.size, 0);
    h.hidden(false); h.advance(4000); assert.equal(calc.expressions.get('sakuraOuter').fillOpacity, 1);
});

test('every flower opens its note with expanded live math, its original layers, and a size slider', () => {
    const h = start(); flowers(h);
    h.get('exploreButton').click();
    const layer = h.document.querySelector('.flower-click-layer');
    const buttons = layer.querySelectorAll('button');
    const card = h.get('flowerNotePanel');
    assert.equal(buttons.length, 12);
    const names = [];
    for (const button of buttons) {
        button.click();
        names.push(card.querySelector('h2').textContent);
        assert.equal(card.querySelector('.flower-note-text').textContent, 'This one reminds me of…');
        assert.equal(card.querySelector('pre'), null);
        assert.equal(card.querySelector('details'), null);
        const detail = h.calculators.at(-1);
        assert.equal(detail.settings.expressions, true);
        assert.equal(detail.settings.expressionsCollapsed, false);
        assert.equal(detail.expressions.get('bloom-size').latex, 'b=1');
        const source = h.calculators[0].expressions;
        for (const curve of detail.getExpressions().filter(expression => expression.parametricDomain)) {
            assert.ok(curve.latex.includes(source.get(curve.id).latex.trim()));
            assert.equal(curve.color, source.get(curve.id).color);
            assert.ok(curve.fillOpacity > 0 || curve.lineOpacity > 0);
        }
        assert.ok(detail.getExpressions().filter(expression => expression.parametricDomain).length >= 4);
        // Switching flowers cleans up the preceding live calculator.
        if (h.calculators.length > 2) assert.equal(h.calculators.at(-2).destroyed, true);
    }
    assert.deepEqual(names.sort(), ['Chrysanthemum', 'Daisy', 'Forget-me-nots', 'Hibiscus', 'Lilac', 'Marigold', 'Pansy', 'Petunia', 'Plumeria', 'Sakura', 'Sunflower', 'Wisteria']);
    h.context.CameronNotes.entries.lilac.note = 'A personal line.\n<em>Kept as plain text.</em>';
    buttons.find(button => button.getAttribute('aria-label') === 'Read the note for Lilac').click();
    const note = card.querySelector('.flower-note-text');
    assert.equal(note.textContent, 'A personal line.\n<em>Kept as plain text.</em>');
    assert.equal(note.classList.contains('is-placeholder'), false);
    assert.equal(note.querySelector('em'), null);
    card.querySelector('button').click();
    assert.equal(h.calculators.at(-1).destroyed, true);
});

test('the lily note works without Desmos, opens on a bloom tap, and does not open on a watering drag', () => {
    const h = start({ reduced: true, desmos: false });
    h.run('ascii-lilies.js'); h.enter(); h.intersect('asciiLiliesCanvas', 1);
    const card = h.get('lilyNotePanel');
    assert.equal(h.get('lilyNoteButton'), null);
    h.get('asciiLiliesCanvas').dispatchEvent({ type: 'keydown', key: 'Enter' });
    assert.equal(card.querySelector('h2').textContent, 'Lilies');
    assert.equal(card.hidden, false);
    card.dispatchEvent({ type: 'keydown', key: 'Escape' });
    assert.equal(card.hidden, true);
    assert.equal(h.document.activeElement, h.get('asciiLiliesCanvas'));
    for (let i = 0; i < 6; i++) h.get('waterLilies').click();
    h.advance(100);
    const canvas = h.get('asciiLiliesCanvas');
    const x = canvas.rect.left + canvas.rect.width * .25;
    const y = canvas.rect.top + canvas.rect.height * .36;
    const pointer = { pointerId: 1, isPrimary: true, button: 0, clientX: x, clientY: y };
    canvas.dispatchEvent({ ...pointer, type: 'pointerdown' });
    canvas.dispatchEvent({ ...pointer, type: 'pointerup' });
    assert.equal(card.hidden, false);
    card.querySelector('button').click();
    canvas.dispatchEvent({ ...pointer, type: 'pointerdown' });
    canvas.dispatchEvent({ ...pointer, type: 'pointermove', clientY: y - 60 });
    canvas.dispatchEvent({ ...pointer, type: 'pointerup', clientY: y - 60 });
    assert.equal(card.hidden, true);
    assert.equal(h.requests().length, 0);
});

test('the lilies Bloom slider controls growth and stays in sync with watering and restart', () => {
    const h = start({ reduced: true, desmos: false });
    h.run('ascii-lilies.js'); h.enter(); h.intersect('asciiLiliesCanvas', 1);
    const slider = h.get('lilyGrowth');
    slider.value = '20'; slider.dispatchEvent({ type: 'input' }); h.advance(100);
    assert.equal(slider.getAttribute('aria-valuetext'), '100% bloomed');
    const calls = h.canvasCalls.get(h.get('asciiLiliesCanvas'));
    assert.ok(calls.fills > 0);
    h.get('replayLilies').click();
    assert.equal(Number(slider.value), 0);
    h.get('waterLilies').click();
    assert.equal(Number(slider.value), 3.6);
});

test('welcome entry works before Desmos loads; only background scrolling is blocked', () => {
    const h = start({ reduced: true, desmos: false }); h.run('peanut-gate.js');
    const outside = { type: 'wheel', target: h.get('gardenStart') };
    const inside = { type: 'touchmove', target: h.get('enterPeanutFree') };
    h.document.dispatchEvent(outside); h.document.dispatchEvent(inside);
    assert.equal(outside.defaultPrevented, true); assert.ok(!inside.defaultPrevented);
    h.get('enterPeanutFree').click();
    assert.equal(h.context.CameronSite.entered, true);
    assert.equal(h.get('peanutGate').hidden, true);
    assert.equal(h.document.querySelector('main').inert, false);
    assert.equal(h.document.activeElement, h.get('waterLilies'));
});

test('the birdwatching return opens the garden directly and initializes its graph', async () => {
    const birdwatch = fs.readFileSync(path.resolve(__dirname, '../birdwatch.html'), 'utf8');
    assert.match(birdwatch, /href="index\.html#gardenStart"/);
    const h = start({ hash: '#gardenStart', desmos: false });
    h.run('peanut-gate.js');
    assert.equal(h.context.CameronSite.entered, true);
    assert.equal(h.get('peanutGate').hidden, true);
    assert.equal(h.document.querySelector('main').inert, false);
    assert.equal(h.document.documentElement.classList.contains('peanut-locked'), false);
    assert.equal(h.document.body.classList.contains('peanut-lock'), false);
    assert.equal(h.get('gardenStart').scrolledIntoView, true);
    assert.equal(h.document.activeElement, h.get('gardenStart'));
    const wheel = { type: 'wheel', target: h.get('gardenStart') };
    const tab = { type: 'keydown', key: 'Tab' };
    h.document.dispatchEvent(wheel); h.document.dispatchEvent(tab);
    assert.ok(!wheel.defaultPrevented); assert.ok(!tab.defaultPrevented);
    h.run('flowers.js'); h.run('heart.js'); h.run('graph-loader.js');
    h.intersect('gardenStart', 1);
    assert.equal(h.requests().length, 1);
    h.succeedLibrary(); await flush();
    assert.equal(h.get('exploreButton').disabled, false);
    assert.equal(h.get('flowerStatus').hidden, true);
});

test('loader handles timeout, retry, shared loading and lazy heart initialization', async () => {
    const h = start({ desmos: false });
    h.run('flowers.js'); h.run('heart.js'); h.run('graph-loader.js');
    h.intersect('gardenStart', 1);
    assert.equal(h.requests().length, 0);
    h.enter(); assert.equal(h.requests().length, 1);
    h.advance(15001); await flush();
    const retry = h.document.querySelector('[data-retry="flowers"]');
    assert.equal(retry.hidden, false); assert.equal(h.get('exploreButton').disabled, true);
    retry.click(); assert.equal(h.requests().length, 1);
    h.succeedLibrary(); await flush();
    assert.equal(h.get('flowerStatus').hidden, true);
    assert.equal(h.get('exploreButton').disabled, false);
    assert.equal(h.calculators.length, 1);
    h.intersect('heartFinale', 1); await flush();
    assert.equal(h.calculators.length, 2);
    assert.equal(h.get('heartStatus').hidden, true);
    assert.equal(h.requests().length, 1);
    h.intersect('gardenStart', 1); await flush(); assert.equal(h.calculators.length, 2);
});

test('settled lilies stop drawing, resume on interaction, and pause offscreen', () => {
    const h = start(); h.run('ascii-lilies.js'); h.intersect('asciiLiliesCanvas', 1);
    const calls = h.canvasCalls.get(h.get('asciiLiliesCanvas'));
    h.advance(5000); assert.equal(calls.fills, 0);
    h.enter(); h.advance(100); assert.equal(h.frames.size, 0);
    h.get('waterLilies').click(); h.advance(15000);
    assert.ok(calls.fills > 0); assert.equal(h.frames.size, 0);
    const settled = calls.fills; h.advance(2000); assert.equal(calls.fills, settled);
    h.get('colorLilies').click(); h.advance(100); assert.ok(calls.fills > settled);
    h.get('waterLilies').click(); h.intersect('asciiLiliesCanvas', 0);
    const offscreen = calls.fills; h.advance(2000); assert.equal(calls.fills, offscreen);
    h.intersect('asciiLiliesCanvas', 1); h.advance(100); assert.ok(calls.fills > offscreen);
    h.get('replayLilies').click(); h.advance(100); assert.equal(h.frames.size, 0);
});

test('the whale waits for BALLENAS and pauses its entrance when the ocean is offscreen', () => {
    const h = start();
    const home = h.get('whaleHome');
    home.rect = { ...home.rect, top: 1800, bottom: 2700 };
    h.run('whale.js');
    const canvas = h.get('roamingWhale'), calls = h.canvasCalls.get(canvas);
    assert.equal(canvas.parent, home);
    assert.equal(canvas.classList.contains('is-roaming'), false);
    h.advance(5000); assert.equal(calls.fills, 0);
    h.enter(); h.advance(100);
    assert.equal(calls.fills, 0); assert.equal(h.frames.size, 0);
    assert.equal(canvas.getAttribute('aria-hidden'), 'true');
    home.rect = { ...home.rect, top: 0, bottom: 900 };
    h.windowEvent('scroll'); h.advance(100);
    // Visiting the section alone must never release the whale or start an animation loop.
    assert.equal(calls.fills, 0); assert.equal(h.frames.size, 0);
    assert.equal(h.get('whaleRoam').hidden, true);
    h.get('whaleDrop').click(); h.advance(100);
    assert.ok(calls.fills > 0); assert.ok(calls.translations[0][1] < 0);
    assert.equal(home.getAttribute('data-whale-state'), 'falling');
    assert.equal(canvas.getAttribute('aria-hidden'), 'false');
    home.rect = { ...home.rect, top: -900, bottom: 0 };
    h.windowEvent('scroll'); h.advance(100);
    const paused = calls.fills;
    h.advance(1000);
    assert.equal(calls.fills, paused); assert.equal(h.frames.size, 0);
    assert.equal(canvas.getAttribute('aria-hidden'), 'true');
    home.rect = { ...home.rect, top: 0, bottom: 900 };
    h.windowEvent('scroll'); h.advance(100);
    assert.equal(home.getAttribute('data-whale-state'), 'falling');
});

test('BALLENAS falls from above, lands once, then unlocks the existing swimming controls', () => {
    const h = start(); h.run('whale.js');
    const home = h.get('whaleHome'), drop = h.get('whaleDrop'), roam = h.get('whaleRoam');
    // Neither the welcome gate nor a forced click on the hidden roam control can bypass the entrance.
    drop.click(); h.advance(2000);
    assert.equal(home.getAttribute('data-whale-state'), 'waiting');
    h.enter(); roam.click();
    assert.equal(h.get('roamingWhale').parent, home);
    drop.focus(); drop.click(); h.advance(500);
    const calls = h.canvasCalls.get(h.get('roamingWhale'));
    const positions = calls.translations.filter(([x]) => x === 720).map(([, y]) => y);
    assert.ok(positions[0] < 0);
    assert.ok(positions.at(-1) > positions[0]);
    assert.equal(drop.hidden, true); assert.equal(roam.hidden, true);
    h.hidden(true); h.advance(5000);
    assert.equal(home.getAttribute('data-whale-state'), 'falling');
    h.hidden(false); h.advance(700);
    assert.equal(home.getAttribute('data-whale-state'), 'impact');
    assert.equal(roam.hidden, true);
    h.advance(900);
    assert.equal(home.getAttribute('data-whale-state'), 'swimming');
    assert.equal(roam.hidden, false); assert.equal(h.document.activeElement, roam);
    const swimming = calls.fills; h.advance(100);
    assert.ok(calls.fills > swimming);
    drop.click();
    assert.equal(home.getAttribute('data-whale-state'), 'swimming');
});

test('roaming is opt-in, the return control travels with the whale, and returning contains it again', () => {
    const h = start(); h.run('whale.js'); h.enter();
    h.get('whaleDrop').click(); h.advance(2300);
    const home = h.get('whaleHome'), canvas = h.get('roamingWhale');
    const button = h.get('whaleRoam'), calls = h.canvasCalls.get(canvas);
    assert.equal(button.getAttribute('aria-pressed'), 'false');
    button.click(); h.advance(100);
    assert.equal(canvas.parent, h.document.body);
    assert.equal(button.parent, h.document.body);
    assert.equal(canvas.classList.contains('is-roaming'), true);
    assert.equal(button.getAttribute('aria-pressed'), 'true');
    assert.equal(button.textContent, 'Bring the whale back');
    assert.equal(h.document.activeElement, button);
    home.rect = { ...home.rect, top: -900, bottom: 0 };
    h.windowEvent('scroll');
    const released = calls.fills; h.advance(100);
    assert.ok(calls.fills > released);
    h.hidden(true); assert.equal(h.frames.size, 0);
    h.hidden(false); h.advance(100);
    button.click(); h.advance(100);
    assert.equal(canvas.parent, home); assert.equal(button.parent, home);
    assert.equal(canvas.classList.contains('is-roaming'), false);
    assert.equal(button.getAttribute('aria-pressed'), 'false');
    assert.equal(button.textContent, 'Let the whale roam');
    assert.equal(home.scrolledIntoView, true);
    assert.equal(h.frames.size, 0);
    assert.equal(h.document.querySelectorAll('#roamingWhale').length, 1);
    assert.equal(h.document.querySelectorAll('#whaleRoam').length, 1);
});

test('the contained and roaming whale respect reduced motion through resizing and scrolling', () => {
    const h = start({ reduced: true }); h.run('whale.js'); h.enter();
    // The visitor still chooses when the whale appears, but no falling frames are rendered.
    h.get('whaleDrop').click(); h.advance(17);
    const canvas = h.get('roamingWhale'), calls = h.canvasCalls.get(canvas);
    assert.equal(h.get('whaleHome').getAttribute('data-whale-state'), 'swimming');
    assert.ok(calls.translations[0][1] > 0);
    const previous = calls.fills; assert.equal(h.frames.size, 0);
    h.context.innerWidth = 390; h.context.innerHeight = 844;
    h.resize('whaleHome', 390, 844); h.windowEvent('resize'); h.advance(17);
    assert.equal(canvas.width, 390); assert.equal(canvas.height, 844);
    assert.ok(calls.fills > previous); assert.equal(h.frames.size, 0);
    h.get('whaleRoam').click(); h.advance(17);
    const released = calls.fills;
    h.windowEvent('scroll'); h.advance(17);
    assert.ok(calls.fills > released); assert.equal(h.frames.size, 0);
    h.get('whaleRoam').click(); h.advance(17);
    assert.equal(canvas.parent, h.get('whaleHome'));
    assert.equal(h.frames.size, 0);
});

test('changing to reduced motion during the drop resolves the landing without leaving a loop', () => {
    const h = start(); h.run('whale.js'); h.enter();
    h.get('whaleDrop').click(); h.advance(400);
    h.setReduced(true); h.advance(17);
    assert.equal(h.get('whaleHome').getAttribute('data-whale-state'), 'swimming');
    assert.equal(h.get('whaleRoam').hidden, false);
    assert.equal(h.frames.size, 0);
});

test('heart math stays open without extra buttons and its native slider controls playback', () => {
    const h = start(); heart(h); const calc = h.calculators[0];
    assert.equal(calc.expressions.get('heart').latex, String.raw`f(x)=x^{\frac{2}{3}}+\sqrt{5-x^2}\sin(a\pi x)`);
    assert.equal(calc.expressions.get('slider').playing, false);
    assert.equal(calc.settings.expressions, true);
    assert.equal(calc.settings.expressionsCollapsed, false);
    assert.equal(h.get('heartCalculator').inert, false);
    assert.equal(h.get('toggleHeartMath'), null);
    assert.equal(h.get('toggleHeartAnimation'), null);
    h.intersect('heartFinale', 1); assert.equal(calc.expressions.get('slider').playing, true);
    h.hidden(true); assert.equal(calc.expressions.get('slider').playing, false);
    h.hidden(false); assert.equal(calc.expressions.get('slider').playing, true);
    calc.setExpression({ id: 'slider', playing: false });
    calc.userChange('change', { isUserInitiated: true });
    h.intersect('heartFinale', 0); h.intersect('heartFinale', 1);
    assert.equal(calc.expressions.get('slider').playing, false);
    h.get('heartFinale').dispatchEvent({ type: 'keydown', key: 'Escape' });
    assert.equal(calc.settings.expressions, true); assert.equal(h.get('heartCalculator').inert, false);
    h.setReduced(true);
    assert.equal(calc.expressions.get('slider').playing, false);
    calc.setExpression({ id: 'slider', playing: true });
    calc.userChange('change', { isUserInitiated: true });
    assert.equal(calc.expressions.get('slider').playing, true);
    h.resize('heartCalculator', 320, 240);
    const b = calc.bounds;
    assert.ok(b.left <= -3.5 && b.right >= 3.5 && b.bottom <= -2 && b.top >= 5);
    assert.ok(Math.abs(320 / (b.right - b.left) - 240 / (b.top - b.bottom)) < .00001);
});

test('HTML has unique IDs and all referenced local scripts/styles exist', () => {
    const root = path.resolve(__dirname, '..'); const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        if (!url.startsWith('http')) assert.ok(fs.existsSync(path.join(root, url.split('?')[0])), url);
    }
});


