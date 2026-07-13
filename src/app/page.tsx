import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <div className="pb-8 pt-4 sm:pt-8">
      <FadeIn>
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
          {site.tagline}
        </p>
        <h1 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.15] tracking-tight text-fg sm:text-[2.35rem]">
          Eliot Maurice
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-fg-body sm:text-[17px]">
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
      </FadeIn>

      <FadeIn delay={0.08} className="mt-12">
        <section className="card-soft rounded-2xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-fg-subtle">
                Building
              </p>
              <h2 className="mt-2 text-[18px] font-semibold tracking-tight text-fg">
                Cial
              </h2>
              <p className="mt-2 max-w-md text-[14px] leading-relaxed text-fg-muted">
                A real AI workspace you own: agents, tools, and a product surface
                that lives on your machine — not a chat demo.
              </p>
            </div>
            <a
              href={site.links.cial}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-medium text-fg transition-colors hover:border-accent/40 hover:text-accent"
            >
              Visit →
            </a>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.14} className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.12em] text-fg-subtle">
            Writing
          </h2>
          <Link
            href="/writing/"
            className="text-[13px] text-fg-muted transition-colors hover:text-fg"
          >
            All posts →
          </Link>
        </div>

        {posts.length > 0 ? (
          <ul className="mt-2 divide-y divide-border">
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

      <FadeIn delay={0.2} className="mt-16">
        <h2 className="text-[13px] font-medium uppercase tracking-[0.12em] text-fg-subtle">
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
