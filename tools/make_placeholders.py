#!/usr/bin/env python3
"""Generate warm, editorial-style SVG placeholders for the Eclipse site.

These stand in for the client's real photography. Replace the files in /img
with optimised WebP/AVIF (+ JPEG fallback) of the same aspect ratio and update
alt text in index.html. Run:  python3 tools/make_placeholders.py
"""
from pathlib import Path
from xml.sax.saxutils import escape
import random

OUT = Path(__file__).resolve().parent.parent / "img"
OUT.mkdir(parents=True, exist_ok=True)

# Warm, muted palettes that sit alongside the brand tokens.
PALETTES = [
    ("#E7D8C6", "#C79A7B", "#8A4F38"),
    ("#EDE3D6", "#CBB49B", "#9C6B4E"),
    ("#E4D3C4", "#B98A6C", "#6E3F2E"),
    ("#F0E7DB", "#D3B79C", "#A0714F"),
    ("#DECBB9", "#AE8062", "#5F3A2C"),
    ("#EFE6D9", "#D8BCA0", "#B5654A"),
    ("#E9DACB", "#C89C7C", "#7A4A36"),
    ("#F2EADF", "#DBC1A6", "#A5714F"),
]


def svg(w, h, title, subtitle, palette, seed):
    rnd = random.Random(seed)
    a, b, c = palette
    title, subtitle = escape(title), escape(subtitle)
    angle = rnd.choice(["0%", "100%"])
    grain = rnd.randint(20, 30)
    # A soft off-centre light source.
    cx = rnd.choice([30, 45, 60, 72])
    cy = rnd.choice([22, 34, 48])
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title} placeholder">
  <defs>
    <linearGradient id="bg{seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{a}"/>
      <stop offset="1" stop-color="{b}"/>
    </linearGradient>
    <radialGradient id="glow{seed}" cx="{cx}%" cy="{cy}%" r="72%">
      <stop offset="0" stop-color="#FFFDF9" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FFFDF9" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain{seed}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
      <feComposite operator="in" in2="SourceGraphic"/>
    </filter>
    <linearGradient id="shade{seed}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.34"/>
    </linearGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#bg{seed})"/>
  <rect width="{w}" height="{h}" fill="url(#glow{seed})"/>
  <rect width="{w}" height="{h}" filter="url(#grain{seed})" opacity="0.{grain}"/>
  <rect width="{w}" height="{h}" fill="url(#shade{seed})"/>
  <g fill="#FFFDF9" font-family="Georgia, 'Times New Roman', serif">
    <text x="{int(w*0.055)}" y="{int(h*0.9)}" font-size="{max(22, int(min(w, h) * 0.062))}" font-style="italic" opacity="0.95">{title}</text>
    <text x="{int(w*0.055)}" y="{int(h*0.9)+int(max(22, int(min(w, h)*0.062))*0.9)}" font-family="Helvetica, Arial, sans-serif" font-size="{max(11, int(min(w, h) * 0.022))}" letter-spacing="{max(2, int(min(w, h)*0.004))}" opacity="0.72" text-transform="uppercase">{subtitle}</text>
  </g>
  <rect x="0.5" y="0.5" width="{w-1}" height="{h-1}" fill="none" stroke="{c}" stroke-opacity="0.25"/>
</svg>
"""


def write(name, w, h, title, subtitle, i):
    (OUT / name).write_text(svg(w, h, title, subtitle, PALETTES[i % len(PALETTES)], i * 17 + w))
    return name


# Hero and editorial supporting images (portrait / landscape).
write("hero.svg", 1920, 1280, "Signature colour", "Eclipse Hair Salon", 0)
write("about.svg", 1200, 1400, "Inside the studio", "Eclipse Hair Salon", 1)
write("og.svg", 1200, 630, "Eclipse Hair Salon", "Quietly modern hair, Portland", 2)

# Stylist portraits.
for n, (name, role) in enumerate(
    [("Mara", "Colour director"), ("Ivo", "Cutting specialist"), ("Sena", "Stylist & texture")], start=1
):
    write(f"team-{n}.svg", 900, 1100, name, role, n + 2)

# Gallery looks, mixed aspect ratios to feed the masonry.
looks = [
    ("Soft balayage", 1000, 1300),
    ("Blunt bob", 1000, 1000),
    ("Copper gloss", 1000, 1400),
    ("Textured crop", 1000, 1050),
    ("Glass-skin blowout", 1000, 1250),
    ("Curtain fringe", 1000, 1000),
    ("Mushroom toner", 1000, 1350),
    ("Natural curl shape", 1000, 1100),
    ("Editorial updo", 1000, 1300),
    ("Warm auburn", 1000, 1000),
    ("Air-dried waves", 1000, 1200),
    ("Precision line", 1000, 1050),
]
for n, (title, w, h) in enumerate(looks, start=1):
    write(f"look-{n:02d}.svg", w, h, title, "Look", n + 4)

print(f"Wrote {len(list(OUT.glob('*.svg')))} SVG placeholders to {OUT}")
