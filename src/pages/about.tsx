import { FadeIn } from "@/components/fade-in";
import { Seo } from "@/components/seo";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";

export function AboutPage() {
  return (
    <div className="pb-10 pt-6 sm:pt-10">
      <Seo
        title="About"
        description={`About ${site.name} — founder of Cial, builder and writer.`}
        path="/about/"
      />

      <FadeIn>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] ring-1 ring-border sm:h-44 sm:w-44">
            <img
              src={asset("/images/portrait.jpg")}
              alt="Eliot Maurice"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
              About
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-fg sm:text-[2.25rem]">
              Eliot Maurice
            </h1>
            <p className="mt-2 text-[15px] text-fg-muted">
              Founder · builder · {site.handle}
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn
        delay={0.08}
        className="mt-10 space-y-5 text-[16px] leading-[1.75] text-fg-body sm:text-[17px]"
      >
        <p>
          I&apos;m a founder and builder. I care about software that feels
          intentional — fast, clear, and owned by the people who use it.
        </p>
        <p>
          Today I&apos;m the creator of{" "}
          <a
            href={site.links.cial}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Cial
          </a>
          : a self-hosted AI workspace with real login, tools, and agents. The
          idea is simple and hard at once — give people a durable place to work
          with AI that isn&apos;t trapped in a chat tab.
        </p>
        <p>
          This site is personal. I write about technologies I try, decisions
          behind the product, and the quieter parts of building something over
          years rather than weekends.
        </p>
        <p>
          If you want to talk — product, collaboration, or just a sharp
          technical note — email{" "}
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          .
        </p>
      </FadeIn>

      <FadeIn delay={0.12} className="mt-12">
        <div className="card-soft overflow-hidden rounded-2xl">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface">
            <img
              src={asset("/images/cial-workspace.jpg")}
              alt="Cial workspace"
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="flex items-center gap-3 p-5 sm:p-6">
            <img
              src={asset("/images/cial-icon.png")}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg ring-1 ring-border"
            />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-fg">Building Cial</p>
              <p className="text-[13px] text-fg-muted">
                Self-hosted AI workspace ·{" "}
                <a
                  href={site.links.cial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  cial.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.16} className="mt-10">
        <div className="card-soft rounded-2xl p-5 sm:p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
            Elsewhere
          </h2>
          <ul className="mt-4 space-y-0 text-[15px]">
            <li className="flex items-center justify-between gap-4 border-b border-border py-3">
              <span className="text-fg-muted">Product</span>
              <a
                href={site.links.cial}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Cial
              </a>
            </li>
            <li className="flex items-center justify-between gap-4 border-b border-border py-3">
              <span className="text-fg-muted">CTO</span>
              <a
                href="https://clinicpilot.io"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                ClinicPilot
              </a>
            </li>
            <li className="flex items-center justify-between gap-4 border-b border-border py-3">
              <span className="text-fg-muted">Code</span>
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                github.com/{site.handle}
              </a>
            </li>
            <li className="flex items-center justify-between gap-4 py-3">
              <span className="text-fg-muted">Social</span>
              <a
                href={site.links.x}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                @{site.handle}
              </a>
            </li>
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}
