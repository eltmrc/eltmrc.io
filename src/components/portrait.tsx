import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

type PortraitProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

/** GitHub-sourced portrait for Eliot Maurice */
export function Portrait({ size = 96, className, priority }: PortraitProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Cached images fire no load event — settle immediately.
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full shadow-[var(--shadow-soft)] ring-1 ring-border",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img
        ref={ref}
        src={asset("/images/portrait.jpg")}
        alt="Eliot Maurice"
        width={size}
        height={size}
        {...(priority ? { fetchPriority: "high" as const } : {})}
        onLoad={() => setLoaded(true)}
        className={cn("h-full w-full object-cover img-fade", loaded && "is-loaded")}
      />
    </div>
  );
}
