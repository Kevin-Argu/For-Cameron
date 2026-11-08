// Self-playing little tunes and playable notes, with no downloads or microphone.
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
    const playControls = [...section.querySelectorAll('[data-play-instrument]')];
    const scenes = {
        piano: section.querySelector('.piano-instrument'),
        harmonica: section.querySelector('.harmonica-instrument')
    };
    const animatedNotes = new Set();
    let recital = null;
    // Small original phrases keep this page self-contained. The duet has one
    // shared step clock, so its accompaniment and melody cannot drift apart.
    const tunes = {
        piano: { beat: 440, steps: [
            [[60, 64], 1], [67, 1], [72, 1.5], [71, .5], [69, 1], [67, 1],
            [[57, 64], 1], [69, 1], [72, 1], [76, 1], [74, 1], [72, 1],
            [[53, 60], 1], [65, 1], [69, 1.5], [67, .5], [64, 1], [62, 1],
            [[55, 62], 1], [67, 1], [71, 1], [74, 1], [[60, 64, 67], 3]
        ] },
        harmonica: { beat: 330, steps: [
            [60, 1], [64, 1], [67, 1.5], [64, .5], [60, 1], [62, 1],
            [64, 1], [67, 1], [72, 2], [71, 1], [67, 1], [64, 2],
            [65, 1], [69, 1], [67, 1.5], [64, .5], [62, 1], [67, 1], [60, 3]
        ] }
    };
    tunes.duet = { beat: 460, steps: [
        [{ piano: [60, 64], harmonica: 67 }, 1], [{ piano: 67, harmonica: 72 }, 1],
        [{ piano: [60, 64], harmonica: 76 }, 1.5], [{ piano: 67, harmonica: 74 }, .5],
        [{ piano: [60, 64], harmonica: 72 }, 1], [{ piano: 67, harmonica: 67 }, 1],
        [{ piano: [62, 65], harmonica: 71 }, 1], [{ piano: 69, harmonica: 72 }, 1],
        [{ piano: [62, 65], harmonica: 74 }, 2], [{ piano: 69, harmonica: 72 }, 1],
        [{ piano: [60, 65], harmonica: 71 }, 1], [{ piano: 67, harmonica: 67 }, 1],
        [{ piano: [60, 64], harmonica: 64 }, 1], [{ piano: 67, harmonica: 67 }, 1],
        [{ piano: [62, 67], harmonica: 71 }, 1], [{ piano: 65, harmonica: 74 }, 1],
        [{ piano: [60, 64, 67], harmonica: 72 }, 3]
    ] };
    // Standard C Richter tuning, holes 1 through 10 (MIDI pitches).
    const tuning = {
        blow: [60, 64, 67, 72, 76, 79, 84, 88, 91, 96],
        draw: [62, 67, 71, 74, 77, 81, 83, 86, 89, 93]
    };
    let breath = 'blow';
    let context, master, compressor, reedWave;
    const active = new Map();
    const shortcuts = new Map(buttons.filter(button => button.getAttribute('data-key'))
        .map(button => [button.getAttribute('data-key'), button]));
    const Audio = window.AudioContext || window.webkitAudioContext;
    const pianoMechanisms = new Map([...section.querySelectorAll('[data-piano-note]')]
        .map(part => [part.getAttribute('data-piano-note'), part]));
    const noteName = midi => ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][midi % 12] + (Math.floor(midi / 12) - 1);

    function setPlaying(button, playing) {
        button.classList.toggle('is-playing', playing);
        if (button.getAttribute('data-instrument') === 'piano') {
            pianoMechanisms.get(button.getAttribute('data-midi'))?.classList.toggle('is-playing', playing);
        }
    }

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

    function voice(midi, instrument, level = 1) {
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
            const peak = (harmonic ? .24 : [.31, .11, .045, .02][index]) * level;
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

    function clearDecorativeNotes() {
        for (const button of animatedNotes) {
            button.classList.remove('is-performing-note');
            if (button.getAttribute('data-instrument') === 'piano') {
                pianoMechanisms.get(button.getAttribute('data-midi'))?.classList.remove('is-performing-note');
            }
        }
        animatedNotes.clear();
    }
    function updatePlayControls() {
        for (const control of playControls) {
            const instrument = control.getAttribute('data-play-instrument');
            const playing = recital?.instrument === instrument;
            const name = instrument === 'duet' ? 'piano and harmonica together' : instrument + ' solo';
            control.setAttribute('aria-pressed', String(playing));
            control.setAttribute('aria-label', (playing ? 'Stop ' : 'Play ') + name);
            const label = control.querySelector('.play-label');
            const icon = control.querySelector('.play-icon');
            if (label) label.textContent = playing ? 'stop playing' : 'play together';
            if (icon) icon.textContent = playing ? '□' : '▷';
        }
        for (const instrument of ['piano', 'harmonica']) {
            scenes[instrument].classList.toggle('is-performing',
                recital?.instrument === instrument || recital?.instrument === 'duet');
        }
    }
    function stopRecital() {
        const previous = recital;
        recital = null;
        if (previous) {
            previous.timers.forEach(clearTimeout);
            previous.voices.forEach(stop => stop());
            previous.timers.clear();
            previous.voices.clear();
        }
        clearDecorativeNotes();
        updatePlayControls();
        if (previous) status.textContent = 'piano & harmonica';
    }
    // Every queued step belongs to one session. A switch, stop, or hidden tab
    // invalidates both pending audio resumes and all future notes/animations.
    function later(session, callback, delay) {
        const timer = setTimeout(() => {
            session.timers.delete(timer);
            if (recital === session) callback();
        }, delay);
        session.timers.add(timer);
        return timer;
    }
    function animateRecital(session) {
        clearDecorativeNotes();
        if (site.reducedMotion.matches || recital !== session) return;
        // Use the notes that are actually sounding. Solo bass notes outside the
        // visible two octaves are shown at the same pitch class on this keyboard.
        for (const [instrument, midi] of session.currentNotes) {
            let button;
            if (instrument === 'piano') {
                const displayed = midi < 60 ? midi + 12 * Math.ceil((60 - midi) / 12)
                    : midi > 84 ? 72 + midi % 12 : midi;
                button = buttons.find(item => item.getAttribute('data-instrument') === 'piano'
                    && Number(item.getAttribute('data-midi')) === displayed);
            } else {
                let hole = tuning.blow.indexOf(midi);
                if (hole < 0) hole = tuning.draw.indexOf(midi);
                button = holes[hole];
            }
            if (!button) continue;
            animatedNotes.add(button);
            button.classList.add('is-performing-note');
            if (instrument === 'piano') {
                pianoMechanisms.get(button.getAttribute('data-midi'))?.classList.add('is-performing-note');
            }
        }
    }
    function playStep(session, index) {
        const tune = tunes[session.instrument];
        if (index >= tune.steps.length) {
            later(session, stopRecital, 350);
            return;
        }
        const [notes, beats] = tune.steps[index];
        const duration = beats * tune.beat;
        const parts = session.instrument === 'duet' ? Object.entries(notes) : [[session.instrument, notes]];
        session.currentNotes = [];
        // Both parts start in this callback and share the same duration and stop
        // session. Stopping, leaving, or manually playing a key cancels them both.
        for (const [instrument, part] of parts) {
            const pitches = Array.isArray(part) ? part : [part];
            for (const midi of pitches) {
                const level = session.instrument === 'duet' ? (instrument === 'piano' ? .65 : .6) : 1;
                const stop = voice(midi, instrument, level);
                session.voices.add(stop);
                session.currentNotes.push([instrument, midi]);
                later(session, () => { stop(); session.voices.delete(stop); }, duration * .86);
            }
        }
        animateRecital(session);
        later(session, () => { session.currentNotes = []; clearDecorativeNotes(); }, duration * .86);
        later(session, () => playStep(session, index + 1), duration);
    }
    function toggleRecital(instrument) {
        if (!site.entered || document.hidden || !Audio) return;
        if (recital?.instrument === instrument) { stopRecital(); return; }
        stopRecital();
        releaseAll();
        const session = { instrument, timers: new Set(), voices: new Set(), started: false, currentNotes: [] };
        recital = session;
        updatePlayControls();
        function begin() {
            if (recital !== session) return;
            session.started = true;
            status.textContent = instrument === 'duet' ? 'a little duet · piano & harmonica' : instrument + ' solo';
            playStep(session, 0);
        }
        function failed() {
            if (recital !== session) return;
            stopRecital();
            status.textContent = 'Sound couldn’t start. Tap the instrument to try again.';
        }
        try {
            const resumed = prepareAudio();
            if (resumed) resumed.then(begin).catch(failed);
            else begin();
        } catch (_) { failed(); }
    }
    playControls.forEach(control => control.addEventListener('click', () => {
        toggleRecital(control.getAttribute('data-play-instrument'));
    }));
    site.reducedMotion.addEventListener('change', () => {
        clearDecorativeNotes();
        if (!recital?.started) return;
        if (!site.reducedMotion.matches) animateRecital(recital);
    });

    function release(token) {
        const held = active.get(token);
        if (!held) return;
        active.delete(token);
        clearTimeout(held.timer);
        held.stop?.();
        if (![...active.values()].some(item => item.button === held.button)) setPlaying(held.button, false);
    }
    function releaseAll(instrument) {
        for (const [token, held] of active) if (!instrument || held.instrument === instrument) release(token);
    }
    function press(button, token, duration) {
        if (!site.entered || document.hidden || active.has(token) || !Audio) return;
        // Touching an individual key takes over from the automatic tune.
        if (recital) stopRecital();
        if (active.size >= 16) release(active.keys().next().value);
        const instrument = button.getAttribute('data-instrument');
        const midi = instrument === 'piano' ? Number(button.getAttribute('data-midi'))
            : tuning[breath][Number(button.getAttribute('data-hole'))];
        const held = { button, instrument, stop: null, timer: null };
        active.set(token, held);
        setPlaying(button, true);
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
            if (event.detail === 0) press(button, 'tap:' + button.getAttribute('data-instrument') + ':' + (button.getAttribute('data-midi') || button.getAttribute('data-hole')), 650);
        });
    });
    section.addEventListener('keydown', event => {
        if (event.key === 'Escape') { silence(); return; }
        if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
        const key = event.key.toLowerCase();
        const button = shortcuts.get(key);
        if (!button) return;
        event.preventDefault();
        press(button, 'key:' + key);
    });
    window.addEventListener('keyup', event => release('key:' + event.key.toLowerCase()));
    function silence() { stopRecital(); releaseAll(); }
    window.addEventListener('blur', silence);
    window.addEventListener('pagehide', silence);
    document.addEventListener('visibilitychange', () => { if (document.hidden) silence(); });
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(entries => { if (!entries[0].isIntersecting) silence(); }).observe(section);
    }
    function setBreath(next) {
        if (recital?.instrument === 'harmonica' || recital?.instrument === 'duet') stopRecital();
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
        [...buttons, ...playControls].forEach(button => { button.disabled = true; });
        status.textContent = 'Audio isn’t available in this browser.';
    }
})();

