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

test('piano mechanics follow each key and stay raised until every input for that key releases', () => {
    const t = setup(); t.h.enter();
    const parts = midi => t.h.document.querySelector('[data-piano-note="' + midi + '"]');
    const raised = midi => parts(midi).classList.contains('is-playing');
    t.down('a', 1); t.down('d', 2);
    assert.equal(raised(60), true);
    assert.equal(raised(64), true);
    assert.equal(raised(61), false);
    t.h.get('musicFinale').dispatchEvent({ type: 'keydown', key: 'a', target: t.button('a') });
    t.up('a', 1);
    assert.equal(raised(60), true);
    t.h.windowEvent('keyup', { key: 'a' });
    assert.equal(raised(60), false);
    assert.equal(raised(64), true);
    t.h.intersect('musicFinale', 0);
    assert.equal(raised(64), false);
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
    assert.equal(missing.h.get('pianoPlay').disabled, true);
    assert.equal(missing.h.get('harmonicaPlay').disabled, true);
    assert.match(missing.h.get('musicStatus').textContent, /isn’t available/);
});

test('a click starts a tune; a manual note takes over and cancels the remaining phrase', () => {
    const t = setup();
    t.h.get('pianoPlay').click();
    assert.equal(t.contexts.length, 0);
    t.h.enter(); t.h.get('pianoPlay').click();
    assert.equal(t.h.get('pianoPlay').getAttribute('aria-pressed'), 'true');
    assert.ok(t.oscillators.length > 0);
    assert.ok(t.h.document.querySelectorAll('.is-performing-note').length > 0);
    t.h.advance(900);
    t.down('a'); t.up('a');
    assert.equal(t.h.get('pianoPlay').getAttribute('aria-pressed'), 'false');
    const count = t.oscillators.length;
    t.h.advance(3000);
    assert.equal(t.oscillators.length, count);
    assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
});

test('switching instruments stops the old phrase; clicking the active instrument stops both sound and movement', () => {
    const t = setup(); t.h.enter(); t.h.get('pianoPlay').click();
    const oldVoices = [...t.oscillators];
    t.h.get('harmonicaPlay').click();
    assert.equal(t.h.get('pianoPlay').getAttribute('aria-pressed'), 'false');
    assert.equal(t.h.get('harmonicaPlay').getAttribute('aria-pressed'), 'true');
    assert.ok(oldVoices.every(node => node.stops.at(-1) === .18));
    assert.equal(t.h.document.querySelector('.piano-instrument').classList.contains('is-performing'), false);
    t.h.advance(500); t.h.get('harmonicaPlay').click();
    const count = t.oscillators.length;
    t.h.advance(3000);
    assert.equal(t.oscillators.length, count);
    assert.equal(t.h.get('harmonicaPlay').getAttribute('aria-pressed'), 'false');
    assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
});

test('leaving, hiding, blurring, or pressing Escape cancels every scheduled tune note', () => {
    const exits = [
        h => h.intersect('musicFinale', 0), h => h.hidden(true),
        h => h.windowEvent('blur'), h => h.windowEvent('pagehide'),
        h => h.get('musicFinale').dispatchEvent({ type: 'keydown', key: 'Escape' })
    ];
    for (const exit of exits) {
        const t = setup(); t.h.enter(); t.h.get('pianoPlay').click();
        t.h.advance(500); exit(t.h);
        const count = t.oscillators.length;
        t.h.advance(2000);
        assert.equal(t.oscillators.length, count);
        assert.equal(t.h.get('pianoPlay').getAttribute('aria-pressed'), 'false');
        assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
    }
});

test('stopping while audio unlocks cannot start a delayed tune', async () => {
    const t = setup({ suspended: true }); t.h.enter();
    t.h.get('pianoPlay').click(); t.h.get('pianoPlay').click();
    t.resume(); await flush(); t.h.advance(2000);
    assert.equal(t.oscillators.length, 0);
    assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
});

test('reduced motion keeps the tune playable without moving keys', () => {
    const t = setup(); t.h.enter(); t.h.setReduced(true);
    t.h.get('pianoPlay').click(); t.h.advance(500);
    assert.ok(t.oscillators.length > 0);
    assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
    t.h.setReduced(false);
    assert.ok(t.h.document.querySelectorAll('.is-performing-note').length > 0);
    t.h.setReduced(true); t.h.advance(1000);
    assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
    assert.equal(t.h.get('pianoPlay').getAttribute('aria-pressed'), 'true');
});

test('a finished tune returns to rest without looping or leaving keys held', () => {
    const t = setup(); t.h.enter(); t.h.get('pianoPlay').click();
    t.h.advance(18000);
    assert.equal(t.h.get('pianoPlay').getAttribute('aria-pressed'), 'false');
    assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
    const count = t.oscillators.length;
    t.h.advance(2000);
    assert.equal(t.oscillators.length, count);
});

test('the duet starts both instruments and highlights the notes actually sounding', () => {
    const t = setup(); t.h.enter(); t.h.get('duetPlay').click();
    assert.equal(t.h.get('duetPlay').getAttribute('aria-pressed'), 'true');
    // Two piano notes have four partials each; one harmonica note has a reed and vibrato.
    assert.equal(t.oscillators.length, 10);
    assert.ok(t.oscillators[8].wave);
    assert.ok(Math.abs(t.oscillators[8].frequency.value - 392) < .1);
    assert.ok(t.button('a').classList.contains('is-performing-note'));
    assert.ok(t.button('d').classList.contains('is-performing-note'));
    assert.ok(t.button('3').classList.contains('is-performing-note'));
    assert.equal(t.button('s').classList.contains('is-performing-note'), false);
    t.h.advance(460);
    assert.ok(t.button('g').classList.contains('is-performing-note'));
    assert.ok(t.button('4').classList.contains('is-performing-note'));
    assert.equal(t.button('a').classList.contains('is-performing-note'), false);
});

test('duet stop, manual interruption, and leaving cancel both parts', () => {
    const exits = [
        t => t.h.get('duetPlay').click(),
        t => { t.down('a'); t.up('a'); },
        t => t.h.intersect('musicFinale', 0)
    ];
    for (const exit of exits) {
        const t = setup(); t.h.enter(); t.h.get('duetPlay').click();
        t.h.advance(500); exit(t);
        const count = t.oscillators.length;
        t.h.advance(20000);
        assert.equal(t.oscillators.length, count);
        assert.equal(t.h.get('duetPlay').getAttribute('aria-pressed'), 'false');
        assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
        assert.ok(t.oscillators.every(node => node.stops.at(-1) === .18));
    }
});

test('the duet finishes once and cancelling an audio unlock cannot revive it', async () => {
    const t = setup(); t.h.enter(); t.h.get('duetPlay').click(); t.h.advance(16000);
    assert.equal(t.h.get('duetPlay').getAttribute('aria-pressed'), 'false');
    assert.equal(t.h.document.querySelectorAll('.is-performing-note').length, 0);
    const count = t.oscillators.length; t.h.advance(5000);
    assert.equal(t.oscillators.length, count);
    const pending = setup({ suspended: true }); pending.h.enter();
    pending.h.get('duetPlay').click(); pending.h.get('duetPlay').click();
    pending.resume(); await flush(); pending.h.advance(2000);
    assert.equal(pending.oscillators.length, 0);
});

