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
    <article className="forms-card interactive">
      <div className="forms-card-header">
        <div className="forms-card-copy">
          <p className="forms-card-id">
            Form #{String(form.id)}
          </p>
          <h2 className="forms-card-title">{form.title}</h2>
        </div>
        <span className="forms-card-badge">Active</span>
      </div>

      <p className="forms-card-description">{form.description || "No description yet."}</p>

      <div className="forms-card-footer">
        <div className="forms-card-meta">
          <p>{summary}</p>
          {createdSummary && (
            <p className="forms-card-created">
              Created {createdSummary}
            </p>
          )}
        </div>
        <Link href="/" className="btn-primary interactive forms-card-link">
          Open builder
        </Link>
      </div>
    </article>
  );
}
