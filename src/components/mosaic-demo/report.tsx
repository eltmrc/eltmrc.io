import { motion } from "motion/react";
import {
  CONTACTS,
  LIFE,
  POLITICS,
  PORTRAITS,
  RELATIONS,
  SOURCES,
} from "./data";
import { SourceLogo } from "./logos";
import { LocationMap } from "./map";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Render a string with **bold** spans. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** A stylised, model-guessed likeness — deliberately not a real photo. */
function ReconFace({ seed }: { seed: number }) {
  const skin = ["#f0c9a8", "#e6b48c", "#d8a074"][seed % 3];
  const skinD = ["#d9a878", "#c9915f", "#b87f52"][seed % 3];
  const hair = ["#3a2a22", "#5a3b2a", "#8a5a3a"][seed % 3];
  const bg = ["#efe6f8", "#e7edfb", "#fbe7f1"][seed % 3];
  const long = seed % 2 === 0;
  return (
    <svg viewBox="0 0 80 96" width="100%" height="100%" aria-hidden>
      <defs>
        <linearGradient id={`rf-bg-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bg} />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={`rf-sk-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={skin} />
          <stop offset="1" stopColor={skinD} />
        </linearGradient>
      </defs>
      <rect width="80" height="96" fill={`url(#rf-bg-${seed})`} />
      {/* shoulders */}
      <path d="M12 96c0-16 12-24 28-24s28 8 28 24z" fill={`url(#rf-sk-${seed})`} opacity="0.5" />
      {/* hair back */}
      {long && <path d="M18 42c0-16 8-26 22-26s22 10 22 26v30l-8-6V44a14 14 0 0 0-28 0v22l-8 6z" fill={hair} />}
      {/* head */}
      <ellipse cx="40" cy="44" rx="17" ry="20" fill={`url(#rf-sk-${seed})`} />
      {/* hair top */}
      <path d="M22 42c0-15 8-24 18-24s18 9 18 24c-4-8-10-11-18-11s-14 3-18 11z" fill={hair} />
      {/* eyes + brows + mouth */}
      <g fill="#3a2f28">
        <ellipse cx="33" cy="44" rx="2.1" ry="2.6" />
        <ellipse cx="47" cy="44" rx="2.1" ry="2.6" />
      </g>
      <g stroke="#3a2f28" strokeWidth="1.3" strokeLinecap="round" opacity="0.7">
        <path d="M30 39.5c2-1.2 4-1.2 6 0" />
        <path d="M44 39.5c2-1.2 4-1.2 6 0" />
      </g>
      <path d="M40 48l-1.4 5h2.8z" fill={skinD} opacity="0.8" />
      <path d="M35 56c3 2.2 7 2.2 10 0" stroke="#b06a62" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* scanlines overlay — reads as generated */}
      <g stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1">
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1="0" y1={i * 4} x2="80" y2={i * 4} />
        ))}
      </g>
      <rect x="0.5" y="0.5" width="79" height="95" fill="none" stroke="#000" strokeOpacity="0.06" />
    </svg>
  );
}

function PoliticsGauge() {
  const pct = ((POLITICS.lean + 1) / 2) * 100;
  return (
    <div className="mosaic-gauge">
      <div className="mosaic-gauge__bar">
        <span className="mosaic-gauge__dot" style={{ left: `${pct}%` }} />
      </div>
      <div className="mosaic-gauge__ends">
        <span>left</span>
        <span>centre</span>
        <span>right</span>
      </div>
    </div>
  );
}

export function Report() {
  return (
    <motion.div
      className="mosaic-report"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mosaic-report__title">📁 Subject dossier — Morgan Vale</div>
      <p className="mosaic-report__lede">
        Here is everything one email unfolded into. Assembled from 7 real-world breach types; every value fabricated.
      </p>

      {/* life, reconstructed */}
      <h4 className="mosaic-report__h">🧭 A life, reconstructed</h4>
      <ul className="mosaic-life">
        {LIFE.map((e, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, ease: EASE, duration: 0.3 }}
          >
            <span className="mosaic-life__icon">{e.icon}</span>
            <span className="mosaic-life__when">{e.when}</span>
            <span className="mosaic-life__text">
              <RichText text={e.text} />
            </span>
            {e.source && (
              <span className="mosaic-life__src" title={SOURCES[e.source].name}>
                <SourceLogo id={e.source} size={13} />
              </span>
            )}
          </motion.li>
        ))}
      </ul>

      {/* map */}
      <h4 className="mosaic-report__h">🗺️ Where she's been — Paris → Lyon</h4>
      <LocationMap />
      <p className="mosaic-report__cap">
        Five years of logins and deliveries, pinned. The line is her move from Paris to Lyon.
      </p>

      {/* family / relations */}
      <h4 className="mosaic-report__h">👪 People around her</h4>
      <div className="mosaic-tree">
        <div className="mosaic-tree__root">Morgan Vale</div>
        <div className="mosaic-tree__branches">
          {RELATIONS.map((r) => (
            <div key={r.name} className="mosaic-tree__node">
              <div className="mosaic-tree__name">{r.name}</div>
              <div className="mosaic-tree__tie">{r.tie}</div>
              <div className="mosaic-tree__via">{r.via}</div>
            </div>
          ))}
        </div>
      </div>

      {/* contacts */}
      <h4 className="mosaic-report__h">📇 Full contact sheet</h4>
      <div className="mosaic-contacts">
        {CONTACTS.map((c) => (
          <div key={c.label} className="mosaic-contact">
            <span className="mosaic-contact__icon">{c.icon}</span>
            <span className="mosaic-contact__label">{c.label}</span>
            <span className="mosaic-contact__value">{c.value}</span>
          </div>
        ))}
      </div>

      {/* politics */}
      <h4 className="mosaic-report__h">🎭 Likely politics <span className="mosaic-report__est">estimate</span></h4>
      <div className="mosaic-politics">
        <div className="mosaic-politics__label">{POLITICS.label}</div>
        <PoliticsGauge />
        <ul className="mosaic-politics__signals">
          {POLITICS.signals.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <div className="mosaic-politics__conf">confidence: {POLITICS.confidence} — a guess from follows and likes, not a fact.</div>
      </div>

      {/* portraits */}
      <h4 className="mosaic-report__h">🖼️ Reconstructed likeness <span className="mosaic-report__est">model-guessed</span></h4>
      <div className="mosaic-faces">
        {PORTRAITS.map((p) => (
          <figure key={p.seed} className="mosaic-face">
            <div className="mosaic-face__img"><ReconFace seed={p.seed} /></div>
            <figcaption>guess · {p.score}</figcaption>
          </figure>
        ))}
      </div>
      <p className="mosaic-report__cap">Not photos. A model's guess at a face from the profile — which is exactly the point.</p>

      <div className="mosaic-report__warn">
        ⚠️ Every line above is fabricated. Shown to make one thing concrete: what correlation across real breach types makes possible.
      </div>
    </motion.div>
  );
}
