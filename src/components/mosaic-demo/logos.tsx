import type { SourceId } from "./data";

/* Real brand marks — single-path, viewBox 0 0 24 24 (simple-icons, CC0). */
const BRAND_PATHS: Record<string, string> = {
  tinder:
    "M9.317 9.451c.045.073.123.12.212.12.06 0 .116-.021.158-.057l.015-.012c.39-.325.741-.66 1.071-1.017 3.209-3.483 1.335-7.759 1.32-7.799-.09-.21-.03-.459.15-.594.195-.135.435-.12.615.033 10.875 10.114 7.995 17.818 7.785 18.337-.87 3.141-4.335 5.414-8.444 5.53-.138.008-.242.008-.363.008-4.852 0-8.977-2.989-8.977-6.807v-.06c0-5.297 4.795-10.522 5.009-10.744.136-.149.345-.195.525-.105.18.076.297.255.291.451-.043 1.036.167 1.935.631 2.7v.015l.002.001z",
  adobe: "M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z",
  dropbox:
    "M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  nordvpn:
    "M2.2838 21.5414A11.9866 11.9866 0 010 14.4832C0 7.8418 5.3727 2.4586 12 2.4586c6.6279 0 12 5.3832 12 12.0246a11.9853 11.9853 0 01-2.2838 7.0582l-5.7636-9.3783-.5565.9419.5645 2.6186L12 8.9338l-2.45 4.1447.5707 2.6451-2.0764-3.5555-5.7605 9.3733z",
  google:
    "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z",
  proton:
    "M2.474 17.75V24h4.401v-5.979c0-.582.232-1.14.645-1.551a2.204 2.204 0 0 1 1.556-.643h4.513a7.955 7.955 0 0 0 5.612-2.318 7.907 7.907 0 0 0 2.325-5.595 7.91 7.91 0 0 0-2.325-5.596A7.958 7.958 0 0 0 13.587 0H2.474v7.812h4.401V4.129h6.416c.995 0 1.951.394 2.656 1.097.704.7 1.1 1.653 1.101 2.646a3.742 3.742 0 0 1-1.101 2.648 3.766 3.766 0 0 1-2.656 1.097H8.627a6.158 6.158 0 0 0-4.352 1.795 6.133 6.133 0 0 0-1.801 4.338Z",
};

const BRAND_COLOR: Record<string, string> = {
  tinder: "#FE3C72",
  adobe: "#EB1000",
  dropbox: "#0061FF",
  linkedin: "#0A66C2",
  nordvpn: "#4687FF",
  google: "#EA4335",
  proton: "#6D4AFF",
};

/** Which brand mark (if any) each source renders. */
const SOURCE_BRAND: Partial<Record<SourceId, keyof typeof BRAND_PATHS>> = {
  linkedin: "linkedin",
  adobe: "adobe",
  dropbox: "dropbox",
  tinder: "tinder",
  nordvpn: "nordvpn",
  google: "google",
};

function Mark({ brand, size }: { brand: keyof typeof BRAND_PATHS; size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={BRAND_COLOR[brand]}>
      <path d={BRAND_PATHS[brand]} />
    </svg>
  );
}

/** Ledger — hexagon monogram (no simple-icon available). */
function Ledger({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="#0a0a0a" />
      <g stroke="#fff" strokeWidth="1.5" fill="none">
        <path d="M7 8V7h4M7 16v1h4M17 8V7h-4M17 16v1h-4M7 11v2M17 11v2" />
      </g>
    </svg>
  );
}

/** Collection #1 — "aggregate" compilation mark. */
function Collection({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <rect x="3" y="6" width="18" height="14" rx="2.5" fill="#3b2f55" />
      <rect x="5.5" y="3.5" width="13" height="4" rx="1.5" fill="#6a5ae0" opacity="0.6" />
      <path d="M7.5 11h9M7.5 14h6.5" stroke="#cfc6ea" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** France Travail — tricolor state tile. */
function FranceTravail({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" fill="#fff" stroke="#e3e0ec" />
      <rect x="2.5" y="4.5" width="6.4" height="15" rx="3" fill="#000091" />
      <rect x="15.1" y="4.5" width="6.4" height="15" fill="#E1000F" />
      <path d="M15.1 4.5h3.4a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-3.4z" fill="#E1000F" />
    </svg>
  );
}

export function SourceLogo({
  id,
  size = 24,
}: {
  id: SourceId;
  color?: string;
  size?: number;
}) {
  const brand = SOURCE_BRAND[id];
  if (brand) return <span className="mosaic-logo" style={{ width: size, height: size }}><Mark brand={brand} size={size} /></span>;
  const Custom = id === "ledger" ? Ledger : id === "collection1" ? Collection : FranceTravail;
  return <span className="mosaic-logo" style={{ width: size, height: size }}><Custom size={size} /></span>;
}

/** Palantir — real mark (simple-icons): orb + eyelid chevron. */
export function PalantirMark({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M20.147 18L12 21.178 3.853 18 2.5 20.343 12 24l9.5-3.657L20.147 18zM12 0a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 16.078a6.568 6.568 0 1 1 0-13.136 6.568 6.568 0 0 1 0 13.136z" />
    </svg>
  );
}

/** GLM / Z.ai — the "Z" mark on a dark tile. */
export function GlmMark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 30 30" width={size} height={size} aria-hidden>
      <rect width="30" height="30" rx="7" fill="#0f0e1a" />
      <g fill="#fff">
        <path d="M15.47,7.1l-1.3,1.85c-0.2,0.29-0.54,0.47-0.9,0.47h-7.1V7.09C6.16,7.1,15.47,7.1,15.47,7.1z" />
        <path d="M14.53,22.91l1.31-1.86c0.2-0.29,0.54-0.47,0.9-0.47h7.09v2.33H14.53z" />
        <polygon points="24.3,7.1 13.14,22.91 5.7,22.91 16.86,7.1" />
      </g>
    </svg>
  );
}

const PALANTIR_D =
  "M20.147 18L12 21.178 3.853 18 2.5 20.343 12 24l9.5-3.657L20.147 18zM12 0a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 16.078a6.568 6.568 0 1 1 0-13.136 6.568 6.568 0 0 1 0 13.136z";

/** Palantir mark rendered in Cial's glossy style: candy gradient, rim light, specular. */
export function PalantirGlossy({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="-3 -3 30 30" width={size} height={size} aria-hidden>
      <defs>
        <radialGradient id="pg-body" cx="34%" cy="24%" r="85%">
          <stop offset="0" stopColor="#ffe3f6" />
          <stop offset=".45" stopColor="#ff8fd0" />
          <stop offset="1" stopColor="#8b46e8" />
        </radialGradient>
        <radialGradient id="pg-aura" cx="50%" cy="45%" r="50%">
          <stop offset=".45" stopColor="#ff5fa8" stopOpacity=".32" />
          <stop offset="1" stopColor="#ff5fa8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pg-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="pg-clip">
          <path d={PALANTIR_D} />
        </clipPath>
      </defs>
      <circle cx="12" cy="11" r="15" fill="url(#pg-aura)" />
      <path d={PALANTIR_D} fill="#5b2a9e" opacity=".28" transform="translate(0 .7)" />
      <path d={PALANTIR_D} fill="url(#pg-body)" />
      <g clipPath="url(#pg-clip)">
        <ellipse cx="9" cy="3.6" rx="7" ry="3.4" fill="url(#pg-shine)" />
        <path d="M3.6 6.5A9 9 0 0 1 9 1.3" stroke="#fff" strokeOpacity=".8" strokeWidth=".9" strokeLinecap="round" fill="none" />
      </g>
      <ellipse cx="7.4" cy="4.6" rx="1.3" ry=".8" fill="#fff" opacity=".85" transform="rotate(-35 7.4 4.6)" />
    </svg>
  );
}
