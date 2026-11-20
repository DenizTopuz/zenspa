"""
Kleine vectorbibliotheek voor de Zen Spa cadeaubon.
Alles wordt als paden opgebouwd (geen rasterbeelden, geen tekst als lettertype) en kan worden weggeschreven als
SVG en als PDF (PDF-compatibel .ai voor Adobe Illustrator).

Coördinaten: punten (pt), oorsprong linksboven, y wijst omlaag (zoals SVG).
Een pad is een lijst commando's: ('M',x,y) ('L',x,y) ('C',x1,y1,x2,y2,x3,y3) ('Z',)
"""
import io
import math
import re
import zlib

import uharfbuzz as hb
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont

# ───────────────────────────── Affiene transformaties ─────────────────────────────


def mat_mul(a, b):
    """a·b voor matrices (a,b,c,d,e,f)."""
    return (
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5],
    )


IDENT = (1, 0, 0, 1, 0, 0)


def translate(tx, ty):
    return (1, 0, 0, 1, tx, ty)


def scale(sx, sy=None):
    return (sx, 0, 0, sx if sy is None else sy, 0, 0)


def rotate(deg, cx=0, cy=0):
    r = math.radians(deg)
    c, s = math.cos(r), math.sin(r)
    m = (c, s, -s, c, 0, 0)
    return mat_mul(mat_mul(translate(cx, cy), m), translate(-cx, -cy))


def apply(m, x, y):
    return (m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5])


def transform_path(path, m):
    out = []
    for cmd in path:
        op = cmd[0]
        if op == 'Z':
            out.append(('Z',))
            continue
        pts = []
        for i in range(1, len(cmd), 2):
            pts.extend(apply(m, cmd[i], cmd[i + 1]))
        out.append((op, *pts))
    return out


# ───────────────────────────── Basisvormen ─────────────────────────────


def rect_path(x, y, w, h, r=0):
    if r <= 0:
        return [('M', x, y), ('L', x + w, y), ('L', x + w, y + h), ('L', x, y + h), ('Z',)]
    r = min(r, w / 2, h / 2)
    k = 0.5522847498 * r
    return [
        ('M', x + r, y),
        ('L', x + w - r, y),
        ('C', x + w - r + k, y, x + w, y + r - k, x + w, y + r),
        ('L', x + w, y + h - r),
        ('C', x + w, y + h - r + k, x + w - r + k, y + h, x + w - r, y + h),
        ('L', x + r, y + h),
        ('C', x + r - k, y + h, x, y + h - r + k, x, y + h - r),
        ('L', x, y + r),
        ('C', x, y + r - k, x + r - k, y, x + r, y),
        ('Z',),
    ]


def circle_path(cx, cy, r):
    k = 0.5522847498 * r
    return [
        ('M', cx + r, cy),
        ('C', cx + r, cy + k, cx + k, cy + r, cx, cy + r),
        ('C', cx - k, cy + r, cx - r, cy + k, cx - r, cy),
        ('C', cx - r, cy - k, cx - k, cy - r, cx, cy - r),
        ('C', cx + k, cy - r, cx + r, cy - k, cx + r, cy),
        ('Z',),
    ]


def poly_path(points, close=True):
    p = [('M', *points[0])]
    for pt in points[1:]:
        p.append(('L', *pt))
    if close:
        p.append(('Z',))
    return p


def polyline_path(points):
    return poly_path(points, close=False)


# ───────────────────────────── SVG-pad parser ─────────────────────────────

_NUM = re.compile(r'[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?')


def parse_svg_path(d):
    """Zet een SVG pad (m l h v c s q t z, absoluut en relatief) om naar M/L/C/Z-commando's."""
    tokens = re.findall(r'[MmLlHhVvCcSsQqTtZzAa]|' + _NUM.pattern, d)
    out = []
    i = 0
    cx = cy = sx = sy = 0.0
    last_c = None  # laatste tweede controlepunt voor S
    cmd = None

    def num():
        nonlocal i
        v = float(tokens[i])
        i += 1
        return v

    while i < len(tokens):
        if re.match(r'[A-Za-z]', tokens[i]):
            cmd = tokens[i]
            i += 1
            if cmd in 'Zz':
                out.append(('Z',))
                cx, cy = sx, sy
                last_c = None
                continue
        c = cmd
        rel = c.islower()
        u = c.upper()
        if u == 'A':
            raise ValueError('Bogen (A) wordt niet ondersteund')
        if u == 'M':
            x, y = num(), num()
            if rel:
                x, y = cx + x, cy + y
            out.append(('M', x, y))
            cx, cy, sx, sy = x, y, x, y
            cmd = 'l' if rel else 'L'
            last_c = None
        elif u == 'L':
            x, y = num(), num()
            if rel:
                x, y = cx + x, cy + y
            out.append(('L', x, y))
            cx, cy = x, y
            last_c = None
        elif u == 'H':
            x = num()
            x = cx + x if rel else x
            out.append(('L', x, cy))
            cx = x
            last_c = None
        elif u == 'V':
            y = num()
            y = cy + y if rel else y
            out.append(('L', cx, y))
            cy = y
            last_c = None
        elif u == 'C':
            x1, y1, x2, y2, x, y = [num() for _ in range(6)]
            if rel:
                x1, y1, x2, y2, x, y = cx + x1, cy + y1, cx + x2, cy + y2, cx + x, cy + y
            out.append(('C', x1, y1, x2, y2, x, y))
            last_c = (x2, y2)
            cx, cy = x, y
        elif u == 'S':
            x2, y2, x, y = [num() for _ in range(4)]
            if rel:
                x2, y2, x, y = cx + x2, cy + y2, cx + x, cy + y
            x1, y1 = (2 * cx - last_c[0], 2 * cy - last_c[1]) if last_c else (cx, cy)
            out.append(('C', x1, y1, x2, y2, x, y))
            last_c = (x2, y2)
            cx, cy = x, y
        elif u == 'Q':
            qx, qy, x, y = [num() for _ in range(4)]
            if rel:
                qx, qy, x, y = cx + qx, cy + qy, cx + x, cy + y
            out.append(('C', cx + 2 / 3 * (qx - cx), cy + 2 / 3 * (qy - cy), x + 2 / 3 * (qx - x), y + 2 / 3 * (qy - y), x, y))
            cx, cy = x, y
            last_c = None
        else:
            raise ValueError('Onbekend commando ' + c)
    return out


# ───────────────────────────── Tekst als contouren ─────────────────────────────


class _Pen(BasePen):
    def __init__(self, glyphset):
        super().__init__(glyphset)
        self.cmds = []

    def _moveTo(self, p):
        self.cmds.append(('M', *p))

    def _lineTo(self, p):
        self.cmds.append(('L', *p))

    def _curveToOne(self, p1, p2, p3):
        self.cmds.append(('C', *p1, *p2, *p3))

    def _qCurveToOne(self, q, p):
        x0, y0 = self._getCurrentPoint()
        self.cmds.append(('C', x0 + 2 / 3 * (q[0] - x0), y0 + 2 / 3 * (q[1] - y0), p[0] + 2 / 3 * (q[0] - p[0]), p[1] + 2 / 3 * (q[1] - p[1]), *p))

    def _closePath(self):
        self.cmds.append(('Z',))

    def _endPath(self):
        pass


class Font:
    def __init__(self, ttfont: TTFont):
        buf = io.BytesIO()
        ttfont.save(buf)
        self.tt = TTFont(io.BytesIO(buf.getvalue()))
        self.gs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.upem = self.tt['head'].unitsPerEm
        self.hb_font = hb.Font(hb.Face(hb.Blob(buf.getvalue())))
        self._cache = {}

    def glyph(self, gid):
        if gid not in self._cache:
            pen = _Pen(self.gs)
            self.gs[self.order[gid]].draw(pen)
            self._cache[gid] = pen.cmds
        return self._cache[gid]

    def shape(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hb_font, buf, {'kern': True, 'liga': True})
        return list(zip(buf.glyph_infos, buf.glyph_positions))

    def width(self, text, size, tracking=0.0):
        s = size / self.upem
        return sum(p.x_advance * s + tracking for _, p in self.shape(text)) - tracking if text else 0.0

    def outline(self, text, x, y, size, tracking=0.0, anchor='start'):
        """Pad(en) van de tekst met de basislijn op (x, y). Geeft (cmds, breedte)."""
        s = size / self.upem
        w = self.width(text, size, tracking)
        if anchor == 'middle':
            x -= w / 2
        elif anchor == 'end':
            x -= w
        cmds = []
        pen_x = x
        for info, pos in self.shape(text):
            g = self.glyph(info.codepoint)
            m = (s, 0, 0, -s, pen_x + pos.x_offset * s, y - pos.y_offset * s)
            cmds.extend(transform_path(g, m))
            pen_x += pos.x_advance * s + tracking
        return cmds, w


def load_variable(path, wght):
    from fontTools.varLib import instancer

    vf = TTFont(path)
    inst = instancer.instantiateVariableFont(vf, {'wght': wght}, inplace=False)
    return Font(inst)


def load_static(path):
    return Font(TTFont(path))


# ───────────────────────────── Scène ─────────────────────────────


class Scene:
    def __init__(self, width, height, title='', creator='Zen Spa'):
        self.w, self.h = width, height
        self.items = []
        self.title = title
        self.creator = creator
        self.m = IDENT
        self._stack = []
        self._clip = None

    # transformaties
    def push(self, m):
        self._stack.append((self.m, self._clip))
        self.m = mat_mul(self.m, m)

    def pop(self):
        self.m, self._clip = self._stack.pop()

    def clip_to(self, path):
        self._clip = transform_path(path, self.m)

    # tekenen
    def add(self, path, fill=None, stroke=None, width=1.0, dash=None, alpha=1.0, gradient=None, cap='butt', join='miter'):
        """fill: '#RRGGBB'. gradient: dict(x0,y0,x1,y1,c0,c1) in lokale coördinaten."""
        p = transform_path(path, self.m)
        g = None
        if gradient:
            x0, y0 = apply(self.m, gradient['x0'], gradient['y0'])
            x1, y1 = apply(self.m, gradient['x1'], gradient['y1'])
            g = dict(x0=x0, y0=y0, x1=x1, y1=y1, c0=gradient['c0'], c1=gradient['c1'])
        scale_f = math.sqrt(abs(self.m[0] * self.m[3] - self.m[1] * self.m[2]))
        self.items.append(
            dict(path=p, fill=fill, stroke=stroke, width=width * scale_f, dash=[d * scale_f for d in dash] if dash else None,
                 alpha=alpha, gradient=g, clip=self._clip, cap=cap, join=join)
        )

    # ───── SVG ─────
    def to_svg(self):
        def fmt(v):
            return ('%.3f' % v).rstrip('0').rstrip('.')

        def d(path):
            parts = []
            for c in path:
                if c[0] == 'Z':
                    parts.append('Z')
                else:
                    parts.append(c[0] + ' '.join(fmt(v) for v in c[1:]))
            return ''.join(parts)

        defs, body = [], []
        clip_ids = {}
        grad_n = 0
        for it in self.items:
            attrs = []
            if it['gradient']:
                grad_n += 1
                gid = 'g%d' % grad_n
                g = it['gradient']
                defs.append(
                    '<linearGradient id="%s" gradientUnits="userSpaceOnUse" x1="%s" y1="%s" x2="%s" y2="%s">'
                    '<stop offset="0" stop-color="%s"/><stop offset="1" stop-color="%s"/></linearGradient>'
                    % (gid, fmt(g['x0']), fmt(g['y0']), fmt(g['x1']), fmt(g['y1']), g['c0'], g['c1'])
                )
                attrs.append('fill="url(#%s)"' % gid)
            elif it['fill']:
                attrs.append('fill="%s"' % it['fill'])
            else:
                attrs.append('fill="none"')
            if it['stroke']:
                attrs.append('stroke="%s" stroke-width="%s"' % (it['stroke'], fmt(it['width'])))
                if it['dash']:
                    attrs.append('stroke-dasharray="%s"' % ' '.join(fmt(v) for v in it['dash']))
                if it['cap'] != 'butt':
                    attrs.append('stroke-linecap="%s"' % it['cap'])
                if it['join'] != 'miter':
                    attrs.append('stroke-linejoin="%s"' % it['join'])
            if it['alpha'] < 1:
                attrs.append('opacity="%s"' % fmt(it['alpha']))
            el = '<path d="%s" %s/>' % (d(it['path']), ' '.join(attrs))
            if it['clip']:
                key = d(it['clip'])
                if key not in clip_ids:
                    clip_ids[key] = 'c%d' % (len(clip_ids) + 1)
                    defs.append('<clipPath id="%s"><path d="%s"/></clipPath>' % (clip_ids[key], key))
                el = '<g clip-path="url(#%s)">%s</g>' % (clip_ids[key], el)
            body.append(el)
        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" width="%spt" height="%spt">\n'
            '<title>%s</title>\n<defs>%s</defs>\n%s\n</svg>\n'
            % (fmt(self.w), fmt(self.h), fmt(self.w), fmt(self.h), self.title, ''.join(defs), '\n'.join(body))
        )

    # ───── PDF (PDF-compatibel .ai) ─────
    def to_pdf(self):
        H = self.h

        def rgb(hexcol):
            h = hexcol.lstrip('#')
            return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))

        def n(v):
            return ('%.3f' % v).rstrip('0').rstrip('.')

        def pth(path):
            ops = []
            for c in path:
                if c[0] == 'M':
                    ops.append('%s %s m' % (n(c[1]), n(H - c[2])))
                elif c[0] == 'L':
                    ops.append('%s %s l' % (n(c[1]), n(H - c[2])))
                elif c[0] == 'C':
                    ops.append('%s %s %s %s %s %s c' % (n(c[1]), n(H - c[2]), n(c[3]), n(H - c[4]), n(c[5]), n(H - c[6])))
                else:
                    ops.append('h')
            return ' '.join(ops)

        gs_alpha = {}
        shadings = []
        out = []
        for it in self.items:
            out.append('q')
            if it['clip']:
                out.append(pth(it['clip']) + ' W n')
            if it['alpha'] < 1:
                key = round(it['alpha'], 3)
                gs_alpha.setdefault(key, 'GS%d' % len(gs_alpha))
                out.append('/%s gs' % gs_alpha[key])
            if it['gradient']:
                g = it['gradient']
                shadings.append(g)
                out.append(pth(it['path']) + ' W n')
                out.append('/Sh%d sh' % (len(shadings) - 1))
            elif it['fill']:
                r, gg, b = rgb(it['fill'])
                out.append('%s %s %s rg' % (n(r), n(gg), n(b)))
                out.append(pth(it['path']) + ' f')
            if it['stroke']:
                r, gg, b = rgb(it['stroke'])
                out.append('%s %s %s RG %s w' % (n(r), n(gg), n(b), n(it['width'])))
                out.append({'butt': '0 J', 'round': '1 J', 'square': '2 J'}[it['cap']])
                out.append({'miter': '0 j', 'round': '1 j', 'bevel': '2 j'}[it['join']])
                out.append('[%s] 0 d' % ' '.join(n(v) for v in it['dash'])) if it['dash'] else out.append('[] 0 d')
                out.append(pth(it['path']) + ' S')
            out.append('Q')
        content = zlib.compress('\n'.join(out).encode('latin-1'))

        objs = []  # lijst van bytes (inhoud zonder 'n 0 obj')

        def add(b):
            objs.append(b if isinstance(b, bytes) else b.encode('latin-1'))
            return len(objs)  # objectnummer

        catalog = add('')  # 1 (later)
        pages = add('')  # 2
        page = add('')  # 3
        contents = add(b'<< /Length %d /Filter /FlateDecode >>\nstream\n' % len(content) + content + b'\nendstream')  # 4
        info = add('<< /Title (%s) /Creator (%s) /Producer (Zen Spa vector) >>' % (self.title, self.creator))

        sh_refs = []
        for i, g in enumerate(shadings):
            c0, c1 = rgb(g['c0']), rgb(g['c1'])
            ref = add(
                '<< /ShadingType 2 /ColorSpace /DeviceRGB /Coords [%s %s %s %s] /Extend [true true] '
                '/Function << /FunctionType 2 /Domain [0 1] /C0 [%s] /C1 [%s] /N 1 >> >>'
                % (n(g['x0']), n(H - g['y0']), n(g['x1']), n(H - g['y1']), ' '.join(n(v) for v in c0), ' '.join(n(v) for v in c1))
            )
            sh_refs.append(ref)

        gs_dict = ' '.join('/%s << /ca %s /CA %s >>' % (name, n(a), n(a)) for a, name in gs_alpha.items())
        sh_dict = ' '.join('/Sh%d %d 0 R' % (i, r) for i, r in enumerate(sh_refs))
        box = '[0 0 %s %s]' % (n(self.w), n(H))
        objs[catalog - 1] = b'<< /Type /Catalog /Pages 2 0 R >>'
        objs[pages - 1] = b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>'
        objs[page - 1] = (
            '<< /Type /Page /Parent 2 0 R /MediaBox %s /CropBox %s /TrimBox %s /ArtBox %s /Contents 4 0 R '
            '/Resources << /ExtGState << %s >> /Shading << %s >> >> >>' % (box, box, box, box, gs_dict, sh_dict)
        ).encode('latin-1')

        buf = io.BytesIO()
        buf.write(b'%PDF-1.5\n%\xe2\xe3\xcf\xd3\n')
        offsets = []
        for i, body in enumerate(objs, 1):
            offsets.append(buf.tell())
            buf.write(b'%d 0 obj\n' % i + body + b'\nendobj\n')
        xref = buf.tell()
        buf.write(b'xref\n0 %d\n' % (len(objs) + 1))
        buf.write(b'0000000000 65535 f \n')
        for o in offsets:
            buf.write(b'%010d 00000 n \n' % o)
        buf.write(
            b'trailer\n<< /Size %d /Root 1 0 R /Info %d 0 R >>\nstartxref\n%d\n%%%%EOF\n' % (len(objs) + 1, info, xref)
        )
        return buf.getvalue()
