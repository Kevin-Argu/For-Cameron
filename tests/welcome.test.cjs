const test = require('node:test');
const assert = require('node:assert/strict');
const { harness } = require('./harness.cjs');

function welcome(options = {}) {
    const h = harness({ desmos: false, ...options });
    h.run('main.js');
    h.run('peanut-gate.js');
    return h;
}

test('entry waits for both George hops, ignores child animations and repeated clicks, then restores lily focus', () => {
    const h = welcome();
    const gate = h.get('peanutGate'), george = h.get('welcomeGeorge');
    assert.equal(gate.classList.contains('is-george-hopping'), false);
    h.get('enterPeanutFree').click();
    assert.equal(gate.classList.contains('is-george-hopping'), true);
    assert.equal(h.context.CameronSite.entered, false);
    assert.equal(h.get('welcomeGeorgeScene').scrolledIntoView, true);
    h.advance(450);
    h.get('enterPeanutFree').click();
    george.dispatchEvent({ type: 'animationend', target: george.querySelector('.peanut-george-body'), animationName: 'george-welcome-bound' });
    assert.equal(gate.classList.contains('is-closing'), false);
    george.dispatchEvent({ type: 'animationend', animationName: 'george-welcome-travel' });
    assert.equal(gate.classList.contains('is-closing'), true);
    assert.equal(h.context.CameronSite.entered, false);
    gate.dispatchEvent({ type: 'transitionend', propertyName: 'opacity' });
    assert.equal(h.context.CameronSite.entered, true);
    assert.equal(gate.hidden, true);
    assert.equal(h.document.querySelector('main').inert, false);
    assert.equal(h.document.activeElement, h.get('waterLilies'));
});

test('missing animation events cannot keep the visitor locked on the welcome', () => {
    const h = welcome();
    let entries = 0;
    h.document.addEventListener('cameron:entered', () => entries++);
    h.get('enterPeanutFree').click();
    h.advance(700);
    h.get('enterPeanutFree').click();
    h.advance(1000);
    assert.equal(h.context.CameronSite.entered, true);
    assert.equal(h.get('peanutGate').hidden, true);
    assert.equal(entries, 1);
    h.advance(2000);
    assert.equal(entries, 1);
});

test('reduced motion enters immediately, including a preference change during hopping', () => {
    for (const reduced of [true, false]) {
        const h = welcome({ reduced });
        h.get('enterPeanutFree').click();
        if (!reduced) {
            h.advance(200);
            assert.equal(h.context.CameronSite.entered, false);
            h.setReduced(true);
        }
        assert.equal(h.context.CameronSite.entered, true);
        assert.equal(h.get('peanutGate').hidden, true);
        assert.equal(h.document.activeElement, h.get('waterLilies'));
    }
});
