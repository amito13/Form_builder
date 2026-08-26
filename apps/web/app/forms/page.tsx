"use client";

import { useMemo, useState, useEffect } from "react";
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
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const formsQuery = trpc.form.listForms.useQuery(undefined, { retry: false });
  const userQuery = trpc.auth.getLoggedInUserInfo.useQuery(undefined, { retry: false });
  
  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  // Toggle theme and persist to localStorage
  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };
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
          <Link href="/forms/new" className="forms-sidebar-action forms-sidebar-action-primary"><span aria-hidden="true">+</span>Create new form</Link>
          <a href="#forms-grid" className="forms-sidebar-action"><span aria-hidden="true">↗</span>Responses</a>
        </nav>
        
        <button
          onClick={toggleTheme}
          className="forms-theme-toggle"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <span className="forms-theme-toggle-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          <span className="forms-theme-toggle-label">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        
        <div className="forms-user">
          <div className="forms-user-avatar" aria-hidden="true">{initial}</div>
          <div className="forms-user-copy"><strong>{userName}</strong><span>{userQuery.data?.email || "Loading account…"}</span></div>
        </div>
      </aside>

      <section className="forms-workspace" aria-labelledby="forms-title">
        <header className="forms-hero-section">
          <div className="forms-hero-content">
            <div className="forms-hero-badge">✨ Welcome to Formroom</div>
            <h1 className="forms-hero-title">Collect feedback effortlessly</h1>
            <p className="forms-hero-subtitle">Create beautiful forms, gather responses, and understand your audience better. All in one place.</p>
            
            <div className="forms-features-grid">
              <div className="forms-feature-item">
                <div className="forms-feature-icon">📋</div>
                <div className="forms-feature-text">
                  <strong>Easy Creation</strong>
                  <span>Build forms in minutes with our intuitive builder</span>
                </div>
              </div>
              <div className="forms-feature-item">
                <div className="forms-feature-icon">📊</div>
                <div className="forms-feature-text">
                  <strong>Smart Analytics</strong>
                  <span>Visualize and analyze responses in real-time</span>
                </div>
              </div>
              <div className="forms-feature-item">
                <div className="forms-feature-icon">🔗</div>
                <div className="forms-feature-text">
                  <strong>Easy Sharing</strong>
                  <span>Share your forms via link, email, or social media</span>
                </div>
              </div>
              <div className="forms-feature-item">
                <div className="forms-feature-icon">🔒</div>
                <div className="forms-feature-text">
                  <strong>Secure & Private</strong>
                  <span>Your data is encrypted and protected at all times</span>
                </div>
              </div>
            </div>
          </div>
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
