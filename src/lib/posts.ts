import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  /** Optional: draft posts are excluded from production lists */
  draft?: boolean;
  tags?: string[];
  /** Optional og / hero image path under /public */
  image?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
};

function ensureWritingDir() {
  if (!fs.existsSync(WRITING_DIR)) {
    fs.mkdirSync(WRITING_DIR, { recursive: true });
  }
}

function parsePostFile(filename: string): Post | null {
  const slug = filename.replace(/\.mdx?$/, "");
  const fullPath = path.join(WRITING_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  if (!data.title || !data.date) {
    console.warn(`[posts] Skipping ${filename}: missing title or date`);
    return null;
  }

  const stats = readingTime(content);

  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ""),
    date: String(data.date),
    draft: Boolean(data.draft),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image: data.image ? String(data.image) : undefined,
    readingTime: stats.text,
    content,
  };
}

export function getPostSlugs(): string[] {
  ensureWritingDir();
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getAllPosts({ includeDrafts = false } = {}): PostMeta[] {
  ensureWritingDir();
  const files = fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files
    .map(parsePostFile)
    .filter((p): p is Post => p !== null)
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts.map(({ content: _c, ...meta }) => meta);
}

export function getPostBySlug(slug: string): Post | null {
  ensureWritingDir();
  const mdxPath = path.join(WRITING_DIR, `${slug}.mdx`);
  const mdPath = path.join(WRITING_DIR, `${slug}.md`);
  const file = fs.existsSync(mdxPath)
    ? `${slug}.mdx`
    : fs.existsSync(mdPath)
      ? `${slug}.md`
      : null;
  if (!file) return null;
  return parsePostFile(file);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
