import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CategoryChip } from "@/components/category-chip";
import { FadeIn } from "@/components/fade-in";
import { Prose } from "@/components/prose";
import { Seo } from "@/components/seo";
import { cn } from "@/lib/cn";
import { formatDate, getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

export function WritingPostPage() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);
  const [tldrOpen, setTldrOpen] = useState(false);

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

      {post.tldr && post.tldr.length > 0 ? (
        <FadeIn delay={0.06} className="mt-10">
          <aside className="card-soft overflow-hidden rounded-2xl">
            <button
              type="button"
              onClick={() => setTldrOpen((v) => !v)}
              aria-expanded={tldrOpen}
              className="group pressable flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-6"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                TL;DR
                <span className="ml-2 font-normal normal-case tracking-normal text-fg-subtle">
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
                  "h-3.5 w-3.5 shrink-0 text-fg-muted transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quart)] group-hover:text-fg",
                  tldrOpen && "rotate-180",
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
