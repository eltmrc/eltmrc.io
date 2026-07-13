/**
 * Canonical categories for eltmrc.io writing.
 * Posts reference a category by `slug` in frontmatter:
 *   category: ai
 */

export type Category = {
  slug: string;
  name: string;
  description: string;
  /** Icon key maps to CategoryIcon in components/category-icons.tsx */
  icon: CategoryIconId;
};

export type CategoryIconId =
  | "ai"
  | "building"
  | "design"
  | "engineering"
  | "product"
  | "tools"
  | "lab"
  | "systems"
  | "founding"
  | "infrastructure"
  | "shipping"
  | "learning"
  | "open-source"
  | "security"
  | "performance"
  | "work"
  | "notes"
  | "writing"
  | "ux"
  | "meta";

export const categories: Category[] = [
  {
    slug: "ai",
    name: "AI",
    description: "Models, agents, and working with machine intelligence.",
    icon: "ai",
  },
  {
    slug: "building",
    name: "Building",
    description: "Making software in public — craft over noise.",
    icon: "building",
  },
  {
    slug: "design",
    name: "Design",
    description: "Visual systems, taste, and quiet polish.",
    icon: "design",
  },
  {
    slug: "engineering",
    name: "Engineering",
    description: "Code, architecture, and hard technical tradeoffs.",
    icon: "engineering",
  },
  {
    slug: "product",
    name: "Product",
    description: "Decisions, scope, and what to ship next.",
    icon: "product",
  },
  {
    slug: "tools",
    name: "Tools",
    description: "Stacks, apps, and gear I actually use.",
    icon: "tools",
  },
  {
    slug: "lab",
    name: "Lab",
    description: "Experiments and tech I tried for a week.",
    icon: "lab",
  },
  {
    slug: "systems",
    name: "Systems",
    description: "Mental models, platforms, and how pieces fit.",
    icon: "systems",
  },
  {
    slug: "founding",
    name: "Founding",
    description: "Startup path, identity, and long games.",
    icon: "founding",
  },
  {
    slug: "infrastructure",
    name: "Infrastructure",
    description: "Deploy, hosts, data, and the boring backbone.",
    icon: "infrastructure",
  },
  {
    slug: "shipping",
    name: "Shipping",
    description: "Releases, loops, and getting things out the door.",
    icon: "shipping",
  },
  {
    slug: "learning",
    name: "Learning",
    description: "Books, courses, and skills in progress.",
    icon: "learning",
  },
  {
    slug: "open-source",
    name: "Open source",
    description: "Public code, communities, and contributions.",
    icon: "open-source",
  },
  {
    slug: "security",
    name: "Security",
    description: "Trust boundaries, auth, and staying careful.",
    icon: "security",
  },
  {
    slug: "performance",
    name: "Performance",
    description: "Speed, budgets, and perceived quality.",
    icon: "performance",
  },
  {
    slug: "work",
    name: "Work",
    description: "Culture, remote life, and how I operate.",
    icon: "work",
  },
  {
    slug: "notes",
    name: "Notes",
    description: "Short field notes and loose ends.",
    icon: "notes",
  },
  {
    slug: "writing",
    name: "Writing",
    description: "On writing itself — process and voice.",
    icon: "writing",
  },
  {
    slug: "ux",
    name: "UX",
    description: "Interfaces, interaction, and how software feels.",
    icon: "ux",
  },
  {
    slug: "meta",
    name: "Meta",
    description: "This site, process, and behind the scenes.",
    icon: "meta",
  },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string | undefined | null): Category | undefined {
  if (!slug) return undefined;
  return bySlug.get(slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function isCategorySlug(slug: string): boolean {
  return bySlug.has(slug);
}
