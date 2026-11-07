"""Build the Dillbillies sprite from colored ASCII glyphs, using only the standard library.

Run from any directory: python3 scripts/draw-dillbillies.py
The curves below are sampling guides; the exported SVG paints text only.
"""
from html import escape
from math import hypot, sqrt
from pathlib import Path

COLS, ROWS = 84, 94
CELL_X, CELL_Y = 6, 7.2
grid = [[None for _ in range(COLS)] for _ in range(ROWS)]
palettes = {
    # Small glyphs leave plenty of dark background, so their highlights need extra contrast.
    'wood': ('#805534', '#edba84'),
    'pickle': ('#54772b', '#d2e878'),
    'cap': ('#a29c7a', '#f5edcd'),
    'red': ('#974548', '#e58b83'),
    'boot': ('#805037', '#d69b66'),
    'metal': ('#536268', '#c6cfcb'),
    'lens': ('#10191b', '#354348'),
}


def color(palette, amount):
    """Quantize tones to keep the text SVG small and the texture deliberately coarse."""
    low, high = palettes[palette]
    amount = round(max(0, min(1, amount)) * 7) / 7
    channels = [round(int(low[i:i+2], 16) * (1-amount) + int(high[i:i+2], 16) * amount)
                for i in (1, 3, 5)]
    return '#' + ''.join(f'{c:02x}' for c in channels)


def smooth(points):
    """Sample a closed Catmull-Rom outline without drawing a solid path."""
    result = []
    for i, b in enumerate(points):
        a, c, d = points[i-1], points[(i+1) % len(points)], points[(i+2) % len(points)]
        for step in range(8):
            t = step / 8
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


def shape(points, palette, bank='.:;+xCS#@', rounded=True):
    """Shade an outline with glyphs; the left-center highlight rounds the pickle and wood."""
    points = smooth(points) if rounded else points
    left, right = min(x for x, _ in points), max(x for x, _ in points)
    for row in range(ROWS):
        for col in range(COLS):
            if not inside(points, col+.5, row+.5):
                continue
            noise = ((col*17 + row*31 + col*row*7) % 29) / 28
            volume = sqrt(max(0, 1-((col-left)/(right-left)*2-1)**2))
            tone = .18 + volume*.58 + noise*.2
            grid[row][col] = (bank[int(noise*(len(bank)-1))], color(palette, tone))


def line(points, width, palette, bank='|/+='):
    """Thick, character-built strokes form the chair's rails and curved rockers."""
    for row in range(ROWS):
        for col in range(COLS):
            for a, b in zip(points, points[1:]):
                dx, dy = b[0]-a[0], b[1]-a[1]
                t = max(0, min(1, ((col+.5-a[0])*dx+(row+.5-a[1])*dy)/(dx*dx+dy*dy or 1)))
                distance = hypot(col+.5-a[0]-t*dx, row+.5-a[1]-t*dy)
                if distance < width/2:
                    glyph = bank[(col*3+row*7) % len(bank)]
                    grid[row][col] = (glyph, color(palette, .35+.6*(1-distance/(width/2))))
                    break


def oval(cx, cy, rx, ry, palette):
    # Twelve points provide a compact rounded guide for knuckles and pickle bumps.
    from math import cos, sin, tau
    shape([(cx+rx*cos(i*tau/12), cy+ry*sin(i*tau/12)) for i in range(12)], palette)


def lettering(x, y, text, ink):
    for i, char in enumerate(text):
        if 0 <= x+i < COLS and 0 <= y < ROWS:
            grid[y][x+i] = (char, ink) if char != ' ' else None


# Back of the chair: tall turned posts, visible slats, and a gently sloping seat.
line([(64, 16), (62, 36), (59, 59), (58, 80)], 2.8, 'wood')
line([(73, 18), (71, 40), (66, 62), (65, 79)], 2.8, 'wood')
for y in (22, 31, 40, 49):
    line([(63-(y-22)*.09, y), (73-(y-18)*.13, y+1)], 1.8, 'wood', '-=+')
line([(29, 63), (65, 64)], 3.2, 'wood', '-=+')
line([(31, 62), (26, 81)], 2.8, 'wood')
line([(61, 63), (60, 83)], 2.8, 'wood')
line([(28, 72), (61, 74)], 1.6, 'wood', '-=')

# A curved pickle reclines into the chair; thin arms and green ankles make the sitting pose clear.
shape([(45, 20), (56, 21), (61, 30), (59, 42), (55, 53), (45, 61),
       (31, 64), (24, 59), (28, 51), (35, 43), (36, 32), (39, 25)], 'pickle')
line([(31, 56), (28, 66), (25, 72)], 4.1, 'pickle')
line([(45, 58), (43, 66), (42, 73)], 4.3, 'pickle')
line([(34, 47), (28, 46), (25, 38)], 3.1, 'pickle')
line([(56, 40), (58, 48), (53, 52)], 3.0, 'pickle')

# Irregular bumps and a drooping cheek give the body its cucumber texture and expression.
for cx, cy, rx, ry in [(39, 27, 1.5, 2), (57, 34, 1.4, 2.1), (53, 45, 1.3, 2),
                       (45, 53, 1.6, 1.9), (33, 56, 1.4, 1.8), (40, 42, 1.2, 2)]:
    oval(cx, cy, rx, ry, 'pickle')
line([(47, 33), (45, 37), (46, 40)], 2.3, 'pickle')
line([(43, 40), (44, 46), (40, 51), (35, 56)], 1.5, 'pickle')
lettering(45, 38, '..', '#315021')
lettering(41, 43, '//', '#365425')

# The reference's cream cap and red brim sit above two dark sunglasses lenses.
shape([(35, 21), (36, 15), (42, 10), (51, 10), (59, 15), (60, 22), (48, 23)], 'cap')
line([(49, 11), (47, 14), (46, 20)], .9, 'cap', ':;')
shape([(36, 19), (30, 18), (27, 21), (30, 25), (37, 24), (48, 22)], 'red')
line([(29, 20), (35, 21), (46, 23)], .9, 'red', '_-=')
shape([(39, 26), (48, 26), (47, 31), (41, 31)], 'lens', '#Sx', rounded=False)
shape([(50, 26), (59, 26), (57, 31), (51, 31)], 'lens', '#Sx', rounded=False)
line([(38, 26), (59, 26)], 1, 'metal', '_-')
line([(48, 28), (50, 28)], 1.2, 'metal', '-')
lettering(41, 27, '//', '#d8ddcf')
lettering(52, 27, '//', '#d8ddcf')

# The little rifle remains a still prop from the shirt, resting upright in his hand.
line([(12, 12), (18, 27)], 1.4, 'metal', '|/!')
line([(15, 13), (21, 28)], 1.2, 'metal', '|/!')
line([(17, 25), (23, 36)], 3, 'boot')
shape([(21, 33), (24, 34), (28, 44), (24, 45)], 'boot', rounded=False)
shape([(18, 28), (19, 31), (15, 34), (10, 33), (11, 31)], 'metal')
oval(25, 38, 2.7, 2.3, 'pickle')

# Arm rests and boots are painted in front, so he reads as seated inside the chair.
line([(52, 53), (61, 52), (69, 51)], 2.4, 'wood', '-=+')
line([(31, 53), (24, 53), (22, 57)], 1.9, 'wood', '-=+')
oval(53, 51, 2.6, 1.6, 'pickle')
shape([(23, 70), (29, 71), (30, 77), (25, 79), (17, 77), (14, 73), (18, 73), (22, 75)], 'boot')
shape([(39, 71), (46, 71), (47, 77), (44, 80), (34, 80), (31, 77), (38, 77)], 'boot')
line([(17, 78), (25, 81), (42, 85), (59, 85), (71, 81), (77, 76)], 2.3, 'wood', '_-=+')
line([(12, 81), (22, 85), (37, 87), (55, 87), (68, 83)], 2.3, 'wood', '_-=+')

# Merge adjacent colors into tspans. Every visible mark remains an ordinary ASCII character.
rows = []
for row, cells in enumerate(grid):
    if not any(cells):
        continue
    runs, text, previous = [], '', None
    for cell in cells:
        char, ink = cell or (' ', previous or '#bcc7a0')
        if ink != previous and text:
            runs.append(f'<tspan fill="{previous}" style="white-space: pre">{escape(text)}</tspan>')
            text = ''
        text += char
        previous = ink
    if text:
        runs.append(f'<tspan fill="{previous}" style="white-space: pre">{escape(text.rstrip())}</tspan>')
    rows.append(f'    <text x="0" y="{row*CELL_Y+10:.1f}" style="white-space: pre">' + ''.join(runs) + '</text>')
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="504" height="677" viewBox="0 0 504 677">
  <title>Dillbillies pickle lounging in his wooden rocking chair</title>
  <desc>A green pickle in sunglasses, a cream cap with a red brim, and brown boots, holding the shirt's small upright rifle.</desc>
  <!-- Generated by scripts/draw-dillbillies.py. Only text is painted; there are no solid vector fills. -->
  <g font-family="'Courier New', monospace" font-size="10" font-weight="600" xml:space="preserve">
{chr(10).join(rows)}
  </g>
</svg>
'''
destination = Path(__file__).resolve().parents[1] / 'assets' / 'dillbillies.svg'
destination.write_text(svg)
print(destination)
