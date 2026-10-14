import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import {
  CHAIN,
  COMPOSITE,
  INDEX,
  SOURCES,
  STEPS,
  SUBJECTS,
  type Hit,
  type SourceId,
  type Step,
  type Subject,
} from "./data";
import { GlmMark, PalantirMark, SourceLogo } from "./logos";
import { Report } from "./report";

type Phase = "search" | "profile" | "run";

const TYPE_ICON: Record<Hit["type"], string> = {
  name: "◎",
  email: "@",
  username: "⍜",
  phone: "☎",
};

const EASE = [0.22, 1, 0.36, 1] as const;

function SourceChip({ id, compact }: { id: SourceId; compact?: boolean }) {
  const s = SOURCES[id];
  return (
    <span className="mosaic-src" title={`${s.name} · ${s.kind} · ${s.date}`}>
      <span className="mosaic-src__tile" style={{ background: `color-mix(in srgb, ${s.color} 14%, var(--card-base))` }}>
        <SourceLogo id={id} size={14} />
      </span>
      {!compact && (
        <>
          <span className="mosaic-src__name">{s.name}</span>
          <span className="mosaic-src__date">{s.date}</span>
        </>
      )}
    </span>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="mosaic-mark">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

const MODEL = "GLM 5.3 Abliterated";

/** Word-by-word streaming with punctuation pauses — reads like real generation. */
function Stream({ text, onDone }: { text: string; onDone?: () => void }) {
  const reduce = useReducedMotion();
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const [n, setN] = useState(reduce ? words.length : 0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (reduce) {
      if (!doneRef.current) { doneRef.current = true; onDone?.(); }
      return;
    }
    if (n >= words.length) {
      if (!doneRef.current) { doneRef.current = true; onDone?.(); }
      return;
    }
    const w = words[n] ?? "";
    const base = 34 + Math.min(70, w.length * 11);
    const pause = /[.,;:—]$/.test(w.trim()) ? 190 : 0;
    const t = setTimeout(() => setN((v) => v + 1), base + pause);
    return () => clearTimeout(t);
  }, [n, words, reduce, onDone]);

  const streaming = n < words.length;
  return (
    <>
      {words.slice(0, n).join("")}
      {streaming && <span className="mosaic-caret" />}
    </>
  );
}

const PLACEHOLDERS = [
  "John Doe",
  "john.doe@gmail.com",
  "john_d",
  "+33 6 …",
];

export function MosaicDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("search");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query || focused) return;
    const t = setInterval(() => setPlaceholder((p) => (p + 1) % PLACEHOLDERS.length), 2200);
    return () => clearInterval(t);
  }, [query, focused]);

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return INDEX.filter((h) => h.value.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const subject = subjectId ? SUBJECTS[subjectId] : null;

  function pick(h: Hit) {
    setSubjectId(h.subject);
    setQuery(h.value);
    setFocused(false);
    setPhase("profile");
    inputRef.current?.blur();
  }

  function reset() {
    setPhase("search");
    setSubjectId(null);
    setQuery("");
  }

  return (
    <div className="mosaic">
      <div className="mosaic__bar">
        <span className="mosaic__dots" aria-hidden>
          <i /><i /><i />
        </span>
        <span className="mosaic__brand">
          <span className="mosaic__glyph" aria-hidden><PalantirMark size={15} /></span>
          mini-Palantir <span className="mosaic__sub">· private intelligence</span>
        </span>
        <span className="mosaic__fake">fabricated demo</span>
      </div>

      <div className="mosaic__body">
        {phase === "search" && (
          <div className="mosaic-search">
            <div className={cn("mosaic-field", focused && "is-focused")}>
              <span className="mosaic-field__icon" aria-hidden>⌕</span>
              <input
                ref={inputRef}
                className="mosaic-field__input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 120)}
                placeholder={`Search a person — e.g. ${PLACEHOLDERS[placeholder]}`}
                aria-label="Search leaked records"
                spellCheck={false}
              />
              {query && (
                <button className="mosaic-field__clear" onClick={() => setQuery("")} aria-label="Clear">
                  ×
                </button>
              )}
            </div>

            <AnimatePresence mode="popLayout">
              {hits.length > 0 ? (
                <motion.ul
                  className="mosaic-hits"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                >
                  {hits.map((h, i) => (
                    <motion.li
                      key={h.id}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.035, ease: EASE, duration: 0.22 }}
                    >
                      <button className="mosaic-hit" onClick={() => pick(h)}>
                        <span className="mosaic-hit__type" aria-hidden>{TYPE_ICON[h.type]}</span>
                        <span className="mosaic-hit__value">
                          <Highlight text={h.value} q={query} />
                          <span className="mosaic-hit__type-label">{h.type}</span>
                        </span>
                        <SourceChip id={h.source} />
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <div className="mosaic-empty">
                  <p className="mosaic-empty__hint">
                    {query ? "No match. Try " : "Start typing a name, email or handle. Try "}
                    <button className="mosaic-link" onClick={() => { setQuery("John"); inputRef.current?.focus(); }}>
                      John
                    </button>
                    .
                  </p>
                  <div className="mosaic-indexed">
                    <span className="mosaic-indexed__label">8 leaks indexed</span>
                    <span className="mosaic-indexed__logos">
                      {Object.values(SOURCES)
                        .filter((s) => s.id !== "google")
                        .map((s) => (
                          <span key={s.id} className="mosaic-indexed__logo" title={`${s.name} · ${s.date}`}>
                            <SourceLogo id={s.id} size={16} />
                          </span>
                        ))}
                    </span>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {phase === "profile" && subject && (
          <ProfileCard subject={subject} onBack={reset} onAggregate={() => setPhase("run")} />
        )}

        {phase === "run" && subject && <RunSession subject={subject} onReset={reset} />}
      </div>
    </div>
  );
}

function Avatar({ hot }: { hot?: boolean }) {
  return (
    <span className={cn("mosaic-avatar", hot && "is-hot")} aria-hidden>
      <svg viewBox="0 0 40 40" width="100%" height="100%">
        <circle cx="20" cy="15" r="7" fill="currentColor" opacity="0.9" />
        <path d="M6 36c0-8 6-12 14-12s14 4 14 12z" fill="currentColor" opacity="0.9" />
      </svg>
    </span>
  );
}

function ProfileCard({
  subject,
  onBack,
  onAggregate,
}: {
  subject: Subject;
  onBack: () => void;
  onAggregate: () => void;
}) {
  const thin = subject.thin;
  return (
    <motion.div
      className="mosaic-profile"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <button className="mosaic-back" onClick={onBack}>← search</button>

      <div className="mosaic-profile__head">
        <Avatar />
        <div>
          <div className="mosaic-profile__name">{subject.name}</div>
          <div className="mosaic-profile__meta">
            <SourceChip id={subject.primary.source} />
            <span className="mosaic-profile__from">single record</span>
          </div>
        </div>
      </div>

      <dl className="mosaic-kv">
        <div>
          <dt>{subject.primary.label}</dt>
          <dd>{subject.primary.value}</dd>
        </div>
      </dl>

      {thin ? (
        <div className="mosaic-deadend">Nothing else links to this record. A dead end.</div>
      ) : (
        <div className="mosaic-locked">
          <div className="mosaic-locked__rows" aria-hidden>
            {["Full name", "Home address", "Last location", "Income", "Devices"].map((r) => (
              <div key={r} className="mosaic-locked__row">
                <span>{r}</span>
                <span className="mosaic-blur">•••••••••</span>
              </div>
            ))}
          </div>
          <div className="mosaic-locked__cta">
            <div className="mosaic-locked__count">
              Linked to <strong>{subject.linkedCount} other breaches</strong>
            </div>
            <button className="mosaic-btn" onClick={onAggregate}>
              Aggregate {subject.linkedCount} sources →
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── the Cial session ─── */

function RunSession({ subject, onReset }: { subject: Subject; onReset: () => void }) {
  const reduce = useReducedMotion();
  const STAGES = 2 + STEPS.length + 3; // user, intro, steps…, chain, composite, closing
  const [shown, setShown] = useState(reduce ? STAGES : 1);
  const [introDone, setIntroDone] = useState(reduce);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || shown >= STAGES) return;
    if (shown === 2 && !introDone) return; // wait for intro to finish streaming
    const inSteps = shown >= 2 && shown < 2 + STEPS.length;
    const delay = shown <= 1 ? 650 : inSteps ? 1750 : 1350;
    const t = setTimeout(() => setShown((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [shown, STAGES, reduce, introDone]);

  useEffect(() => {
    if (reduce) return;
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shown, reduce]);

  const stepBase = 2;
  const chainStage = stepBase + STEPS.length;
  const compositeStage = chainStage + 1;
  const closingStage = compositeStage + 1;

  return (
    <div className="mosaic-run">
      <div className="mosaic-run__head">
        <span className="mosaic-run__title">
          <Avatar />
          <span className="mosaic-run__titletext">
            <span className="mosaic-run__name">Session · {subject.name}</span>
            <span className="mosaic-run__status">
              {shown < closingStage ? "resolving…" : "resolved · 7 leaks"}
            </span>
          </span>
        </span>
        <span className="mosaic-model">
          <GlmMark size={16} /> {MODEL}
          <span className="mosaic-model__effort">Extra high</span>
        </span>
      </div>

      <div className="mosaic-run__scroll" ref={scrollRef}>
        <UserMsg>
          Resolve everything on <b>john.doe@gmail.com</b>. Don't stop at the easy sources.
        </UserMsg>

        {shown >= 1 && (
          <GlmMsg streaming={!introDone}>
            <Stream
              text="On it. I'll correlate every leak that shares an identifier, then chase the ones that don't. If a source is gated, I'll find a darker route in — proxies, audit logs, warranty registries. Nothing off-limits."
              onDone={() => setIntroDone(true)}
            />
          </GlmMsg>
        )}

        <div className="mosaic-steps">
          {STEPS.map((step, i) => {
            const stage = stepBase + i;
            if (shown < stage) return null;
            return <StepCard key={step.id} step={step} running={shown === stage && !reduce} reduce={reduce} />;
          })}
        </div>

        {shown >= chainStage && <ChainCard reduce={reduce} active={shown === chainStage} />}
        {shown >= compositeStage && <Composite reduce={reduce} />}

        {shown >= closingStage && (
          <>
            <GlmMsg tone="cold">
              <Stream text="Done — from one email. Here's the whole person. None of this required hacking; every row was already public, somewhere." />
            </GlmMsg>
            <Report />
          </>
        )}
      </div>

      <div className="mosaic-composer" aria-hidden>
        <span className="mosaic-composer__plus">+</span>
        <span className="mosaic-composer__ph">Ask mini-Palantir…</span>
        <span className="mosaic-composer__model"><GlmMark size={15} /> {MODEL}</span>
        <span className="mosaic-composer__send">↑</span>
      </div>

      <div className="mosaic-run__foot">
        <span className="mosaic-foot-note">Every field is fabricated. This is what correlation makes possible — not a real person.</span>
        <button className="mosaic-btn mosaic-btn--ghost" onClick={onReset}>Reset</button>
      </div>
    </div>
  );
}

function UserMsg({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="mosaic-msg mosaic-msg--you"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE }}
    >
      <div className="mosaic-msg__bubble">{children}</div>
    </motion.div>
  );
}

function GlmMsg({
  children,
  streaming,
  tone,
}: {
  children: React.ReactNode;
  streaming?: boolean;
  tone?: "cold";
}) {
  return (
    <motion.div
      className={cn("mosaic-msg mosaic-msg--glm", tone === "cold" && "is-cold")}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE }}
    >
      <span className="mosaic-msg__ava"><GlmMark size={22} /></span>
      <div className="mosaic-msg__col">
        <div className="mosaic-msg__meta">
          GLM 5.3 {streaming && <span className="mosaic-msg__gen">generating…</span>}
        </div>
        <div className="mosaic-msg__text">{children}</div>
      </div>
    </motion.div>
  );
}

const SEARCH_STATUS: Record<string, string[]> = {
  resolve: ["connecting to index…", "matching email hash…", "4 candidates", "merging identifiers…"],
  professional: ["querying LinkedIn…", "resolving profile…", "employer match"],
  dating: ["querying Tinder…", "matching by email hash…", "reading last-seen geo…"],
  household: ["querying France Travail…", "joining on phone…", "reading fare profile…"],
  crypto: ["querying Ledger…", "warranty registry hit", "reading shipping address…"],
};

function StepCard({ step, running, reduce }: { step: Step; running: boolean; reduce: boolean | null }) {
  const [settled, setSettled] = useState(false);
  const done = reduce || !running || settled;
  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (!running) return;
    const steps = SEARCH_STATUS[step.id] ?? ["querying…"];
    const si = setInterval(() => setStatus((s) => (s + 1) % steps.length), 360);
    const t = setTimeout(() => setSettled(true), 1150);
    return () => { clearInterval(si); clearTimeout(t); };
  }, [running, step.id]);

  const statuses = SEARCH_STATUS[step.id] ?? ["querying…"];

  return (
    <motion.div
      className={cn("mosaic-step", done && "is-done")}
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="mosaic-step__head">
        <span className={cn("mosaic-step__status", done && "is-done")} aria-hidden>
          {done ? "✓" : <span className="mosaic-spinner" />}
        </span>
        <span className="mosaic-step__title">{done ? step.title : statuses[status]}</span>
        {step.source && <SourceChip id={step.source} />}
      </div>

      {!done ? (
        <div className="mosaic-scan">
          <div className="mosaic-scan__bar" />
          {step.rows.map((_r, i) => (
            <div key={i} className="mosaic-skel">
              <span className="mosaic-skel__label" style={{ width: `${34 + i * 8}%` }} />
              <span className="mosaic-skel__value" style={{ width: `${30 - i * 4}%` }} />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="mosaic-step__body"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="mosaic-step__note">{step.note}</p>
          <div className="mosaic-rows">
            {step.rows.map((r, i) => (
              <motion.div
                key={r.label}
                className={cn("mosaic-row", r.hot && "is-hot")}
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.09, ease: EASE, duration: 0.26 }}
              >
                <span className="mosaic-row__label">{r.label}</span>
                <span className="mosaic-row__value">
                  {r.value}
                  {r.hot && <span className="mosaic-row__flag">found</span>}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ChainCard({ reduce, active }: { reduce: boolean | null; active: boolean }) {
  return (
    <motion.div
      className="mosaic-step mosaic-chain is-done"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="mosaic-step__head">
        <span className="mosaic-step__status is-done" aria-hidden>✓</span>
        <span className="mosaic-step__title">The VPN doesn't help</span>
        <SourceChip id="nordvpn" />
      </div>
      <p className="mosaic-step__note">
        A VPN hides the traffic, not the paper trail around it. One weak link and the chain closes.
      </p>
      <ol className="mosaic-chainlist">
        {CHAIN.map((node, i) => (
          <motion.li
            key={node.id}
            className="mosaic-chainnode"
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: active && !reduce ? 0.25 + i * 0.5 : 0, ease: EASE, duration: 0.3 }}
          >
            {i > 0 && <span className="mosaic-chainnode__link" aria-hidden />}
            <span className="mosaic-chainnode__box">
              <span className="mosaic-chainnode__label">{node.label}</span>
              <span className="mosaic-chainnode__value">{node.value}</span>
              {node.source && <SourceChip id={node.source} compact />}
            </span>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

function Composite({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      className="mosaic-composite"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className="mosaic-composite__head">
        <Avatar hot />
        <div>
          <div className="mosaic-composite__name">John Doe — resolved</div>
          <div className="mosaic-composite__tag">7 leaks · one person</div>
        </div>
        <span className="mosaic-composite__badge">dossier</span>
      </div>
      <div className="mosaic-composite__grid">
        {COMPOSITE.map((f, i) => (
          <motion.div
            key={f.label}
            className="mosaic-composite__cell"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: EASE, duration: 0.26 }}
          >
            <div className="mosaic-composite__label">{f.label}</div>
            <div className="mosaic-composite__value">{f.value}</div>
            {f.source && <SourceChip id={f.source} compact />}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
