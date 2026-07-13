import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { CategoryIconId } from "@/lib/categories";

type IconProps = {
  className?: string;
  title?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

/** Shared sober SVG chrome */
function Frame({
  className,
  children,
  title,
  anim = "idle",
}: IconProps & { children: ReactNode; anim?: string }) {
  return (
    <svg
      {...base}
      className={cn("cat-icon", `cat-icon--${anim}`, className)}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      {children}
    </svg>
  );
}

export function IconAi({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="pulse">
      <circle className="cat-draw" cx="12" cy="12" r="3.2" />
      <path className="cat-orbit" d="M12 4.5a7.5 7.5 0 1 1-5.3 2.2" />
      <path className="cat-orbit cat-orbit--delay" d="M12 19.5a7.5 7.5 0 0 1 5.3-2.2" />
      <circle className="cat-node" cx="12" cy="4.5" r="1" fill="currentColor" stroke="none" />
      <circle className="cat-node cat-node--delay" cx="17.3" cy="17.3" r="1" fill="currentColor" stroke="none" />
    </Frame>
  );
}

export function IconBuilding({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="rise">
      <path className="cat-draw" d="M4 20h16" />
      <path className="cat-block" d="M6 20V9l6-4 6 4v11" />
      <path className="cat-block cat-block--delay" d="M10 20v-5h4v5" />
      <path className="cat-draw" d="M10 11h.01M14 11h.01M10 14h.01M14 14h.01" />
    </Frame>
  );
}

export function IconDesign({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="spin-slow">
      <circle className="cat-draw" cx="12" cy="12" r="8" />
      <circle className="cat-draw cat-orbit" cx="12" cy="12" r="3.5" />
      <path className="cat-draw" d="M12 4v3M12 17v3M4 12h3M17 12h3" />
    </Frame>
  );
}

export function IconEngineering({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="cog">
      <circle className="cat-draw" cx="12" cy="12" r="3" />
      <path
        className="cat-cog"
        d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18"
      />
    </Frame>
  );
}

export function IconProduct({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="float">
      <rect className="cat-draw" x="4.5" y="6" width="15" height="12" rx="2" />
      <path className="cat-draw cat-block" d="M4.5 10h15" />
      <circle className="cat-node" cx="8" cy="8" r="0.8" fill="currentColor" stroke="none" />
      <circle className="cat-node cat-node--delay" cx="10.5" cy="8" r="0.8" fill="currentColor" stroke="none" />
    </Frame>
  );
}

export function IconTools({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="nudge">
      <path className="cat-draw" d="M14.5 5.5a3.5 3.5 0 0 0-4.9 4.9L4 16l4 4 5.6-5.6a3.5 3.5 0 0 0 4.9-4.9L16 12l-2.5-2.5z" />
    </Frame>
  );
}

export function IconLab({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="bubble">
      <path className="cat-draw" d="M9 3h6M10 3v5.2L6.2 18a2 2 0 0 0 1.8 2.8h8a2 2 0 0 0 1.8-2.8L14 8.2V3" />
      <path className="cat-liquid" d="M8.2 15.5h7.6" />
      <circle className="cat-node" cx="10" cy="17.2" r="0.7" fill="currentColor" stroke="none" />
      <circle className="cat-node cat-node--delay" cx="13.5" cy="16.5" r="0.55" fill="currentColor" stroke="none" />
    </Frame>
  );
}

export function IconSystems({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="pulse">
      <rect className="cat-draw" x="3.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect className="cat-draw cat-block--delay" x="14.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect className="cat-draw" x="9" y="14.5" width="6" height="6" rx="1.2" />
      <path className="cat-draw cat-orbit" d="M9.5 6.5h5M17.5 9.5v3.2M12 14.5v-2.2" />
    </Frame>
  );
}

export function IconFounding({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="rise">
      <path className="cat-draw" d="M12 20V9" />
      <path className="cat-block" d="M12 9 5.5 12.5V20h13v-7.5L12 9z" />
      <path className="cat-draw cat-block--delay" d="M12 4.5 16 8" />
      <circle className="cat-node" cx="12" cy="4.2" r="1.1" fill="currentColor" stroke="none" />
    </Frame>
  );
}

export function IconInfrastructure({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="idle">
      <rect className="cat-draw" x="3.5" y="14" width="5.5" height="6" rx="1" />
      <rect className="cat-draw cat-block--delay" x="9.25" y="10" width="5.5" height="10" rx="1" />
      <rect className="cat-draw" x="15" y="6" width="5.5" height="14" rx="1" />
      <path className="cat-draw cat-orbit" d="M6.2 14V9.5M12 10V7M17.8 6V4" />
    </Frame>
  );
}

export function IconShipping({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="nudge">
      <path className="cat-draw" d="M3 13h11l3.5-4H21v8.5a1.5 1.5 0 0 1-1.5 1.5H18" />
      <circle className="cat-draw cat-node" cx="7.5" cy="19" r="1.6" />
      <circle className="cat-draw cat-node cat-node--delay" cx="16.5" cy="19" r="1.6" />
      <path className="cat-draw" d="M3 13V8.5A1.5 1.5 0 0 1 4.5 7H12v6" />
    </Frame>
  );
}

export function IconLearning({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="float">
      <path className="cat-draw" d="M4 6.5c3-.9 5-.9 8 0v12c-3-.9-5-.9-8 0V6.5z" />
      <path className="cat-draw cat-block--delay" d="M12 6.5c3-.9 5-.9 8 0v12c-3-.9-5-.9-8 0V6.5z" />
      <path className="cat-draw" d="M12 6.5v12" />
    </Frame>
  );
}

export function IconOpenSource({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="spin-slow">
      <circle className="cat-draw" cx="12" cy="12" r="3" />
      <circle className="cat-draw" cx="6" cy="7" r="2" />
      <circle className="cat-draw" cx="18" cy="7" r="2" />
      <circle className="cat-draw" cx="12" cy="19" r="2" />
      <path className="cat-draw cat-orbit" d="M8 8.2 10.2 10.5M15.8 10.5 18 8.2M12 15v2" />
    </Frame>
  );
}

export function IconSecurity({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="pulse">
      <path className="cat-draw" d="M12 3.5 19 7v5.2c0 4.2-2.9 7.1-7 8.3-4.1-1.2-7-4.1-7-8.3V7l7-3.5z" />
      <path className="cat-draw cat-block" d="M9.5 12.2 11.2 14l3.5-4" />
    </Frame>
  );
}

export function IconPerformance({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="nudge">
      <path className="cat-draw" d="M4 16h16" />
      <path className="cat-draw cat-block" d="M5 16 9 9l3 4 3-7 4 10" />
      <circle className="cat-node" cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
    </Frame>
  );
}

export function IconWork({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="idle">
      <rect className="cat-draw" x="3.5" y="8" width="17" height="11" rx="1.5" />
      <path className="cat-draw cat-block" d="M8 8V6.5A1.5 1.5 0 0 1 9.5 5h5A1.5 1.5 0 0 1 16 6.5V8" />
      <path className="cat-draw" d="M3.5 12h17" />
    </Frame>
  );
}

export function IconNotes({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="float">
      <path className="cat-draw" d="M7 4.5h8.5L19 8v11.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1z" />
      <path className="cat-draw cat-block" d="M15.5 4.5V8H19" />
      <path className="cat-draw cat-block--delay" d="M9 12h6M9 15h4" />
    </Frame>
  );
}

export function IconWriting({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="nudge">
      <path className="cat-draw" d="M5 19.5h14" />
      <path className="cat-draw cat-block" d="M7.5 16.5 16 5.5l2.5 2-8.5 11H7.5v-2z" />
    </Frame>
  );
}

export function IconUx({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="pulse">
      <rect className="cat-draw" x="4" y="5" width="16" height="14" rx="2" />
      <path className="cat-draw cat-block" d="M8 15.5h3M13 15.5h3" />
      <circle className="cat-node" cx="9.5" cy="10.5" r="1.4" />
      <path className="cat-draw cat-block--delay" d="M13.5 9.5h3.5v3h-3.5z" />
    </Frame>
  );
}

export function IconMeta({ className, title }: IconProps) {
  return (
    <Frame className={className} title={title} anim="spin-slow">
      <circle className="cat-draw" cx="12" cy="12" r="7.5" />
      <path className="cat-draw cat-orbit" d="M12 4.5c2.2 2.2 3.3 4.6 3.3 7.5S14.2 17.3 12 19.5c-2.2-2.2-3.3-4.6-3.3-7.5S9.8 6.7 12 4.5z" />
      <path className="cat-draw" d="M4.5 12h15" />
    </Frame>
  );
}

const iconMap: Record<
  CategoryIconId,
  (props: IconProps) => ReactElement
> = {
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
