// Verify the visible reactions, their lifecycle, and the motion-preference fallback.
const test = require('node:test');
const assert = require('node:assert/strict');
const { harness } = require('./harness.cjs');

function swimming({ width = 1440, ...options } = {}) {
    const h = harness(options);
    h.run('main.js'); h.run('whale.js');
    if (width !== 1440) h.resize('whaleHome', width, 844);
    h.enter();
    h.get('whaleDrop').click(); h.advance(2300);
    return h;
}


// The first translation after each clear places the whale on the page; later ones articulate its fins.
function trackPosition(whale) {
    const ctx = whale.getContext('2d'), positions = [];
    const originalClear = ctx.clearRect, originalTranslate = ctx.translate;
    let nextIsPosition = false;
    ctx.clearRect = (...args) => { nextIsPosition = true; originalClear(...args); };
    ctx.translate = (x, y) => {
        if (nextIsPosition) { positions.push([x, y]); nextIsPosition = false; }
        originalTranslate(x, y);
    };
    return positions;
}

test('the whale sends up a tall repeated fountain and stops spraying during tricks or reduced motion', () => {
    const h = swimming(), whale = h.get('roamingWhale'), ctx = whale.getContext('2d');
    const fillText = ctx.fillText;
    let spray = [];
    // Inspect the water glyphs drawn on the live layer; the cached skin is drawn separately as images.
    ctx.fillText = (glyph, x, y) => {
        fillText(glyph, x, y);
        if (glyph === '|' || glyph === 'o') spray.push({ glyph, x, y });
    };
    let bursts = 0, wasSpraying = false, highestDrop = Infinity;
    for (let i = 0; i < 85; i++) {
        spray = []; h.advance(100);
        const spraying = spray.length > 0;
        if (spraying && !wasSpraying) bursts++;
        for (const drop of spray) highestDrop = Math.min(highestDrop, drop.y);
        wasSpraying = spraying;
    }
    assert.ok(bursts >= 2, 'the fountain should appear at least twice in an eight-second view');
    assert.ok(highestDrop < 0, 'the spray should rise above the top of the whale sprite');
    spray = [];
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' }); h.advance(500);
    assert.equal(spray.length, 0, 'a flip should not drag a fountain around with it');
    h.setReduced(true); h.advance(5000);
    assert.equal(spray.length, 0);
    assert.equal(h.frames.size, 0);
});

test('tapping the whale performs a full flip; keyboard activation then makes an upward swoop', () => {
    const h = swimming(), whale = h.get('roamingWhale'), calls = h.canvasCalls.get(whale);
    h.windowEvent('click', { target: h.get('whaleHome'), clientX: 720, clientY: 585 });
    assert.equal(whale.getAttribute('data-whale-trick'), 'flip');
    const firstRotation = calls.rotations.length;
    h.advance(1300);
    assert.ok(calls.rotations.slice(firstRotation).some(angle => angle < -Math.PI));
    // Extra taps cannot restart the active flip or queue an unexpected second animation.
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' });
    h.advance(1000);
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    const worldMoves = trackPosition(whale);
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' }); h.advance(1100);
    assert.equal(whale.getAttribute('data-whale-trick'), 'swoop');
    assert.ok(worldMoves.some(([, y]) => y < 430));
    h.advance(1600);
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    assert.equal(h.get('whaleRoam').hidden, false);
});

test('whale reactions pause offscreen and in a hidden tab, and stop when motion is reduced', () => {
    const h = swimming(), whale = h.get('roamingWhale'), home = h.get('whaleHome');
    whale.dispatchEvent({ type: 'keydown', key: ' ' }); h.advance(300);
    home.rect = { ...home.rect, top: -900, bottom: 0 };
    h.windowEvent('scroll'); h.advance(5000);
    assert.equal(whale.getAttribute('data-whale-trick'), 'flip');
    assert.equal(whale.getAttribute('tabindex'), '-1');
    assert.equal(h.frames.size, 0);
    home.rect = { ...home.rect, top: 0, bottom: 900 };
    h.windowEvent('scroll'); h.advance(100);
    h.hidden(true); h.advance(5000);
    assert.equal(whale.getAttribute('data-whale-trick'), 'flip');
    assert.equal(h.frames.size, 0);
    h.hidden(false); h.setReduced(true); h.advance(17);
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    assert.equal(h.frames.size, 0);
});

for (const width of [1440, 390]) {
    test(`pointer clicks reverse both facing and swimming after the flip and turn at ${width}px`, () => {
        const h = swimming({ width }), whale = h.get('roamingWhale'), ctx = whale.getContext('2d');
        const positions = trackPosition(whale);
        let mirrors = 0;
        const originalScale = ctx.scale;
        ctx.scale = (sx, sy) => { if (sx === -1 && sy === 1) mirrors++; originalScale(sx, sy); };
        h.advance(50);
        const click = () => {
            const [clientX, clientY] = positions.at(-1);
            h.windowEvent('click', { target: h.get('whaleHome'), clientX, clientY });
        };
        const assertSwimming = heading => {
            const start = positions.length;
            mirrors = 0; h.advance(350);
            assert.equal(mirrors > 0, heading < 0, 'the whale should face the direction it swims');
            const movement = positions.slice(start);
            assert.ok((movement.at(-1)[0]-movement[0][0])*heading > 1,
                'the whale must travel in the new direction, including on a phone');
        };

        // Exercise actual pointer hit testing and repeat the complete sequence in both headings.
        for (let cycle = 0; cycle < 2; cycle++) {
            click(); assert.equal(whale.getAttribute('data-whale-trick'), 'flip'); h.advance(2300);
            assertSwimming(-1);
            click(); assert.equal(whale.getAttribute('data-whale-trick'), 'swoop'); h.advance(2700);
            click(); assert.equal(whale.getAttribute('data-whale-trick'), 'turn');
            h.advance(300); click(); // A tap during the turn must not restart or queue a reaction.
            h.advance(800);
            assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
            assertSwimming(1);
        }
    });
}

test('a slow rendering rate does not stretch a flip or landing into a long wait', () => {
    const h = harness();
    h.run('main.js'); h.run('whale.js'); h.enter(); h.get('whaleDrop').click();
    h.advance(2400, 100);
    assert.equal(h.get('whaleHome').getAttribute('data-whale-state'), 'swimming');
    const whale = h.get('roamingWhale'), positions = trackPosition(whale);
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' });
    h.advance(2300, 100);
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    const start = positions.length;
    h.advance(500, 100);
    const movement = positions.slice(start);
    assert.ok(movement.at(-1)[0] < movement[0][0]);
});

test('reduced motion keeps a bounded heart response, and ordinary controls do not trigger tricks', () => {
    const h = swimming({ reduced: true }), whale = h.get('roamingWhale');
    h.windowEvent('click', { target: h.get('whaleRoam'), clientX: 720, clientY: 585 });
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' }); h.advance(17);
    assert.match(h.get('whaleStatus').textContent, /heart/);
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    h.advance(1000);
    assert.equal(h.frames.size, 0);

    // The first click already reversed facing; the third restores it without ongoing animation.
    const ctx = whale.getContext('2d');
    let mirrors = 0;
    const originalScale = ctx.scale;
    ctx.scale = (sx, sy) => { if (sx === -1 && sy === 1) mirrors++; originalScale(sx, sy); };
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' }); h.advance(1000);
    assert.ok(mirrors > 0); mirrors = 0;
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' }); h.advance(17);
    assert.match(h.get('whaleStatus').textContent, /other way/);
    assert.equal(mirrors, 0);
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    h.advance(1000);
    assert.equal(h.frames.size, 0);
});
