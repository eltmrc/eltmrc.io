import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/fade-in";
import { Prose } from "@/components/prose";
import { formatDate, getAllPosts, getPostBySlug } from "@/lib/posts";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.draft) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${site.url}/writing/${post.slug}/`,
    },
  };
}

export default async function WritingPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.draft) notFound();

  return (
    <div className="pb-8 pt-4 sm:pt-8">
      <FadeIn>
        <Link
          href="/writing/"
          className="text-[13px] text-fg-muted transition-colors hover:text-fg"
        >
          ← Writing
        </Link>
        <h1 className="mt-5 text-[1.85rem] font-semibold leading-[1.2] tracking-tight text-fg sm:text-[2.15rem]">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-fg-subtle">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
          {post.tags && post.tags.length > 0 ? (
            <>
              <span aria-hidden>·</span>
              <span>{post.tags.join(", ")}</span>
            </>
          ) : null}
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-10">
        <Prose source={post.content} />
      </FadeIn>
    </div>
  );
}
