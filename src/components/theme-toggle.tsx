import { useRef, useState } from "react";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setCurrent] = useState<Theme>(() => getTheme());
  const transitionTimer = useRef<number | undefined>(undefined);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.add("theme-transition");
    requestAnimationFrame(() => {
      setTheme(next);
      setCurrent(next);
    });
    // Clear any pending removal so a rapid re-toggle doesn't cut the
    // cross-fade short.
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="group pressable relative rounded-md p-2 text-fg-muted hover:text-fg"
    >
      <span className="absolute inset-x-2 bottom-[3px] h-px origin-left scale-x-0 bg-accent/60 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quart)] group-hover:scale-x-100" />
      <span className="swap-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={theme === "light" ? "swap-hidden h-[17px] w-[17px]" : "h-[17px] w-[17px]"}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M18.4 5.6l-1.1 1.1M6.7 17.3l-1.1 1.1" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={theme === "dark" ? "swap-hidden h-[17px] w-[17px]" : "h-[17px] w-[17px]"}
        >
          <path d="M20.4 14.2A8.2 8.2 0 0 1 9.8 3.6a8.2 8.2 0 1 0 10.6 10.6Z" />
        </svg>
      </span>
    </button>
  );
}
