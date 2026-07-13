import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

type PortraitProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

/** GitHub-sourced portrait for Eliot Maurice */
export function Portrait({ size = 96, className, priority }: PortraitProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full shadow-[var(--shadow-soft)] ring-1 ring-border",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img
        src={asset("/images/portrait.jpg")}
        alt="Eliot Maurice"
        width={size}
        height={size}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
