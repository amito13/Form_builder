"use client";

import { useMemo, useState } from "react";
import type { AppRouter } from "@repo/trpc";
import { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import { trpc } from "@/trpc/trpc";
import { FormListCard } from "./components/FormListCard";
import { FormListEmptyState } from "./components/FormListEmptyState";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Not updated yet";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function FormsPage() {
  const [search, setSearch] = useState("");
  const formsQuery = trpc.form.listForms.useQuery(undefined, { retry: false });
  const userQuery = trpc.auth.getLoggedInUserInfo.useQuery(undefined, { retry: false });
  const forms = useMemo(() => formsQuery.data ?? [], [formsQuery.data]);
  const mostRecentForm = useMemo(() => forms.reduce<FormListItem | null>((latest, form) => {
    const latestTime = latest?.updatedAt ? new Date(latest.updatedAt).getTime() : -Infinity;
    const formTime = form.updatedAt ? new Date(form.updatedAt).getTime() : -Infinity;
    return formTime > latestTime ? form : latest;
  }, null), [forms]);
  const filteredForms = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return forms;
    return forms.filter((form) => {
      const description = form.description ?? "";
      return String(form.id).toLowerCase().includes(query) || form.title.toLowerCase().includes(query) || description.toLowerCase().includes(query);
    });
  }, [forms, search]);
  const userName = userQuery.data?.fullName || "Your workspace";
  const initial = userName.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="forms-page">
      <aside className="forms-sidebar" aria-label="Workspace navigation">
        <Link href="/forms" className="forms-brand" aria-label="Formroom forms">
          <span className="forms-brand-mark" aria-hidden="true">F</span><span>Formroom</span>
        </Link>
        <nav className="forms-sidebar-nav" aria-label="Forms actions">
          <Link href="/" className="forms-sidebar-action forms-sidebar-action-primary"><span aria-hidden="true">+</span>Create new form</Link>
          <a href="#forms-grid" className="forms-sidebar-action"><span aria-hidden="true">↗</span>Responses</a>
        </nav>
        <div className="forms-user">
          <div className="forms-user-avatar" aria-hidden="true">{initial}</div>
          <div className="forms-user-copy"><strong>{userName}</strong><span>{userQuery.data?.email || "Loading account…"}</span></div>
        </div>
      </aside>

      <section className="forms-workspace" aria-labelledby="forms-title">
        <header className="forms-recent-panel">
          <div>
            <p className="forms-section-label">Previous form</p>
            <h1 id="forms-title">{mostRecentForm ? mostRecentForm.title : "No form selected"}</h1>
            <p>{mostRecentForm ? mostRecentForm.description || "Continue shaping your latest form." : "Create a form to begin collecting thoughtful responses."}</p>
          </div>
          {mostRecentForm && <div className="forms-recent-meta"><span>Last updated</span><strong>{formatDate(mostRecentForm.updatedAt)}</strong></div>}
        </header>

        <section className="forms-content" aria-labelledby="forms-list-title">
          <div className="forms-content-heading">
            <div><p className="forms-section-label">Workspace</p><h2 id="forms-list-title">Forms</h2></div>
            <label className="forms-search"><span className="sr-only">Search forms</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search forms" className="form-input forms-search-input" /></label>
          </div>
          {formsQuery.isPending && <div className="forms-grid" aria-label="Loading forms">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="forms-skeleton-card"><div className="skeleton h-3 w-20" /><div className="skeleton mt-4 h-7 w-3/4" /><div className="skeleton mt-4 h-4 w-full" /></div>)}</div>}
          {formsQuery.isError && <div className="forms-feedback forms-feedback-error" role="alert">{formsQuery.error.message || "Unable to load forms."}</div>}
          {!formsQuery.isPending && !formsQuery.isError && forms.length === 0 && <FormListEmptyState />}
          {!formsQuery.isPending && !formsQuery.isError && forms.length > 0 && filteredForms.length === 0 && <div className="forms-feedback">No forms match “{search.trim()}”.</div>}
          {!formsQuery.isPending && !formsQuery.isError && filteredForms.length > 0 && <div id="forms-grid" className="forms-grid">{filteredForms.map((form) => <FormListCard key={String(form.id)} form={form} />)}</div>}
        </section>
      </section>
    </main>
  );
}
