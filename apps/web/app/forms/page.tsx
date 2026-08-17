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
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="card mb-8 rounded-3xl p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
                Workspace index
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                Your forms
              </h1>
              <p className="mt-3 text-sm leading-6 text-text-muted md:text-base">
                Scan the current library, open the right form, and keep active
                work close at hand.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="btn-secondary interactive px-4 py-2.5 text-sm"
              >
                Builder
              </Link>
              <Link
                href="/"
                className="btn-primary interactive px-4 py-2.5 text-sm"
              >
                New form
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-canvas px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                Forms
              </p>
              <p className="mt-2 font-mono text-xl font-semibold">{summary}</p>
            </div>
            <div className="rounded-2xl border border-border bg-canvas px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                Latest update
              </p>
              <p className="mt-2 font-mono text-xl font-semibold">
                {latestSummary}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-canvas px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-text-muted">
                Visible
              </p>
              <p className="mt-2 font-mono text-xl font-semibold">
                {visibleSummary}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="card flex max-w-xl flex-1 items-center gap-3 rounded-2xl px-4 py-3">
            <span className="text-sm text-text-muted">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, description, or form ID"
              className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-text-muted"
            />
          </label>
          <p className="text-sm text-text-muted">
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
                className="card animate-pulse rounded-2xl p-5"
              >
                <div className="h-3 w-20 rounded-full bg-border" />
                <div className="mt-4 h-7 w-3/4 rounded-lg bg-border" />
                <div className="mt-4 h-4 w-full rounded-md bg-border" />
                <div className="mt-2 h-4 w-2/3 rounded-md bg-border" />
                <div className="mt-6 h-10 rounded-xl bg-border" />
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
            <div className="card rounded-3xl border-dashed p-10 text-center text-sm text-text-muted">
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
