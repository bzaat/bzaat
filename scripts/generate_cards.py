#!/usr/bin/env python3
"""Regenerate the profile README's live cards (run every 12 h by update-magic.yml).

  assets/card-light.svg     Auror Spell of the Day (a charm) + live metrics, parchment/gold
  assets/card-dark.svg      Dark Arts Incantation of the Day (curse/hex/jinx) + metrics, obsidian/emerald
  assets/records-light.svg  Ministry of Magic Records: GitHub stats + top languages, light
  assets/records-dark.svg   the same, dark

Data: Potter DB spells (https://api.potterdb.com/v1/spells) and the GitHub API for
USERNAME. The stats cards are drawn here rather than embedded from
github-readme-stats, whose public server is often rate-limited or down.

Standard library only. Set GITHUB_TOKEN for higher rate limits and the
contributions count (GraphQL needs a token). If any fetch fails, existing cards
are left untouched and the script exits 0.
"""
from __future__ import annotations

import json
import os
import random
import sys
import textwrap
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

USERNAME = "bzaat"
ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
POTTER_API = "https://api.potterdb.com/v1/spells"
GITHUB_API = "https://api.github.com"
TOKEN = os.environ.get("GITHUB_TOKEN", "").strip()
SERIF = "Georgia, 'Palatino Linotype', 'Book Antiqua', 'Times New Roman', serif"
W, H = 600, 340

# Notebook JSON (embedded outputs) and web markup inflate byte counts.
EXCLUDED_LANGUAGES = {"Jupyter Notebook", "HTML", "CSS"}

THEMES = {
    "light": dict(
        bg="#F4E4BC", bg2="#E6CF98", ink="#2C1E12", soft="#5A4630", accent="#8C6D12",
        accent2="#2E6F78", line="#2C1E12", bars=["#8C6D12", "#2E6F78", "#7A2E1E", "#3D5A3A", "#5A4630"],
    ),
    "dark": dict(
        bg="#0B0C10", bg2="#12201A", ink="#C5C6C7", soft="#8F989E", accent="#2ECC71",
        accent2="#A9F5C6", line="#2ECC71", bars=["#2ECC71", "#C5C6C7", "#1E8449", "#7FA88E", "#5D6D63"],
    ),
}

# Playful, true-to-life footnotes for the dark card.
UNFORGIVABLES = [
    ("Avada Kedavra", "kill -9 on a runaway training job"),
    ("Crucio", "debugging a NaN loss at epoch 37"),
    ("Imperio", "an embodied agent obeying its policy"),
]


# ----------------------------------------------------------------------------- data
def get_json(url: str, *, data: bytes | None = None, github: bool = False):
    headers = {"User-Agent": "bzaat-profile-cards", "Accept": "application/json"}
    if github:
        headers["Accept"] = "application/vnd.github+json"
        if TOKEN:
            headers["Authorization"] = f"Bearer {TOKEN}"
    if data is not None:
        headers["Content-Type"] = "application/json"
    with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=headers), timeout=25) as r:
        return json.load(r)


def all_spells() -> list[dict]:
    spells, page = [], 1
    while True:
        res = get_json(f"{POTTER_API}?page%5Bsize%5D=100&page%5Bnumber%5D={page}")
        spells.extend(x["attributes"] for x in res["data"])
        if not res["meta"]["pagination"].get("next"):
            return spells
        page += 1


def is_dark(cat: str) -> bool:
    c = cat.lower()
    return any(k in c for k in ("curse", "hex", "jinx", "dark"))


def is_light(cat: str) -> bool:
    c = cat.lower()
    return not is_dark(c) and any(k in c for k in ("charm", "healing", "counter"))


def pick(spells: list[dict], test, rnd: random.Random) -> dict:
    pool = [s for s in spells if s.get("effect") and test(s.get("category") or "")]
    with_inc = [s for s in pool if s.get("incantation")]
    if not pool:
        raise RuntimeError("no spells matched")
    return rnd.choice(with_inc or pool)


def github_metrics() -> dict:
    user = get_json(f"{GITHUB_API}/users/{USERNAME}", github=True)
    repos, page = [], 1
    while True:
        batch = get_json(f"{GITHUB_API}/users/{USERNAME}/repos?per_page=100&page={page}&type=owner", github=True)
        repos.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    own = [r for r in repos if not r.get("fork")]
    languages: dict[str, int] = {}
    for r in own:
        try:
            for name, size in get_json(r["languages_url"], github=True).items():
                if name not in EXCLUDED_LANGUAGES:
                    languages[name] = languages.get(name, 0) + int(size)
        except Exception:
            continue
    contributions = None
    if TOKEN:
        q = json.dumps({
            "query": "query($u:String!){user(login:$u){contributionsCollection{contributionCalendar{totalContributions}}}}",
            "variables": {"u": USERNAME},
        }).encode()
        try:
            contributions = get_json(f"{GITHUB_API}/graphql", data=q, github=True)["data"]["user"][
                "contributionsCollection"]["contributionCalendar"]["totalContributions"]
        except Exception:
            contributions = None
    return {
        "repos": int(user.get("public_repos", 0)),
        "followers": int(user.get("followers", 0)),
        "stars": sum(int(r.get("stargazers_count", 0)) for r in own),
        "languages": languages,
        "contributions": contributions,
    }


# --------------------------------------------------------------------------- render
def t(s: object) -> str:
    return escape(str(s))


def plural(n: int, one: str, many: str) -> str:
    return one if n == 1 else many


def fit(s: str, size: float, max_chars: int, min_size: float) -> float:
    return size if len(s) <= max_chars else max(min_size, size * max_chars / len(s))


def wrap(s: str, width: int, max_lines: int) -> list[str]:
    lines = textwrap.wrap(s, width=width) or [""]
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = lines[-1].rstrip(" .,;") + "…"
    return lines


def split_incantation(raw: str | None) -> tuple[str | None, str | None]:
    """Potter DB writes pronunciations inline: 'Reparifors(re-PAR-i-fors)'."""
    if not raw:
        return None, None
    if "(" in raw and raw.rstrip().endswith(")"):
        words, _, say = raw.partition("(")
        return words.strip() or raw, say.rstrip(")").strip() or None
    return raw.strip(), None


def sentence(s: str) -> str:
    s = (s or "").strip()
    return s if not s or s[-1] in ".!?" else s + "."


def frame(k: str, c: dict) -> str:
    grain = (
        f'<filter id="{k}-grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5"/>'
        f'<feColorMatrix values="0 0 0 0 .17  0 0 0 0 .12  0 0 0 0 .07  0 0 0 .06 0"/>'
        f'<feComposite in2="SourceGraphic" operator="in"/></filter>'
    )
    return f"""  <defs>
    <radialGradient id="{k}-bg" cx="30%" cy="20%" r="95%"><stop offset="0" stop-color="{c['bg']}"/><stop offset="1" stop-color="{c['bg2']}"/></radialGradient>
    {grain}
  </defs>
  <style>
    .in {{ animation: in 1.4s ease-out both; }}
    @keyframes in {{ from {{ opacity: 0; transform: translateY(4px) }} to {{ opacity: 1; transform: none }} }}
    .glint {{ animation: glint 3.2s ease-in-out infinite alternate; }}
    @keyframes glint {{ from {{ opacity: .45 }} to {{ opacity: 1 }} }}
    @media (prefers-reduced-motion: reduce) {{ * {{ animation: none !important; }} }}
  </style>
  <rect x="1.5" y="1.5" width="{W - 3}" height="{H - 3}" rx="14" fill="url(#{k}-bg)" stroke="{c['line']}" stroke-opacity=".55" stroke-width="1.5"/>
  {'<rect x="1.5" y="1.5" width="%d" height="%d" rx="14" fill="%s" filter="url(#%s-grain)"/>' % (W - 3, H - 3, c['bg'], k) if k.endswith('light') else ''}
  <rect x="10" y="10" width="{W - 20}" height="{H - 20}" rx="9" fill="none" stroke="{c['line']}" stroke-opacity=".35" stroke-dasharray="2 5"/>"""


def metric_row(c: dict, m: dict, y: int) -> str:
    items = [
        (m["repos"], plural(m["repos"], "repository", "repositories")),
        (m["stars"], plural(m["stars"], "star", "stars")),
        (m["followers"], plural(m["followers"], "follower", "followers")),
    ]
    if m.get("contributions") is not None:
        items.append((m["contributions"], "contributions, 1 yr"))
    step = (W - 80) / len(items)
    return "".join(
        f'<text x="{40 + step * (i + .5):.0f}" y="{y}" text-anchor="middle" font-size="24" font-weight="bold" fill="{c["accent"]}">{t(v)}</text>'
        f'<text x="{40 + step * (i + .5):.0f}" y="{y + 19}" text-anchor="middle" font-size="12" fill="{c["soft"]}">{t(lbl)}</text>'
        for i, (v, lbl) in enumerate(items)
    )


def spell_card(theme: str, spell: dict, m: dict, updated: str, rnd: random.Random) -> str:
    c, k = THEMES[theme], f"card-{theme}"
    heading = "Auror Spell of the Day" if theme == "light" else "Dark Arts Incantation of the Day"
    name = spell.get("name") or "Unknown spell"
    inc, say = split_incantation(spell.get("incantation"))
    effect_lines = wrap(spell.get("effect") or "", 62, 3)
    effect = "".join(f'<tspan x="40" dy="{0 if i == 0 else 19}">{t(l)}</tspan>' for i, l in enumerate(effect_lines))
    say_svg = f' <tspan font-size="12" fill="{c["soft"]}">({t(say)})</tspan>' if say else ""
    inc_svg = (
        f'<text x="40" y="128" font-size="{fit(inc, 18, 34, 12):.1f}" font-style="italic" fill="{c["accent2"]}">“{t(inc)}”{say_svg}</text>'
        if inc else f'<text x="40" y="128" font-size="14" font-style="italic" fill="{c["soft"]}">non-verbal: no incantation recorded</text>'
    )
    footnote = ""
    if theme == "dark":
        curse, meaning = rnd.choice(UNFORGIVABLES)
        footnote = (f'<text x="40" y="226" font-size="12.5" font-style="italic" fill="{c["soft"]}">'
                    f'Unforgivable of the day: <tspan fill="{c["accent2"]}">{t(curse)}</tspan>, a.k.a. {t(meaning)}</text>')
    else:
        footnote = (f'<text x="40" y="226" font-size="12.5" font-style="italic" fill="{c["soft"]}">'
                    f'Research focus: computer vision, uncertainty-aware perception, embodied AI</text>')
    desc = (f"{heading}: {name}" + (f" ({inc})" if inc else "") + f". {sentence(spell.get('effect') or '')} "
            f"GitHub: {m['repos']} {plural(m['repos'], 'repository', 'repositories')}, "
            f"{m['stars']} {plural(m['stars'], 'star', 'stars')}, {m['followers']} {plural(m['followers'], 'follower', 'followers')}"
            + (f", {m['contributions']} contributions in the last year" if m.get('contributions') is not None else "")
            + f". Updated {updated}.")
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="{k}-t {k}-d" font-family="{SERIF}">
  <title id="{k}-t">{t(heading)} for {USERNAME}</title>
  <desc id="{k}-d">{t(desc)}</desc>
{frame(k, c)}
  <g class="in">
    <text x="40" y="52" font-size="13" letter-spacing="2.5" fill="{c['accent']}">{t(heading.upper())}</text>
    <circle class="glint" cx="{W - 46}" cy="47" r="5" fill="{c['accent']}"/>
    <text x="40" y="96" font-size="{fit(name, 28, 30, 17):.1f}" font-weight="bold" fill="{c['ink']}">{t(name)}</text>
    {inc_svg}
    <text x="40" y="160" font-size="14.5" fill="{c['ink']}">{effect}</text>
    {footnote}
    <line x1="40" y1="246" x2="{W - 40}" y2="246" stroke="{c['line']}" stroke-opacity=".4"/>
    {metric_row(c, m, 282)}
    <text x="{W - 24}" y="{H - 16}" text-anchor="end" font-size="10.5" fill="{c['soft']}">{t(spell.get('category') or 'Spell')} from Potter DB · updated {t(updated)}</text>
  </g>
</svg>
"""


def records_card(theme: str, m: dict, updated: str) -> str:
    c, k = THEMES[theme], f"records-{theme}"
    langs = sorted(m["languages"].items(), key=lambda kv: kv[1], reverse=True)
    total = sum(v for _, v in langs) or 1
    top = [(n, v) for n, v in langs if v / total >= 0.01][:5]
    other = total - sum(v for _, v in top)
    if other / total >= 0.005:
        top.append(("Other", other))
    bars = c["bars"] + [c["soft"]]

    rows = [
        ("Public repositories", m["repos"]),
        ("Stars earned", m["stars"]),
        ("Followers", m["followers"]),
    ]
    if m.get("contributions") is not None:
        rows.append(("Contributions, last year", m["contributions"]))
    row_svg = "".join(
        f'<text x="40" y="{96 + i * 27}" font-size="15" fill="{c["ink"]}">{t(lbl)}</text>'
        f'<text x="{W - 40}" y="{96 + i * 27}" text-anchor="end" font-size="16" font-weight="bold" fill="{c["accent"]}">{t(v)}</text>'
        for i, (lbl, v) in enumerate(rows)
    )
    bx, by, bw = 40, 222, W - 80
    x, segs, legend = bx, [], []
    for i, (n, v) in enumerate(top):
        w = bw * v / total
        segs.append(f'<rect x="{x:.1f}" y="{by}" width="{max(w, 1.5):.1f}" height="12" fill="{bars[i % len(bars)]}"/>')
        x += w
        lx, ly = 40 + (i % 3) * 176, by + 40 + (i // 3) * 24
        legend.append(f'<circle cx="{lx + 5}" cy="{ly - 4}" r="5" fill="{bars[i % len(bars)]}"/>'
                      f'<text x="{lx + 16}" y="{ly}" font-size="13" fill="{c["ink"]}">{t(n)} '
                      f'<tspan fill="{c["soft"]}">{100 * v / total:.1f}%</tspan></text>')
    lang_desc = ", ".join(f"{n} {100 * v / total:.0f}%" for n, v in top)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="{k}-t {k}-d" font-family="{SERIF}">
  <title id="{k}-t">Ministry of Magic Records: GitHub statistics for {USERNAME}</title>
  <desc id="{k}-d">{t('; '.join(f'{a}: {b}' for a, b in rows))}. Top languages by code size, excluding notebooks and HTML/CSS: {t(lang_desc)}. Updated {t(updated)}.</desc>
{frame(k, c)}
  <g class="in">
    <text x="40" y="52" font-size="13" letter-spacing="2.5" fill="{c['accent']}">MINISTRY OF MAGIC RECORDS</text>
    <circle class="glint" cx="{W - 46}" cy="47" r="5" fill="{c['accent']}"/>
    <line x1="40" y1="66" x2="{W - 40}" y2="66" stroke="{c['line']}" stroke-opacity=".4"/>
    {row_svg}
    <text x="40" y="208" font-size="13" fill="{c['soft']}">Most-used languages <tspan font-style="italic" font-size="11">(excl. notebooks, HTML/CSS)</tspan></text>
    <rect x="{bx}" y="{by}" width="{bw}" height="12" rx="6" fill="{c['bg2']}"/>
    <g>{''.join(segs)}</g>
    {''.join(legend)}
    <text x="{W - 24}" y="{H - 16}" text-anchor="end" font-size="10.5" fill="{c['soft']}">updated {t(updated)}</text>
  </g>
</svg>
"""


def main() -> int:
    rnd = random.Random()
    try:
        spells = all_spells()
        light_spell = pick(spells, is_light, rnd)
        dark_spell = pick(spells, is_dark, rnd)
        metrics = github_metrics()
    except Exception as exc:
        print(f"warning: data fetch failed, keeping existing cards: {exc}", file=sys.stderr)
        return 0

    updated = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    ASSETS.mkdir(parents=True, exist_ok=True)
    (ASSETS / "card-light.svg").write_text(spell_card("light", light_spell, metrics, updated, rnd), encoding="utf-8")
    (ASSETS / "card-dark.svg").write_text(spell_card("dark", dark_spell, metrics, updated, rnd), encoding="utf-8")
    (ASSETS / "records-light.svg").write_text(records_card("light", metrics, updated), encoding="utf-8")
    (ASSETS / "records-dark.svg").write_text(records_card("dark", metrics, updated), encoding="utf-8")
    print(f"light: {light_spell.get('name')} | dark: {dark_spell.get('name')} | "
          f"repos {metrics['repos']}, stars {metrics['stars']}, followers {metrics['followers']}, "
          f"contributions {metrics['contributions']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
