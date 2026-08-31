"""Build the site favicon from the real G-clef glyph outline.
Font glyph coords are Y-up; SVG is Y-down, hence the negative Y scale."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

FONT = r"C:\Windows\Fonts\seguisym.ttf"
CP = 0x1D11E  # MUSICAL SYMBOL G CLEF
BOX = 64.0    # viewBox is BOX x BOX
PAD = 3.0     # vertical padding inside the box

f = TTFont(FONT, fontNumber=0)
name = f.getBestCmap()[CP]
gs = f.getGlyphSet()
pen = SVGPathPen(gs)
gs[name].draw(pen)
d = pen.getCommands()
g = f["glyf"][name]
x0, y0, x1, y1 = g.xMin, g.yMin, g.xMax, g.yMax
f.close()

s = (BOX - 2 * PAD) / (y1 - y0)          # scale to fit height
tx = (BOX - (x1 - x0) * s) / 2 - x0 * s  # centre horizontally
ty = PAD + y1 * s                        # flip: font yMax -> top padding

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#120D22"/>
  <path transform="translate({tx:.3f} {ty:.3f}) scale({s:.5f} -{s:.5f})"
        fill="#E3B94C" stroke="#E3B94C" stroke-width="{0.8/s:.1f}" stroke-linejoin="round" d="{d}"/>
</svg>
'''
open("assets/favicon.svg", "w", encoding="utf-8").write(svg)
print(f"glyph {name}  bbox {x0},{y0} {x1},{y1}")
print(f"scale {s:.5f}  translate {tx:.3f},{ty:.3f}")
print(f"drawn size {(x1-x0)*s:.1f} x {(y1-y0)*s:.1f} px in {BOX:.0f}px box")
