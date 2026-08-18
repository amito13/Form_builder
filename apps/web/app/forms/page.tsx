"use client";

import { useMemo, useState } from "react";
import type { AppRouter } from "@repo/trpc";
import { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { trpc } from "@/trpc/trpc";
import { FormListCard } from "./components/FormListCard";
import { FormListEmptyState } from "./components/FormListEmptyState";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

export default function FormsPage() {
  const [search, setSearch] = useState("");
  const formsQuery = trpc.form.listForms.useQuery(undefined, {
    retry: false,
  });

  const forms = useMemo(() => formsQuery.data ?? [], [formsQuery.data]);
  const filteredForms = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return forms;

    return forms.filter((form) => {
      const description = form.description ?? "";
      return (
        String(form.id).toLowerCase().includes(query) ||
        form.title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      );
    });
  }, [forms, search]);

  const latestUpdatedAt = useMemo(() => {
    return forms.reduce<Date | null>((latest, form) => {
      if (!form.updatedAt) return latest;
      const updatedAt = new Date(form.updatedAt);
      if (!latest || updatedAt.getTime() > latest.getTime()) {
        return updatedAt;
      }
      return latest;
    }, null);
  }, [forms]);

  const summary = forms.length ? `${forms.length} forms` : "No forms yet";
  const visibleSummary = search.trim()
    ? `${filteredForms.length} matching forms`
    : summary;
  const latestSummary = latestUpdatedAt
    ? latestUpdatedAt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No updates yet";

  return (
    <main className="forms-page">
      <section className="forms-hero" aria-label="Forms workspace overview">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">
            F
          </span>
          <span>Formroom</span>
        </div>

        <div className="auth-intro-copy forms-hero-copy">
          <p className="auth-kicker">Workspace index</p>
          <h1>Your forms stay in view.</h1>
          <p>
            Review the latest work, reopen the right builder, and keep every
            active draft inside the same calm space as your sign-in flow.
          </p>
        </div>

        <div className="forms-hero-stats" aria-label="Forms summary">
          <article className="forms-hero-stat">
            <p>Forms</p>
            <strong>{summary}</strong>
          </article>
          <article className="forms-hero-stat">
            <p>Latest update</p>
            <strong>{latestSummary}</strong>
          </article>
          <article className="forms-hero-stat">
            <p>Visible</p>
            <strong>{visibleSummary}</strong>
          </article>
        </div>

        <div className="auth-note forms-hero-note">
          <span className="auth-note-dot" aria-hidden="true" />
          Ready to reopen your next conversation
        </div>
      </section>

      <section className="forms-panel" aria-labelledby="forms-title">
        <div className="forms-shell">
          <header className="forms-shell-header">
            <div className="forms-shell-copy">
              <p className="auth-eyebrow">Your workspace</p>
              <h2 id="forms-title">Browse and reopen forms</h2>
              <p>
                Search by title, description, or form ID and jump back into the
                builder without leaving this shared theme.
              </p>
            </div>

            <div className="forms-shell-actions">
              <Link href="/" className="btn-secondary interactive forms-action">
                Builder
              </Link>
              <Link href="/" className="btn-primary interactive forms-action">
                New form
              </Link>
            </div>
          </header>

          <section className="forms-toolbar" aria-label="Search forms">
            <label className="forms-search">
              <span>Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Title, description, or form ID"
                className="form-input forms-search-input"
              />
            </label>
            <p className="forms-toolbar-note">
              {search.trim()
                ? "Showing matching forms only."
                : "All forms from your workspace."}
            </p>
          </section>

          {formsQuery.isPending && (
            <div className="forms-grid" aria-label="Loading forms">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="forms-skeleton-card">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton mt-4 h-7 w-3/4" />
                  <div className="skeleton mt-4 h-4 w-full" />
                  <div className="skeleton mt-2 h-4 w-2/3" />
                  <div className="skeleton mt-6 h-10" />
                </div>
              ))}
            </div>
          )}

          {formsQuery.isError && (
            <div className="forms-feedback forms-feedback-error" role="alert">
              {formsQuery.error.message || "Unable to load forms."}
            </div>
          )}

          {!formsQuery.isPending && !formsQuery.isError && forms.length === 0 && (
            <FormListEmptyState />
          )}

          {!formsQuery.isPending &&
            !formsQuery.isError &&
            forms.length > 0 &&
            filteredForms.length === 0 && (
              <div className="forms-feedback">No forms match “{search.trim()}”.</div>
            )}

          {!formsQuery.isPending &&
            !formsQuery.isError &&
            filteredForms.length > 0 && (
              <div className="forms-grid">
                {filteredForms.map((form: FormListItem) => (
                  <FormListCard key={String(form.id)} form={form} />
                ))}
              </div>
            )}
        </div>
      </section>
    </main>
  );
}
