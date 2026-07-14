import { FadeIn } from "@/components/fade-in";
import { PostCard } from "@/components/post-card";
import { Seo, websiteJsonLd } from "@/components/seo";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl, site } from "@/lib/site";

export function WritingIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="pb-10 pt-6 sm:pt-10">
      <Seo
        title="Notes & Articles"
        description="Notes and articles on software, AI, building Cial, and shipping products by Eliot Maurice."
        path="/writing/"
        jsonLd={[
          websiteJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Notes & Articles",
            url: absoluteUrl("/writing/"),
            description:
              "Notes and articles on software, AI, building Cial, and shipping products.",
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
          },
        ]}
      />

      <FadeIn>
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
          Writing
        </p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-fg sm:text-[2.25rem]">
          Notes & Articles
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-fg-muted">
          Product decisions, tools I try, and field notes from building.
        </p>
      </FadeIn>

      <div className="mt-10">
        {posts.length > 0 ? (
          <ul className="divide-y divide-border">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </ul>
        ) : (
          <p
            className="animate-fade-up text-[15px] text-fg-muted"
            style={{ animationDelay: "0.05s" }}
          >
            No posts yet.
          </p>
        )}
      </div>
    </div>
  );
}
