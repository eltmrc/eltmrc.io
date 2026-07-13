import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start py-20">
      <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-fg">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-[15px] text-fg-muted">
        That path doesn&apos;t exist. Head home or browse writing.
      </p>
      <div className="mt-8 flex gap-4 text-[14px]">
        <Link href="/" className="link">
          Home
        </Link>
        <Link href="/writing/" className="link">
          Writing
        </Link>
      </div>
    </div>
  );
}
