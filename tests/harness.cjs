// Minimal DOM/Desmos doubles for application-logic tests; this does not render a browser.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function harness({ reduced = false, desmos = true, hash = '', root = path.resolve(__dirname, '..') } = {}) {
    let document, clock = 0, nextId = 1;
    const frames = new Map(), timers = new Map(), intersections = [], resizes = [], calculators = [];
    const canvasCalls = new Map();
    class Events {
        constructor() { this.listeners = new Map(); }
        addEventListener(type, callback, options = {}) {
            if (!this.listeners.has(type)) this.listeners.set(type, []);
            this.listeners.get(type).push({ callback, once: !!options.once });
        }
        removeEventListener(type, callback) {
            this.listeners.set(type, (this.listeners.get(type) || []).filter(item => item.callback !== callback));
        }
        dispatchEvent(event) {
            event.target ||= this;
            event.preventDefault ||= function () { this.defaultPrevented = true; };
            event.stopPropagation ||= function () {};
            for (const item of [...(this.listeners.get(event.type) || [])]) {
                if (item.once) this.removeEventListener(event.type, item.callback);
                item.callback(event);
            }
            return !event.defaultPrevented;
        }
    }
    class Element extends Events {
        constructor(tag) {
            super(); this.tagName = tag.toLowerCase(); this.children = []; this.attributes = {};
            this.style = {}; this.hidden = false; this.disabled = false; this.inert = false;
            this.className = ''; this.width = 900; this.height = 666;
            this.rect = { width: 1440, height: 900, top: 0, bottom: 900, left: 0, right: 1440 };
            this.classList = {
                contains: name => this.className.split(/\s+/).includes(name),
                add: name => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), name])].join(' '); },
                remove: name => { this.className = this.className.split(/\s+/).filter(x => x !== name).join(' '); },
                toggle: (name, force) => { const add = force ?? !this.classList.contains(name); this.classList[add ? 'add' : 'remove'](name); return add; }
            };
        }
        setAttribute(key, value) {
            this.attributes[key] = String(value);
            if (key === 'class') this.className = String(value);
            if (['id', 'content'].includes(key)) this[key] = String(value);
            if (['hidden', 'disabled', 'inert'].includes(key)) this[key] = true;
        }
        getAttribute(key) { return key === 'class' ? this.className : this.attributes[key] ?? null; }
        removeAttribute(key) { delete this.attributes[key]; }
        appendChild(child) { this.children.push(child); child.parent = this; return child; }
        remove() { if (this.parent) this.parent.children = this.parent.children.filter(x => x !== this); }
        contains(node) { return this === node || this.children.some(child => child.contains(node)); }
        matches(selector) {
            const attr = selector.match(/\[([^=\]]+)(?:="([^"]*)")?\]/);
            const bare = selector.replace(/\[[^\]]+\]/g, '');
            if (attr && (this.getAttribute(attr[1]) === null || (attr[2] !== undefined && this.getAttribute(attr[1]) !== attr[2]))) return false;
            if (bare.startsWith('.')) return this.classList.contains(bare.slice(1));
            if (bare.startsWith('#')) return this.id === bare.slice(1);
            return !bare || this.tagName === bare;
        }
        querySelectorAll(selector) {
            const results = [];
            for (const child of this.children) {
                if (selector.split(',').some(s => child.matches(s.trim()))) results.push(child);
                results.push(...child.querySelectorAll(selector));
            }
            return results;
        }
        querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
        closest(selector) { return selector.split(',').some(s => this.matches(s.trim())) ? this : this.parent?.closest(selector) || null; }
        focus() { document.activeElement = this; }
        click() { if (!this.disabled) this.dispatchEvent({ type: 'click', target: this }); }
        scrollIntoView() { this.scrolledIntoView = true; }
        setPointerCapture() {}
        getBoundingClientRect() { return this.rect; }
        set innerHTML(html) { this.children = []; parse(html, this); }
        getContext() {
            if (this.context) return this.context;
            const calls = { fills: 0, clears: 0, translations: [], clearsAt: [] };
            canvasCalls.set(this, calls);
            this.context = new Proxy({
                measureText: () => ({ width: 7.41 }),
                fillText: () => calls.fills++,
                clearRect: (...args) => { calls.clears++; calls.clearsAt.push(args); },
                translate: (...args) => calls.translations.push(args)
            }, { get: (obj, key) => obj[key] ?? (() => {}), set: (obj, key, value) => (obj[key] = value, true) });
            return this.context;
        }
    }
    function parse(html, rootNode) {
        const stack = [rootNode];
        for (const token of html.matchAll(/<!--[\s\S]*?-->|<[^>]+>/g)) {
            const text = token[0];
            if (/^<!/.test(text)) continue;
            if (/^<\//.test(text)) {
                const closing = text.match(/^<\/([\w-]+)/)?.[1];
                const at = stack.findLastIndex(el => el.tagName === closing);
                if (at > 0) stack.length = at;
                continue;
            }
            const tag = text.match(/^<([\w-]+)/)?.[1];
            if (!tag) continue;
            const el = new Element(tag);
            for (const attr of text.slice(tag.length + 1, -1).matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) el.setAttribute(attr[1], attr[2] ?? '');
            stack.at(-1).appendChild(el);
            if (!['meta','link','input','br','img','hr'].includes(tag) && !text.endsWith('/>')) stack.push(el);
        }
    }
    document = new Element('document');
    parse(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), document);
    document.getElementById = id => document.querySelector('#' + id);
    document.createElement = tag => new Element(tag);
    document.documentElement = document.querySelector('html');
    document.head = document.querySelector('head');
    document.body = document.querySelector('body');
    document.hidden = false;
    const motion = new Events(); motion.matches = reduced;
    const windowEvents = new Events();
    const Desmos = { GraphingCalculator(element, options) {
        const expressions = new Map(), observed = new Map();
        const calc = {
            element, options, expressions, settings: { ...options }, bounds: { left: -10, right: 10, bottom: -6, top: 6 }, batches: 0,
            updateSettings(settings) { Object.assign(this.settings, settings); },
            setExpression(expression) { expressions.set(expression.id, { ...expressions.get(expression.id), ...expression }); },
            setExpressions(list) { this.batches++; list.forEach(expression => this.setExpression(expression)); },
            getExpressions() { return [...expressions.values()]; },
            setMathBounds(bounds) { const changed = JSON.stringify(bounds) !== JSON.stringify(this.bounds); this.bounds = bounds; if (changed) observed.get('graphpaperBounds')?.(); },
            observe(name, callback) { observed.set(name, callback); },
            observeEvent(name, callback) { this.userChange = callback; },
            mathToPixels({ x, y }) { const r = element.rect, b = this.bounds; return { x: (x - b.left) / (b.right - b.left) * r.width, y: (b.top - y) / (b.top - b.bottom) * r.height }; }
        };
        calculators.push(calc); return calc;
    } };
    const context = {
        console, document, Math, Map, Set, Promise, location: { hash }, innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1, scrollY: 0,
        matchMedia: () => motion, scrollTo() {},
        addEventListener: windowEvents.addEventListener.bind(windowEvents),
        requestAnimationFrame: callback => { const id = nextId++; frames.set(id, callback); return id; },
        cancelAnimationFrame: id => frames.delete(id),
        setTimeout: (callback, ms) => { const id = nextId++; timers.set(id, { at: clock + ms, callback }); return id; },
        clearTimeout: id => timers.delete(id),
        CustomEvent: class { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } },
        IntersectionObserver: class { constructor(callback, options) { this.callback = callback; this.options = options; this.targets = []; intersections.push(this); } observe(el) { this.targets.push(el); } },
        ResizeObserver: class { constructor(callback) { this.callback = callback; this.targets = []; resizes.push(this); } observe(el) { this.targets.push(el); } }
    };
    context.window = context;
    if (desmos) context.Desmos = Desmos;
    vm.createContext(context);
    function get(id) { return document.getElementById(id); }
    return {
        context, document, frames, calculators, canvasCalls, motion, get,
        run(file) { vm.runInContext(fs.readFileSync(path.join(root, 'js', file), 'utf8'), context, { filename: file }); },
        evaluate(code) { return vm.runInContext(code, context); },
        intersect(id, ratio) { const el = get(id); intersections.filter(o => o.targets.includes(el)).forEach(o => o.callback([{ target: el, isIntersecting: ratio > 0, intersectionRatio: ratio }])); },
        resize(id, width, height) { const el = get(id); el.rect = { ...el.rect, width, height, bottom: el.rect.top + height }; resizes.filter(o => o.targets.includes(el)).forEach(o => o.callback([{ target: el }])); },
        windowEvent(type, extra = {}) { windowEvents.dispatchEvent({ type, ...extra }); },
        enter() { context.CameronSite.entered = true; document.body.classList.remove('peanut-lock'); document.dispatchEvent({ type: 'cameron:entered' }); },
        hidden(hidden) { document.hidden = hidden; document.dispatchEvent({ type: 'visibilitychange' }); },
        setReduced(matches) { motion.matches = matches; motion.dispatchEvent({ type: 'change', matches }); },
        advance(ms, step = 16.67) {
            const end = clock + ms;
            while (clock < end) {
                clock = Math.min(end, clock + step);
                for (const [id, timer] of [...timers]) if (timer.at <= clock) { timers.delete(id); timer.callback(); }
                const work = [...frames]; frames.clear(); work.forEach(([, callback]) => callback(clock));
            }
        },
        requests() { return document.head.children.filter(el => el.tagName === 'script' && el.src); },
        succeedLibrary() { context.Desmos = Desmos; this.requests().at(-1).onload(); }
    };
}
module.exports = { harness };

