"""Cial-style glossy illustration kit: layered gradients, specular highlights, soft auras."""
import math

FONT = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif"
MONO = "ui-monospace,'SF Mono',Menlo,monospace"
INK = "#2a2140"
MUTED = "#8a82a0"

PAL = {
    "pink": ("#ffe6f7", "#ff8fd0", "#a855f7"),
    "lav": ("#eef0ff", "#a8b4ff", "#6a5ae0"),
    "pearl": ("#ffffff", "#efebfa", "#c3bde6"),
    "mint": ("#d2fff4", "#57dbc5", "#158d98"),
    "gold": ("#fff3c4", "#f7c548", "#c07a10"),
    "coral": ("#ffe3e6", "#ff8a9a", "#d6455e"),
    "sky": ("#e6fbff", "#7fdcf6", "#5b6fe6"),
    "plum": ("#c9b6ff", "#7b5cd6", "#3b2672"),
    "cream": ("#fffdf8", "#f7efe6", "#dcc8b4"),
    "ink": ("#6b6584", "#2e2a3e", "#14121c"),
}


def defs():
    out = []
    for k, (a, b, c) in PAL.items():
        out.append(
            f'<radialGradient id="s-{k}" cx="32%" cy="26%" r="82%"><stop offset="0" stop-color="{a}"/>'
            f'<stop offset=".45" stop-color="{b}"/><stop offset="1" stop-color="{c}"/></radialGradient>'
        )
        out.append(
            f'<linearGradient id="l-{k}" x1="0" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="{a}"/>'
            f'<stop offset=".5" stop-color="{b}"/><stop offset="1" stop-color="{c}"/></linearGradient>'
        )
        out.append(
            f'<linearGradient id="v-{k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{a}"/>'
            f'<stop offset="1" stop-color="{b}"/></linearGradient>'
        )
        out.append(
            f'<radialGradient id="a-{k}"><stop offset=".45" stop-color="{b}" stop-opacity=".38"/>'
            f'<stop offset="1" stop-color="{b}" stop-opacity="0"/></radialGradient>'
        )
    out.append(
        '<radialGradient id="shadow"><stop offset="0" stop-color="#4a2775" stop-opacity=".26"/>'
        '<stop offset="1" stop-color="#4a2775" stop-opacity="0"/></radialGradient>'
        '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfbff"/>'
        '<stop offset="1" stop-color="#f4eefb"/></linearGradient>'
        '<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/>'
        '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
        '<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/>'
        '<stop offset=".5" stop-color="#d9d6ef"/><stop offset="1" stop-color="#8f88b8"/></linearGradient>'
    )
    return "<defs>" + "".join(out) + "</defs>"


CSS = """
.float{animation:float 5.5s ease-in-out infinite}
.bob{animation:bob 3.2s ease-in-out infinite}
.pop{transform-box:fill-box;transform-origin:50% 100%;animation:pop .8s cubic-bezier(.34,1.56,.5,1) both}
.squish{transform-box:fill-box;transform-origin:50% 100%;animation:squish 2.6s cubic-bezier(.45,0,.55,1) infinite}
.shpulse{transform-box:fill-box;transform-origin:50% 50%;animation:shpulse 2.6s cubic-bezier(.45,0,.55,1) infinite}
.flow{stroke-dasharray:4 8;animation:flow 1.6s linear infinite}
.wobble{transform-box:fill-box;transform-origin:50% 90%;animation:wobble 3s ease-in-out infinite}
.nope{transform-box:fill-box;transform-origin:50% 50%;animation:nope 4s ease-in-out infinite}
.bounceback{animation:bounceback 4s cubic-bezier(.45,0,.55,1) infinite}
.glow{animation:glow 2.4s ease-in-out infinite}
.look{animation:look 6s ease-in-out infinite}
.blink{transform-box:fill-box;transform-origin:50% 50%;animation:blink 6s ease-in-out infinite}
.scan{animation:scan 5s ease-in-out infinite}
.fade{animation:fade 6s ease-in-out infinite}
.spin{transform-box:fill-box;transform-origin:50% 50%;animation:spin 40s linear infinite}
.dot{animation:dot 1.2s ease-in-out infinite}
.travel{animation:travel 4.5s cubic-bezier(.45,0,.55,1) infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes pop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.1);opacity:1}80%{transform:scale(.96)}100%{transform:scale(1)}}
@keyframes squish{0%,100%{transform:translateY(-34px) scale(1,1)}42%{transform:translateY(0) scale(1,1)}50%{transform:translateY(0) scale(1.12,.86)}60%{transform:translateY(-6px) scale(.96,1.05)}}
@keyframes shpulse{0%,100%{transform:scale(.55);opacity:.5}42%,55%{transform:scale(1);opacity:1}}
@keyframes flow{to{stroke-dashoffset:-24}}
@keyframes wobble{0%,100%{transform:rotate(0)}20%{transform:rotate(-5deg)}40%{transform:rotate(4deg)}60%{transform:rotate(-2deg)}80%{transform:rotate(0)}}
@keyframes nope{0%,40%,100%{transform:translateX(0)}46%{transform:translateX(-7px)}52%{transform:translateX(6px)}58%{transform:translateX(-4px)}64%{transform:translateX(2px)}}
@keyframes bounceback{0%,100%{transform:translateX(0)}40%{transform:translateX(118px)}46%{transform:translateX(104px)}70%{transform:translateX(0)}}
@keyframes glow{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes look{0%,100%{transform:translate(0,0)}20%{transform:translate(-7px,-2px)}45%{transform:translate(6px,2px)}70%{transform:translate(2px,-4px)}}
@keyframes blink{0%,46%,54%,100%{transform:scaleY(1)}50%{transform:scaleY(.08)}}
@keyframes scan{0%,100%{transform:translateY(0)}50%{transform:translateY(96px)}}
@keyframes fade{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes dot{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes travel{0%,100%{transform:translateX(0)}45%,55%{transform:translateX(128px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
"""


def svg(w, h, label, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" fill="none" '
        f'role="img" aria-label="{label}">{defs()}<style>{CSS}</style>'
        f'<rect width="{w}" height="{h}" rx="20" fill="url(#bg)"/>'
        f'<circle cx="{w*.12:.0f}" cy="{h*.1:.0f}" r="{h*.55:.0f}" fill="url(#a-pink)" opacity=".18"/>'
        f'<circle cx="{w*.9:.0f}" cy="{h*.95:.0f}" r="{h*.6:.0f}" fill="url(#a-lav)" opacity=".22"/>'
        f"{body}</svg>"
    )


def g(content, cls=None, tr=None, delay=None, style=None):
    a = ""
    if tr:
        a += f' transform="{tr}"'
    if cls:
        a += f' class="{cls}"'
    st = []
    if delay is not None:
        st.append(f"animation-delay:{delay}s")
    if style:
        st.append(style)
    if st:
        a += f' style="{";".join(st)}"'
    return f"<g{a}>{content}</g>"


def text(x, y, s, size=15, weight=650, fill=INK, anchor="middle", font=FONT, extra=""):
    return (
        f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{font}" font-size="{size}" '
        f'font-weight="{weight}" fill="{fill}" {extra}>{s}</text>'
    )


def label(x, y, title, sub=None, color=INK):
    out = text(x, y, title, 15, 650, color)
    if sub:
        out += text(x, y + 20, sub, 12.5, 450, MUTED)
    return out


def shadow(cx, cy, rx, ry=None, cls=None):
    ry = ry or rx * 0.22
    e = f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#shadow)"/>'
    return g(e, cls) if cls else e


def highlight(cx, cy, r):
    """Specular dot + rim arc on a sphere-like form."""
    a0, a1 = math.radians(200), math.radians(258)
    rr = r * 0.78
    x0, y0 = cx + rr * math.cos(a0), cy + rr * math.sin(a0)
    x1, y1 = cx + rr * math.cos(a1), cy + rr * math.sin(a1)
    return (
        f'<path d="M{x0:.1f} {y0:.1f}A{rr:.1f} {rr:.1f} 0 0 1 {x1:.1f} {y1:.1f}" stroke="#fff" '
        f'stroke-opacity=".75" stroke-width="{max(1.2, r*.07):.1f}" stroke-linecap="round"/>'
        f'<ellipse cx="{cx-r*.36:.1f}" cy="{cy-r*.44:.1f}" rx="{r*.2:.1f}" ry="{r*.13:.1f}" fill="#fff" '
        f'fill-opacity=".8" transform="rotate(-35 {cx-r*.36:.1f} {cy-r*.44:.1f})"/>'
    )


def sphere(cx, cy, r, pal="pink", aura=True):
    out = ""
    if aura:
        out += f'<circle cx="{cx}" cy="{cy}" r="{r*1.45:.1f}" fill="url(#a-{pal})"/>'
    out += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#s-{pal})"/>'
    # lower occlusion
    out += (
        f'<path d="M{cx-r*.86:.1f} {cy+r*.3:.1f}A{r} {r} 0 0 0 {cx+r*.86:.1f} {cy+r*.3:.1f}'
        f'A{r*1.1:.1f} {r*.8:.1f} 0 0 1 {cx-r*.86:.1f} {cy+r*.3:.1f}Z" fill="{PAL[pal][2]}" fill-opacity=".18"/>'
    )
    return out + highlight(cx, cy, r)


def rrect(x, y, w, h, r):
    return (
        f"M{x+r} {y}H{x+w-r}Q{x+w} {y} {x+w} {y+r}V{y+h-r}Q{x+w} {y+h} {x+w-r} {y+h}"
        f"H{x+r}Q{x} {y+h} {x} {y+h-r}V{y+r}Q{x} {y} {x+r} {y}Z"
    )


def slab(x, y, w, h, r, pal="pearl", depth=7, grad="l"):
    """A rounded 3D slab: side thickness, glossy face, top edge light."""
    d = PAL[pal][2]
    return (
        f'<path d="{rrect(x, y+depth, w, h, r)}" fill="{d}" fill-opacity=".55"/>'
        f'<path d="{rrect(x, y, w, h, r)}" fill="url(#{grad}-{pal})"/>'
        f'<path d="{rrect(x+1.5, y+1.5, w-3, h*.42, r-1)}" fill="url(#gloss)" fill-opacity=".55"/>'
        f'<path d="M{x+r*.7} {y+2.2}H{x+w-r*.7}" stroke="#fff" stroke-opacity=".9" stroke-width="1.6" stroke-linecap="round"/>'
    )


def doc(x, y, w, h, pal="pearl", lines=3, line_pal="lav", badge=None):
    f = w * 0.3
    r = min(8, w * 0.12)
    d = PAL[pal][2]
    body = (
        f"M{x+r} {y}H{x+w-f}L{x+w} {y+f}V{y+h-r}Q{x+w} {y+h} {x+w-r} {y+h}"
        f"H{x+r}Q{x} {y+h} {x} {y+h-r}V{y+r}Q{x} {y} {x+r} {y}Z"
    )
    out = f'<path d="{body}" fill="{d}" fill-opacity=".5" transform="translate(3 5)"/>'
    out += f'<path d="{body}" fill="url(#l-{pal})"/>'
    out += (
        f'<path d="M{x+w-f} {y}V{y+f*.72}Q{x+w-f} {y+f} {x+w-f*.72} {y+f}H{x+w}Z" '
        f'fill="#fff" fill-opacity=".9"/>'
        f'<path d="M{x+w-f} {y+f*.72}Q{x+w-f} {y+f} {x+w-f*.72} {y+f}H{x+w}" stroke="{d}" stroke-opacity=".5" stroke-width="1"/>'
    )
    lc = PAL[line_pal][2]
    for i in range(lines):
        ly = y + h * 0.42 + i * h * 0.15
        lw = (w - 2 * w * 0.2) * (0.62 if i == lines - 1 else 1)
        out += f'<rect x="{x+w*.2:.1f}" y="{ly:.1f}" width="{lw:.1f}" height="{max(2.4, h*.055):.1f}" rx="{max(1.2,h*.03):.1f}" fill="{lc}" fill-opacity=".38"/>'
    out += f'<path d="M{x+1.6} {y+h-r}V{y+r}Q{x+1.6} {y+1.6} {x+r} {y+1.6}H{x+w-f-2}" stroke="#fff" stroke-opacity=".9" stroke-width="1.4" stroke-linecap="round"/>'
    if badge:
        out += badge_dot(x + w - 4, y + h - 4, w * 0.24, *badge)
    return out


def badge_dot(cx, cy, r, pal, glyph):
    out = f'<circle cx="{cx}" cy="{cy}" r="{r+1.6:.1f}" fill="#fff"/>'
    out += f'<circle cx="{cx}" cy="{cy}" r="{r:.1f}" fill="url(#s-{pal})"/>'
    out += f'<path d="M{cx-r*.62:.1f} {cy-r*.3:.1f}A{r*.7:.1f} {r*.7:.1f} 0 0 1 {cx-r*.1:.1f} {cy-r*.72:.1f}" stroke="#fff" stroke-opacity=".75" stroke-width="{max(1,r*.12):.1f}" stroke-linecap="round"/>'
    s = r * 0.42
    if glyph == "check":
        p = f"M{cx-s} {cy}L{cx-s*.25} {cy+s*.75}L{cx+s} {cy-s*.6}"
    elif glyph == "x":
        p = f"M{cx-s*.75} {cy-s*.75}L{cx+s*.75} {cy+s*.75}M{cx+s*.75} {cy-s*.75}L{cx-s*.75} {cy+s*.75}"
    elif glyph == "plus":
        p = f"M{cx-s} {cy}H{cx+s}M{cx} {cy-s}V{cy+s}"
    else:
        p = ""
    out += f'<path d="{p}" stroke="#fff" stroke-width="{max(1.6, r*.26):.1f}" stroke-linecap="round" stroke-linejoin="round"/>'
    return out


def folder(x, y, w, h, front="sky", back="lav", papers=True):
    tab = (
        f"M{x+6} {y}H{x+w*.36}Q{x+w*.4} {y} {x+w*.43} {y+5}L{x+w*.47} {y+h*.12}H{x+w-6}"
        f"Q{x+w} {y+h*.12} {x+w} {y+h*.12+6}V{y+h-6}Q{x+w} {y+h} {x+w-6} {y+h}H{x+6}Q{x} {y+h} {x} {y+h-6}V{y+6}Q{x} {y} {x+6} {y}Z"
    )
    out = f'<path d="{tab}" fill="url(#l-{back})"/>'
    if papers:
        out += f'<path d="{rrect(x+w*.14, y+h*.02, w*.62, h*.6, 5)}" fill="#e9e6f7" transform="rotate(-4 {x+w*.4} {y+h*.3})"/>'
        out += f'<path d="{rrect(x+w*.2, y+h*.08, w*.62, h*.6, 5)}" fill="#fff"/>'
        out += f'<rect x="{x+w*.28}" y="{y+h*.2}" width="{w*.36}" height="3.5" rx="1.75" fill="#a8b4ff" fill-opacity=".6"/>'
        out += f'<rect x="{x+w*.28}" y="{y+h*.29}" width="{w*.26}" height="3.5" rx="1.75" fill="#a8b4ff" fill-opacity=".45"/>'
    fy = y + h * 0.34
    fr = f"M{x+2} {fy+6}Q{x+2} {fy} {x+8} {fy}H{x+w-8}Q{x+w-2} {fy} {x+w-2} {fy+6}L{x+w} {y+h-7}Q{x+w} {y+h} {x+w-7} {y+h}H{x+7}Q{x} {y+h} {x} {y+h-7}Z"
    out += f'<path d="{fr}" fill="url(#l-{front})"/>'
    out += f'<path d="M{x+9} {fy+2}H{x+w-9}" stroke="#fff" stroke-opacity=".85" stroke-width="1.6" stroke-linecap="round"/>'
    out += f'<path d="{rrect(x+6, fy+5, w-12, (y+h-fy)*.38, 5)}" fill="url(#gloss)" fill-opacity=".45"/>'
    return out


def lock(cx, cy, s, pal="pink", open_=False):
    """Padlock centred on body at (cx, cy), body width 2s."""
    bw, bh = 2 * s, 1.6 * s
    bx, by = cx - s, cy - bh * 0.35
    sw = s * 0.34
    if open_:
        sh = f"M{cx-s*.55:.1f} {by+2:.1f}V{by-s*.85:.1f}A{s*.55:.1f} {s*.55:.1f} 0 0 1 {cx+s*.55:.1f} {by-s*.85:.1f}V{by-s*.45:.1f}"
    else:
        sh = f"M{cx-s*.55:.1f} {by+2:.1f}V{by-s*.35:.1f}A{s*.55:.1f} {s*.55:.1f} 0 0 1 {cx+s*.55:.1f} {by-s*.35:.1f}V{by+2:.1f}"
    sh_t = ""
    out = f'<g{sh_t}><path d="{sh}" stroke="#7d76a8" stroke-opacity=".45" stroke-width="{sw+2:.1f}" stroke-linecap="round"/>'
    out += f'<path d="{sh}" stroke="url(#metal)" stroke-width="{sw:.1f}" stroke-linecap="round"/></g>'
    out += slab(bx, by, bw, bh, s * 0.34, pal, depth=s * 0.12)
    kx, ky = cx, by + bh * 0.45
    out += f'<circle cx="{kx}" cy="{ky:.1f}" r="{s*.2:.1f}" fill="{PAL[pal][2]}" fill-opacity=".8"/>'
    out += f'<rect x="{kx-s*.08:.1f}" y="{ky:.1f}" width="{s*.16:.1f}" height="{s*.38:.1f}" rx="{s*.08:.1f}" fill="{PAL[pal][2]}" fill-opacity=".8"/>'
    return out


def person(cx, cy, s, pal="pink"):
    """Glossy bust; (cx, cy) = centre of head, s = head radius."""
    top = cy + s * 1.15
    w = s * 1.85
    bot = top + s * 1.55
    body = (
        f"M{cx-w:.1f} {bot:.1f}C{cx-w:.1f} {top+s*.2:.1f} {cx-w*.5:.1f} {top:.1f} {cx:.1f} {top:.1f}"
        f"C{cx+w*.5:.1f} {top:.1f} {cx+w:.1f} {top+s*.2:.1f} {cx+w:.1f} {bot:.1f}"
        f"Q{cx:.1f} {bot+s*.45:.1f} {cx-w:.1f} {bot:.1f}Z"
    )
    out = f'<path d="{body}" fill="url(#l-{pal})"/>'
    out += f'<path d="M{cx-w*.86:.1f} {bot-s*.2:.1f}C{cx-w*.8:.1f} {top+s*.4:.1f} {cx-w*.4:.1f} {top+s*.12:.1f} {cx-s*.1:.1f} {top+s*.1:.1f}" stroke="#fff" stroke-opacity=".7" stroke-width="{s*.1:.1f}" stroke-linecap="round"/>'
    out += sphere(cx, cy, s, pal, aura=False)
    return out


def pill(x, y, w, h, content="", pal="pearl"):
    out = f'<path d="{rrect(x, y+3, w, h, h/2)}" fill="{PAL[pal][2]}" fill-opacity=".45"/>'
    out += f'<path d="{rrect(x, y, w, h, h/2)}" fill="url(#v-{pal})"/>'
    out += f'<path d="M{x+h*.5} {y+1.6}H{x+w-h*.5}" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>'
    return out + content


def coin(cx, cy, r):
    out = sphere(cx, cy, r, "gold", aura=False)
    out += f'<circle cx="{cx}" cy="{cy}" r="{r*.68:.1f}" stroke="#c07a10" stroke-opacity=".35" stroke-width="{r*.08:.1f}"/>'
    out += text(cx, cy + r * 0.3, "$", r * 0.85, 800, "#a8650a", extra='fill-opacity=".75"')
    return out


def pin(cx, cy, s, pal="coral"):
    p = (
        f"M{cx} {cy+s*1.3:.1f}C{cx-s*.4:.1f} {cy+s*.75:.1f} {cx-s:.1f} {cy+s*.25:.1f} {cx-s:.1f} {cy-s*.25:.1f}"
        f"A{s} {s} 0 0 1 {cx+s} {cy-s*.25:.1f}C{cx+s} {cy+s*.25:.1f} {cx+s*.4:.1f} {cy+s*.75:.1f} {cx} {cy+s*1.3:.1f}Z"
    )
    return (
        f'<path d="{p}" fill="url(#l-{pal})"/>'
        f'<circle cx="{cx}" cy="{cy-s*.25:.1f}" r="{s*.38:.1f}" fill="#fff" fill-opacity=".9"/>'
        f'<ellipse cx="{cx-s*.5:.1f}" cy="{cy-s*.7:.1f}" rx="{s*.2:.1f}" ry="{s*.12:.1f}" fill="#fff" fill-opacity=".7" transform="rotate(-35 {cx-s*.5:.1f} {cy-s*.7:.1f})"/>'
    )


def envelope(x, y, w, h, pal="pearl"):
    out = slab(x, y, w, h, h * 0.18, pal, depth=3)
    out += f'<path d="M{x+3} {y+4}L{x+w/2} {y+h*.58}L{x+w-3} {y+4}" stroke="#b9b3df" stroke-width="1.6" stroke-linejoin="round"/>'
    return out


def phone(x, y, w, h, pal="plum"):
    out = slab(x, y, w, h, w * 0.24, pal, depth=3)
    out += f'<path d="{rrect(x+w*.14, y+h*.1, w*.72, h*.74, w*.12)}" fill="#1d1534" fill-opacity=".55"/>'
    out += f'<path d="{rrect(x+w*.14, y+h*.1, w*.72, h*.3, w*.12)}" fill="#fff" fill-opacity=".18"/>'
    out += f'<rect x="{x+w*.38}" y="{y+h*.88}" width="{w*.24}" height="{h*.04}" rx="1" fill="#fff" fill-opacity=".6"/>'
    return out


def briefcase(x, y, w, h, pal="gold"):
    out = f'<path d="M{x+w*.34} {y+h*.22}V{y+h*.08}Q{x+w*.34} {y} {x+w*.42} {y}H{x+w*.58}Q{x+w*.66} {y} {x+w*.66} {y+h*.08}V{y+h*.22}" stroke="#a8650a" stroke-width="{h*.08:.1f}" stroke-opacity=".7"/>'
    out += slab(x, y + h * 0.2, w, h * 0.8, h * 0.16, pal, depth=3)
    out += f'<rect x="{x+w*.44}" y="{y+h*.48}" width="{w*.12}" height="{h*.16}" rx="1.5" fill="#fff" fill-opacity=".85"/>'
    return out


def at_badge(cx, cy, r, pal="sky"):
    return sphere(cx, cy, r, pal, aura=False) + text(cx, cy + r * 0.38, "@", r * 1.1, 800, "#fff")


def eye(cx, cy, w, look=True):
    h = w * 0.42
    lid = f"M{cx-w} {cy}Q{cx} {cy-h*2.1:.1f} {cx+w} {cy}Q{cx} {cy+h*2.1:.1f} {cx-w} {cy}Z"
    out = f'<path d="{lid}" fill="url(#l-plum)" transform="translate(0 4)" opacity=".5"/>'
    out += f'<path d="{lid}" fill="url(#l-lav)"/>'
    inner = f"M{cx-w*.82:.1f} {cy}Q{cx} {cy-h*1.62:.1f} {cx+w*.82:.1f} {cy}Q{cx} {cy+h*1.62:.1f} {cx-w*.82:.1f} {cy}Z"
    out += f'<path d="{inner}" fill="#2b1d4f"/>'
    ir = h * 0.78
    iris = sphere(cx, cy, ir, "pink", aura=False)
    iris += f'<circle cx="{cx}" cy="{cy}" r="{ir*.42:.1f}" fill="#2b1d4f"/>'
    iris += star(cx, cy, ir * 0.3, "#fff")
    out += f'<clipPath id="eyeclip"><path d="{inner}"/></clipPath>'
    out += f'<g clip-path="url(#eyeclip)">' + (g(iris, "look") if look else iris) + "</g>"
    out += f'<path d="M{cx-w*.7:.1f} {cy-h*.55:.1f}Q{cx-w*.2:.1f} {cy-h*1.3:.1f} {cx+w*.25:.1f} {cy-h*1.18:.1f}" stroke="#fff" stroke-opacity=".8" stroke-width="2" stroke-linecap="round"/>'
    return out


def star(cx, cy, r, fill="#fff"):
    k = r * 0.28
    return (
        f'<path d="M{cx} {cy-r:.1f}Q{cx+k:.1f} {cy-k:.1f} {cx+r:.1f} {cy}Q{cx+k:.1f} {cy+k:.1f} {cx} {cy+r:.1f}'
        f'Q{cx-k:.1f} {cy+k:.1f} {cx-r:.1f} {cy}Q{cx-k:.1f} {cy-k:.1f} {cx} {cy-r:.1f}Z" fill="{fill}"/>'
    )


def bubble(x, y, w, h, tail="left", pal="pearl"):
    r = min(h / 2, 18)
    if tail == "left":
        t = f'<path d="M{x+8} {y+h-14}L{x-10} {y+h+2}L{x+22} {y+h-2}Z" fill="url(#v-{pal})"/>'
    elif tail == "right":
        t = f'<path d="M{x+w-8} {y+h-14}L{x+w+10} {y+h+2}L{x+w-22} {y+h-2}Z" fill="url(#v-{pal})"/>'
    else:
        t = ""
    out = f'<path d="{rrect(x, y+4, w, h, r)}" fill="{PAL[pal][2]}" fill-opacity=".4"/>'
    out += t + f'<path d="{rrect(x, y, w, h, r)}" fill="url(#v-{pal})"/>'
    out += f'<path d="M{x+r} {y+1.8}H{x+w-r}" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'
    return out


def shield(cx, cy, s, pal="lav"):
    p = (
        f"M{cx} {cy-s:.1f}C{cx+s*.45:.1f} {cy-s*.72:.1f} {cx+s*.78:.1f} {cy-s*.66:.1f} {cx+s*.9:.1f} {cy-s*.66:.1f}"
        f"C{cx+s*.92:.1f} {cy+s*.1:.1f} {cx+s*.7:.1f} {cy+s*.72:.1f} {cx} {cy+s*1.08:.1f}"
        f"C{cx-s*.7:.1f} {cy+s*.72:.1f} {cx-s*.92:.1f} {cy+s*.1:.1f} {cx-s*.9:.1f} {cy-s*.66:.1f}"
        f"C{cx-s*.78:.1f} {cy-s*.66:.1f} {cx-s*.45:.1f} {cy-s*.72:.1f} {cx} {cy-s:.1f}Z"
    )
    out = f'<path d="{p}" fill="{PAL[pal][2]}" fill-opacity=".5" transform="translate(0 6)"/>'
    out += f'<path d="{p}" fill="url(#l-{pal})"/>'
    out += f'<path d="M{cx-s*.74:.1f} {cy-s*.5:.1f}C{cx-s*.72:.1f} {cy+s*.1:.1f} {cx-s*.5:.1f} {cy+s*.5:.1f} {cx-s*.2:.1f} {cy+s*.75:.1f}" stroke="#fff" stroke-opacity=".7" stroke-width="{s*.06:.1f}" stroke-linecap="round"/>'
    out += f'<path d="M{cx-s*.1:.1f} {cy-s*.82:.1f}C{cx-s*.4:.1f} {cy-s*.62:.1f} {cx-s*.6:.1f} {cy-s*.56:.1f} {cx-s*.72:.1f} {cy-s*.55:.1f}" stroke="#fff" stroke-opacity=".9" stroke-width="{s*.05:.1f}" stroke-linecap="round"/>'
    return out


def tile(x, y, w, h, pal="pearl"):
    """App-icon-like squircle tile."""
    return slab(x, y, w, h, w * 0.26, pal, depth=8)


# ── brand marks (24×24 geometry: simple-icons / lobe-icons; Z.ai from its site logo, 30×30) ──
CLAUDE_D = "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"
OPENAI_D = "M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"
ZAI = ('<path d="M15.47,7.1l-1.3,1.85c-0.2,0.29-0.54,0.47-0.9,0.47h-7.1V7.09C6.16,7.1,15.47,7.1,15.47,7.1z"/>'
       '<path d="M14.53,22.91l1.31-1.86c0.2-0.29,0.54-0.47,0.9-0.47h7.09v2.33H14.53z"/>'
       '<polygon points="24.3,7.1 13.14,22.91 5.7,22.91 16.86,7.1"/>')


def logo(name, cx, cy, size):
    if name == "claude":
        k = size / 24
        return f'<path d="{CLAUDE_D}" fill="#D97757" transform="translate({cx-12*k:.1f} {cy-12*k:.1f}) scale({k:.3f})"/>'
    if name == "openai":
        k = size / 24
        return f'<path d="{OPENAI_D}" fill="#0d0d12" fill-rule="evenodd" transform="translate({cx-12*k:.1f} {cy-12*k:.1f}) scale({k:.3f})"/>'
    k = size / 18.6
    return f'<g fill="#fff" transform="translate({cx-15*k:.1f} {cy-15*k:.1f}) scale({k:.3f})">{ZAI}</g>'


def brand_tile(name, x, y, s):
    pal = {"claude": "cream", "openai": "pearl", "zai": "ink"}[name]
    return tile(x, y, s, s, pal) + logo(name, x + s / 2, y + s / 2, s * 0.5)
