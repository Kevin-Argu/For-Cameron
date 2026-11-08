"""Draw the welcome-page George as colored ASCII text, without photo assets.

Run: python3 scripts/draw-george-welcome.py
The outlines are sampling guides only. Both exported SVGs contain text alone;
the separate near ear can swing naturally during the two welcome hops.
"""
from html import escape
from math import sin, cos, sqrt, hypot, tau
from pathlib import Path

COLS, ROWS = 80, 54
DX, DY = 4, 4.5
WIDTH, HEIGHT = COLS * DX, ROWS * DY
PALETTES = {
    'fur': ('#918478', '#f2e7d6'),
    'shadow': ('#76695f', '#c9bba9'),
    'face': ('#786a61', '#ded0bc'),
    'muzzle': ('#51474a', '#968780'),
    'ear': ('#77675c', '#d4c0a9'),
    'inner': ('#615451', '#a79287'),
}


def tone(palette, amount):
    low, high = PALETTES[palette]
    amount = round(max(0, min(1, amount)) * 6) / 6
    return '#' + ''.join(f'{round(int(low[i:i+2], 16) * (1-amount) + int(high[i:i+2], 16) * amount):02x}' for i in (1, 3, 5))


def smooth(points):
    """Round the silhouette without exporting a solid vector outline."""
    result = []
    for i, b in enumerate(points):
        a, c, d = points[i-1], points[(i+1) % len(points)], points[(i+2) % len(points)]
        for step in range(10):
            t = step / 10
            result.append(tuple(.5 * (2*b[k] + (-a[k]+c[k])*t +
                (2*a[k]-5*b[k]+4*c[k]-d[k])*t*t +
                (-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t) for k in (0, 1)))
    return result


def inside(points, x, y):
    hit = False
    for a, b in zip(points, points[1:] + points[:1]):
        if (a[1] > y) != (b[1] > y) and x < (b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:
            hit = not hit
    return hit


def shape(grid, points, palette, light=(.35, .3)):
    points = smooth(points)
    left, right = min(p[0] for p in points), max(p[0] for p in points)
    top, bottom = min(p[1] for p in points), max(p[1] for p in points)
    for row in range(ROWS):
        for col in range(COLS):
            x, y = (col+.5)*DX, (row+.5)*DY
            if not inside(points, x, y):
                continue
            # Broad mottling follows George's warm gray coat; fine glyphs suggest fur.
            noise = ((col*17 + row*31 + col*row*7) % 29) / 28
            cloud = sin(x*.061 + sin(y*.075))*cos(y*.08)*.12
            volume = max(0, 1-hypot((x-left)/(right-left)-light[0], (y-top)/(bottom-top)-light[1]))
            ink = tone(palette, .12 + volume*.78 + cloud + (noise-.5)*.16)
            bank = '.,:;!+x%'
            grid[row][col] = (bank[int(noise*(len(bank)-1))], ink)


def oval(grid, cx, cy, rx, ry, palette):
    shape(grid, [(cx+rx*cos(i*tau/16), cy+ry*sin(i*tau/16)) for i in range(16)], palette)


def letters(grid, x, y, text, ink):
    col, row = round(x/DX), round(y/DY)
    for i, char in enumerate(text):
        if 0 <= col+i < COLS and 0 <= row < ROWS:
            grid[row][col+i] = (char, ink) if char != ' ' else None


def stroke(grid, points, ink, bank='.-'):
    """Single-character whiskers and paw creases stay legible at the small size."""
    for a, b in zip(points, points[1:]):
        steps = max(1, round(hypot(b[0]-a[0], b[1]-a[1])/DX))
        for i in range(steps+1):
            t = i/steps
            letters(grid, a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, bank[i % len(bank)], ink)


body = [[None for _ in range(COLS)] for _ in range(ROWS)]
ear = [[None for _ in range(COLS)] for _ in range(ROWS)]

# Rounded haunches and a small tail establish a crouching rabbit, facing right.
oval(body, 55, 175, 22, 22, 'fur')
shape(body, [(67,183), (64,146), (81,110), (117,87), (158,83),
             (192,96), (217,125), (238,176), (224,211), (169,224),
             (108,219), (78,206)], 'fur')
oval(body, 124, 182, 44, 35, 'shadow')
oval(body, 120, 174, 39, 31, 'fur')
# The long back foot and two short front paws prevent the silhouette reading as a cat.
shape(body, [(102,201), (135,205), (162,215), (159,226), (119,229), (94,224), (88,215)], 'fur')
shape(body, [(220,164), (235,160), (248,187), (254,211), (270,217),
             (268,227), (243,229), (228,217)], 'shadow')
shape(body, [(205,160), (227,157), (237,187), (239,213), (252,220),
             (248,231), (222,230), (209,216), (198,192)], 'fur')

# One far ear peeks behind the crown; neither ear points upright.
shape(body, [(233,51), (253,58), (263,92), (260,130), (250,139),
             (240,122), (237,90), (224,68)], 'shadow')
# George's broad forehead and short dark muzzle are based on the reference photos.
shape(body, [(188,111), (187,78), (204,54), (229,48), (254,54),
             (273,74), (283,97), (294,111), (289,134), (269,151),
             (235,154), (210,140)], 'face')
shape(body, [(200,79), (216,55), (241,53), (262,67), (274,87),
             (257,95), (231,88), (215,103)], 'fur')
oval(body, 275, 125, 22, 18, 'muzzle')
oval(body, 268, 141, 18, 10, 'fur')
# A dark eye with one light glint, a small nose, and restrained whiskers.
letters(body, 256, 96, '(o)', '#e3cfb3')
letters(body, 260, 96, 'o', '#352f30')
letters(body, 260, 91, '.', '#fff2dc')
letters(body, 292, 121, 'v', '#e2b6bc')
stroke(body, [(289,130), (283,136), (275,133)], '#5a4547', '_/')
stroke(body, [(288,130), (310,120)], '#c5b9ae', '.-')
stroke(body, [(290,134), (315,135)], '#d2c5b7', '.-')
stroke(body, [(285,138), (307,150)], '#b0a298', '.\\')
for x, y in [(118,225), (132,225), (232,226), (242,225), (260,224)]:
    letters(body, x, y, '/', '#776b64')

# The near ear lies over the cheek and hangs well below the chin. Its wide rounded
# tip and darker inset are kept on a separate transparent text layer for the flop.
near_ear = [(208,65), (225,66), (232,86), (228,116), (220,149),
            (205,179), (192,181), (184,168), (190,138), (199,106), (199,81)]
# A narrow unpainted gap below the ear's root separates it from the similar-toned
# shoulder at phone sizes. It also prevents two text layers muddying the fur.
ear_gap = smooth([(210+(x-210)*1.16, 78+(y-78)*1.04) for x, y in near_ear])
for row in range(ROWS):
    for col in range(COLS):
        x, y = (col+.5)*DX, (row+.5)*DY
        if y > 90 and inside(ear_gap, x, y):
            body[row][col] = None
shape(ear, near_ear, 'ear')
shape(ear, [(209,84), (218,85), (217,113), (207,146), (198,165),
            (196,153), (203,120)], 'inner')
stroke(ear, [(203,72), (200,103), (190,139), (187,165)], '#d4c5b1', ':;')
stroke(ear, [(223,81), (224,106), (216,138), (204,167), (196,176)], '#e5d2b8', ':!')


def export(grid, filename, title):
    rows = []
    for row, cells in enumerate(grid):
        if not any(cells):
            continue
        runs, chars, previous = [], '', None
        for cell in cells:
            char, ink = cell or (' ', previous or '#c0b4a5')
            if ink != previous and chars:
                runs.append(f'<tspan fill="{previous}" style="white-space: pre">{escape(chars)}</tspan>')
                chars = ''
            previous, chars = ink, chars+char
        if chars:
            runs.append(f'<tspan fill="{previous}" style="white-space: pre">{escape(chars.rstrip())}</tspan>')
        # Explicitly preserve each row and run: inherited whitespace handling can
        # collapse the leading spaces inside SVG images and flatten the silhouette.
        rows.append(f'    <text style="white-space: pre" x="0" y="{(row+1)*DY:g}">{"".join(runs)}</text>')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT:g}" viewBox="0 0 {WIDTH} {HEIGHT:g}">
  <title>{title}</title>
  <!-- Generated by scripts/draw-george-welcome.py. Every visible mark is ASCII text. -->
  <g font-family="'Courier New', monospace" font-size="6.6666667" font-weight="bold" xml:space="preserve" style="white-space: pre">
{chr(10).join(rows)}
  </g>
</svg>
'''
    (Path(__file__).resolve().parents[1] / 'assets' / filename).write_text(svg)


export(body, 'george-welcome.svg', 'George, a soft gray-brown lop rabbit drawn from ASCII characters')
export(ear, 'george-welcome-ear.svg', "George's long floppy ear, drawn from ASCII characters")
