import type { SourceId } from "./data";

/** Minimal glyph per source, drawn on a 24×24 grid in currentColor. */
const GLYPHS: Record<SourceId, string> = {
  // credential compilation — stacked sheets
  collection1:
    "M7 4h7l3 3v9a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zM9 2h7l3 3M10 11h5M10 14h3",
  // credential stuffing — key
  nazapi:
    "M10 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm2.5 3H20m-2 0v2m-2-2v2",
  // dating — flame
  tindr:
    "M12 3c3 3 4 5 4 8a4 4 0 0 1-8 0c0-1 .4-2 1-2.6C9 9 11 8 12 3z",
  // ride registry — car
  taxifr:
    "M5 14l1.5-4h11L19 14M5 14h14v3h-2v-1H7v1H5zM7 14v-3M17 14v-3M8 16.5h.01M16 16.5h.01",
  // crypto wallet — cube
  chainvault:
    "M12 3l7 4v8l-7 4-7-4V7zM12 3v18M12 12l7-4M12 12l-7-4",
  // VPN — shield
  vaultvpn:
    "M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6zM9.5 11.5l2 2 3.5-4",
  // phone location SDK — pin
  geodrop:
    "M12 3a5 5 0 0 1 5 5c0 4-5 10-5 10S7 12 7 8a5 5 0 0 1 5-5zm0 3.5A1.5 1.5 0 1 0 12 9a1.5 1.5 0 0 0 0-3z",
  // employer — briefcase
  acmehr:
    "M5 8h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M4 12h16",
};

export function SourceLogo({
  id,
  color,
  size = 24,
}: {
  id: SourceId;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="mosaic-logo"
      style={{ width: size, height: size, color }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <path
          d={GLYPHS[id]}
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
