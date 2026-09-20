"use client";

import Link from "next/link";
import type { AppRouter } from "@repo/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { FileText, ArrowRight, Link2, Check } from "lucide-react";
import { trpc } from "@/trpc/trpc";
import styles from "../workspace.module.css";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

export function FormListCard({ form }: { form: FormListItem }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const preview = trpc.form.getForm.useQuery({ formId: Number(form.id) }, { staleTime: 60_000, retry: false });
  const date = form.updatedAt ?? form.createdAt;
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/forms/respond/${form.shareToken}`);
      setCopied(true);
      setCopyError(false);
    } catch { setCopyError(true); }
  }

  return (
    <article className={styles.card}>
      <Link href={`/forms/manage/${form.id}`} className={styles.paperLink} aria-label={`Manage ${form.title}`}>
        <div className={styles.paper} aria-hidden="true">
          <strong>{form.title}</strong>
          {preview.data?.fields.length ? preview.data.fields.slice(0, 2).map(field => <div className={styles.previewField} key={String(field.id)}><span>{field.label}{field.isRequired ? " *" : ""}</span>{field.type === "YES_NO" ? <div className={styles.previewChoice}><i />Yes <i />No</div> : <div className={styles.previewInput}>{field.type === "PASSWORD" ? "••••••••" : field.placeholder || "Your answer here…"}</div>}</div>) : <><p>{form.description || "Every good conversation starts with a question."}</p><div className={styles.paperLines}><span /><span /><span /></div></>}
        </div>
      </Link>
      <div className={styles.cardBody}>
        <h2><Link href={`/forms/manage/${form.id}`}>{form.title}</Link></h2>
        <p>{form.description || "Add a description to introduce your form."}</p>
        <time dateTime={date ? new Date(date).toISOString() : undefined}>{date ? `Updated ${new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : "Recently created"}</time>
        <footer><Link href={`/forms/manage/${form.id}`}><FileText size={17} />Manage <ArrowRight size={16} /></Link><button onClick={copyLink}>{copied ? <Check size={17} /> : <Link2 size={17} />}{copied ? "Copied" : "Copy link"}</button></footer>
        <span className="sr-only" role="status">{copied ? "Share link copied" : ""}</span>
        {copyError && <p className={styles.copyError} role="alert">Could not copy. <Link href={`/forms/manage/${form.id}`}>Open sharing options</Link>.</p>}
      </div>
    </article>
  );
}
