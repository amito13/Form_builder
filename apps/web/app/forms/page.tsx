"use client";

import type { AppRouter } from "@repo/trpc";
import { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { trpc } from "@/trpc/trpc";
import { FormListCard } from "./components/FormListCard";
import { FormListEmptyState } from "./components/FormListEmptyState";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

export default function FormsPage() {
  const formsQuery = trpc.form.listForms.useQuery(undefined, {
    retry: false,
  });

  const forms = formsQuery.data ?? [];
  const summary = forms.length
    ? `${forms.length} forms`
    : "No forms yet";

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                Form library
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
                Your forms
              </h1>
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
        </header>

        <section className="mb-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
          <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
            {summary}
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
            Updated today
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
            Ready to publish
          </div>
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

        {!formsQuery.isPending && !formsQuery.isError && forms.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {forms.map((form: FormListItem) => (
              <FormListCard key={String(form.id)} form={form} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
