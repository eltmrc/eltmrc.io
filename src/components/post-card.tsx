import { Link } from "react-router-dom";
import { CategoryChip } from "@/components/category-chip";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/posts";

export function PostCard({
  post,
  index = 0,
}: {
  post: PostMeta;
  index?: number;
}) {
  return (
    <li
      className="group animate-fade-up"
      style={{ animationDelay: `${0.05 + Math.min(index, 7) * 0.05}s` }}
    >
      <div className="-mx-2 rounded-xl px-2 py-4 transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] hover:bg-surface">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {post.category ? <CategoryChip slug={post.category} /> : null}
            </div>
            <Link to={`/writing/${post.slug}/`} className="block">
              <h3 className="text-[16px] font-medium tracking-tight text-fg transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-accent">
                <span className="hover-underline">{post.title}</span>
              </h3>
              {post.description ? (
                <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-fg-muted">
                  {post.description}
                </p>
              ) : null}
            </Link>
          </div>
          <time
            dateTime={post.date}
            className="shrink-0 text-[13px] tabular-nums text-fg-subtle transition-colors duration-[var(--dur-fast)] ease-[var(--ease-std)] group-hover:text-fg-muted sm:pt-7"
          >
            {formatDate(post.date)}
          </time>
        </div>
      </div>
    </li>
  );
}
