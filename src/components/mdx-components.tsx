import type { Components } from "react-markdown";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { ImageLightbox } from "@/components/image-lightbox";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { slugifyHeading } from "@/lib/headings";

function textOf(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/** `## 2014–2016 · Title` renders as a timeline marker instead of a plain heading. */
const TIMELINE_HEADING = /^(\d{4}(?:\s*[–-]\s*(?:\d{4}|now))?)\s*·\s*(.+)$/;

function headingId(props: { id?: string; children?: ReactNode }): string {
  if (props.id) return props.id;
  return slugifyHeading(textOf(props.children).trim());
}

function H2(props: ComponentPropsWithoutRef<"h2">) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const title = textOf(props.children).trim();
  const id = headingId(props);
  const match = TIMELINE_HEADING.exec(title);
  if (match) {
    return (
      <h2
        ref={ref}
        id={id}
        className="mt-12 scroll-mt-20 first:mt-0"
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)]",
              inView && "ring-pulse-once",
            )}
          />
          <span className="font-mono text-[12px] font-medium tracking-[0.18em] text-accent">
            {match[1]}
          </span>
          <span className={cn("h-px flex-1 bg-border", inView && "draw-line")} />
        </span>
        <span className="mt-2.5 block text-xl font-semibold tracking-tight text-fg">
          {match[2]}
        </span>
      </h2>
    );
  }
  return (
    <h2
      {...props}
      id={id}
      className="mt-10 scroll-mt-20 text-xl font-semibold tracking-tight text-fg first:mt-0"
    />
  );
}

function A(props: ComponentPropsWithoutRef<"a">) {
  const external = props.href?.startsWith("http");
  return (
    <a
      {...props}
      className="link"
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    />
  );
}

function Img(props: ComponentPropsWithoutRef<"img">) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Cached images fire no load event — settle immediately.
    if (ref.current?.complete) setLoaded(true);
  }, []);

  const raw = props.src;
  const src =
    typeof raw === "string" && raw.startsWith("/") && !raw.startsWith("//")
      ? asset(raw)
      : raw;
  const rawAlt = props.alt ?? "";
  // Convention: "Caption text |side" floats the figure beside following prose.
  const side = /\|\s*side\s*$/i.test(rawAlt);
  const caption = rawAlt.replace(/\|\s*side\s*$/i, "").trim();
  const srcStr = typeof src === "string" ? src : "";

  return (
    <>
      <figure
        className={cn(
          "prose-figure",
          side ? "prose-figure--side" : "mt-8",
        )}
      >
        <button
          type="button"
          className="prose-figure__zoom group block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
          onClick={() => setOpen(true)}
          aria-label={caption ? `View larger: ${caption}` : "View larger image"}
        >
          <img
            {...props}
            ref={ref}
            src={src}
            className={cn(
              "img-fade w-full rounded-xl border border-border transition-[border-color,box-shadow,transform] duration-[var(--dur-base)] ease-[var(--ease-out-quart)]",
              "group-hover:border-accent/30 group-hover:shadow-[var(--shadow-soft-hover)]",
              side && "object-cover object-top",
              loaded && "is-loaded",
            )}
            alt={caption}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            draggable={false}
          />
        </button>
        {caption ? (
          <figcaption
            className={cn(
              "mt-2 text-[12.5px] leading-relaxed text-fg-subtle",
              side ? "text-left" : "text-center",
            )}
          >
            {caption}
          </figcaption>
        ) : null}
      </figure>
      {srcStr ? (
        <ImageLightbox
          open={open}
          src={srcStr}
          alt={caption}
          caption={caption || undefined}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export const markdownComponents: Components = {
  a: A,
  h2: H2,
  h3: (props) => {
    const id = headingId(props);
    return (
      <h3
        {...props}
        id={id}
        className="mt-8 scroll-mt-20 text-lg font-semibold tracking-tight text-fg"
      />
    );
  },
  p: (props) => (
    <p className="mt-5 text-[16px] leading-[1.75] text-fg-body first:mt-0" {...props} />
  ),
  ul: (props) => (
    <ul
      className="mt-5 list-disc space-y-2 pl-5 text-[16px] leading-[1.75] text-fg-body marker:text-fg-subtle"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-5 list-decimal space-y-2 pl-5 text-[16px] leading-[1.75] text-fg-body marker:text-fg-subtle"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote className="prose-callout mt-8" {...props} />
  ),
  code: (props) => {
    const isBlock =
      typeof props.className === "string" &&
      props.className.includes("language-");
    if (isBlock) {
      return <code {...props} />;
    }
    return (
      <code
        className="rounded-md bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.875em] text-fg"
        {...props}
      />
    );
  },
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface-code px-4 py-4 font-mono text-[13px] leading-relaxed text-fg transition-[border-color] duration-[var(--dur-fast)] ease-[var(--ease-std)] hover:border-[color-mix(in_srgb,var(--accent)_20%,var(--border))] focus-within:border-[color-mix(in_srgb,var(--accent)_20%,var(--border))]"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  strong: (props) => <strong className="prose-mark" {...props} />,
  img: Img,
};
