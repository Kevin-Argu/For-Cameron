const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { harness } = require('./harness.cjs');
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };
function start(options) { const h = harness(options); h.run('main.js'); return h; }
function flowers(h) { h.run('flowers.js'); h.context.CameronGraphs.flowers(); h.get('exploreButton').disabled = false; }
function heart(h) { h.run('heart.js'); h.context.CameronGraphs.heart(); h.get('toggleHeartMath').disabled = false; h.get('toggleHeartAnimation').disabled = false; }

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

test('Done closes math, restores scroll mode and focus; repeated math visits restore the hint', () => {
    const h = start(); flowers(h);
    const card = h.document.querySelector('.flower-math-card');
    const layer = h.document.querySelector('.flower-click-layer');
    const hint = h.document.querySelector('.flower-math-hint');
    const zone = layer.querySelector('button');
    h.get('exploreButton').click(); zone.click();
    assert.equal(card.hidden, false);
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

test('heart keeps its equation, pauses offscreen, respects pause/reduced motion, and exposes math on demand', () => {
    const h = start(); heart(h); const calc = h.calculators[0];
    assert.equal(calc.expressions.get('heart').latex, String.raw`f(x)=x^{\frac{2}{3}}+\sqrt{5-x^2}\sin(a\pi x)`);
    assert.equal(calc.expressions.get('slider').playing, false);
    h.intersect('heartFinale', 1); assert.equal(calc.expressions.get('slider').playing, true);
    h.hidden(true); assert.equal(calc.expressions.get('slider').playing, false);
    h.hidden(false); assert.equal(calc.expressions.get('slider').playing, true);
    h.get('toggleHeartAnimation').click();
    h.intersect('heartFinale', 0); h.intersect('heartFinale', 1);
    assert.equal(calc.expressions.get('slider').playing, false);
    h.get('toggleHeartMath').click();
    assert.equal(calc.settings.expressions, true); assert.equal(h.get('heartCalculator').inert, false);
    h.get('heartFinale').dispatchEvent({ type: 'keydown', key: 'Escape' });
    assert.equal(calc.settings.expressions, false); assert.equal(h.get('heartCalculator').inert, true);
    h.get('toggleHeartAnimation').click(); h.setReduced(true);
    assert.equal(calc.expressions.get('slider').playing, false);
    h.get('toggleHeartAnimation').click(); assert.equal(calc.expressions.get('slider').playing, true);
});

test('HTML has unique IDs and all referenced local scripts/styles exist', () => {
    const root = path.resolve(__dirname, '..'); const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        if (!url.startsWith('http')) assert.ok(fs.existsSync(path.join(root, url.split('?')[0])), url);
    }
});

