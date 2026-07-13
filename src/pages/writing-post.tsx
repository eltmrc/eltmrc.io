import { Link, Navigate, useParams } from "react-router-dom";
import { CategoryChip } from "@/components/category-chip";
import { FadeIn } from "@/components/fade-in";
import { Prose } from "@/components/prose";
import { Seo } from "@/components/seo";
import { formatDate, getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

export function WritingPostPage() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);

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
          className="text-[13px] text-fg-muted transition-colors hover:text-fg"
        >
          ← Writing
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

      <FadeIn delay={0.08} className="mt-10">
        <Prose source={post.content} />
      </FadeIn>

      <FadeIn delay={0.12} className="mt-14 border-t border-border pt-8">
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
      </FadeIn>
    </div>
  );
}
