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
        <Link
          to="/"
          className="group text-[15px] font-medium tracking-tight text-fg transition-colors hover:text-accent"
        >
          <span className="inline-flex items-baseline gap-1.5">
            <span>{site.name}</span>
            <span className="text-fg-muted transition-colors group-hover:text-accent/80">
              ·
            </span>
            <span className="font-normal text-fg-muted transition-colors group-hover:text-accent/80">
              {site.handle}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Main">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "pressable relative rounded-md px-2.5 py-1.5 text-[14px]",
                  active
                    ? "text-fg"
                    : "text-fg-muted hover:bg-surface-elevated/60 hover:text-fg",
                )}
              >
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-md bg-surface-elevated"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                        opacity: { duration: 0.14, ease: "easeOut" },
                      }}
                    />
                  )}
                </AnimatePresence>
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
