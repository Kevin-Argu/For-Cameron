const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { harness } = require('./harness.cjs');
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function start(options) { const h = harness(options); h.run('main.js'); h.run('flower-notes.js'); return h; }
function flowers(h) { h.run('flower-details.js'); h.run('flowers.js'); h.context.CameronGraphs.flowers(); h.get('exploreButton').disabled = false; }
function heart(h) { h.run('heart.js'); h.context.CameronGraphs.heart(); }

test('all original flower expressions, colors, domains and layers are preserved', () => {
    const h = start(); flowers(h);
    const expressions = h.calculators[0].getExpressions().sort((a,b) => a.id.localeCompare(b.id));
    assert.equal(expressions.length, 183);
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(expressions)).digest('hex'),
        '0f8dd56ec693e273d3055eecb14ec9995d3ee58d030fd738c90dde851d14c74b');
    assert.equal(h.calculators[0].settings.showXAxis, false);
    assert.equal(h.calculators[0].settings.showYAxis, false);
});

test('garden framing contains all original bounds with equal axis scale across device sizes', () => {
    for (const [width, height] of [[320,568],[390,844],[844,390],[768,1024],[1440,900]]) {
        const h = start(); h.resize('flowerCalculator', width, height); flowers(h);
        const b = h.calculators[0].bounds;
        assert.ok(b.left <= -10 && b.right >= 10 && b.bottom <= -6 && b.top >= 6);
        assert.ok(Math.abs(width / (b.right - b.left) - height / (b.top - b.bottom)) < .00001);
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
    assert.equal(calc.expressions.get('wisteria_16_petals').fillOpacity, 1);
    const batches = calc.batches; h.advance(1000); assert.equal(calc.batches, batches);
    h.intersect('gardenStart', 0); assert.equal(calc.expressions.get('sakuraOuter').fillOpacity, 0);
    h.intersect('gardenStart', 1); h.advance(4000);
    assert.equal(calc.expressions.get('wisteria_16_petals').fillOpacity, 1);
    h.hidden(true); assert.equal(h.frames.size, 0);
    h.hidden(false); h.advance(4000); assert.equal(calc.expressions.get('sakuraOuter').fillOpacity, 1);
});

test('every flower opens its note with expanded live math, its original layers, and a size slider', () => {
    const h = start(); flowers(h);
    h.get('exploreButton').click();
    const layer = h.document.querySelector('.flower-click-layer');
    const buttons = layer.querySelectorAll('button');
    const card = h.get('flowerNotePanel');
    assert.equal(buttons.length, 6);
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
    assert.deepEqual(names.sort(), ['Hibiscus', 'Lilac', 'Petunia', 'Plumeria', 'Sakura', 'Wisteria']);
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

test('whale entrance waits for entry and reduced-motion whale repaints on resize/scroll', () => {
    const h = start(); h.run('whale.js');
    const calls = h.canvasCalls.get(h.get('roamingWhale'));
    h.advance(5000); assert.equal(calls.fills, 0);
    h.enter(); h.advance(17); assert.ok(calls.translations[0][1] < 0);
    h.hidden(true); assert.equal(h.frames.size, 0);
    const reduced = start({ reduced: true }); reduced.run('whale.js'); reduced.enter(); reduced.advance(17);
    const staticCalls = reduced.canvasCalls.get(reduced.get('roamingWhale'));
    const previous = staticCalls.fills; assert.equal(reduced.frames.size, 0);
    reduced.context.innerWidth = 390; reduced.context.innerHeight = 844;
    reduced.windowEvent('resize'); reduced.advance(17);
    assert.ok(staticCalls.fills > previous); assert.equal(reduced.frames.size, 0);
    const afterResize = staticCalls.fills; reduced.windowEvent('scroll'); reduced.advance(17);
    assert.ok(staticCalls.fills > afterResize);
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

