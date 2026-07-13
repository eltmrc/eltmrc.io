import { Link, Navigate, useParams } from "react-router-dom";
import { CategoryIcon } from "@/components/category-icons";
import { FadeIn } from "@/components/fade-in";
import { PostCard } from "@/components/post-card";
import { Seo } from "@/components/seo";
import { getCategory, isCategorySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";

export function CategoryPage() {
  const { slug = "" } = useParams();

  if (!isCategorySlug(slug)) {
    return <Navigate to="/categories/" replace />;
  }

  const cat = getCategory(slug)!;
  const posts = getPostsByCategory(slug);

  return (
    <div className="pb-10 pt-6 sm:pt-10">
      <Seo title={cat.name} description={cat.description} path={`/categories/${cat.slug}/`} />

      <FadeIn>
        <Link
          to="/categories/"
          className="text-[13px] text-fg-muted transition-colors hover:text-fg"
        >
          ← Categories
        </Link>

        <div className="mt-6 flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent ring-1 ring-border">
            <CategoryIcon id={cat.icon} className="cat-icon--xl" title={cat.name} />
          </span>
          <div>
            <h1 className="text-[2rem] font-semibold tracking-tight text-fg sm:text-[2.15rem]">
              {cat.name}
            </h1>
            <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-fg-muted">
              {cat.description}
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.08} className="mt-10">
        {posts.length > 0 ? (
          <ul className="divide-y divide-border">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-surface px-5 py-8 text-[14px] text-fg-muted">
            No posts in this category yet. When I write one, it will show up
            here.
          </p>
        )}
      </FadeIn>
    </div>
  );
}
