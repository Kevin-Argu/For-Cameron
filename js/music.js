// Small, self-contained instruments: no recordings, downloads, or microphone.
(() => {
    'use strict';
    const section = document.getElementById('musicFinale');
    if (!section) return;
    const site = window.CameronSite;
    const buttons = [...section.querySelectorAll('[data-instrument]')];
    const holes = buttons.filter(button => button.getAttribute('data-instrument') === 'harmonica');
    const volume = document.getElementById('musicVolume');
    const status = document.getElementById('musicStatus');
    const blow = document.getElementById('harmonicaBlow');
    const draw = document.getElementById('harmonicaDraw');
    // Standard C Richter tuning, holes 1 through 10 (MIDI pitches).
    const tuning = {
        blow: [60, 64, 67, 72, 76, 79, 84, 88, 91, 96],
        draw: [62, 67, 71, 74, 77, 81, 83, 86, 89, 93]
    };
    let breath = 'blow';
    let context, master, compressor, reedWave;
    const active = new Map();
    const shortcuts = new Map(buttons.map(button => [button.getAttribute('data-key'), button]));
    const Audio = window.AudioContext || window.webkitAudioContext;
    const noteName = midi => ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][midi % 12] + (Math.floor(midi / 12) - 1);

    function setVolume() {
        if (master) master.gain.setTargetAtTime(Number(volume.value) / 100 * .65, context.currentTime, .02);
    }
    function prepareAudio() {
        if (!context) {
            context = new Audio();
            master = context.createGain();
            compressor = context.createDynamicsCompressor();
            compressor.threshold.value = -18;
            compressor.knee.value = 20;
            compressor.ratio.value = 6;
            compressor.attack.value = .003;
            compressor.release.value = .2;
            master.connect(compressor);
            compressor.connect(context.destination);
            setVolume();
            reedWave = context.createPeriodicWave(
                new Float32Array(7), new Float32Array([0, 1, .42, .24, .13, .07, .035]));
        }
        // Called only by a key or pointer gesture, never by a page observer.
        return context.state === 'running' ? null : context.resume();
    }

    function voice(midi, instrument) {
        const now = context.currentTime;
        const frequency = 440 * Math.pow(2, (midi - 69) / 12);
        const nodes = [], envelopes = [];
        const harmonic = instrument === 'harmonica';
        const partials = harmonic ? [1] : [1, 2, 3, 4];
        let released = false;
        partials.forEach((partial, index) => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.frequency.value = frequency * partial * (harmonic ? 1 : 1 + .00018 * partial * partial);
            if (harmonic) oscillator.setPeriodicWave(reedWave);
            else oscillator.type = 'sine';
            const peak = harmonic ? .24 : [.31, .11, .045, .02][index];
            gain.gain.setValueAtTime(.0001, now);
            gain.gain.linearRampToValueAtTime(peak, now + (harmonic ? .045 : .006));
            if (!harmonic) {
                gain.gain.exponentialRampToValueAtTime(peak * .42, now + .25);
                gain.gain.exponentialRampToValueAtTime(.0001, now + 3.8 / Math.sqrt(partial));
            }
            oscillator.connect(gain);
            gain.connect(master);
            oscillator.start(now);
            oscillator.stop(now + (harmonic ? 20 : 4));
            oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
            nodes.push(oscillator); envelopes.push(gain.gain);
            if (harmonic) {
                const vibrato = context.createOscillator();
                const depth = context.createGain();
                vibrato.frequency.value = 5.2;
                depth.gain.value = 5;
                vibrato.connect(depth); depth.connect(oscillator.detune);
                vibrato.start(now); vibrato.stop(now + 20);
                vibrato.onended = () => { vibrato.disconnect(); depth.disconnect(); };
                nodes.push(vibrato);
            }
        });
        return () => {
            if (released) return;
            released = true;
            const end = context.currentTime;
            envelopes.forEach(gain => {
                if (typeof gain.cancelAndHoldAtTime === 'function') gain.cancelAndHoldAtTime(end);
                else {
                    const value = Math.max(.0001, gain.value);
                    gain.cancelScheduledValues(end); gain.setValueAtTime(value, end);
                }
                gain.linearRampToValueAtTime(0, end + .15);
            });
            nodes.forEach(node => node.stop(end + .18));
        };
    }

    function release(token) {
        const held = active.get(token);
        if (!held) return;
        active.delete(token);
        clearTimeout(held.timer);
        held.stop?.();
        if (![...active.values()].some(item => item.button === held.button)) held.button.classList.remove('is-playing');
    }
    function releaseAll(instrument) {
        for (const [token, held] of active) if (!instrument || held.instrument === instrument) release(token);
    }
    function press(button, token, duration) {
        if (!site.entered || document.hidden || active.has(token) || !Audio) return;
        if (active.size >= 16) release(active.keys().next().value);
        const instrument = button.getAttribute('data-instrument');
        const midi = instrument === 'piano' ? Number(button.getAttribute('data-midi'))
            : tuning[breath][Number(button.getAttribute('data-hole'))];
        const held = { button, instrument, stop: null, timer: null };
        active.set(token, held);
        button.classList.add('is-playing');
        function begin() {
            // A released tap must not start a delayed, stuck note after resume.
            if (active.get(token) !== held) return;
            held.stop = voice(midi, instrument);
            status.textContent = (instrument === 'piano' ? 'piano · ' : 'harmonica · ' + breath + ' · ') + noteName(midi);
            held.timer = setTimeout(() => release(token), duration || (instrument === 'piano' ? 4200 : 19500));
        }
        function failed() {
            release(token);
            status.textContent = 'Sound couldn’t start. Tap a note to try again.';
        }
        try {
            const resumed = prepareAudio();
            if (resumed) resumed.then(begin).catch(failed);
            else begin();
        } catch (_) { failed(); }
    }

    buttons.forEach(button => {
        button.addEventListener('pointerdown', event => {
            if (event.button > 0) return;
            event.preventDefault();
            button.focus({ preventScroll: true });
            button.setPointerCapture(event.pointerId);
            press(button, 'pointer:' + event.pointerId);
        });
        for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
            button.addEventListener(type, event => release('pointer:' + event.pointerId));
        }
        // Native keyboard activation and assistive-technology clicks have no pointer.
        button.addEventListener('click', event => {
            if (event.detail === 0) press(button, 'tap:' + button.getAttribute('data-key'), 650);
        });
    });
    section.addEventListener('keydown', event => {
        if (event.key === 'Escape') { releaseAll(); return; }
        if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
        const key = event.key.toLowerCase();
        const button = shortcuts.get(key);
        if (!button) return;
        event.preventDefault();
        press(button, 'key:' + key);
    });
    window.addEventListener('keyup', event => release('key:' + event.key.toLowerCase()));
    window.addEventListener('blur', () => releaseAll());
    window.addEventListener('pagehide', () => releaseAll());
    document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => { if (!entries[0].isIntersecting) releaseAll(); }).observe(section);
    }
    function setBreath(next) {
        releaseAll('harmonica');
        breath = next;
        blow.setAttribute('aria-pressed', String(next === 'blow'));
        draw.setAttribute('aria-pressed', String(next === 'draw'));
        holes.forEach((button, i) => button.setAttribute('aria-label', 'Harmonica hole ' + (i + 1) + ', ' + next + ' ' + noteName(tuning[next][i])));
        status.textContent = 'harmonica · ' + next;
    }
    blow.addEventListener('click', () => setBreath('blow'));
    draw.addEventListener('click', () => setBreath('draw'));
    volume.addEventListener('input', setVolume);
    if (!Audio) {
        buttons.forEach(button => { button.disabled = true; });
        status.textContent = 'Audio isn’t available in this browser.';
    }
})();
