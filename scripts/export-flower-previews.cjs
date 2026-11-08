// Regenerate the cached entrance artwork from the same geometry as the live garden.
// Run with Node, open /flower-export.html in the local preview, export/download,
// then run this script with --import followed by the downloaded JSON file.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const ids = ['sakura', 'petunia', 'plumeria', 'hibiscus', 'lilac', 'pansy',
    'sunflower', 'chrysanthemum', 'marigold', 'daisy', 'forgetmenots', 'wisteria'];

if (process.argv[2] === '--import') {
    const assets = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
    if (assets.length !== ids.length || new Set(assets.map(asset => asset.id)).size !== ids.length) {
        throw new Error('Expected twelve unique flower previews.');
    }
    const output = path.join(root, 'assets/flower-previews');
    fs.mkdirSync(output, { recursive: true });
    for (const asset of assets) {
        if (!ids.includes(asset.id) || !asset.data.startsWith('data:image/png;base64,')) {
            throw new Error('Unrecognized flower preview.');
        }
        fs.writeFileSync(path.join(output, asset.id + '.png'), Buffer.from(asset.data.split(',')[1], 'base64'));
    }
    console.log('Saved twelve flower previews.');
} else {
    // The lightweight app harness collects the arranged expressions without a
    // browser. The export page uses real Desmos to evaluate and draw them.
    const { harness } = require('../tests/harness.cjs');
    const h = harness({ reduced: true });
    for (const file of ['main.js', 'flower-notes.js', 'bouquet-data.js', 'flower-details.js', 'flowers.js']) h.run(file);
    h.context.CameronGraphs.flowers();
    h.intersect('gardenStart', 1);
    const calc = h.calculators[0];
    const groups = h.document.querySelector('.flower-click-layer').children.map(button => ({
        id: button.getAttribute('aria-label').replace('Explore ', '').toLowerCase().replace(/-/g, ''),
        left: parseFloat(button.style.left) / 1440 * 1200,
        top: parseFloat(button.style.top) / 900 * 750,
        width: parseFloat(button.style.width) / 1440 * 1200,
        height: parseFloat(button.style.height) / 900 * 750
    }));
    const key = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        .match(/name="desmos-api-key" content="([^"]+)"/)[1];
    const data = JSON.stringify({ expressions: calc.getExpressions(), settings: calc.settings, bounds: calc.bounds, groups });
    const html = `<!doctype html><meta charset="utf-8"><title>Export flower previews</title>
<p id="state">Preparing original flower equations…</p><button id="export" disabled>Export flower previews</button>
<div id="calc" style="width:1200px;height:750px"></div><div id="preview"></div>
<script src="https://www.desmos.com/api/v1.12/calculator.js?apiKey=${key}"></script>
<script>
const data = ${data};
const status = document.getElementById('state');
const button = document.getElementById('export');
const calc = Desmos.GraphingCalculator(document.getElementById('calc'), data.settings);
calc.setMathBounds(data.bounds);
calc.setExpressions(data.expressions);
calc.asyncScreenshot({ format: 'svg', width: 1200, height: 750 }, svg => {
    document.getElementById('preview').innerHTML = svg;
    status.textContent = 'Ready to export twelve flower previews';
    button.disabled = false;
});
button.addEventListener('click', async () => {
    button.disabled = true;
    try {
        const svg = document.querySelector('#preview svg');
        const sketches = svg.querySelector('g[id^="expressions-"]');
        const assets = [];
        for (const group of data.groups) {
            status.textContent = 'Exporting ' + group.id;
            const copy = svg.cloneNode(false);
            copy.setAttribute('viewBox', [group.left, group.top, group.width, group.height].join(' '));
            copy.setAttribute('width', Math.ceil(group.width * 3));
            copy.setAttribute('height', Math.ceil(group.height * 3));
            copy.removeAttribute('style');
            for (const defs of svg.querySelectorAll('defs')) copy.appendChild(defs.cloneNode(true));
            let matched = 0;
            // Exported SVG titles identify the one-based expression index.
            // Validate the mapping here; production never depends on SVG internals.
            for (const node of sketches.children) {
                const index = Number(node.querySelector('title')?.textContent.replace('Expression ', '')) - 1;
                if (data.expressions[index]?.id.startsWith(group.id)) {
                    copy.appendChild(node.cloneNode(true));
                    matched++;
                }
            }
            if (!matched) throw new Error('Could not locate SVG curves for ' + group.id);
            const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml' }));
            const image = new Image();
            image.src = url;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = Math.ceil(group.width * 3);
            canvas.height = Math.ceil(group.height * 3);
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            assets.push({ id: group.id, width: canvas.width, height: canvas.height, data: canvas.toDataURL('image/png') });
        }
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([JSON.stringify(assets)], { type: 'application/json' }));
        link.download = 'flower-previews.json';
        link.textContent = 'Download flower previews';
        document.body.appendChild(link);
        status.textContent = 'Twelve flower previews ready';
    } catch (error) {
        status.textContent = 'Export failed: ' + error.message;
        button.disabled = false;
    }
});
</script>`;
    fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
    fs.writeFileSync(path.join(root, 'dist/flower-export.html'), html);
    console.log('Open /flower-export.html in the local preview.');
}
