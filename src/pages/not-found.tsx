import { Link } from "react-router-dom";
import { FadeIn } from "@/components/fade-in";
import { Seo } from "@/components/seo";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start py-20">
      <Seo title="Not found" description="Page not found." path="/404" />
      <FadeIn>
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-fg">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-[15px] text-fg-muted">
          That path doesn&apos;t exist. Head home or browse writing.
        </p>
      </FadeIn>
      <FadeIn delay={0.08} className="mt-8 flex gap-4 text-[14px]">
        <Link to="/" className="link">
          <span className="arrow-icon arrow-icon--back mr-1">←</span>
          Home
        </Link>
        <Link to="/writing/" className="link">
          Writing
        </Link>
      </FadeIn>
    </div>
  );
}
