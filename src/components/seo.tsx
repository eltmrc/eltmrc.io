import { Helmet } from "react-helmet-async";
import { site } from "@/lib/site";

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** When false, use title as-is (home). Default true → "Title · Name" */
  titleTemplate?: boolean;
};

export function Seo({
  title,
  description = site.description,
  path = "/",
  type = "website",
  publishedTime,
  titleTemplate = true,
}: SeoProps) {
  const fullTitle =
    title && titleTemplate
      ? `${title} · ${site.name}`
      : title ?? site.title;
  const url = `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={`@${site.handle}`} />

      {publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
    </Helmet>
  );
}
