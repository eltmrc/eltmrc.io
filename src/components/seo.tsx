import { Helmet } from "react-helmet-async";
import { absoluteUrl, site } from "@/lib/site";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Path under /public or absolute URL. Falls back to site default. */
  image?: string;
  /** Magic cover "cial-mark" has no photo — use default OG. */
  imageAlt?: string;
  keywords?: string[];
  noindex?: boolean;
  /** When false, use title as-is (home). Default true → "Title · Name" */
  titleTemplate?: boolean;
  jsonLd?: JsonLd;
};

function resolveImage(image?: string): { url: string; alt: string } {
  if (!image || image === "cial-mark") {
    return {
      url: absoluteUrl(site.defaultOgImage),
      alt: `${site.name} portrait`,
    };
  }
  return {
    url: absoluteUrl(image),
    alt: imageAltFallback(image),
  };
}

function imageAltFallback(image: string) {
  const leaf = image.split("/").pop() ?? "image";
  return leaf.replace(/\.[a-z0-9]+$/i, "").replace(/[-_]/g, " ");
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    image: absoluteUrl(site.defaultOgImage),
    email: site.email,
    jobTitle: "Co-founder",
    worksFor: [
      {
        "@type": "Organization",
        name: "Cial",
        url: site.links.cial,
      },
      {
        "@type": "Organization",
        name: "ClinicPilot",
        url: "https://clinicpilot.io",
      },
    ],
    sameAs: [
      site.links.github,
      site.links.x,
      site.links.linkedin,
      site.links.opencial,
      site.links.cial,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.lang,
    publisher: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  image?: string;
}) {
  const img = resolveImage(opts.image);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.publishedTime,
    dateModified: opts.modifiedTime ?? opts.publishedTime,
    mainEntityOfPage: absoluteUrl(opts.path),
    url: absoluteUrl(opts.path),
    image: [img.url],
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.name,
      url: site.url,
      image: absoluteUrl(site.defaultOgImage),
    },
    inLanguage: site.lang,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function Seo({
  title,
  description = site.description,
  path = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  image,
  imageAlt,
  keywords = [...site.keywords],
  noindex = false,
  titleTemplate = true,
  jsonLd,
}: SeoProps) {
  const fullTitle =
    title && titleTemplate
      ? `${title} · ${site.name}`
      : (title ?? site.title);
  const url = absoluteUrl(path);
  const { url: imageUrl, alt: defaultAlt } = resolveImage(image);
  const alt = imageAlt ?? defaultAlt;
  const robots = noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  const graph: Record<string, unknown>[] = [];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) graph.push(...jsonLd);
    else graph.push(jsonLd);
  }

  return (
    <Helmet>
      <html lang={site.lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 ? (
        <meta name="keywords" content={keywords.join(", ")} />
      ) : null}
      <meta name="author" content={site.name} />
      <meta name="creator" content={site.name} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={url} />
      <link rel="alternate" type="application/rss+xml" title={`${site.name} RSS`} href={absoluteUrl("/rss.xml")} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={alt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={site.socials.x} />
      <meta name="twitter:creator" content={site.socials.x} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={alt} />

      {type === "article" && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === "article" && (modifiedTime ?? publishedTime) ? (
        <meta
          property="article:modified_time"
          content={modifiedTime ?? publishedTime}
        />
      ) : null}
      {type === "article" ? (
        <meta property="article:author" content={site.name} />
      ) : null}

      {graph.map((node, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(node)}
        </script>
      ))}
    </Helmet>
  );
}
