import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/** Discord has no public profile URL — clicking copies the username. */
export function DiscordHandle({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const copy = () => {
    navigator.clipboard?.writeText(site.socials.discord).catch(() => {});
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy Discord username"
      className={cn("pressable cursor-pointer", className)}
    >
      {copied ? (
        <span className="text-accent">copied!</span>
      ) : (
        site.socials.discord
      )}
    </button>
  );
}
