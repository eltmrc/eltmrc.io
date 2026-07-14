import { getCategory, isCategorySlug } from "@/lib/categories";
import { parseFrontmatter } from "@/lib/frontmatter";
import { readingTime } from "@/lib/reading-time";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  /** Optional: draft posts are excluded from production lists */
  draft?: boolean;
  /** Primary category slug (see src/lib/categories.ts) */
  category?: string;
  tags?: string[];
  /** Optional og / hero image path under /public */
  image?: string;
  /** Optional TL;DR bullets shown at the top of the post */
  tldr?: string[];
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
};

const rawModules = import.meta.glob("../../content/writing/*.{md,mdx}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function slugFromPath(filePath: string): string {
  const file = filePath.split("/").pop() ?? filePath;
  return file.replace(/\.mdx?$/, "");
}

function parsePost(filePath: string, raw: string): Post | null {
  const slug = slugFromPath(filePath);
  const { data, content } = parseFrontmatter(raw);

  if (!data.title || !data.date) {
    console.warn(`[posts] Skipping ${slug}: missing title or date`);
    return null;
  }

  const stats = readingTime(content);
  const categoryRaw = data.category ? String(data.category) : undefined;
  const category =
    categoryRaw && isCategorySlug(categoryRaw) ? categoryRaw : undefined;

  if (categoryRaw && !category) {
    console.warn(
      `[posts] Unknown category "${categoryRaw}" in ${slug} — ignored`,
    );
  }

  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ""),
    date: String(data.date),
    draft: Boolean(data.draft),
    category,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image: data.image ? String(data.image) : undefined,
    tldr: Array.isArray(data.tldr) ? data.tldr.map(String) : undefined,
    readingTime: stats.text,
    content,
  };
}

const allPosts: Post[] = Object.entries(rawModules)
  .map(([filePath, raw]) => parsePost(filePath, raw))
  .filter((p): p is Post => p !== null)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getAllPosts({ includeDrafts = false } = {}): PostMeta[] {
  return allPosts
    .filter((p) => includeDrafts || !p.draft)
    .map((post) => {
      const { content: _content, ...meta } = post;
      void _content;
      return meta;
    });
}

export function getPostBySlug(slug: string): Post | null {
  const post = allPosts.find((p) => p.slug === slug) ?? null;
  if (!post) return null;
  if (post.draft && import.meta.env.PROD) return null;
  return post;
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
  if (!isCategorySlug(categorySlug)) return [];
  return getAllPosts().filter((p) => p.category === categorySlug);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const post of getAllPosts()) {
    if (!post.category) continue;
    counts[post.category] = (counts[post.category] ?? 0) + 1;
  }
  return counts;
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function getPostCategory(post: PostMeta) {
  return getCategory(post.category);
}
