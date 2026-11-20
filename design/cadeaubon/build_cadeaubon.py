"""
Bouwt de offline Zen Spa cadeaubon (vector) als .ai (PDF-compatibel), .pdf en .svg.

Gebruik:  python build_cadeaubon.py <uitvoermap>
Lettertypen (alleen als contouren gebruikt):
  EB Garamond (Google Fonts, OFL)  -> koppen en velden
  Nunito Sans (statisch)           -> labels en kleine tekst
Logo: public/logo-green.svg en public/logo-variant.svg (officiële bestanden).
"""
import math
import os
import re
import sys

from vec import (Scene, circle_path, load_static, load_variable, parse_svg_path, poly_path, polyline_path, rect_path,
                 rotate, scale, translate)

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
FONT_DIR = os.environ.get('ZENSPA_FONT_DIR', os.path.join(HERE, 'fonts'))
NUNITO = os.path.expanduser('~/Library/Fonts')

W, H = 603.78, 277.8  # artboard van het bestaande Cadeaubon_ZenSpa.ai

# Huisstijl
OLIVE = '#616848'        # olijfgroen zoals de site het toont
OLIVE_BRAND = '#74795E'  # logo-groen
INK = '#21231B'          # zwartgroen
MUTED = '#5A6049'
CREAM = '#F8F2E8'
LOGO_CREAM = '#EAE1D6'
GOLD = '#E6CF95'
GOLD_D = '#D2B66F'
ROSE = '#E5A8B4'
ROSE_D = '#D68C9D'
BERRY = '#B5485B'
BERRY_D = '#9B3A4C'
OLIVE_G = '#657350'
OLIVE_GD = '#53603F'
GIFT_CREAM = '#F4EFE4'
GIFT_CREAM_D = '#E8DFCC'

garamond = load_variable(os.path.join(FONT_DIR, 'EBGaramond-VF.ttf'), 400)
nunito = load_static(os.path.join(NUNITO, 'NunitoSans_10pt-Regular.ttf'))
nunito_semi = load_static(os.path.join(NUNITO, 'NunitoSans_10pt-SemiBold.ttf'))
nunito_italic = load_static(os.path.join(NUNITO, 'NunitoSans_10pt-Italic.ttf'))


def logo_paths(name):
    svg = open(os.path.join(REPO, 'public', name)).read()
    return [parse_svg_path(d) for d in re.findall(r'<path[^>]*\sd="([^"]+)"', svg)]


LOGO_GREEN = logo_paths('logo-green.svg')
LOGO_CREAM_P = logo_paths('logo-variant.svg')
LOGO_W, LOGO_H = 332.14, 89.22
ICON_N = 9  # de eerste negen paden zijn de lotus


def text(sc, font, s, x, y, size, fill, tracking=0.0, anchor='start', alpha=1.0):
    cmds, w = font.outline(s, x, y, size, tracking, anchor)
    sc.add(cmds, fill=fill, alpha=alpha)
    return w


def draw_logo(sc, paths, x, y, width, fill, alpha=1.0, only_icon=False):
    s = width / (165 if only_icon else LOGO_W)
    sc.push(translate(x, y))
    sc.push(scale(s))
    for p in (paths[:ICON_N] if only_icon else paths):
        sc.add(p, fill=fill, alpha=alpha)
    sc.pop()
    sc.pop()


# ───────────────────────────── Versiering ─────────────────────────────


def gift(sc, cx, base, w, look, variant='wide', rot=0.0):
    """Cadeautje; (cx, base) = midden van de onderkant. look = (body, lid, ribbon)."""
    body, lid, ribbon = look
    s = w / (100 if variant == 'tall' else 120)
    sc.push(translate(cx, base))
    sc.push(rotate(rot))
    sc.push(scale(s))
    if variant == 'tall':
        sc.push(translate(-50, -142))
        # schaduw
        sc.add(rect_path(18, 62, 64, 80, 7), fill=body)
        sc.add(rect_path(12, 46, 76, 22, 6), fill=lid)
        sc.add(rect_path(44, 46, 12, 96), fill=ribbon)
        sc.add([('M', 50, 46), ('C', 32, 14, 10, 26, 28, 46), ('Z',)], fill=ribbon)
        sc.add([('M', 50, 46), ('C', 68, 14, 90, 26, 72, 46), ('Z',)], fill=ribbon)
        sc.add(circle_path(50, 46, 7), fill=ribbon, stroke='#000000', width=0.4, alpha=1.0)
    else:
        sc.push(translate(-60, -116))
        sc.add(rect_path(20, 58, 80, 58, 7), fill=body)
        sc.add(rect_path(13, 42, 94, 22, 6), fill=lid)
        sc.add(rect_path(54, 42, 12, 74), fill=ribbon)
        sc.add([('M', 60, 42), ('C', 38, 8, 14, 22, 34, 42), ('Z',)], fill=ribbon)
        sc.add([('M', 60, 42), ('C', 82, 8, 106, 22, 86, 42), ('Z',)], fill=ribbon)
        sc.add(circle_path(60, 42, 8), fill=ribbon)
    sc.pop()
    sc.pop()
    sc.pop()
    sc.pop()


def ground_shadow(sc, cx, base, w):
    sc.add([('M', cx - w * 0.45, base)] + [('C', cx - w * 0.45, base + 3, cx - w * 0.2, base + 4.2, cx, base + 4.2),
                                        ('C', cx + w * 0.2, base + 4.2, cx + w * 0.45, base + 3, cx + w * 0.45, base), ('Z',)],
           fill='#000000', alpha=0.18)


def tree(sc, cx, base, h):
    """Versierde kerstboom, hoogte h, voet op (cx, base)."""
    s = h / 270.0
    sc.push(translate(cx, base))
    sc.push(scale(s))
    sc.push(translate(-100, -254))
    sc.add(rect_path(91, 222, 18, 32, 2), fill='#4A3B2C')
    sc.add(poly_path([(100, 98), (186, 224), (14, 224)]), fill='#2C3822')
    sc.add(poly_path([(100, 52), (166, 156), (34, 156)]), fill='#33422A')
    sc.add(poly_path([(100, 12), (148, 92), (52, 92)]), fill='#3B4B31')
    for d in (
        [('M', 58, 80), ('C', 80, 92, 120, 92, 142, 80)],
        [('M', 44, 138), ('C', 76, 154, 124, 154, 156, 138)],
        [('M', 26, 206), ('C', 68, 226, 132, 226, 174, 206)],
    ):
        sc.add(d, stroke=GOLD, width=2, alpha=0.8, cap='round')
    for (x, y, c) in [(86, 70, '#C14A5E'), (116, 78, GOLD), (70, 124, GOLD), (102, 142, '#C14A5E'), (138, 126, GIFT_CREAM),
                      (48, 192, '#C14A5E'), (88, 204, GIFT_CREAM), (126, 206, GOLD), (160, 192, '#C14A5E')]:
        sc.add(circle_path(x, y, 6), fill=c)
    for (x, y) in [(100, 40), (74, 108), (128, 112), (58, 168), (150, 170), (30, 214), (170, 214)]:
        sc.add(circle_path(x, y, 2.6), fill='#FBF3D5')
    # ster
    star = [(100, -2), (104.5, 8), (115, 9.5), (107.5, 17), (109.5, 27.5), (100, 22.5), (90.5, 27.5), (92.5, 17), (85, 9.5), (95.5, 8)]
    sc.add(poly_path(star), fill=GOLD)
    sc.pop()
    sc.pop()
    sc.pop()


def snowflake(sc, cx, cy, r, color, alpha):
    for k in range(3):
        a = math.radians(k * 60 + 15)
        dx, dy = math.cos(a) * r, math.sin(a) * r
        sc.add(polyline_path([(cx - dx, cy - dy), (cx + dx, cy + dy)]), stroke=color, width=0.55, alpha=alpha, cap='round')
        for sgn in (-1, 1):
            bx, by = cx + dx * 0.62 * sgn, cy + dy * 0.62 * sgn
            for off in (-34, 34):
                b = a + math.radians(off) + (math.pi if sgn < 0 else 0)
                sc.add(polyline_path([(bx, by), (bx + math.cos(b) * r * 0.32, by + math.sin(b) * r * 0.32)]),
                       stroke=color, width=0.5, alpha=alpha, cap='round')


def nordic_band(sc, x, y, width, s, color, alpha):
    """Noorse truienrand: zigzag, sterren, ruitjes, boompjes en puntjes in een herhalend patroon (tegel 96x48)."""
    tiles = int(math.ceil(width / (96 * s))) + 1
    for t in range(tiles):
        ox = x + t * 96 * s
        sc.push(translate(ox, y))
        sc.push(scale(s))
        zig = [(0, 8), (8, 2), (16, 8), (24, 2), (32, 8), (40, 2), (48, 8), (56, 2), (64, 8), (72, 2), (80, 8), (88, 2), (96, 8)]
        sc.add(polyline_path(zig), stroke=color, width=1.5, alpha=alpha, join='round')
        sc.add(polyline_path([(a, b + 38) for a, b in zig]), stroke=color, width=1.5, alpha=alpha, join='round')
        sc.add(poly_path([(24, 14), (26, 22), (34, 24), (26, 26), (24, 34), (22, 26), (14, 24), (22, 22)]), fill=color, alpha=alpha)
        sc.add(poly_path([(48, 20), (52, 24), (48, 28), (44, 24)]), fill=color, alpha=alpha)
        sc.add(poly_path([(72, 12), (79, 21), (75, 21), (81, 29), (63, 29), (69, 21), (65, 21)]), fill=color, alpha=alpha)
        sc.add(rect_path(70.5, 29, 3, 4), fill=color, alpha=alpha)
        for cx in (12, 36, 60, 84):
            sc.add(circle_path(cx, 24, 1.6), fill=color, alpha=alpha)
        sc.pop()
        sc.pop()


def holly(sc, x, y, s, rot=0.0, flip=False):
    leaf = [('M', 0, 0), ('C', 10, -11, 30, -11, 42, 0), ('C', 30, 11, 10, 11, 0, 0), ('Z',)]
    sc.push(translate(x, y))
    sc.push(rotate(rot))
    sc.push(scale(-s if flip else s, s))
    sc.add([('M', 4, 6), ('C', 50, 18, 90, 40, 140, 70)], stroke='#4E5A39', width=3, cap='round')
    for i, (lx, ly, lr) in enumerate([(28, 14, 28), (52, 26, 62), (78, 36, 20), (96, 48, 66), (118, 58, 28)]):
        sc.push(translate(lx, ly))
        sc.push(rotate(lr))
        sc.add(leaf, fill='#7E8A63' if i % 2 else '#8E9A72')
        sc.add([('M', 2, 0), ('L', 38, 0)], stroke='#4E5A39', width=1.2, alpha=0.5)
        sc.pop()
        sc.pop()
    for (bx, by) in [(66, 52), (78, 62), (60, 66)]:
        sc.add(circle_path(bx, by, 6.5), fill='#C14A5E')
        sc.add(circle_path(bx - 2, by - 2, 1.8), fill='#FFFFFF', alpha=0.55)
    sc.pop()
    sc.pop()
    sc.pop()


def bow(sc, cx, cy, s):
    """Gouden strik (knoop op cx, cy)."""
    sc.push(translate(cx, cy))
    sc.push(scale(s))
    # staarten
    for sgn in (-1, 1):
        sc.push(rotate(sgn * 16))
        sc.add([('M', -5, 2), ('L', 5, 2), ('L', 9 * sgn + 3, 44), ('L', 2 * sgn, 38), ('L', -4 * sgn - 3, 44), ('Z',)],
               fill=GOLD_D if sgn < 0 else GOLD)
        sc.pop()
    # lussen
    for sgn in (-1, 1):
        sc.push(scale(sgn, 1))
        sc.add([('M', 0, 0), ('C', -12, -26, -44, -32, -42, -9), ('C', -41, 8, -18, 11, 0, 0), ('Z',)], fill=GOLD)
        sc.add([('M', -6, -3), ('C', -16, -17, -33, -20, -33, -9), ('C', -32, -1, -18, 2, -6, -3), ('Z',)], fill=GOLD_D, alpha=0.5)
        sc.pop()
    sc.add(circle_path(0, 0, 6.4), fill=GOLD)
    sc.add(circle_path(0, 0, 6.4), stroke=GOLD_D, width=0.8)
    sc.pop()
    sc.pop()


# ───────────────────────────── De bon ─────────────────────────────

PANEL_W = 200.0
RX0, RX1 = 256.0, 566.0  # linker en rechter rand van de tekstkolom


def build(kerst: bool):
    title = 'Cadeaubon Zen Spa' + (' (kerst)' if kerst else '')
    sc = Scene(W, H, title=title, creator='Zen Spa')

    # achtergrond
    sc.add(rect_path(0, 0, W, H), fill=CREAM)

    # linker paneel
    g0, g1 = ('#5E6846', '#394123') if kerst else ('#636E4B', '#434C2D')
    panel = rect_path(0, 0, PANEL_W, H)
    sc.add(panel, gradient=dict(x0=0, y0=0, x1=PANEL_W * 0.6, y1=H, c0=g0, c1=g1))

    sc.push(translate(0, 0))
    sc.clip_to(panel)
    if kerst:
        nordic_band(sc, 0, 30, PANEL_W, 0.62, LOGO_CREAM, 0.42)
        nordic_band(sc, 0, H - 30 - 30, PANEL_W, 0.62, LOGO_CREAM, 0.42)
        for (fx, fy, fr) in [(26, 130, 6), (172, 126, 6.5), (34, 168, 5), (168, 172, 5.5), (62, 146, 4.5), (140, 150, 4.5)]:
            snowflake(sc, fx, fy, fr, LOGO_CREAM, 0.5)
    else:
        draw_logo(sc, LOGO_CREAM_P, -40, 120, 300, LOGO_CREAM, alpha=0.06, only_icon=True)
    sc.pop()

    # logo (officieel bestand, crème variant)
    lw = 134
    lh = lw * LOGO_H / LOGO_W
    ly = 104 if not kerst else 60
    draw_logo(sc, LOGO_CREAM_P, (PANEL_W - lw) / 2 - 2, ly, lw, LOGO_CREAM)
    text(sc, nunito_semi, 'CADEAUBON', PANEL_W / 2 - 2, ly + lh + 19, 6.6, GOLD, tracking=2.2, anchor='middle')

    if kerst:
        # tafereeltje onderin: boom met cadeautjes
        gx = PANEL_W / 2 - 4
        base = H - 58
        tree(sc, gx, base - 12, 82)
        ground_shadow(sc, gx, base + 1, 120)
        looks = {
            'gold': (GOLD, GOLD_D, BERRY), 'rose': (ROSE, ROSE_D, GIFT_CREAM), 'olive': (OLIVE_G, OLIVE_GD, GOLD),
            'berry': (BERRY, BERRY_D, GOLD), 'cream': (GIFT_CREAM, GIFT_CREAM_D, ROSE),
        }
        gifts = [  # (dx, base, breedte, look, variant, rot)
            (-44, base - 8, 30, 'berry', 'wide', -3), (-14, base - 10, 26, 'gold', 'wide', 3), (14, base - 9, 28, 'olive', 'wide', -2),
            (40, base - 8, 30, 'rose', 'wide', 3), (-28, base + 1, 26, 'rose', 'tall', -4), (-4, base + 2, 20, 'cream', 'wide', 3),
            (14, base + 1, 24, 'gold', 'tall', 4), (34, base + 2, 22, 'berry', 'wide', -3),
        ]
        for dx, b, w, lk, var, rot in gifts:
            gift(sc, gx + dx, b, w, looks[lk], var, rot)

    # gouden lint tussen paneel en rest
    rx = PANEL_W - 9
    sc.add(rect_path(rx, 0, 18, H), gradient=dict(x0=rx, y0=0, x1=rx + 18, y1=0, c0=GOLD_D, c1=GOLD))
    sc.add(rect_path(rx + 5, 0, 8, H), fill=GOLD, alpha=0.75)
    bow(sc, PANEL_W, 34, 0.74)

    # rechterkant: gestippelde binnenrand
    sc.add(rect_path(PANEL_W + 36, 20, W - PANEL_W - 36 - 16, H - 40, 12), stroke=OLIVE_BRAND, width=0.7, dash=[3.2, 3.2], alpha=0.55)

    # lichtjes en hulst in de kerstvariant
    if kerst:
        sc.add(polyline_path([(PANEL_W + 40, 8), (W - 18, 8)]), stroke=OLIVE_BRAND, width=0.5, alpha=0.5)
        cols = [GOLD_D, ROSE_D, OLIVE_BRAND]
        n = int((W - 18 - (PANEL_W + 40)) / 17)
        for i in range(n + 1):
            x = PANEL_W + 40 + i * (W - 18 - (PANEL_W + 40)) / n
            sc.add(circle_path(x, 8, 3.4), fill=cols[i % 3], alpha=0.25)
            sc.add(circle_path(x, 8, 1.8), fill=cols[i % 3])
        holly(sc, W - 16, 30, 0.42, rot=8, flip=True)

    # titel
    eyebrow_y = 54
    if kerst:
        text(sc, nunito_semi, 'KERST BIJ ZEN SPA', RX0, eyebrow_y, 6.8, OLIVE, tracking=2.0)
    else:
        text(sc, nunito_semi, 'ZEN SPA  ·  HOUSE OF BEAUTY', RX0, eyebrow_y, 6.8, OLIVE, tracking=2.0)
    text(sc, garamond, 'Cadeaubon', RX0 - 2, 104, 52, INK, tracking=-0.4)
    text(sc, nunito_italic, 'Een moment van rust voor jou', RX0, 124, 10.5, MUTED)

    # velden
    labels = ['Voor:', 'Behandeling:', 'Datum:']
    maxw = max(garamond.width(t, 16.5) for t in labels)
    line_x0 = RX0 + maxw + 10
    for i, lab in enumerate(labels):
        yb = 158 + i * 31
        text(sc, garamond, lab, RX0, yb, 16.5, INK)
        sc.add(polyline_path([(line_x0, yb + 1.5), (RX1, yb + 1.5)]), stroke=OLIVE_BRAND, width=0.8, alpha=0.7)

    # geldigheid
    sc.add(poly_path([(RX0 + 3.2, 235.4 - 3.4), (RX0 + 6.4, 235.4), (RX0 + 3.2, 235.4 + 3.4), (RX0, 235.4)]), fill=GOLD_D)
    text(sc, nunito_semi, 'Deze cadeaubon is 1 jaar geldig.', RX0 + 12, 238.2, 8.6, OLIVE)

    # contact
    contact = 'Kretastraat 77, 1339 VT Almere   ·   06 53 20 77 29   ·   info@zenspa.nl   ·   @cigdemzenspa'
    text(sc, nunito, contact, RX0, 251.5, 6.1, MUTED, tracking=0.1)
    return sc


def write(sc, outdir, name):
    os.makedirs(outdir, exist_ok=True)
    pdf = sc.to_pdf()
    open(os.path.join(outdir, name + '.ai'), 'wb').write(pdf)  # PDF-compatibel Illustrator-bestand
    open(os.path.join(outdir, name + '.pdf'), 'wb').write(pdf)
    open(os.path.join(outdir, name + '.svg'), 'w').write(sc.to_svg())


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'uitvoer')
    write(build(False), out, 'Cadeaubon_ZenSpa_nieuw')
    write(build(True), out, 'Cadeaubon_ZenSpa_kerst')
    print('klaar:', out)
