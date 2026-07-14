import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CategoryChip } from "@/components/category-chip";
import { FadeIn } from "@/components/fade-in";
import { PostMinimap } from "@/components/post-minimap";
import { Prose } from "@/components/prose";
import { Seo } from "@/components/seo";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { extractHeadings } from "@/lib/headings";
import { formatDate, getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

export function WritingPostPage() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);
  const [tldrOpen, setTldrOpen] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const coverRef = useRef<HTMLImageElement>(null);
  const headings = post ? extractHeadings(post.content) : [];

  useEffect(() => {
    if (coverRef.current?.complete) setCoverLoaded(true);
  }, [post?.image]);

  if (!post || post.draft) {
    return <Navigate to="/writing/" replace />;
  }

  return (
    <div className="pb-10 pt-6 sm:pt-10">
      <Seo
        title={post.title}
        description={post.description}
        path={`/writing/${post.slug}/`}
        type="article"
        publishedTime={post.date}
      />

      <PostMinimap headings={headings} />

      <FadeIn>
        <Link
          to="/writing/"
          className="text-[13px] text-fg-muted transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] hover:text-fg"
        >
          <span className="arrow-icon arrow-icon--back">←</span> Writing
        </Link>
        {post.category ? (
          <div className="mt-5">
            <CategoryChip slug={post.category} />
          </div>
        ) : null}
        <h1 className="mt-4 text-[1.85rem] font-semibold leading-[1.2] tracking-tight text-fg sm:text-[2.15rem]">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-fg-subtle">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
      </FadeIn>

      {post.image ? (
        <FadeIn delay={0.04} className="mt-8">
          <figure className="overflow-hidden rounded-2xl border border-border">
            <img
              ref={coverRef}
              src={asset(post.image)}
              alt=""
              width={1200}
              height={675}
              className={cn(
                "img-fade aspect-[16/9] w-full object-cover",
                coverLoaded && "is-loaded",
              )}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setCoverLoaded(true)}
            />
          </figure>
        </FadeIn>
      ) : null}

      {post.tldr && post.tldr.length > 0 ? (
        <FadeIn delay={0.06} className="mt-10">
          <aside className="card-soft overflow-hidden rounded-2xl">
            <button
              type="button"
              onClick={() => setTldrOpen((v) => !v)}
              aria-expanded={tldrOpen}
              className={cn(
                "group pressable flex w-full cursor-pointer items-center justify-between gap-3",
                "px-5 py-4 text-left sm:px-6",
                "hover:bg-[color-mix(in_srgb,var(--accent)_7%,transparent)]",
                "active:bg-[color-mix(in_srgb,var(--accent)_11%,transparent)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40",
              )}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                TL;DR
                <span className="ml-2 font-normal normal-case tracking-normal text-fg-subtle transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-fg-muted">
                  {tldrOpen
                    ? "Hide"
                    : `${post.tldr.length} key point${post.tldr.length === 1 ? "" : "s"}`}
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={cn(
                  "chevron-icon h-3.5 w-3.5 shrink-0 text-fg-muted group-hover:text-fg",
                  tldrOpen && "is-open",
                )}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <AnimatePresence initial={false}>
              {tldrOpen ? (
                <motion.div
                  key="tldr-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2 border-t border-border px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
                    {post.tldr.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2.5 text-[14px] leading-relaxed text-fg-body"
                      >
                        <span
                          aria-hidden
                          className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent/60"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </aside>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.08} className="mt-10">
        <Prose source={post.content} />
      </FadeIn>

      {post.slug === "why-im-building-cial" ? (
        <FadeIn delay={0.1} className="mt-12">
          <aside className="card-soft rounded-2xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              OpenCial
            </p>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-fg-body">
              The open release is on GitHub. Star it, fork it, break it — or
              just come hang in the community Discord.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href={site.links.opencialGithub}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "pressable group inline-flex cursor-pointer items-center gap-2 rounded-full",
                  "border border-border bg-[color-mix(in_srgb,var(--card-base)_92%,transparent)]",
                  "px-3.5 py-2 text-[13px] font-medium text-fg",
                  "hover:border-accent/40 hover:bg-accent-soft hover:text-accent",
                  "hover:shadow-[0_0_0_3px_var(--accent-soft)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                  className="h-3.5 w-3.5"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
                <span className="arrow-icon text-fg-muted group-hover:text-accent">
                  →
                </span>
              </a>
              <a
                href={site.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "pressable group inline-flex cursor-pointer items-center gap-2 rounded-full",
                  "border border-border bg-[color-mix(in_srgb,var(--card-base)_92%,transparent)]",
                  "px-3.5 py-2 text-[13px] font-medium text-fg",
                  "hover:border-accent/40 hover:bg-accent-soft hover:text-accent",
                  "hover:shadow-[0_0_0_3px_var(--accent-soft)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                )}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                  className="h-3.5 w-3.5"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Discord
                <span className="arrow-icon text-fg-muted group-hover:text-accent">
                  →
                </span>
              </a>
            </div>
          </aside>
        </FadeIn>
      ) : null}

      {/* Scroll-gated entrance; 0.4s = --dur-slow, [0.22,1,0.36,1] = --ease-out-quart
          (motion/react cannot read CSS vars — sanctioned token mapping). */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14 border-t border-border pt-8"
      >
        <p className="text-[14px] text-fg-muted">
          Written by {site.name}.{" "}
          <Link to="/writing/" className="link">
            More writing
          </Link>
          {post.category ? (
            <>
              {" · "}
              <Link to={`/categories/${post.category}/`} className="link">
                More in this category
              </Link>
            </>
          ) : null}
          {" · "}
          <a
            href={site.links.x}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow on X
          </a>
        </p>
      </motion.div>
    </div>
  );
}
