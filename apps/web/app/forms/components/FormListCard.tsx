import Link from "next/link";
import type { AppRouter } from "@repo/trpc";
import type { inferRouterOutputs } from "@trpc/server";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

export function FormListCard({ form }: { form: FormListItem }) {
  const updatedAt = form.updatedAt ? new Date(form.updatedAt) : null;
  const summary = updatedAt
    ? `Updated ${updatedAt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    : "Recently created";

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-[var(--accent)]/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Form #{String(form.id)}
          </p>
          <h2 className="truncate text-xl font-semibold text-[var(--foreground)]">
            {form.title}
          </h2>
        </div>
        <span className="rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
          Active
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-[var(--muted)]">
        {form.description || "No description yet."}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
        <p className="text-xs text-[var(--muted)]">{summary}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-[var(--accent-foreground)] transition hover:opacity-90"
        >
          Open
        </Link>
      </div>
    </article>
  );
}
