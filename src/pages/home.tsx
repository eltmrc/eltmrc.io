import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CategoryCard } from "@/components/category-card";
import { CialMarkInteractive } from "@/components/cial-mark-interactive";
import { FadeIn } from "@/components/fade-in";
import { Portrait } from "@/components/portrait";
import { PostCard } from "@/components/post-card";
import { RotatingDrop } from "@/components/rotating-drop";
import { Seo } from "@/components/seo";
import { asset } from "@/lib/asset";
import { getAllCategories } from "@/lib/categories";
import { getAllPosts, getCategoryCounts } from "@/lib/posts";
import { projects, type Project } from "@/lib/projects";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/* Keep short — must sit on one line after “then ” inside max-w-xl. */
const THEN_CHAPTERS = [
  {
    text: "built an indie game 3D engine.",
    when: "2018",
    marks: ["3D engine"],
  },
  {
    text: "co-founded dental AI SaaS, 100+ clinics.",
    when: "2022–2026",
    marks: ["AI SaaS"],
    href: "https://clinicpilot.io",
  },
  {
    text: "shipped ProClient — 250k+ downloads.",
    when: "2017–2019",
    marks: ["ProClient"],
    href: "https://x.com/ProClientMC",
  },
  {
    text: "scaled HardFight to 150k+ players.",
    when: "2014–2016",
    marks: ["HardFight"],
  },
  {
    text: "built military-grade drone software.",
    when: "2019–2020",
    marks: ["drone"],
    href: "https://generate.fr/systeme-internest-facilite-latterrissage-des-drones/",
  },
  {
    text: "shipped complex finance SaaS in prod.",
    when: "2022",
    marks: ["finance"],
  },
  {
    text: "helped 30+ startups as a freelancer.",
    when: "2021–2022",
    marks: ["30+"],
  },
  {
    text: "built OpenCial, the AI workspace.",
    when: "2026",
    marks: ["OpenCial"],
    href: "https://opencial.ai",
  },
  {
    text: "built a live electricity map for Enedis.",
    when: "2021",
    marks: ["Enedis"],
    href: "https://www.enedis.fr/",
  },
] as const;

export function HomePage() {
  const posts = getAllPosts().slice(0, 4);
  const counts = getCategoryCounts();
  const featuredCategories = getAllCategories()
    .filter((c) => (counts[c.slug] ?? 0) > 0)
    .slice(0, 6);

  const [showArchived, setShowArchived] = useState(false);
  const activeProjects = projects.filter((p) => p.status === "active");
  const archivedProjects = projects.filter((p) => p.status !== "active");

  const renderProject = (project: Project, delay: number) => {
    const meta = [project.role, project.period].filter(Boolean).join(" · ");
    const body = (
      <div className="list-row flex items-start justify-between gap-4 -mx-2 px-2 py-4">
        {project.icon === "cial-mark" ? (
          <CialMarkInteractive
            alive
            portalBurst
            burstScale={1.2}
            aria-label="OpenCial"
            className="h-8 w-8"
            shellClassName="mt-0.5 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />
        ) : project.icon ? (
          <img
            src={asset(project.icon)}
            alt=""
            width={32}
            height={32}
            className="mt-0.5 h-8 w-8 shrink-0 rounded-lg object-contain"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="text-[15px] font-medium text-fg transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-accent">
              {project.name}
            </span>
            <span className="text-[12px] text-fg-subtle">{meta}</span>
            {project.status === "active" ? (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] leading-none text-accent">
                Active
              </span>
            ) : (
              <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[11px] leading-none text-fg-subtle">
                Archived
              </span>
            )}
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-fg-muted">
            {project.description}
          </p>
        </div>
        {project.href ? (
          <span className="shrink-0 text-[13px] text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-accent">
            {project.linkLabel ?? "Visit"} <span className="arrow-icon">→</span>
          </span>
        ) : null}
      </div>
    );
    const isInternal = project.href?.startsWith("/");
    return (
      <li
        key={project.name}
        className="animate-fade-up"
        style={{ animationDelay: `${delay}s` }}
      >
        {project.href && isInternal ? (
          <Link to={project.href} className="group block">
            {body}
          </Link>
        ) : project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            {body}
          </a>
        ) : (
          body
        )}
      </li>
    );
  };

  return (
    <div className="pb-10 pt-6 sm:pt-10">
      <Seo title={site.title} description={site.description} path="/" titleTemplate={false} />

      {/* z-40 so the portrait contact menu paints above the Cial.app card below */}
      <FadeIn className="relative z-40">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <Portrait size={88} priority className="sm:mt-1" />
          <div className="min-w-0">
            <h1 className="max-w-xl text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-fg sm:text-[2.5rem]">
              Eliot Maurice
            </h1>
            <div className="mt-4 max-w-xl text-[16px] leading-[1.75] text-fg-body sm:text-[17px]">
              <p>
                I&apos;ve been building since 12 — picking up every tool that
                helps people ship what they need. Started with Minecraft mods,
                then{" "}
                <RotatingDrop phrases={THEN_CHAPTERS} />
              </p>
              <p className="mt-4">
                Now I work on <strong className="prose-mark">AI</strong> as
                co-founder of{" "}
                <a
                  href={site.links.cial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Cial
                </a>{" "}
                and <strong className="prose-mark">OSS</strong> contributor with{" "}
                <a
                  href={site.links.opencial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  OpenCial
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.08} className="relative z-10 mt-8">
        <a
          href={site.links.cial}
          target="_blank"
          rel="noopener noreferrer"
          className="card-soft group block overflow-hidden rounded-2xl"
        >
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-3.5">
              <CialMarkInteractive
                alive
                portalBurst
                burstScale={1.35}
                aria-label="Cial"
                className="h-10 w-10"
                shellClassName="mt-0.5 shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
              <div>
                <h2 className="text-[18px] font-semibold tracking-tight text-fg transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-accent">
                  Cial.app
                </h2>
                <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-fg-muted">
                  The managed version of Cial — security, team-ready workflows,
                  and access to powerful tools for everyone. Not just a chat
                  demo.
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-border bg-bg px-3.5 py-1.5 text-[13px] font-medium text-fg transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:border-accent/40 group-hover:text-accent sm:self-center">
              Visit <span className="arrow-icon">→</span>
            </span>
          </div>
        </a>
      </FadeIn>

      <section className="mt-14">
        <FadeIn delay={0.12}>
          <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
            Projects
          </h2>
        </FadeIn>
        <ul className="mt-1 divide-y divide-border">
          {activeProjects.map((project, i) =>
            renderProject(project, 0.12 + Math.min(i, 7) * 0.05),
          )}
        </ul>
        <AnimatePresence initial={false}>
          {showArchived && (
            <motion.div
              key="archived-projects"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ul className="divide-y divide-border border-t border-border">
                {archivedProjects.map((project, i) =>
                  renderProject(project, Math.min(i, 7) * 0.04),
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          aria-expanded={showArchived}
          className="pressable group mt-2 -ml-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[13px] text-fg-muted hover:text-fg"
        >
          {showArchived
            ? "Hide archived projects"
            : `See archived projects (${archivedProjects.length})`}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={cn(
              "chevron-icon h-3.5 w-3.5 text-fg-subtle group-hover:text-fg-muted",
              showArchived && "is-open",
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </section>

      <section className="mt-14">
        <FadeIn delay={0.14}>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
              Writing
            </h2>
            <Link
              to="/writing/"
              className="group text-[13px] text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] hover:text-fg"
            >
              All posts <span className="arrow-icon">→</span>
            </Link>
          </div>
        </FadeIn>

        {posts.length > 0 ? (
          <ul className="mt-1 divide-y divide-border">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-[14px] text-fg-muted">
            First posts coming soon.
          </p>
        )}
      </section>

      {featuredCategories.length > 0 ? (
        <FadeIn delay={0.18} className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
              Categories
            </h2>
            <Link
              to="/categories/"
              className="group text-[13px] text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] hover:text-fg"
            >
              All 20 <span className="arrow-icon">→</span>
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {featuredCategories.map((cat, i) => (
              <CategoryCard
                key={cat.slug}
                category={cat}
                count={counts[cat.slug] ?? 0}
                index={i}
              />
            ))}
          </div>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.22} className="mt-16">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
          Connect
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-fg-body">
          Reach me at{" "}
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          , or on{" "}
          <a
            href={site.links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            X
          </a>
          ,{" "}
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            LinkedIn
          </a>
          ,{" "}
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            GitHub
          </a>
          , and the{" "}
          <a
            href={site.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Cial Discord
          </a>
          .
        </p>
      </FadeIn>
    </div>
  );
}
