import type { ReactElement } from "react";
import type { CategoryIconId } from "@/lib/categories";
import { GlyphShell } from "@/components/category-glyphs/shell";
import { AiArt } from "@/components/category-glyphs/ai";
import { BuildingArt } from "@/components/category-glyphs/building";
import { DesignArt } from "@/components/category-glyphs/design";
import { EngineeringArt } from "@/components/category-glyphs/engineering";
import { ProductArt } from "@/components/category-glyphs/product";
import { ToolsArt } from "@/components/category-glyphs/tools";
import { LabArt } from "@/components/category-glyphs/lab";
import { SystemsArt } from "@/components/category-glyphs/systems";
import { FoundingArt } from "@/components/category-glyphs/founding";
import { InfrastructureArt } from "@/components/category-glyphs/infrastructure";
import { ShippingArt } from "@/components/category-glyphs/shipping";
import { LearningArt } from "@/components/category-glyphs/learning";
import { OpenSourceArt } from "@/components/category-glyphs/open-source";
import { SecurityArt } from "@/components/category-glyphs/security";
import { PerformanceArt } from "@/components/category-glyphs/performance";
import { WorkArt } from "@/components/category-glyphs/work";
import { NotesArt } from "@/components/category-glyphs/notes";
import { WritingArt } from "@/components/category-glyphs/writing";
import { UxArt } from "@/components/category-glyphs/ux";
import { MetaArt } from "@/components/category-glyphs/meta";

type ArtProps = { uid: string; reduce: boolean | null };

const artMap: Record<CategoryIconId, (p: ArtProps) => ReactElement> = {
  ai: (p) => <AiArt {...p} />,
  building: (p) => <BuildingArt {...p} />,
  design: (p) => <DesignArt {...p} />,
  engineering: (p) => <EngineeringArt {...p} />,
  product: (p) => <ProductArt {...p} />,
  tools: (p) => <ToolsArt {...p} />,
  lab: (p) => <LabArt {...p} />,
  systems: (p) => <SystemsArt {...p} />,
  founding: (p) => <FoundingArt {...p} />,
  infrastructure: (p) => <InfrastructureArt {...p} />,
  shipping: (p) => <ShippingArt {...p} />,
  learning: (p) => <LearningArt {...p} />,
  "open-source": (p) => <OpenSourceArt {...p} />,
  security: (p) => <SecurityArt {...p} />,
  performance: (p) => <PerformanceArt {...p} />,
  work: (p) => <WorkArt {...p} />,
  notes: (p) => <NotesArt {...p} />,
  writing: (p) => <WritingArt {...p} />,
  ux: (p) => <UxArt {...p} />,
  meta: (p) => <MetaArt {...p} />,
};

/**
 * Always-on Cial squishee category mark (motion/react). No badge chrome —
 * just the SVG. Loops forever unless prefers-reduced-motion.
 */
export function CategoryIcon({
  id,
  className,
  title,
}: {
  id: CategoryIconId;
  className?: string;
  title?: string;
}) {
  const Art = artMap[id];
  return (
    <GlyphShell className={className} title={title}>
      {(uid, reduce) => <Art uid={uid} reduce={reduce} />}
    </GlyphShell>
  );
}
