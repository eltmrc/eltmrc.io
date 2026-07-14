import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

type PortraitProps = {
  size?: number;
  className?: string;
  priority?: boolean;
  /** Circle (home) or soft square (about). */
  shape?: "circle" | "rounded";
  /** When false, just the image — no contact menu. Default true. */
  menu?: boolean;
};

type ContactItem = {
  label: string;
  href: string;
  external?: boolean;
  icon: "x" | "mail" | "discord" | "github" | "linkedin";
};

const CONTACTS: ContactItem[] = [
  {
    label: "DM me on X",
    href: site.links.x,
    external: true,
    icon: "x",
  },
  {
    label: "Send me an email",
    href: `mailto:${site.email}`,
    icon: "mail",
  },
  {
    label: "Connect on LinkedIn",
    href: site.links.linkedin,
    external: true,
    icon: "linkedin",
  },
  {
    label: "Join the OpenCial Discord",
    href: site.links.discord,
    external: true,
    icon: "discord",
  },
  {
    label: "GitHub",
    href: site.links.github,
    external: true,
    icon: "github",
  },
];

function ContactIcon({ name }: { name: ContactItem["icon"] }) {
  const size = 15;
  if (name === "x") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    );
  }
  if (name === "mail") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  if (name === "linkedin") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  if (name === "discord") {
    return (
      <svg width={size + 1} height={size + 1} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/** GitHub-sourced portrait — hover/tap opens a squishee contact menu. */
export function Portrait({
  size = 96,
  className,
  priority,
  shape = "circle",
  menu = true,
}: PortraitProps) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  useEffect(() => {
    // Cached images fire no load event — settle immediately.
    if (ref.current?.complete) setLoaded(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  const openMenu = () => {
    clearClose();
    setOpen(true);
  };

  const shell = (
    <div
      className={cn(
        "portrait-face relative overflow-hidden shadow-[var(--shadow-soft)] ring-1 ring-border",
        shape === "circle" ? "rounded-full" : "rounded-2xl",
        menu && "portrait-face--interactive",
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
        onError={() => setLoaded(true)}
        className={cn("h-full w-full object-cover img-fade", loaded && "is-loaded")}
        draggable={false}
      />
      {menu ? <span className="portrait-face__hint" aria-hidden /> : null}
    </div>
  );

  if (!menu) {
    return (
      <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
        {shell}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn("portrait-menu-root relative shrink-0", className)}
      data-open={open ? "true" : "false"}
      style={{ width: size, height: size }}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocusCapture={openMenu}
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        className={cn(
          "portrait-trigger group block border-0 bg-transparent p-0",
          shape === "circle" ? "rounded-full" : "rounded-2xl",
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Contact Eliot"
        onClick={() => setOpen((v) => !v)}
      >
        {shell}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Contact"
            className="portrait-menu"
            initial={{ opacity: 0, y: 6, scale: 0.92, scaleY: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1, scaleY: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.94, scaleY: 0.92 }}
            transition={{
              type: "spring",
              stiffness: 520,
              damping: 28,
              mass: 0.7,
            }}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
          >
            <div className="portrait-menu__inner">
              {CONTACTS.map((item, i) => (
                <motion.a
                  key={item.label}
                  role="menuitem"
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="portrait-menu__item group/item"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.03 + i * 0.035,
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span className="portrait-menu__icon" aria-hidden>
                    <ContactIcon name={item.icon} />
                  </span>
                  <span className="portrait-menu__label">{item.label}</span>
                  <span className="portrait-menu__arrow" aria-hidden>
                    →
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
