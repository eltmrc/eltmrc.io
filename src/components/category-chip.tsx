import { Link } from "react-router-dom";
import { CategoryIcon } from "@/components/category-icons";
import { getCategory, type Category } from "@/lib/categories";
import { cn } from "@/lib/cn";

export function CategoryChip({
  category,
  slug,
  className,
}: {
  category?: Category;
  slug?: string;
  className?: string;
}) {
  const cat = category ?? getCategory(slug);
  if (!cat) return null;

  return (
    <Link
      to={`/categories/${cat.slug}/`}
      className={cn("category-chip", className)}
    >
      {/* Size only — squishee loop stays on GlyphShell / motion. */}
      <CategoryIcon id={cat.icon} className="!h-4 !w-4" title={cat.name} />
      <span>{cat.name}</span>
    </Link>
  );
}
