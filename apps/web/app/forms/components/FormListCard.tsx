import Link from "next/link";
import type { AppRouter } from "@repo/trpc";
import type { inferRouterOutputs } from "@trpc/server";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

export function FormListCard({ form }: { form: FormListItem }) {
  const updatedAt = form.updatedAt ? new Date(form.updatedAt) : null;
  const summary = updatedAt
    ? updatedAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Recently created";

  return (
    <Link href={`/forms/${String(form.id)}`} className="forms-card forms-card-open">
      <div className="forms-card-topline"><span>Form #{String(form.id)}</span><span className="forms-card-status">Active</span></div>
      <h3 className="forms-card-title">{form.title}</h3>
      <p className="forms-card-description">{form.description || "No description yet."}</p>
      <footer className="forms-card-footer"><span>Updated {summary}</span><span className="forms-card-link">Edit fields <span aria-hidden="true">→</span></span></footer>
    </Link>
  );
}
