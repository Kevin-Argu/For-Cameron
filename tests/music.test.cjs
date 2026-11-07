const test = require('node:test');
const assert = require('node:assert/strict');
const { harness } = require('./harness.cjs');
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

function setup({ suspended = false, unsupported = false } = {}) {
    const h = harness();
    const contexts = [], oscillators = [], gains = [];
    let resumeAudio;
    class Param {
        constructor() { this.value = 0; this.events = []; }
        setValueAtTime(value, time) { this.value = value; this.events.push(['set', value, time]); }
        linearRampToValueAtTime(value, time) { this.events.push(['linear', value, time]); }
        exponentialRampToValueAtTime(value, time) { this.events.push(['exponential', value, time]); }
        setTargetAtTime(value) { this.value = value; }
        cancelAndHoldAtTime() {}
    }
    class Node {
        constructor() {
            this.gain = new Param(); this.frequency = new Param(); this.detune = new Param();
            this.connections = []; this.stops = []; this.starts = [];
        }
        connect(target) { this.connections.push(target); }
        disconnect() { this.disconnected = true; }
        setPeriodicWave(wave) { this.wave = wave; }
        start(time) { this.starts.push(time); }
        stop(time) { this.stops.push(time); }
    }
    class AudioContext {
        constructor() { this.state = suspended ? 'suspended' : 'running'; this.currentTime = 0; this.destination = {}; contexts.push(this); }
        createGain() { const node = new Node(); gains.push(node); return node; }
        createOscillator() { const node = new Node(); oscillators.push(node); return node; }
        createDynamicsCompressor() { const n = new Node(); for (const p of ['threshold','knee','ratio','attack','release']) n[p] = new Param(); return n; }
        createPeriodicWave(real, imag) { return { real, imag }; }
        resume() { return new Promise(resolve => { resumeAudio = () => { this.state = 'running'; resolve(); }; }); }
    }
    if (!unsupported) h.context.AudioContext = AudioContext;
    h.run('main.js');
    h.get('musicVolume').value = '35';
    h.run('music.js');
    const button = key => h.document.querySelector('[data-key="' + key + '"]');
    const down = (key, id = 1) => button(key).dispatchEvent({ type: 'pointerdown', pointerId: id, button: 0 });
    const up = (key, id = 1) => button(key).dispatchEvent({ type: 'pointerup', pointerId: id });
    return { h, contexts, oscillators, gains, button, down, up, resume: () => resumeAudio() };
}

test('instruments are silent on load; piano chords start on interaction and release every partial', () => {
    const t = setup();
    assert.equal(t.contexts.length, 0);
    t.down('a'); assert.equal(t.contexts.length, 0);
    t.h.enter(); t.down('a', 1); t.down('d', 2);
    assert.equal(t.contexts.length, 1);
    assert.equal(t.oscillators.length, 8);
    assert.ok(t.button('a').classList.contains('is-playing'));
    assert.ok(Math.abs(t.oscillators[0].frequency.value - 261.63) < .1);
    t.up('a', 1); t.up('d', 2);
    assert.ok(t.oscillators.every(node => node.stops.at(-1) === .18));
    assert.equal(t.button('a').classList.contains('is-playing'), false);
});

test('harmonica blow/draw selects Richter notes and releases the previous reed', () => {
    const t = setup(); t.h.enter(); t.down('1');
    assert.ok(t.oscillators[0].wave);
    assert.ok(Math.abs(t.oscillators[0].frequency.value - 261.63) < .1);
    t.h.get('harmonicaDraw').click();
    assert.equal(t.button('1').classList.contains('is-playing'), false);
    assert.equal(t.h.get('harmonicaDraw').getAttribute('aria-pressed'), 'true');
    assert.equal(t.button('1').getAttribute('aria-label'), 'Harmonica hole 1, draw D4');
    t.down('1');
    assert.ok(Math.abs(t.oscillators[2].frequency.value - 293.66) < .1);
    t.h.windowEvent('blur');
    assert.ok(t.oscillators.every(node => node.stops.at(-1) === .18));
});

test('keyboard repeat, pointer cancellation, offscreen exit, and tab hiding cannot leave notes held', () => {
    const t = setup(); t.h.enter();
    const section = t.h.get('musicFinale');
    section.dispatchEvent({ type: 'keydown', key: 'a', target: t.button('a') });
    section.dispatchEvent({ type: 'keydown', key: 'a', repeat: true, target: t.button('a') });
    assert.equal(t.oscillators.length, 4);
    t.h.windowEvent('keyup', { key: 'a' });
    assert.equal(t.button('a').classList.contains('is-playing'), false);
    t.down('2'); t.button('2').dispatchEvent({ type: 'pointercancel', pointerId: 1 });
    assert.equal(t.button('2').classList.contains('is-playing'), false);
    t.down('3'); t.h.intersect('musicFinale', 0);
    assert.equal(t.button('3').classList.contains('is-playing'), false);
    t.down('4'); t.h.hidden(true);
    assert.equal(t.button('4').classList.contains('is-playing'), false);
    assert.ok(t.oscillators.every(node => node.stops.at(-1) === .18));
});

test('a tap released before audio resumes cannot create a delayed note', async () => {
    const t = setup({ suspended: true }); t.h.enter(); t.down('a'); t.up('a');
    t.resume(); await flush();
    assert.equal(t.oscillators.length, 0);
    assert.equal(t.button('a').classList.contains('is-playing'), false);
});

test('accessible clicks play a bounded note, volume reaches mute, and unavailable audio is explained', () => {
    const t = setup(); t.h.enter();
    t.button('a').dispatchEvent({ type: 'click', detail: 0 });
    assert.equal(t.oscillators.length, 4);
    t.h.advance(700);
    assert.equal(t.button('a').classList.contains('is-playing'), false);
    t.h.get('musicVolume').value = '0';
    t.h.get('musicVolume').dispatchEvent({ type: 'input' });
    assert.equal(t.gains[0].gain.value, 0);
    const missing = setup({ unsupported: true });
    assert.equal(missing.button('a').disabled, true);
    assert.match(missing.h.get('musicStatus').textContent, /isn’t available/);
});
