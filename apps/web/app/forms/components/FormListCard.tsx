import Link from "next/link";
import type { AppRouter } from "@repo/trpc";
import type { inferRouterOutputs } from "@trpc/server";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

export function FormListCard({ form }: { form: FormListItem }) {
  const updatedAt = form.updatedAt ? new Date(form.updatedAt) : null;
  const createdAt = form.createdAt ? new Date(form.createdAt) : null;
  const summary = updatedAt
    ? `Updated ${updatedAt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    : "Recently created";
  const createdSummary = createdAt
    ? createdAt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="card interactive group rounded-3xl p-5 hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            Form #{String(form.id)}
          </p>
          <h2 className="truncate text-xl font-semibold text-text-primary">
            {form.title}
          </h2>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
          Active
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-text-muted">
        {form.description || "No description yet."}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="space-y-1">
          <p className="text-xs text-text-muted">{summary}</p>
          {createdSummary && (
            <p className="font-mono text-[11px] tracking-[0.08em] text-text-muted">
              Created {createdSummary}
            </p>
          )}
        </div>
        <Link
          href="/"
          className="btn-primary interactive px-3.5 py-2 text-sm"
        >
          Open builder
        </Link>
      </div>
    </article>
  );
}
