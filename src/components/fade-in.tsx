import { cn } from "@/lib/cn";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds */
  delay?: number;
};

/**
 * CSS-only entrance. Content is always visible if JS fails —
 * unlike motion `initial={{ opacity: 0 }}` which can leave a blank page.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  return (
    <div
      className={cn("animate-fade-up", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
