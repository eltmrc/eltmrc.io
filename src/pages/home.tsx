import { Link } from "react-router-dom";
import { CategoryCard } from "@/components/category-card";
import { FadeIn } from "@/components/fade-in";
import { Portrait } from "@/components/portrait";
import { PostCard } from "@/components/post-card";
import { Seo } from "@/components/seo";
import { asset } from "@/lib/asset";
import { getAllCategories } from "@/lib/categories";
import { getAllPosts, getCategoryCounts } from "@/lib/posts";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export function HomePage() {
  const posts = getAllPosts().slice(0, 4);
  const counts = getCategoryCounts();
  const featuredCategories = getAllCategories()
    .filter((c) => (counts[c.slug] ?? 0) > 0)
    .slice(0, 6);

  return (
    <div className="pb-10 pt-6 sm:pt-10">
      <Seo title={site.title} description={site.description} path="/" titleTemplate={false} />

      <FadeIn>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <Portrait size={88} priority className="sm:mt-1" />
          <div className="min-w-0">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
              {site.tagline}
            </p>
            <h1 className="mt-3 max-w-xl text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-fg sm:text-[2.5rem]">
              Eliot Maurice
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-[1.75] text-fg-body sm:text-[17px]">
              I build tools for how people work with AI. Creator of{" "}
              <a
                href={site.links.cial}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Cial
              </a>
              — a self-hosted AI workspace — and this is where I write about
              software, systems, and the long path of shipping something real.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-12">
        <a
          href={site.links.cial}
          target="_blank"
          rel="noopener noreferrer"
          className="card-soft group block overflow-hidden rounded-2xl transition-colors"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
            <img
              src={asset("/images/cial-workspace.jpg")}
              alt="Cial — AI workspace product preview"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
          </div>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-3.5">
              <img
                src={asset("/images/cial-icon.png")}
                alt=""
                width={40}
                height={40}
                className="mt-0.5 h-10 w-10 rounded-xl ring-1 ring-border"
              />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
                  Building
                </p>
                <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-fg transition-colors group-hover:text-accent">
                  Cial
                </h2>
                <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-fg-muted">
                  A real AI workspace you own: agents, tools, and a product
                  surface that lives on your machine — not a chat demo.
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-border bg-bg px-3.5 py-1.5 text-[13px] font-medium text-fg transition-colors group-hover:border-accent/40 group-hover:text-accent sm:self-center">
              Visit →
            </span>
          </div>
        </a>
      </FadeIn>

      <FadeIn delay={0.12} className="mt-14">
        <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
          Projects
        </h2>
        <ul className="mt-1 divide-y divide-border">
          {projects.map((project) => {
            const meta = [project.role, project.period]
              .filter(Boolean)
              .join(" · ");
            const body = (
              <div className="flex items-start justify-between gap-4 py-4">
                {project.icon ? (
                  <img
                    src={asset(project.icon)}
                    alt=""
                    width={32}
                    height={32}
                    className="mt-0.5 h-8 w-8 shrink-0 rounded-lg object-contain ring-1 ring-border"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <span className="text-[15px] font-medium text-fg transition-colors group-hover:text-accent">
                      {project.name}
                    </span>
                    <span className="text-[12px] text-fg-subtle">{meta}</span>
                    {project.status === "active" ? (
                      <span className="rounded-full border border-accent/30 bg-accent/5 px-2 py-0.5 text-[11px] leading-none text-accent">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[11px] leading-none text-fg-subtle">
                        Archived
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-fg-muted">
                    {project.description}
                  </p>
                </div>
                {project.href ? (
                  <span className="shrink-0 text-[13px] text-fg-muted transition-colors group-hover:text-accent">
                    {project.linkLabel ?? "Visit"} →
                  </span>
                ) : null}
              </div>
            );
            const isInternal = project.href?.startsWith("/");
            return (
              <li key={project.name}>
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
          })}
        </ul>
      </FadeIn>

      <FadeIn delay={0.14} className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
            Writing
          </h2>
          <Link
            to="/writing/"
            className="text-[13px] text-fg-muted transition-colors hover:text-fg"
          >
            All posts →
          </Link>
        </div>

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
      </FadeIn>

      {featuredCategories.length > 0 ? (
        <FadeIn delay={0.18} className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
              Categories
            </h2>
            <Link
              to="/categories/"
              className="text-[13px] text-fg-muted transition-colors hover:text-fg"
            >
              All 20 →
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
          </a>{" "}
          and{" "}
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            GitHub
          </a>
          .
        </p>
      </FadeIn>
    </div>
  );
}
