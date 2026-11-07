// Verify the visible reactions, their lifecycle, and the motion-preference fallback.
const test = require('node:test');
const assert = require('node:assert/strict');
const { harness } = require('./harness.cjs');

function swimming(options) {
    const h = harness(options);
    h.run('main.js'); h.run('whale.js'); h.enter();
    h.get('whaleDrop').click(); h.advance(2300);
    return h;
}

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
    const firstMove = calls.translations.length;
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' }); h.advance(1100);
    assert.equal(whale.getAttribute('data-whale-trick'), 'swoop');
    const worldMoves = calls.translations.slice(firstMove).filter(([x]) => x > 600);
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

test('reduced motion keeps a bounded heart response, and ordinary controls do not trigger tricks', () => {
    const h = swimming({ reduced: true }), whale = h.get('roamingWhale');
    h.windowEvent('click', { target: h.get('whaleRoam'), clientX: 720, clientY: 585 });
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    whale.dispatchEvent({ type: 'keydown', key: 'Enter' }); h.advance(17);
    assert.match(h.get('whaleStatus').textContent, /heart/);
    assert.equal(whale.getAttribute('data-whale-trick'), 'idle');
    h.advance(1000);
    assert.equal(h.frames.size, 0);
});
