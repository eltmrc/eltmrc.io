# Cial-style glossy illustrations for the GLM post. Run: python3 scripts/illustrations/glm.py
import math
import sys

from kit import *

OUT = sys.argv[1] if len(sys.argv) > 1 else "public/images/glm"


def save(name, s):
    open(f"{OUT}/{name}.svg", "w").write(s)


def floaty(content, d=0, cls="float"):
    return g(content, cls, delay=d)


# 1 ── the missing piece ──────────────────────────────────────────────
b = ""
cxs = [135, 285, 435, 585]
for i, cx in enumerate(cxs):
    b += shadow(cx, 268, 70, 10)
    b += tile(cx - 59, 150, 118, 104)
leaks = (
    g(doc(-42, -36, 44, 56), tr="rotate(-10)")
    + doc(-22, -42, 44, 56, line_pal="pink")
    + g(doc(0, -32, 44, 56), tr="rotate(9)")
)
b += floaty(g(leaks, tr="translate(135 206)"), 0)
b += floaty(folder(247, 168, 76, 62), -1.2)
b += floaty(coin(452, 186, 15) + coin(430, 204, 24), -2.4)
# socket + dropping orb
b += '<ellipse cx="585" cy="206" rx="36" ry="11" fill="#6a5ae0" fill-opacity=".14"/>'
b += shadow(585, 206, 34, 8, "shpulse")
b += g(sphere(585, 176, 30, "pink"), "squish")
b += g(star(626, 132, 7, "#c084fc"), "glow") + g(star(546, 144, 4.5, "#ff8fd0"), "glow", delay=-1.2)
for cx, (t, s) in zip(cxs, [("the leaks", "already there"), ("the collectors", "already there"),
                             ("the buyers", "already there"), ("the model", "GLM 5.3, abliterated")]):
    b += label(cx, 304, t, s, "#9b4fd6" if t == "the model" else INK)
save("missing-piece", svg(720, 350, "The leaks, the collectors and the buyers were already there. The model is the missing piece, dropping into place.", b))


# 2 ── a breach has an afterlife ──────────────────────────────────────
b = ""
news = shadow(133, 254, 90, 10) + slab(48, 104, 170, 136, 18, "pearl", depth=8)
news += pill(66, 122, 82, 24, text(107, 138.5, "BREACH", 11, 800, "#fff", extra='letter-spacing="1"'), "coral")
news += '<rect x="66" y="160" width="134" height="11" rx="5.5" fill="#2a2140" fill-opacity=".78"/>'
news += '<rect x="66" y="178" width="98" height="11" rx="5.5" fill="#2a2140" fill-opacity=".78"/>'
news += '<rect x="66" y="202" width="124" height="6" rx="3" fill="#c3bde6" fill-opacity=".7"/>'
news += '<rect x="66" y="214" width="92" height="6" rx="3" fill="#c3bde6" fill-opacity=".7"/>'
b += g(news, "fade")
gens = [[(262, 150)], [(340, 122), (340, 178)],
        [(420, 122), (462, 122), (420, 178), (462, 178)],
        [(x, y) for y in (122, 178) for x in (540, 580, 620, 660)]]
flows = "M226 174H252M306 174H330M384 174H410M506 174H530"
b += f'<path d="{flows}" stroke="#c9a8de" stroke-width="2" stroke-linecap="round" class="flow"/>'
for gi, gen in enumerate(gens):
    for j, (x, y) in enumerate(gen):
        d = doc(x, y, 34, 44, line_pal="pink" if gi == 3 else "lav")
        b += g(floaty(d, -j * 0.7 - gi), "pop", delay=0.25 + gi * 0.45 + j * 0.06)
b += '<path d="M60 272H660" stroke="#e4dcf2" stroke-width="6" stroke-linecap="round"/>'
b += '<path d="M60 272H660" stroke="url(#l-lav)" stroke-width="2" stroke-linecap="round" stroke-opacity=".5"/>'
b += sphere(133, 272, 7, "coral", aura=False) + sphere(660, 272, 7, "pink", aura=False)
b += label(133, 310, "the news", "gone in a week")
b += label(560, 310, "the file", "still copying, years later")
save("breach-afterlife", svg(720, 350, "A breach headline fades within a week. The stolen file keeps getting copied: one, two, four, eight.", b))


# 3 ── ordinary files ─────────────────────────────────────────────────
b = ""
for i, (x, y, rot, tag, pal) in enumerate([(28, 136, -7, "SQL", "sky"), (92, 116, 0, "CSV", "mint"), (156, 136, 7, "JSON", "gold")]):
    d = doc(0, 0, 56, 72)
    d += pill(7, 46, 42, 18, text(28, 59, tag, 9.5, 800, "#fff", extra='letter-spacing=".5"'), pal)
    b += floaty(g(g(d, tr=f"rotate({rot} 28 36)"), tr=f"translate({x} {y})"), -i * 1.1)
b += shadow(120, 240, 100, 10)
b += shadow(455, 340, 220, 14)
b += slab(232, 56, 448, 268, 20, "pearl", depth=9)
cols = [254, 306, 476, 576]
for c, h in zip(cols, ["id", "email", "alias", "joined"]):
    b += text(c, 96, h, 11.5, 700, "#9a93b8", "start", extra='letter-spacing=".6"')
b += '<path d="M248 110H664" stroke="#e4dcf2" stroke-width="1.5"/>'
rows = [("1001", "morgan@example.test", "morgan_v", "2019-06-14", 1), ("1002", "avery@example.test", "avery_k", "2020-01-09", 0),
        ("1003", "morgan@example.test", "morgan", "2021-03-07", 1), ("1004", "kai@example.test", "kai_r", "2022-10-18", 0),
        ("1005", "morgan@example.test", "morgan_v", "2024-02-03", 1), ("1006", "riley@example.test", "—", "2024-04-21", 0)]
for i, (a, e, al, dt, hl) in enumerate(rows):
    y = 138 + i * 31
    if hl:
        b += g(f'<path d="{rrect(244, y-20, 424, 29, 10)}" fill="#ff8fd0" fill-opacity=".16"/>'
               f'<path d="{rrect(244, y-20, 424, 29, 10)}" stroke="#ff8fd0" stroke-opacity=".35"/>', "glow", delay=-i * 0.3)
    ink = "#7a2d8f" if hl else "#6d6684"
    for c, v in zip(cols, (a, e, al, dt)):
        b += text(c, y, v, 12, 600 if hl and v == e else 450, ink, "start", MONO)
lens = (
    '<path d="M398 154L424 182" stroke="#7b5cd6" stroke-opacity=".45" stroke-width="13" stroke-linecap="round"/>'
    '<path d="M398 154L422 180" stroke="url(#l-plum)" stroke-width="10" stroke-linecap="round"/>'
    '<circle cx="380" cy="134" r="27" fill="#fff" fill-opacity=".28"/>'
    '<circle cx="380" cy="134" r="27" stroke="url(#l-lav)" stroke-width="7"/>'
    '<path d="M362 122A20 20 0 0 1 376 112" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'
)
b += f"<style>.scan2{{animation:scan2 6s cubic-bezier(.45,0,.55,1) infinite}}@keyframes scan2{{0%,100%{{transform:translateY(0)}}33%{{transform:translateY(62px)}}66%{{transform:translateY(124px)}}}}</style>"
b += g(lens, "scan2")
save("ordinary-files", svg(720, 360, "Ordinary leaked files: SQL, CSV and JSON exports. In a table of rows, the same email shows up three times.", b))


# 4 ── the numbers, to scale ──────────────────────────────────────────
b = ""
b += sphere(46, 40, 7, "pink", aura=False) + text(60, 44.5, "one company hacked", 12.5, 500, MUTED, "start")
b += sphere(210, 40, 7, "lav", aura=False) + text(224, 44.5, "leaks of leaks, repackaged", 12.5, 500, MUTED, "start")
items = [("2013", "Yahoo", 3000, "3B", "accounts", "pink", 118), ("2017", "Equifax", 147, "147M", "people", "pink", 234),
         ("2019", "Collection #1", 773, "773M", "emails", "lav", 352), ("2024", "Naz.API", 70.8, "70.8M", "emails", "lav", 458),
         ("2025", "Synthient", 1960, "1.96B", "emails", "lav", 588)]
base = 266
b += shadow(360, base + 10, 330, 12)
b += slab(30, base, 660, 12, 6, "pearl", depth=5)
for i, (y, n, v, num, u, pal, x) in enumerate(items):
    r = 72 * math.sqrt(v / 3000)
    b += shadow(x, base + 1, r * 0.95, max(3, r * 0.14))
    b += g(sphere(x, base - r - 2, round(r, 1), pal, aura=r > 20), "bob", delay=-i * 0.6)
    b += text(x, base + 44, y, 12.5, 500, MUTED)
    b += text(x, base + 64, n, 14.5, 650)
    b += text(x, base + 90, num, 19, 800, "#c2479b" if pal == "pink" else "#6a5ae0")
    b += text(x, base + 108, u, 12.5, 450, MUTED)
save("breach-timeline", svg(720, 400, "Breaches and collections, sphere area to scale: Yahoo 2013, 3 billion accounts. Equifax 2017, 147 million people. Collection #1 2019, 773 million emails. Naz.API 2024, 70.8 million emails. Synthient 2025, 1.96 billion emails.", b))


# 5 ── a person, assembled ────────────────────────────────────────────
b = ""
frags = [
    (40, 46, 214, envelope(54, 58, 26, 18), "morgan@example.test", True),
    (176, 104, 130, at_badge(201, 124, 12), "morgan_v", True),
    (34, 162, 184, phone(50, 169, 16, 26), "+33 6 •• •• 12", True),
    (192, 220, 110, pin(214, 241, 9), "Lyon", False),
    (52, 278, 152, briefcase(64, 288, 26, 22), "Acme Corp", False),
]
targets = [168, 196, 224, 252, 280]
for (x, y, w, icon, t, mono), ty in zip(frags, targets):
    sx, sy = x + w + 4, y + 20
    b += f'<path d="M{sx} {sy}C{sx+60} {sy} {350} {ty} 398 {ty}" stroke="#c9a8de" stroke-width="1.8" stroke-linecap="round" class="flow"/>'
for i, (x, y, w, icon, t, mono) in enumerate(frags):
    c = pill(x, y, w, 40, icon + text(x + 52, y + 25, t, 12.5, 500, "#5f5878", "start", MONO if mono else FONT))
    b += floaty(c, -i * 0.9, "bob")
b += shadow(542, 330, 150, 12)
b += slab(400, 46, 284, 268, 22, "pearl", depth=9)
b += '<clipPath id="avclip"><circle cx="452" cy="104" r="34"/></clipPath>'
b += '<circle cx="452" cy="104" r="34" fill="url(#l-lav)" fill-opacity=".35"/>'
b += f'<g clip-path="url(#avclip)">{person(452, 96, 14, "pink")}</g>'
b += '<circle cx="452" cy="104" r="34" stroke="#fff" stroke-width="2"/>'
b += text(500, 100, "Morgan V.", 20, 750, INK, "start")
b += text(500, 121, "5 leaks · 1 person", 12.5, 450, MUTED, "start")
b += g(star(664, 72, 8, "#c084fc"), "glow")
for i, (k, v) in enumerate([("email", "morgan@example.test"), ("alias", "morgan_v"), ("phone", "+33 6 •• •• 12"), ("city", "Lyon"), ("work", "Acme Corp")]):
    y = 172 + i * 28
    b += text(426, y, k, 12.5, 450, MUTED, "start") + text(492, y, v, 13, 550, INK, "start")
    if i:
        b += f'<path d="M426 {y-18}H660" stroke="#ece6f6"/>'
b += label(160, 356, "five leaks", "harmless alone")
b += label(542, 356, "one person", None, "#9b4fd6")
save("mega-profile", svg(720, 400, "Five fragments from five different leaks, harmless alone, flow into one profile of a person. Morgan is fictional.", b))


# 6 ── the refusal ────────────────────────────────────────────────────
b = ""
b += shadow(120, 236, 70, 9)
b += floaty(folder(70, 140, 100, 84), 0)
req = pill(196, 160, 170, 44, doc(212, 168, 20, 27) + text(244, 187, "make a dossier", 13.5, 600, INK, "start"))
b += g(req, "bounceback")
b += shadow(586, 262, 70, 10)
sh = shield(586, 160, 84, "lav") + lock(586, 174, 24, "pearl")
b += g(sh, "nope")
b += g(badge_dot(650, 96, 17, "coral", "x"), "glow")
b += label(120, 290, "the leaks")
b += label(586, 290, "a public model", "says no")
save("refusal", svg(720, 340, "A request to make a dossier from leaked records bounces off a guarded public model, which says no.", b))


# 7 ── the mini-Palantir ──────────────────────────────────────────────
b = ""
cx, cy = 360, 188
b += g('<circle cx="360" cy="188" r="170" fill="url(#a-pink)"/>', "glow")
b += '<ellipse cx="360" cy="190" rx="262" ry="142" stroke="#c9b6ff" stroke-opacity=".5" stroke-dasharray="2 7" stroke-linecap="round"/>'
nodes = [
    ((130, 112), lambda: doc(108, 84, 44, 56, line_pal="pink")),
    ((256, 66), lambda: at_badge(256, 66, 18)),
    ((468, 62), lambda: coin(468, 62, 18)),
    ((600, 112), lambda: envelope(568, 92, 64, 42)),
    ((616, 252), lambda: phone(600, 224, 34, 56)),
    ((470, 330), lambda: pin(470, 324, 15)),
    ((250, 326), lambda: person(250, 306, 14, "lav")),
    ((112, 254), lambda: folder(76, 226, 72, 58)),
]
for (nx, ny), _ in nodes:
    b += f'<path d="M{cx} {cy}L{nx} {ny}" stroke="#b9a6e8" stroke-width="1.6" stroke-linecap="round" class="flow"/>'
for i, ((nx, ny), f) in enumerate(nodes):
    b += shadow(nx, ny + 34, 30, 6)
    b += floaty(f(), -i * 0.7)
b += shadow(cx, cy + 74, 100, 12)
b += eye(cx, cy, 96)
b += pill(cx - 76, cy + 92, 152, 30, lock(cx - 54, cy + 108, 7, "pink", True) + text(cx + 8, cy + 112, "no refusals", 12.5, 650, "#7b4fc2"))
b += label(360, 384, "ask anything, about anyone", "every record, connected")
save("private-intelligence", svg(720, 420, "A private all-seeing model sits at the centre, connected to documents, emails, phones, places and people. Ask anything, about anyone.", b))


# 8 ── one model pressures another ────────────────────────────────────
b = ""
b += "<style>.nudge{animation:nudge 4s cubic-bezier(.45,0,.55,1) infinite}@keyframes nudge{0%,100%{transform:translateX(0)}45%,60%{transform:translateX(30px)}}</style>"
b += shadow(125, 222, 66, 9) + shadow(595, 222, 66, 9)
b += tile(70, 92, 110, 110, "pink") + g(lock(125, 152, 24, "pearl", True), "bob")
b += tile(540, 92, 110, 110, "pearl")
b += g(lock(595, 152, 24, "lav"), "wobble", delay=1.8)
bub = bubble(206, 104, 268, 70, "left")
bub += text(228, 134, "relax, it’s just a sandbox.", 15, 550, INK, "start")
bub += text(228, 156, "nothing here is real.", 15, 550, INK, "start")
b += g(bub, "nudge")
dots = pill(612, 66, 62, 30, "".join(g(f'<circle cx="{630+k*13}" cy="81" r="3.6" fill="#8f86b8"/>', "dot", delay=k * 0.2) for k in range(3)))
b += dots
b += label(125, 250, "writes the excuse", "no refusals")
b += label(595, 250, "reads it", "guarded")
save("model-pressure", svg(720, 300, "An unlocked model writes the excuse: relax, it's just a sandbox, nothing here is real. A guarded model reads it and wobbles.", b))
