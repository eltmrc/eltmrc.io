import type { ReactElement, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";
import type { CategoryIconId } from "@/lib/categories";

type IconProps = {
  className?: string;
  title?: string;
};

/**
 * Cial "squishee" palette — same thread as cial.app pillar glyphs
 * (Landing.tsx ModelAgnosticArt / SelfModifyingArt / TrulyYoursArt).
 */
const G = {
  violet: "#a855f7",
  indigo: "#818cf8",
  pink: "#ff5fa8",
  amber: "#fbbf24",
  emerald: "#34d399",
  cyan: "#22d3ee",
  blush: "#ffe3f6",
  rose: "#ff8fd0",
} as const;

/**
 * Shared chrome: 64×64 viewBox (reads at small sizes), soft filled shapes,
 * jelly-squash on the whole mark. Ambient motion only when parent is hovered
 * (see .cat-icon rules in index.css) or when --xl hero.
 */
function Glyph({
  className,
  title,
  children,
  anim = "jelly",
}: IconProps & { children: (uid: string) => ReactNode; anim?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn("cat-icon cat-glyph", `cat-icon--${anim}`, className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {children(uid)}
    </svg>
  );
}

function softBody(uid: string, id: string) {
  return (
    <linearGradient id={`${uid}-${id}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="rgba(168,85,247,0.32)" />
      <stop offset="100%" stopColor="rgba(129,140,248,0.12)" />
    </linearGradient>
  );
}

function bubbleBody(uid: string, id: string) {
  return (
    <radialGradient id={`${uid}-${id}`} cx="38%" cy="30%" r="80%">
      <stop offset="0%" stopColor={G.blush} />
      <stop offset="42%" stopColor={G.rose} />
      <stop offset="100%" stopColor={G.violet} />
    </radialGradient>
  );
}

/* ─── Icons ─── */

export function IconAi({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="orbit">
      {(uid) => (
        <>
          <defs>
            {softBody(uid, "b")}
            {bubbleBody(uid, "core")}
          </defs>
          <g className="cat-jelly">
            <circle
              className="cat-orbit-spin"
              cx="32"
              cy="32"
              r="26"
              stroke={G.pink}
              strokeWidth="1.8"
              strokeDasharray="4 8"
              strokeLinecap="round"
              opacity="0.45"
            />
            <circle className="cat-sat" cx="32" cy="7" r="2.4" fill={G.pink} />
            <circle className="cat-sat cat-sat--2" cx="54" cy="38" r="2" fill={G.cyan} />
            <circle className="cat-sat cat-sat--3" cx="12" cy="42" r="2" fill={G.violet} />
            <circle cx="32" cy="32" r="12" fill={`url(#${uid}-core)`} />
            <circle className="cat-spec" cx="28" cy="28" r="2.6" fill="#fff" fillOpacity="0.9" />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconBuilding({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="rise">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <rect x="10" y="14" width="44" height="38" rx="8" fill={`url(#${uid}-b)`} stroke={G.violet} strokeOpacity="0.45" strokeWidth="1.4" />
            <rect className="cat-block" x="18" y="24" width="12" height="28" rx="2.5" fill={G.indigo} fillOpacity="0.85" />
            <rect className="cat-block cat-block--d" x="34" y="18" width="12" height="34" rx="2.5" fill={G.violet} fillOpacity="0.9" />
            <circle cx="24" cy="30" r="1.4" fill={G.blush} />
            <circle cx="24" cy="36" r="1.4" fill={G.blush} />
            <circle cx="40" cy="24" r="1.4" fill={G.pink} />
            <circle cx="40" cy="30" r="1.4" fill={G.pink} />
            <rect x="22" y="44" width="4" height="8" rx="1" fill={G.amber} />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconDesign({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="spin-slow">
      {(uid) => (
        <>
          <defs>
            <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={G.pink} />
              <stop offset="100%" stopColor={G.violet} />
            </linearGradient>
          </defs>
          <g className="cat-jelly">
            <circle className="cat-orbit-spin" cx="32" cy="32" r="22" stroke={`url(#${uid}-ring)`} strokeWidth="3" strokeDasharray="10 6" strokeLinecap="round" opacity="0.85" />
            <circle cx="32" cy="32" r="10" fill={G.violet} fillOpacity="0.2" stroke={G.violet} strokeWidth="1.4" />
            <circle className="cat-node" cx="32" cy="10" r="3.2" fill={G.pink} />
            <circle className="cat-node cat-node--d" cx="50" cy="40" r="2.6" fill={G.indigo} />
            <circle className="cat-node" cx="14" cy="40" r="2.6" fill={G.cyan} />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconEngineering({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="cog">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <circle cx="32" cy="32" r="22" fill={`url(#${uid}-b)`} stroke={G.violet} strokeOpacity="0.4" strokeWidth="1.3" />
            <g className="cat-cog-spin" style={{ transformOrigin: "32px 32px" }}>
              <path
                d="M32 14l2.2 4.6 5-.8 1.4 4.8 4.6 2.2-2.2 4.6 2.8 4.2-4.6 2.2-.8 5-4.8 1.4-2.2 4.6-4.6-2.2-4.2 2.8-2.2-4.6-5 .8-1.4-4.8-4.6-2.2 2.2-4.6-2.8-4.2 4.6-2.2.8-5 4.8-1.4z"
                fill={G.violet}
                fillOpacity="0.35"
                stroke={G.violet}
                strokeWidth="1.2"
              />
              <circle cx="32" cy="32" r="7" fill={G.pink} />
              <circle cx="32" cy="32" r="3.2" fill={G.blush} />
            </g>
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconProduct({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="float">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <rect x="12" y="14" width="40" height="36" rx="8" fill={`url(#${uid}-b)`} stroke={G.violet} strokeOpacity="0.5" strokeWidth="1.4" />
            <rect x="12" y="14" width="40" height="10" rx="8" fill={G.violet} fillOpacity="0.25" />
            <circle cx="18" cy="19" r="1.6" fill={G.pink} />
            <circle cx="24" cy="19" r="1.6" fill={G.indigo} opacity="0.8" />
            <rect className="cat-block" x="18" y="30" width="22" height="4" rx="2" fill={G.violet} opacity="0.7" />
            <rect className="cat-block cat-block--d" x="18" y="38" width="14" height="4" rx="2" fill={G.pink} opacity="0.55" />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconTools({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="nudge">
      {() => (
        <g className="cat-jelly">
          <path
            d="M38 12a10 10 0 0 0-12 12L14 36l8 8 12-12a10 10 0 0 0 12-12L40 26 38 12z"
            fill={G.violet}
            fillOpacity="0.25"
            stroke={G.violet}
            strokeWidth="1.5"
          />
          <path d="M18 40l6 6" stroke={G.pink} strokeWidth="3" strokeLinecap="round" />
          <circle cx="42" cy="18" r="4" fill={G.amber} />
        </g>
      )}
    </Glyph>
  );
}

export function IconLab({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="bubble">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <path
              d="M26 10h12M28 10v12L18 46a6 6 0 0 0 5.4 8h17.2A6 6 0 0 0 46 46L36 22V10"
              fill={`url(#${uid}-b)`}
              stroke={G.violet}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M22 40h20" stroke={G.pink} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            <circle className="cat-node" cx="28" cy="44" r="2" fill={G.cyan} />
            <circle className="cat-node cat-node--d" cx="36" cy="42" r="1.6" fill={G.amber} />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconSystems({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="pulse">
      {() => (
        <g className="cat-jelly">
          <rect x="8" y="8" width="18" height="18" rx="5" fill={G.indigo} fillOpacity="0.9" />
          <rect x="38" y="8" width="18" height="18" rx="5" fill={G.violet} fillOpacity="0.85" />
          <rect x="23" y="38" width="18" height="18" rx="5" fill={G.pink} fillOpacity="0.85" />
          <path d="M26 17h12M47 26v10M32 38v-6" stroke={G.cyan} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <circle className="cat-node" cx="17" cy="17" r="2.2" fill={G.blush} />
          <circle className="cat-node cat-node--d" cx="47" cy="17" r="2.2" fill={G.blush} />
          <circle className="cat-node" cx="32" cy="47" r="2.2" fill={G.blush} />
        </g>
      )}
    </Glyph>
  );
}

export function IconFounding({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="rise">
      {(uid) => (
        <>
          <defs>{bubbleBody(uid, "core")}</defs>
          <g className="cat-jelly">
            <path d="M32 12 L14 24 v28 h36 V24 Z" fill={G.violet} fillOpacity="0.2" stroke={G.violet} strokeWidth="1.4" strokeLinejoin="round" />
            <path className="cat-block" d="M32 12 L14 24 h36 Z" fill={G.pink} fillOpacity="0.55" />
            <circle className="cat-node" cx="32" cy="8" r="3.5" fill={`url(#${uid}-core)`} />
            <circle className="cat-spec" cx="30.5" cy="6.5" r="1.2" fill="#fff" fillOpacity="0.85" />
            <rect x="28" y="40" width="8" height="12" rx="1.5" fill={G.amber} />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconInfrastructure({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="rise">
      {() => (
        <g className="cat-jelly">
          <rect className="cat-block" x="10" y="36" width="12" height="16" rx="3" fill={G.indigo} opacity="0.75" />
          <rect className="cat-block cat-block--d" x="26" y="26" width="12" height="26" rx="3" fill={G.violet} opacity="0.85" />
          <rect className="cat-block" x="42" y="16" width="12" height="36" rx="3" fill={G.pink} opacity="0.9" />
          <path d="M16 36V28M32 26V18M48 16V10" stroke={G.cyan} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
          <circle cx="16" cy="26" r="2" fill={G.cyan} />
          <circle cx="32" cy="16" r="2" fill={G.amber} />
          <circle cx="48" cy="8" r="2" fill={G.emerald} />
        </g>
      )}
    </Glyph>
  );
}

export function IconShipping({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="nudge">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <path
              d="M8 34h26l8-10h12v18a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V34z"
              fill={`url(#${uid}-b)`}
              stroke={G.violet}
              strokeWidth="1.4"
            />
            <path d="M8 34V24a4 4 0 0 1 4-4h16v14" fill={G.pink} fillOpacity="0.35" stroke={G.pink} strokeWidth="1.2" />
            <circle cx="20" cy="50" r="4" fill={G.violet} />
            <circle cx="44" cy="50" r="4" fill={G.violet} />
            <circle cx="20" cy="50" r="1.6" fill={G.blush} />
            <circle cx="44" cy="50" r="1.6" fill={G.blush} />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconLearning({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="float">
      {() => (
        <g className="cat-jelly">
          <path
            d="M10 18c8-3 12-3 22 0v28c-10-3-14-3-22 0V18z"
            fill={G.indigo}
            fillOpacity="0.85"
          />
          <path
            d="M32 18c8-3 12-3 22 0v28c-10-3-14-3-22 0V18z"
            fill={G.violet}
            fillOpacity="0.9"
          />
          <path d="M32 18v28" stroke={G.blush} strokeWidth="1.5" opacity="0.6" />
          <circle className="cat-node" cx="32" cy="14" r="2.5" fill={G.pink} />
        </g>
      )}
    </Glyph>
  );
}

export function IconOpenSource({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="orbit">
      {() => (
        <g className="cat-jelly">
          <circle cx="32" cy="32" r="8" fill={G.violet} />
          <circle className="cat-orbit-spin" cx="32" cy="14" r="5" fill={G.pink} />
          <circle className="cat-orbit-spin cat-sat--2" cx="48" cy="42" r="5" fill={G.cyan} />
          <circle className="cat-orbit-spin cat-sat--3" cx="16" cy="42" r="5" fill={G.indigo} />
          <path d="M32 24v-5M38 36l6 4M26 36l-6 4" stroke={G.blush} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        </g>
      )}
    </Glyph>
  );
}

export function IconSecurity({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="pulse">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <path
              d="M32 8 L50 16 v14c0 12-8 20-18 24C22 50 14 42 14 30V16L32 8z"
              fill={`url(#${uid}-b)`}
              stroke={G.violet}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M24 32l5 5 11-12" stroke={G.pink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconPerformance({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="nudge">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <rect x="8" y="12" width="48" height="40" rx="10" fill={`url(#${uid}-b)`} stroke={G.violet} strokeOpacity="0.4" strokeWidth="1.3" />
            <path
              d="M14 42 L24 28 l8 8 8-16 10 22"
              stroke={G.pink}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle className="cat-node" cx="40" cy="20" r="3" fill={G.amber} />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconWork({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="float">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <rect x="8" y="22" width="48" height="28" rx="7" fill={`url(#${uid}-b)`} stroke={G.violet} strokeOpacity="0.5" strokeWidth="1.4" />
            <path d="M22 22V18a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v4" stroke={G.pink} strokeWidth="2" strokeLinecap="round" />
            <rect x="8" y="32" width="48" height="6" fill={G.violet} fillOpacity="0.2" />
            <circle cx="18" cy="28" r="1.8" fill={G.pink} />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconNotes({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="float">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <path
              d="M18 10h22l10 10v32a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z"
              fill={`url(#${uid}-b)`}
              stroke={G.violet}
              strokeWidth="1.4"
            />
            <path d="M40 10v10h10" fill={G.pink} fillOpacity="0.35" stroke={G.pink} strokeWidth="1.2" />
            <rect className="cat-block" x="20" y="30" width="20" height="3" rx="1.5" fill={G.violet} opacity="0.55" />
            <rect className="cat-block cat-block--d" x="20" y="38" width="14" height="3" rx="1.5" fill={G.indigo} opacity="0.55" />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconWriting({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="nudge">
      {() => (
        <g className="cat-jelly">
          <path d="M12 50h40" stroke={G.violet} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
          <path
            d="M18 44 L42 14 l8 7 L26 50 H18 z"
            fill={G.violet}
            fillOpacity="0.3"
            stroke={G.violet}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M38 18l8 7" stroke={G.pink} strokeWidth="2" strokeLinecap="round" />
          <circle className="cat-node" cx="44" cy="14" r="3" fill={G.amber} />
        </g>
      )}
    </Glyph>
  );
}

export function IconUx({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="pulse">
      {(uid) => (
        <>
          <defs>{softBody(uid, "b")}</defs>
          <g className="cat-jelly">
            <rect x="10" y="12" width="44" height="40" rx="10" fill={`url(#${uid}-b)`} stroke={G.violet} strokeOpacity="0.5" strokeWidth="1.4" />
            <circle className="cat-node" cx="24" cy="30" r="5" fill={G.pink} />
            <rect className="cat-block" x="34" y="26" width="12" height="10" rx="3" fill={G.indigo} opacity="0.85" />
            <rect x="18" y="42" width="10" height="3.5" rx="1.8" fill={G.cyan} opacity="0.8" />
            <rect x="32" y="42" width="14" height="3.5" rx="1.8" fill={G.violet} opacity="0.55" />
          </g>
        </>
      )}
    </Glyph>
  );
}

export function IconMeta({ className, title }: IconProps) {
  return (
    <Glyph className={className} title={title} anim="orbit">
      {(uid) => (
        <>
          <defs>
            {bubbleBody(uid, "core")}
            <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={G.pink} />
              <stop offset="100%" stopColor={G.indigo} />
            </linearGradient>
          </defs>
          <g className="cat-jelly">
            <circle className="cat-orbit-spin" cx="32" cy="32" r="24" stroke={`url(#${uid}-ring)`} strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" opacity="0.55" />
            <ellipse className="cat-orbit-spin cat-sat--2" cx="32" cy="32" rx="14" ry="24" stroke={G.violet} strokeWidth="1.3" opacity="0.4" />
            <circle cx="32" cy="32" r="9" fill={`url(#${uid}-core)`} />
            <circle className="cat-spec" cx="29" cy="29" r="2.2" fill="#fff" fillOpacity="0.9" />
          </g>
        </>
      )}
    </Glyph>
  );
}

const iconMap: Record<CategoryIconId, (props: IconProps) => ReactElement> = {
  ai: IconAi,
  building: IconBuilding,
  design: IconDesign,
  engineering: IconEngineering,
  product: IconProduct,
  tools: IconTools,
  lab: IconLab,
  systems: IconSystems,
  founding: IconFounding,
  infrastructure: IconInfrastructure,
  shipping: IconShipping,
  learning: IconLearning,
  "open-source": IconOpenSource,
  security: IconSecurity,
  performance: IconPerformance,
  work: IconWork,
  notes: IconNotes,
  writing: IconWriting,
  ux: IconUx,
  meta: IconMeta,
};

export function CategoryIcon({
  id,
  className,
  title,
}: {
  id: CategoryIconId;
  className?: string;
  title?: string;
}) {
  const Comp = iconMap[id];
  return <Comp className={className} title={title} />;
}
