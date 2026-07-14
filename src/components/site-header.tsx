import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const nav = [
  { href: "/writing/", label: "Writing" },
  { href: "/categories/", label: "Categories" },
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

function isActive(pathname: string, href: string) {
  const base = href.replace(/\/$/, "");
  if (base === "") return pathname === "/" || pathname === "";
  return pathname === href || pathname === base || pathname.startsWith(`${base}/`);
}

export function SiteHeader() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className="site-header sticky top-0 z-40 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70"
    >
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5 sm:px-8">
        <Link to="/" className="site-brand group text-[15px] font-medium tracking-tight text-fg">
          <span className="inline-flex items-baseline gap-1.5">
            <span className="site-brand__name">{site.name}</span>
            <span className="site-brand__dot text-fg-muted">·</span>
            <span className="site-brand__handle font-normal text-fg-muted">{site.handle}</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Main">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                data-active={active ? "true" : "false"}
                className={cn(
                  "site-nav-link group relative rounded-md px-2.5 py-1.5 text-[14px]",
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
      </div>
    </header>
  );
}
