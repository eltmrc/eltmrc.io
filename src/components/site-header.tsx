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

/** Width layout spring — soft overshoot when the pill squishes. */
const pillLayoutTransition = {
  type: "spring" as const,
  stiffness: 360,
  damping: 20,
  mass: 0.66,
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

  // Squishee jelly pulse whenever compact state flips (not on first paint).
  useEffect(() => {
    if (!ready || preferReducedMotion) return;
    void jelly.start({
      // Compressing width → briefly fatter on Y; expanding → opposite.
      scaleY: scrolled ? [1, 1.07, 0.97, 1.015, 1] : [1, 0.95, 1.05, 0.99, 1],
      scaleX: scrolled ? [1, 0.97, 1.02, 0.995, 1] : [1, 1.03, 0.97, 1.01, 1],
      transition: {
        duration: 0.46,
        times: [0, 0.22, 0.48, 0.74, 1],
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
            <AnimatePresence initial={false}>
              {!scrolled ? (
                <motion.span
                  key="brand-meta"
                  className="inline-flex items-baseline gap-1.5 overflow-hidden whitespace-nowrap"
                  initial={preferReducedMotion ? false : { opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={
                    preferReducedMotion
                      ? undefined
                      : {
                          opacity: 0,
                          width: 0,
                          transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
                        }
                  }
                  transition={
                    preferReducedMotion
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 380,
                          damping: 26,
                          mass: 0.7,
                          opacity: { duration: 0.16 },
                        }
                  }
                >
                  <span className="site-brand__dot text-fg-muted">·</span>
                  <span className="site-brand__handle font-normal text-fg-muted">
                    {site.handle}
                  </span>
                </motion.span>
              ) : null}
            </AnimatePresence>
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
