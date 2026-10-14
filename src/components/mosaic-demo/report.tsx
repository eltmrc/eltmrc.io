import { motion } from "motion/react";
import {
  CONTACTS,
  LIFE,
  POLITICS,
  PORTRAITS,
  RELATIONS,
  SOURCES,
} from "./data";
import { asset } from "@/lib/asset";
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
      <div className="mosaic-report__title">📁 Subject dossier — John Doe</div>
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
      <h4 className="mosaic-report__h">🗺️ Where he's been — Paris → Lyon</h4>
      <LocationMap />
      <p className="mosaic-report__cap">
        Five years of logins and deliveries, pinned. The line is his move from Paris to Lyon.
      </p>

      {/* family / relations */}
      <h4 className="mosaic-report__h">👪 People around him</h4>
      <div className="mosaic-tree">
        <div className="mosaic-tree__root">John Doe</div>
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
      <h4 className="mosaic-report__h">🖼️ Photos matched to him <span className="mosaic-report__est">AI-generated</span></h4>
      <div className="mosaic-faces">
        {PORTRAITS.map((p) => (
          <figure key={p.src} className="mosaic-face">
            <div className="mosaic-face__img">
              <img src={asset(p.src)} alt="" loading="lazy" draggable={false} />
            </div>
            <figcaption>
              <SourceLogo id={p.source} size={12} /> {p.label}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mosaic-report__cap">AI-generated pictures of a fictional man. In a real run, these would be his actual photos — pulled from the same leaks.</p>

      <div className="mosaic-report__warn">
        ⚠️ Every line above is fabricated. Shown to make one thing concrete: what correlation across real breach types makes possible.
      </div>
    </motion.div>
  );
}
