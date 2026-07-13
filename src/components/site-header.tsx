"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

const nav = [
  { href: "/writing/", label: "Writing" },
  { href: "/about/", label: "About" },
] as const;

function isActive(pathname: string, href: string) {
  const base = href.replace(/\/$/, "");
  if (base === "") return pathname === "/" || pathname === "";
  return pathname === href || pathname === base || pathname.startsWith(`${base}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-transparent backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5 sm:px-8">
        <Link
          href="/"
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
                href={item.href}
                className={cn(
                  "relative rounded-md px-2.5 py-1.5 text-[14px] transition-colors",
                  active ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-md bg-surface-elevated"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
