import Link from "next/link";

// landing page - simple intro with links to dashboard
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="surface w-full max-w-3xl p-10 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">LogScope Platform</p>
        <h1 className="gradient-text text-4xl font-semibold tracking-tight md:text-6xl">
          Modern observability,
          <br />
          built for speed.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
          Real-time log intelligence with beautiful controls, high-signal dashboards,
          and production-first interaction design.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Open Dashboard
          </Link>
          <Link
            href="/logs"
            className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium text-foreground"
          >
            Explore Logs
          </Link>
        </div>
      </div>
    </div>
  );
}
