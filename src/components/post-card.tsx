import Link from "next/link";
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
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link
        href={`/writing/${post.slug}/`}
        className="flex flex-col gap-1.5 rounded-xl py-4 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
      >
        <div className="min-w-0">
          <h3 className="text-[16px] font-medium tracking-tight text-fg transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          {post.description ? (
            <p className="mt-1 line-clamp-2 text-[14px] leading-relaxed text-fg-muted">
              {post.description}
            </p>
          ) : null}
        </div>
        <time
          dateTime={post.date}
          className="shrink-0 text-[13px] tabular-nums text-fg-subtle"
        >
          {formatDate(post.date)}
        </time>
      </Link>
    </li>
  );
}
