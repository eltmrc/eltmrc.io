import { Route, Routes } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Seo } from "@/components/seo";
import { site } from "@/lib/site";
import { AboutPage } from "@/pages/about";
import { CategoriesPage } from "@/pages/categories";
import { CategoryPage } from "@/pages/category";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import { WritingIndexPage } from "@/pages/writing";
import { WritingPostPage } from "@/pages/writing-post";

export default function App() {
  return (
    /* The CSS reduced-motion kill-switch can't reach motion/react's JS
       animations (nav pill, in-view reveals) — MotionConfig covers those. */
    <MotionConfig reducedMotion="user">
      <div className="relative flex min-h-full flex-col font-sans">
        <Seo
          title={site.title}
          description={site.description}
          path="/"
          titleTemplate={false}
        />
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 sm:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/writing" element={<WritingIndexPage />} />
            <Route path="/writing/" element={<WritingIndexPage />} />
            <Route path="/writing/:slug" element={<WritingPostPage />} />
            <Route path="/writing/:slug/" element={<WritingPostPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/categories/:slug/" element={<CategoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
