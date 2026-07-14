import { CialMark } from "@/components/cial-mark";
import { DiscordHandle } from "@/components/discord-handle";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto mt-auto w-full max-w-2xl px-6 pb-12 pt-16 sm:px-8">
      <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-fg-muted">
          © {year} {site.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            GitHub
          </a>
          <a
            href={site.links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            X
          </a>
          <DiscordHandle className="link-quiet" />
          <a
            href={site.links.cial}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet"
          >
            Cial
          </a>
          <a href={`mailto:${site.email}`} className="link-quiet">
            Email
          </a>
        </div>
      </div>

      {/* cial.app-style credit: Built with [mark] Cial */}
      <div className="mt-6 flex items-center justify-center border-t border-border pt-6 sm:justify-start">
        <a
          href={site.links.cial}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[12.5px] text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] hover:text-fg"
        >
          <span>Built with</span>
          <CialMark className="h-4 w-4 shrink-0" alive />
          <span className="font-semibold text-fg-body transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-accent">
            Cial
          </span>
        </a>
      </div>
    </footer>
  );
}
