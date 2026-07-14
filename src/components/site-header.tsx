import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const nav = [
  { href: "/writing/", label: "Writing" },
  { href: "/about/", label: "About" },
] as const;

/** Spring for the shared active underline — snappy settle, soft overshoot. */
const navLineTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 28,
  mass: 0.78,
  opacity: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const },
};

/** Width layout spring — bouncy squishee when the pill narrows. */
const pillLayoutTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 14,
  mass: 0.78,
};

function isActive(pathname: string, href: string) {
  const base = href.replace(/\/$/, "");
  if (base === "") return pathname === "/" || pathname === "";
  return pathname === href || pathname === base || pathname.startsWith(`${base}/`);
}

export function SiteHeader() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const preferReducedMotion = useReducedMotion();
  const jelly = useAnimationControls();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    setReady(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stronger jelly pulse whenever compact state flips (skip first paint).
  useEffect(() => {
    if (!ready || preferReducedMotion) return;
    void jelly.start({
      // Compressing width → fatter on Y; expanding → stretch out.
      scaleY: scrolled
        ? [1, 1.14, 0.9, 1.06, 0.98, 1.02, 1]
        : [1, 0.9, 1.12, 0.94, 1.04, 0.99, 1],
      scaleX: scrolled
        ? [1, 0.92, 1.06, 0.96, 1.03, 0.99, 1]
        : [1, 1.08, 0.93, 1.05, 0.97, 1.01, 1],
      transition: {
        duration: 0.62,
        times: [0, 0.16, 0.34, 0.5, 0.68, 0.84, 1],
        ease: [0.22, 1, 0.36, 1],
      },
    });
  }, [scrolled, ready, preferReducedMotion, jelly]);

  return (
    <header className="site-header sticky top-0 z-50 flex justify-center px-6 pt-3 sm:px-8 sm:pt-4">
      <motion.div
        layout={!preferReducedMotion}
        data-scrolled={scrolled ? "true" : "false"}
        className={cn(
          "site-header__pill",
          scrolled ? "site-header__pill--compact" : "site-header__pill--expanded",
        )}
        style={{ transformOrigin: "center top" }}
        animate={jelly}
        transition={{
          layout: preferReducedMotion ? { duration: 0 } : pillLayoutTransition,
        }}
        initial={false}
      >
        <Link
          to="/"
          className="site-brand group shrink-0 text-[14px] font-medium tracking-tight text-fg sm:text-[15px]"
        >
          <span className="inline-flex items-baseline gap-1.5">
            <span className="site-brand__name">{site.name}</span>
            <span className="site-brand__dot text-fg-muted">·</span>
            <span className="site-brand__handle font-normal text-fg-muted">
              {site.handle}
            </span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-0.5" aria-label="Main">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                data-active={active ? "true" : "false"}
                className={cn(
                  "site-nav-link group relative rounded-full px-2.5 py-1.5 text-[13px] sm:text-[14px]",
                  active ? "text-fg" : "text-fg-muted",
                )}
              >
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.span
                      layoutId="nav-line"
                      className="site-nav-link__active-line absolute inset-x-2.5 bottom-[5px] h-[1.5px] bg-accent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={navLineTransition}
                    />
                  )}
                </AnimatePresence>
                {!active && (
                  <span
                    aria-hidden
                    className="site-nav-link__hover-line absolute inset-x-2.5 bottom-[5px] h-px origin-left scale-x-0 bg-accent/55 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                )}
                <span className="site-nav-link__label relative">{item.label}</span>
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </motion.div>
    </header>
  );
}
