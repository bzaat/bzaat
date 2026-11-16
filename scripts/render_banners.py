#!/usr/bin/env python3
"""Draw the three animated hero banners for the profile README (1200x360 SVG).

  assets/banner-auror-light.svg       light mode: parchment, Patronus particles, snitch,
                                      quill, investigation board of real projects
  assets/banner-dark-arts.svg         dark mode: obsidian, emerald mist, rotating rune
                                      circle, curse sparks
  assets/banner-fantastic-beasts.svg  Newt's case: latch opens, treasure spills, field
                                      journal inks in

Pure SVG + CSS keyframes (no JS, no SMIL) so GitHub renders them inside <img> and
`prefers-reduced-motion` can switch the motion off. Random placement is seeded, so
re-running produces identical files. Standard library only.

    python scripts/render_banners.py
"""
from __future__ import annotations

import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
W, H = 1200, 360
SERIF = "Georgia, 'Palatino Linotype', 'Book Antiqua', 'Times New Roman', serif"

NAME = "Pham Nguyen Khanh Nguyen"
ROLE = "Applied Machine Learning &amp; Computer Vision"

REDUCED_MOTION = """
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; }
    }"""


def svg_open(title: str, desc: str, uid: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" '
        f'role="img" aria-labelledby="{uid}-t {uid}-d" font-family="{SERIF}">\n'
        f'  <title id="{uid}-t">{title}</title>\n  <desc id="{uid}-d">{desc}</desc>\n'
    )


# --------------------------------------------------------------------------- light
def banner_light() -> str:
    rnd = random.Random(7)
    ink, gold, patronus, parch = "#2C1E12", "#D4AF37", "#A8DADC", "#F4E4BC"

    particles = []
    for _ in range(54):
        x, y = rnd.uniform(16, 1184), rnd.uniform(70, 352)
        r, dur = rnd.uniform(1.1, 3.2), rnd.uniform(7, 13)
        particles.append(
            f'<circle class="p" cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" '
            f'style="animation-duration:{dur:.1f}s;animation-delay:-{rnd.uniform(0, dur):.1f}s"/>'
        )

    # Auror investigation board: real projects pinned and linked with gold thread.
    nodes = [
        (880, 92, "ResNet-50", "from scratch"),
        (1090, 118, "SCI-2026", "first author"),
        (930, 262, "AES-RARR", "IECON 2026"),
        (1110, 286, "Badminton CV", "in progress"),
    ]
    links = [(0, 1), (0, 2), (2, 3), (1, 3), (0, 3)]
    threads = "".join(
        f'<line class="thread" x1="{nodes[a][0]}" y1="{nodes[a][1]}" x2="{nodes[b][0]}" y2="{nodes[b][1]}" '
        f'style="animation-delay:-{i * 0.7:.1f}s"/>'
        for i, (a, b) in enumerate(links)
    )
    pins = "".join(
        f'<g transform="translate({x} {y}) rotate({rnd.uniform(-4, 4):.1f})">'
        f'<rect x="-62" y="-24" width="124" height="48" rx="3" fill="#FBF3DC" stroke="{ink}" stroke-opacity=".35"/>'
        f'<circle cx="0" cy="-24" r="4.5" fill="#8B1E1E"/>'
        f'<text y="-2" text-anchor="middle" font-size="15" font-weight="bold" fill="{ink}">{label}</text>'
        f'<text y="15" text-anchor="middle" font-size="11.5" font-style="italic" fill="#6B5537">{note}</text></g>'
        for x, y, label, note in nodes
    )

    return svg_open(
        "Pham Nguyen Khanh Nguyen, Applied Machine Learning and Computer Vision (Auror Office theme)",
        "Parchment banner with drifting silver-blue Patronus light, a golden snitch and a quill, "
        "and an investigation board linking ResNet-50, SCI-2026, AES-RARR (IECON 2026) and a badminton computer-vision project.",
        "bl",
    ) + f"""  <defs>
    <radialGradient id="bl-bg" cx="35%" cy="45%" r="80%">
      <stop offset="0" stop-color="#FBF0D2"/><stop offset=".65" stop-color="{parch}"/><stop offset="1" stop-color="#DCC48C"/>
    </radialGradient>
    <radialGradient id="bl-halo" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".75"/><stop offset="1" stop-color="{patronus}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bl-snitch" cx="35%" cy="35%" r="70%">
      <stop offset="0" stop-color="#FFF1B0"/><stop offset=".55" stop-color="{gold}"/><stop offset="1" stop-color="#8C6D12"/>
    </radialGradient>
    <filter id="bl-glow" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="bl-grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3"/>
      <feColorMatrix values="0 0 0 0 .17  0 0 0 0 .12  0 0 0 0 .07  0 0 0 .06 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  </defs>
  <style>
    .p {{ fill: {patronus}; filter: url(#bl-glow); animation: rise linear infinite; }}
    @keyframes rise {{ 0% {{ transform: translateY(0); opacity: 0 }} 18% {{ opacity: .95 }} 100% {{ transform: translateY(-130px); opacity: 0 }} }}
    .thread {{ stroke: {gold}; stroke-width: 1.6; stroke-dasharray: 6 5; animation: thread 3.5s linear infinite; }}
    @keyframes thread {{ to {{ stroke-dashoffset: -22 }} }}
    .snitch {{ animation: fly 16s ease-in-out infinite; }}
    @keyframes fly {{
      0% {{ transform: translate(120px, 300px) }} 18% {{ transform: translate(360px, 250px) }}
      34% {{ transform: translate(560px, 296px) }} 52% {{ transform: translate(700px, 230px) }}
      70% {{ transform: translate(470px, 312px) }} 86% {{ transform: translate(230px, 270px) }} 100% {{ transform: translate(120px, 300px) }}
    }}
    .wing {{ transform-box: fill-box; transform-origin: center; animation: flap .16s ease-in-out infinite alternate; }}
    @keyframes flap {{ to {{ transform: scaleY(.25) }} }}
    .quill {{ transform-box: fill-box; transform-origin: 50% 90%; animation: drift 7s ease-in-out infinite alternate; }}
    @keyframes drift {{ from {{ transform: translateY(0) rotate(-6deg) }} to {{ transform: translateY(-10px) rotate(7deg) }} }}
    .halo {{ animation: breathe 6s ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }}
    @keyframes breathe {{ from {{ opacity: .55; transform: scale(.94) }} to {{ opacity: 1; transform: scale(1.04) }} }}
    {REDUCED_MOTION}
  </style>
  <rect width="{W}" height="{H}" fill="url(#bl-bg)"/>
  <rect width="{W}" height="{H}" fill="{parch}" filter="url(#bl-grain)"/>
  <rect x="10" y="10" width="{W - 20}" height="{H - 20}" rx="10" fill="none" stroke="{ink}" stroke-opacity=".45" stroke-dasharray="2 6"/>
  <ellipse class="halo" cx="330" cy="170" rx="300" ry="120" fill="url(#bl-halo)"/>
  <g>{''.join(particles)}</g>

  <text x="72" y="92" font-size="15" letter-spacing="4" fill="#6B5537">AUROR OFFICE · DEPARTMENT OF COMPUTER VISION</text>
  <text x="70" y="168" font-size="50" font-weight="bold" fill="{ink}">{NAME}</text>
  <text x="72" y="214" font-size="25" font-style="italic" fill="{ink}">{ROLE}</text>
  <text x="72" y="252" font-size="17" fill="#5A4630">Computer vision · uncertainty-aware perception · embodied AI</text>
  <line x1="72" y1="276" x2="420" y2="276" stroke="{gold}" stroke-width="2"/>

  <g transform="translate(764 246)"><g class="quill">
    <path d="M0 0 C 12 -40, 34 -78, 60 -96 C 48 -64, 30 -30, 6 4 Z" fill="#FBF3DC" stroke="{ink}" stroke-width="1.4"/>
    <path d="M6 4 L 54 -88" stroke="{ink}" stroke-width="1"/>
    <path d="M0 0 L -6 14" stroke="{ink}" stroke-width="2.2" stroke-linecap="round"/>
  </g></g>

  <g>{threads}</g>
  <g>{pins}</g>

  <g class="snitch">
    <ellipse class="wing" cx="-15" cy="-6" rx="15" ry="5.5" fill="#FFFFFF" fill-opacity=".85" stroke="#C9A646" stroke-width=".8"/>
    <ellipse class="wing" cx="15" cy="-6" rx="15" ry="5.5" fill="#FFFFFF" fill-opacity=".85" stroke="#C9A646" stroke-width=".8"/>
    <circle r="7.5" fill="url(#bl-snitch)" filter="url(#bl-glow)"/>
  </g>
</svg>
"""


# ---------------------------------------------------------------------------- dark
def rune(rnd: random.Random, size: float = 14) -> str:
    """A made-up runic glyph: a vertical stave plus two or three angled strokes."""
    s = size
    strokes = [f"M0 {-s / 2} L0 {s / 2}"]
    for _ in range(rnd.randint(2, 3)):
        y1 = rnd.choice([-s / 2, -s / 4, 0, s / 4])
        x2 = rnd.choice([-s / 2.2, s / 2.2])
        y2 = y1 + rnd.choice([-s / 4, s / 4, s / 3])
        strokes.append(f"M0 {y1:.1f} L{x2:.1f} {y2:.1f}")
    return " ".join(strokes)


def banner_dark() -> str:
    rnd = random.Random(13)
    obsidian, emerald, glow, silver = "#0B0C10", "#1A472A", "#2ECC71", "#C5C6C7"
    cx, cy = 1010, 180

    def ring(radius: float, count: int, size: float) -> str:
        out = []
        for i in range(count):
            a = 2 * math.pi * i / count
            x, y = cx + radius * math.cos(a), cy + radius * math.sin(a)
            deg = math.degrees(a) + 90
            out.append(
                f'<path class="rune" d="{rune(rnd, size)}" transform="translate({x:.1f} {y:.1f}) rotate({deg:.1f})" '
                f'style="animation-delay:-{rnd.uniform(0, 4):.1f}s"/>'
            )
        return "".join(out)

    mist = "".join(
        f'<ellipse class="mist" cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}" '
        f'style="animation-duration:{d}s;animation-delay:-{dl}s"/>'
        for x, y, rx, ry, c, d, dl in [
            (980, 190, 230, 110, emerald, 18, 0), (760, 250, 260, 90, emerald, 22, 6),
            (1100, 110, 170, 80, "#145A32", 16, 3), (420, 300, 320, 70, "#123524", 26, 9),
            (920, 300, 200, 60, glow, 20, 12),
        ]
    )

    def zigzag(x: float, y: float, n: int = 5) -> str:
        pts = [(x, y)]
        for i in range(n):
            x += rnd.uniform(10, 18) * rnd.choice([-1, 1])
            y += rnd.uniform(10, 16)
            pts.append((x, y))
        return " ".join(f"{px:.0f},{py:.0f}" for px, py in pts)

    sparks = "".join(
        f'<polyline class="spark" points="{zigzag(x, y)}" style="animation-delay:-{d}s"/>'
        for x, y, d in [(880, 40, 0.0), (1150, 70, 1.7), (870, 230, 3.1), (1140, 240, 4.4)]
    )

    embers = "".join(
        f'<circle class="ember" cx="{rnd.uniform(20, 1180):.0f}" cy="{rnd.uniform(200, 355):.0f}" r="{rnd.uniform(.8, 2.2):.1f}" '
        f'style="animation-duration:{(d := rnd.uniform(8, 15)):.1f}s;animation-delay:-{rnd.uniform(0, d):.1f}s"/>'
        for _ in range(34)
    )

    return svg_open(
        "Pham Nguyen Khanh Nguyen, Applied Machine Learning and Computer Vision (Dark Arts theme)",
        "Obsidian banner with drifting emerald mist, a slowly turning circle of glowing runes, "
        "flickering green curse sparks and rising embers.",
        "bd",
    ) + f"""  <defs>
    <radialGradient id="bd-bg" cx="80%" cy="50%" r="90%">
      <stop offset="0" stop-color="#11201A"/><stop offset=".45" stop-color="#0D1013"/><stop offset="1" stop-color="{obsidian}"/>
    </radialGradient>
    <radialGradient id="bd-orb" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="{glow}" stop-opacity=".9"/><stop offset=".4" stop-color="{glow}" stop-opacity=".25"/><stop offset="1" stop-color="{glow}" stop-opacity="0"/>
    </radialGradient>
    <filter id="bd-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
    <filter id="bd-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <style>
    .mist {{ opacity: .32; filter: url(#bd-blur); animation: mist ease-in-out infinite alternate; }}
    @keyframes mist {{ from {{ transform: translate(-40px, 6px) }} to {{ transform: translate(50px, -10px) }} }}
    .ring {{ transform-box: view-box; transform-origin: {cx}px {cy}px; animation: spin 60s linear infinite; }}
    .ring.rev {{ animation-duration: 42s; animation-direction: reverse; }}
    @keyframes spin {{ to {{ transform: rotate(360deg) }} }}
    .rune {{ fill: none; stroke: {glow}; stroke-width: 1.8; stroke-linecap: round; filter: url(#bd-glow); animation: pulse 4s ease-in-out infinite alternate; }}
    @keyframes pulse {{ from {{ opacity: .3 }} to {{ opacity: 1 }} }}
    .orb {{ transform-box: fill-box; transform-origin: center; animation: orb 5s ease-in-out infinite alternate; }}
    @keyframes orb {{ from {{ opacity: .55; transform: scale(.9) }} to {{ opacity: 1; transform: scale(1.08) }} }}
    .spark {{ fill: none; stroke: #A9F5C6; stroke-width: 1.6; filter: url(#bd-glow); opacity: 0; animation: spark 6s linear infinite; }}
    @keyframes spark {{ 0%, 88%, 100% {{ opacity: 0 }} 90% {{ opacity: 1 }} 92% {{ opacity: .2 }} 94% {{ opacity: .9 }} }}
    .ember {{ fill: {glow}; animation: ember linear infinite; }}
    @keyframes ember {{ 0% {{ transform: translateY(0); opacity: 0 }} 20% {{ opacity: .8 }} 100% {{ transform: translateY(-160px); opacity: 0 }} }}
    .title {{ filter: url(#bd-glow); }}
    {REDUCED_MOTION}
  </style>
  <rect width="{W}" height="{H}" fill="url(#bd-bg)"/>
  <g>{mist}</g>
  <g>{embers}</g>

  <circle class="orb" cx="{cx}" cy="{cy}" r="70" fill="url(#bd-orb)"/>
  <g class="ring"><circle cx="{cx}" cy="{cy}" r="128" fill="none" stroke="{emerald}" stroke-width="1.4"/>{ring(128, 24, 15)}</g>
  <g class="ring rev"><circle cx="{cx}" cy="{cy}" r="84" fill="none" stroke="{emerald}" stroke-width="1" stroke-dasharray="3 6"/>{ring(84, 14, 11)}</g>
  <g>{sparks}</g>

  <text x="72" y="92" font-size="15" letter-spacing="4" fill="#7FA88E">DARK ARTS DIVISION · DEBUGGING AFTER MIDNIGHT</text>
  <text class="title" x="70" y="168" font-size="50" font-weight="bold" fill="{silver}">{NAME}</text>
  <text x="72" y="214" font-size="25" font-style="italic" fill="{glow}">{ROLE}</text>
  <text x="72" y="252" font-size="17" fill="#9DA5AA">Computer vision · uncertainty-aware perception · embodied AI</text>
  <line x1="72" y1="276" x2="420" y2="276" stroke="{glow}" stroke-width="2" stroke-opacity=".8"/>
</svg>
"""


# ------------------------------------------------------------------------- beasts
def banner_beasts() -> str:
    rnd = random.Random(21)
    leather, leather_dk, teal, gold, parch, ink = "#5C4033", "#3B281F", "#1E6B7B", "#D4AF37", "#F1E3C2", "#2C1E12"
    loop = 9  # seconds

    coins = "".join(
        f'<circle class="coin" cx="{x:.0f}" cy="208" r="{rnd.uniform(5, 8):.1f}" '
        f'style="--dx:{rnd.uniform(-70, 70):.0f}px;--dy:{-rnd.uniform(70, 150):.0f}px;animation-delay:{2.6 + i * 0.12:.2f}s"/>'
        for i, x in enumerate(rnd.uniform(200, 380) for _ in range(9))
    )

    entries = [
        ("Niffler", "small-object detection: finds the 10 px shuttlecock"),
        ("Demiguise", "evidential uncertainty: sees what might happen"),
        ("Bowtruckle", "ResNet-50 built twig by twig, from scratch"),
        ("Mooncalf", "reads patterns in fields: suburb-level encoding"),
        ("Occamy", "Vision Transformers: next expedition"),
    ]
    lines = "".join(
        f'<g class="entry" style="animation-delay:{3.4 + i * 0.45:.2f}s">'
        f'<text x="0" y="{i * 34}" font-size="18" font-weight="bold" fill="{teal}">{name}</text>'
        f'<text x="128" y="{i * 34}" font-size="15.5" font-style="italic" fill="{ink}">{text}</text></g>'
        for i, (name, text) in enumerate(entries)
    )

    scales = "".join(
        f'<path d="M{x} 74 a11 11 0 0 1 22 0" fill="none" stroke="{teal}" stroke-width="2" opacity=".75"/>' for x in range(574, 1130, 22)
    )

    return svg_open(
        "Newt Scamander's case: a field guide mapping machine-learning work to magical creatures",
        "A worn leather suitcase unlatches and spills golden coins, then a field journal inks in: "
        "Niffler for small-object detection, Demiguise for evidential uncertainty, Bowtruckle for a from-scratch ResNet-50, "
        "Mooncalf for suburb-level encoding, and Occamy for Vision Transformers as the next expedition.",
        "fb",
    ) + f"""  <defs>
    <linearGradient id="fb-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2A1D16"/><stop offset="1" stop-color="#17110D"/>
    </linearGradient>
    <linearGradient id="fb-leather" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#76533F"/><stop offset="1" stop-color="{leather}"/>
    </linearGradient>
    <radialGradient id="fb-light" cx="50%" cy="100%" r="80%">
      <stop offset="0" stop-color="#FFE7A3" stop-opacity=".95"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <style>
    .latch {{ transform-box: fill-box; transform-origin: 50% 0; animation: latch {loop}s ease-in-out infinite; }}
    @keyframes latch {{ 0%, 14% {{ transform: rotate(0) }} 22%, 88% {{ transform: rotate(-80deg) }} 96%, 100% {{ transform: rotate(0) }} }}
    .lid {{ transform-box: fill-box; transform-origin: 50% 100%; animation: lid {loop}s ease-in-out infinite; }}
    @keyframes lid {{ 0%, 22% {{ transform: scaleY(1) }} 32%, 86% {{ transform: scaleY(.35) translateY(-20px) }} 96%, 100% {{ transform: scaleY(1) }} }}
    .beam {{ opacity: 0; animation: beam {loop}s ease-in-out infinite; }}
    @keyframes beam {{ 0%, 24% {{ opacity: 0 }} 34%, 84% {{ opacity: .9 }} 94%, 100% {{ opacity: 0 }} }}
    .coin {{ fill: {gold}; stroke: #8C6D12; stroke-width: 1; opacity: 0; animation: coin {loop}s ease-out infinite; }}
    @keyframes coin {{ 0% {{ opacity: 0; transform: translate(0, 0) }} 8% {{ opacity: 1 }} 30% {{ opacity: 1; transform: translate(var(--dx), var(--dy)) }} 46%, 100% {{ opacity: 0; transform: translate(var(--dx), calc(var(--dy) + 40px)) }} }}
    .journal {{ opacity: 0; animation: journal {loop}s ease-in-out infinite; }}
    @keyframes journal {{ 0%, 28% {{ opacity: 0; transform: translateX(16px) }} 36%, 90% {{ opacity: 1; transform: none }} 98%, 100% {{ opacity: 0 }} }}
    .entry {{ opacity: 0; animation: entry {loop}s ease-out infinite; }}
    @keyframes entry {{ 0% {{ opacity: 0 }} 6%, 52% {{ opacity: 1 }} 60%, 100% {{ opacity: 0 }} }}
    {REDUCED_MOTION}
    @media (prefers-reduced-motion: reduce) {{ .journal, .entry {{ opacity: 1 !important; }} .beam, .coin {{ opacity: 0 !important; }} }}
  </style>
  <rect width="{W}" height="{H}" fill="url(#fb-bg)"/>
  <rect x="10" y="10" width="{W - 20}" height="{H - 20}" rx="10" fill="none" stroke="{gold}" stroke-opacity=".35" stroke-dasharray="2 6"/>

  <!-- the case -->
  <ellipse class="beam" cx="290" cy="200" rx="170" ry="120" fill="url(#fb-light)"/>
  <g class="lid"><rect x="150" y="150" width="280" height="54" rx="12" fill="url(#fb-leather)" stroke="{leather_dk}" stroke-width="3"/>
    <path d="M168 168 H412" stroke="{leather_dk}" stroke-width="1.5" stroke-dasharray="5 5"/></g>
  {coins}
  <rect x="150" y="204" width="280" height="110" rx="12" fill="url(#fb-leather)" stroke="{leather_dk}" stroke-width="3"/>
  <path d="M168 296 H412" stroke="{leather_dk}" stroke-width="1.5" stroke-dasharray="5 5"/>
  <rect x="246" y="132" width="88" height="22" rx="10" fill="none" stroke="{leather_dk}" stroke-width="6"/>
  <rect x="190" y="196" width="22" height="22" rx="3" fill="{gold}" stroke="#8C6D12"/>
  <rect x="368" y="196" width="22" height="22" rx="3" fill="{gold}" stroke="#8C6D12"/>
  <rect class="latch" x="280" y="196" width="20" height="28" rx="4" fill="{gold}" stroke="#8C6D12"/>
  <text x="290" y="342" text-anchor="middle" font-size="14" font-style="italic" fill="#BFA98A">N. Scamander, Magizoologist</text>

  <!-- the field journal -->
  <g class="journal">
    <rect x="548" y="40" width="612" height="282" rx="6" fill="{parch}" stroke="{leather}" stroke-width="3" transform="rotate(-1 854 181)"/>
    {scales}
    <text x="574" y="112" font-size="26" font-weight="bold" fill="{ink}">Magizoology Field Guide</text>
    <text x="1132" y="112" text-anchor="end" font-size="13" font-style="italic" fill="#6B5537">models &amp; methods, catalogued</text>
    <g transform="translate(574 156)">{lines}</g>
  </g>
</svg>
"""


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    for name, render in [
        ("banner-auror-light.svg", banner_light),
        ("banner-dark-arts.svg", banner_dark),
        ("banner-fantastic-beasts.svg", banner_beasts),
    ]:
        (ASSETS / name).write_text(render(), encoding="utf-8")
        print(f"wrote assets/{name}")


if __name__ == "__main__":
    main()
