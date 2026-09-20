"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, Search, LayoutGrid, List, LogOut, ArrowUpRight } from "lucide-react";
import { trpc } from "@/trpc/trpc";
import { FormListCard } from "./components/FormListCard";
import styles from "./workspace.module.css";

export default function FormsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const user = trpc.auth.getLoggedInUserInfo.useQuery(undefined, { retry: false });
  const formsQuery = trpc.form.listForms.useQuery(undefined, { retry: false, enabled: user.isSuccess });
  const signOut = trpc.auth.signOut.useMutation({
    onSuccess: () => { queryClient.clear(); router.replace("/auth"); },
  });
  const forms = formsQuery.data ?? [];
  const query = search.trim().toLowerCase();
  const filtered = forms.filter(form => `${form.title} ${form.description ?? ""}`.toLowerCase().includes(query));
  const name = user.data?.fullName ?? "Your workspace";
  const initials = name.split(" ").slice(0, 2).map(part => part[0]).join("");

  return (
    <main className={styles.workspace}>
      <aside className={styles.sidebar} aria-label="Workspace navigation">
        <Link href="/forms" className={styles.brand}><span className={styles.mark} aria-hidden="true">F</span>Formroom</Link>
        <p className={styles.workspaceName}>{user.data ? `${name.split(" ")[0]}’s workspace` : "Your workspace"}</p>
        <nav className={styles.navigation}>
          <Link href="/forms" className={styles.selected} aria-current="page"><FileText size={19} />All forms</Link>
          <Link href="/forms/new" className={styles.create}><Plus size={19} />Create form</Link>
        </nav>
        <div className={styles.account}>
          <div className={styles.profile}><span className={styles.avatar}>{initials}</span><div><strong>{name}</strong><small>{user.data?.email ?? "Loading account…"}</small></div></div>
          <button className={styles.signOut} onClick={() => signOut.mutate()} disabled={signOut.isPending}><LogOut size={18} />{signOut.isPending ? "Signing out…" : "Sign out"}</button>
          {signOut.error && <p role="alert">Could not sign out. Please try again.</p>}
        </div>
      </aside>
      <section className={styles.content} aria-labelledby="workspace-title">
        <div className={styles.breadcrumb}>Workspace <span>/</span> All forms</div>
        <header className={styles.heading}>
          <div><h1 id="workspace-title">Your forms</h1><p>A place for every question.</p></div>
          <Link href="/forms/new" className={styles.create}><Plus size={19} />Create form</Link>
        </header>
        <div className={styles.toolbar}>
          <label className={styles.search}><Search size={20} aria-hidden="true" /><span className="sr-only">Search forms</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search forms" /></label>
          <span className={styles.count}>{user.isSuccess && formsQuery.isSuccess ? `${filtered.length} ${filtered.length === 1 ? "form" : "forms"}` : ""}</span>
          <div className={styles.viewSwitch} aria-label="Form layout">
            <button aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><LayoutGrid size={19} /></button>
            <button aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List size={20} /></button>
          </div>
        </div>
        {user.isError ? <div className={styles.feedback}><h2>Open your workspace</h2><p>Sign in to view and manage your forms.</p><Link className={styles.create} href="/auth">Sign in <ArrowUpRight size={18} /></Link></div> : formsQuery.isError ? <div className={styles.feedback} role="alert"><h2>Could not load your forms</h2><p>{formsQuery.error.message}</p><button className={styles.create} onClick={() => formsQuery.refetch()}>Try again</button></div> : user.isPending || formsQuery.isPending ? <div className={styles.grid} aria-label="Loading forms" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div key={i} className={styles.skeleton} />)}</div> : filtered.length ? <div className={`${styles.grid} ${view === "list" ? styles.list : ""}`}>{filtered.map(form => <FormListCard key={String(form.id)} form={form} />)}</div> : <div className={styles.feedback}><FileText size={36} strokeWidth={1} /><h2>{query ? "No matching forms" : "Your next conversation starts here"}</h2><p>{query ? "Try a different title or clear your search." : "Create your first form. Add your questions, then share it with the people who matter."}</p>{query ? <button className={styles.create} onClick={() => setSearch("")}>Clear search</button> : <Link className={styles.create} href="/forms/new"><Plus size={18} />Create your first form</Link>}</div>}
      </section>
    </main>
  );
}
