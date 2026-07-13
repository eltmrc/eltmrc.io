import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { Portrait } from "@/components/portrait";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4);

  return (
    <div className="pb-10 pt-6 sm:pt-10">
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
            <Image
              src="/images/cial-workspace.jpg"
              alt="Cial — AI workspace product preview"
              fill
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
          </div>
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-3.5">
              <Image
                src="/images/cial-icon.png"
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

      <FadeIn delay={0.14} className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
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

      <FadeIn delay={0.2} className="mt-16">
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
