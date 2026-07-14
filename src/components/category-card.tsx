import { Link } from "react-router-dom";
import { CategoryIcon } from "@/components/category-icons";
import type { Category } from "@/lib/categories";
import { cn } from "@/lib/cn";

export function CategoryCard({
  category,
  count,
  index = 0,
  className,
}: {
  category: Category;
  count?: number;
  index?: number;
  className?: string;
}) {
  return (
    <Link
      to={`/categories/${category.slug}/`}
      className={cn("category-card animate-fade-up group", className)}
      style={{ animationDelay: `${0.05 + Math.min(index, 7) * 0.05}s` }}
    >
      <div className="flex items-center gap-3">
        <CategoryIcon id={category.icon} className="cat-icon--lg shrink-0" title={category.name} />
        <div className="min-w-0">
          <h3 className="text-[15px] font-medium tracking-tight text-fg">
            {category.name}
          </h3>
          {typeof count === "number" ? (
            <p className="text-[12px] text-fg-subtle">
              {count} {count === 1 ? "post" : "posts"}
            </p>
          ) : null}
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-fg-muted">
        {category.description}
      </p>
    </Link>
  );
}
