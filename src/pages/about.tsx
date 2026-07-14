import { useEffect, useRef, useState } from "react";
import { DiscordHandle } from "@/components/discord-handle";
import { FadeIn } from "@/components/fade-in";
import { Seo } from "@/components/seo";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export function AboutPage() {
  /* Standard .img-fade load-settle contract: cached images fire no load
     event, so also check `complete` on mount. */
  const portraitRef = useRef<HTMLImageElement>(null);
  const [portraitLoaded, setPortraitLoaded] = useState(false);
  const workspaceRef = useRef<HTMLImageElement>(null);
  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);

  useEffect(() => {
    if (portraitRef.current?.complete) setPortraitLoaded(true);
    if (workspaceRef.current?.complete) setWorkspaceLoaded(true);
  }, []);

  return (
    <div className="pb-10 pt-6 sm:pt-10">
      <Seo
        title="About"
        description={`About ${site.name} — builder since forever, founder of Cial, surfboards for tech waves.`}
        path="/about/"
      />

      <FadeIn>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow-soft)] ring-1 ring-border sm:h-44 sm:w-44">
            <img
              ref={portraitRef}
              src={asset("/images/portrait.jpg")}
              alt="Eliot Maurice"
              className={cn(
                "img-fade h-full w-full object-cover",
                portraitLoaded && "is-loaded",
              )}
              onLoad={() => setPortraitLoaded(true)}
              onError={() => setPortraitLoaded(true)}
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
              Builder · founder · OSS · {site.handle}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 text-[14px] text-fg-muted">
              <span
                className="inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-border"
                title="France"
                aria-hidden
              >
                <span className="h-full w-1/3 bg-[#002395]" />
                <span className="h-full w-1/3 bg-white" />
                <span className="h-full w-1/3 bg-[#ed2939]" />
              </span>
              <span>Paris, France</span>
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn
        delay={0.08}
        className="mt-10 space-y-5 text-[16px] leading-[1.75] text-fg-body sm:text-[17px]"
      >
        <p>
          I started coding at <strong className="prose-mark">12</strong>. Not
          a clean résumé path — just a long stack of tools and domains, always
          with the same itch: help the world build what it needs.
        </p>
        <p>
          Java and <strong className="prose-mark">Minecraft</strong> when I was
          a kid. Military <strong className="prose-mark">drones</strong> later.{" "}
          <strong className="prose-mark">Finance</strong> SaaS.{" "}
          <strong className="prose-mark">Health care</strong>. Freelancing. Now
          founder of{" "}
          <a
            href={site.links.cial}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Cial
          </a>{" "}
          /{" "}
          <a
            href={site.links.opencial}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            OpenCial
          </a>
          , <strong className="prose-mark">OSS</strong> contributor, still
          shipping. The wave changes; the job doesn&apos;t — craft the best{" "}
          <strong className="prose-mark">surfboards</strong> for the
          technological waves.
        </p>
        <p>
          Experiences are still a bit unstructured on paper. That&apos;s fine.
          What compounds is the pattern: hit a wall, go after the tool, leave
          something people can actually ride.
        </p>
        <p>
          This site is personal — notes, products, and the messy middle. If you
          want to talk, email{" "}
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          .
        </p>
      </FadeIn>

      <FadeIn delay={0.12} className="mt-12">
        <a
          href={site.links.cial}
          target="_blank"
          rel="noopener noreferrer"
          className="card-soft group block overflow-hidden rounded-2xl"
        >
          {/* img-fade lives on the clip wrapper: on the img itself its
              transition shorthand would override the hover-scale transition. */}
          <div
            className={cn(
              "img-fade relative aspect-[21/9] w-full overflow-hidden bg-surface",
              workspaceLoaded && "is-loaded",
            )}
          >
            <img
              ref={workspaceRef}
              src={asset("/images/cial-workspace.jpg")}
              alt="Cial workspace"
              className="h-full w-full object-cover object-top transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-quart)] group-hover:scale-[1.02]"
              onLoad={() => setWorkspaceLoaded(true)}
              onError={() => setWorkspaceLoaded(true)}
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
              <p className="text-[13px] font-medium text-fg transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-accent">
                Building Cial
              </p>
              <p className="text-[13px] text-fg-muted">
                Self-hosted AI workspace ·{" "}
                <span className="hover-underline text-fg">cial.ai</span>
              </p>
            </div>
          </div>
        </a>
      </FadeIn>

      <FadeIn delay={0.16} className="mt-10">
        <div className="card-soft rounded-2xl p-5 sm:p-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
            Elsewhere
          </h2>
          <ul className="mt-4 space-y-0 text-[15px]">
            <li className="group flex items-center justify-between gap-4 border-b border-border py-3">
              <span className="text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-fg">Based in</span>
              <span className="inline-flex items-center gap-2 text-fg">
                <span
                  className="inline-flex h-3 w-[1.15rem] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-border"
                  aria-hidden
                >
                  <span className="h-full w-1/3 bg-[#002395]" />
                  <span className="h-full w-1/3 bg-white" />
                  <span className="h-full w-1/3 bg-[#ed2939]" />
                </span>
                Paris, France
              </span>
            </li>
            <li className="group flex items-center justify-between gap-4 border-b border-border py-3">
              <span className="text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-fg">Product</span>
              <a
                href={site.links.cial}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Cial
              </a>
            </li>
            <li className="group flex items-center justify-between gap-4 border-b border-border py-3">
              <span className="text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-fg">CTO</span>
              <a
                href="https://clinicpilot.io"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                ClinicPilot
              </a>
            </li>
            <li className="group flex items-center justify-between gap-4 border-b border-border py-3">
              <span className="text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-fg">Code</span>
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                github.com/{site.handle}
              </a>
            </li>
            <li className="group flex items-center justify-between gap-4 border-b border-border py-3">
              <span className="text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-fg">X / Twitter</span>
              <a
                href={site.links.x}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {site.socials.x}
              </a>
            </li>
            <li className="group flex items-center justify-between gap-4 py-3">
              <span className="text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-fg">Discord</span>
              <DiscordHandle className="link" />
            </li>
          </ul>
        </div>
      </FadeIn>
    </div>
  );
}
