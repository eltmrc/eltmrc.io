import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

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

export const mdxComponents: MDXComponents = {
  a: A,
  h2: (props) => (
    <h2
      className="mt-10 scroll-mt-20 text-xl font-semibold tracking-tight text-fg first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 scroll-mt-20 text-lg font-semibold tracking-tight text-fg"
      {...props}
    />
  ),
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
    <blockquote
      className="mt-6 border-l-2 border-accent/40 pl-4 text-[15px] italic leading-relaxed text-fg-muted"
      {...props}
    />
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
      className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface-code px-4 py-4 font-mono text-[13px] leading-relaxed text-fg"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
  strong: (props) => <strong className="font-semibold text-fg" {...props} />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="mt-6 rounded-xl border border-border"
      alt={props.alt ?? ""}
      {...props}
    />
  ),
};
