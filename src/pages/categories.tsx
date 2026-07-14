import { CategoryCard } from "@/components/category-card";
import { FadeIn } from "@/components/fade-in";
import { Seo } from "@/components/seo";
import { getAllCategories } from "@/lib/categories";
import { getCategoryCounts } from "@/lib/posts";

export function CategoriesPage() {
  const cats = getAllCategories();
  const counts = getCategoryCounts();

  return (
    <div className="pb-10 pt-6 sm:pt-10">
      <Seo
        title="Categories"
        description="Browse writing by topic — AI, product, engineering, and more."
        path="/categories/"
      />

      <FadeIn>
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
          Index
        </p>
      </FadeIn>
      <FadeIn delay={0.05}>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-fg sm:text-[2.25rem]">
          Categories
        </h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-fg-muted">
          Twenty topics I write about. Each has a living mark — click through to
          see matching posts.
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {cats.map((cat, i) => (
          <CategoryCard
            key={cat.slug}
            category={cat}
            count={counts[cat.slug] ?? 0}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
