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

  const forms = formsQuery.data ?? [];
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
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Workspace index
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
                Your forms
              </h1>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)] md:text-base">
                Scan the current library, open the right form, and keep active
                work close at hand.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Builder
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-foreground)] transition hover:opacity-90"
              >
                New form
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Forms
              </p>
              <p className="mt-2 font-mono text-xl font-semibold">{summary}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Latest update
              </p>
              <p className="mt-2 font-mono text-xl font-semibold">
                {latestSummary}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                Visible
              </p>
              <p className="mt-2 font-mono text-xl font-semibold">
                {visibleSummary}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex flex-1 max-w-xl items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <span className="text-sm text-[var(--muted)]">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, description, or form ID"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </label>
          <p className="text-sm text-[var(--muted)]">
            {search.trim()
              ? "Showing matching forms only."
              : "All forms from your workspace."}
          </p>
        </section>

        {formsQuery.isPending && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="h-3 w-20 rounded-full bg-[var(--border)]" />
                <div className="mt-4 h-7 w-3/4 rounded-lg bg-[var(--border)]" />
                <div className="mt-4 h-4 w-full rounded-md bg-[var(--border)]" />
                <div className="mt-2 h-4 w-2/3 rounded-md bg-[var(--border)]" />
                <div className="mt-6 h-10 rounded-xl bg-[var(--border)]" />
              </div>
            ))}
          </div>
        )}

        {formsQuery.isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
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
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center text-sm text-[var(--muted)]">
              No forms match “{search.trim()}”.
            </div>
          )}

        {!formsQuery.isPending && !formsQuery.isError && filteredForms.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredForms.map((form: FormListItem) => (
              <FormListCard key={String(form.id)} form={form} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
