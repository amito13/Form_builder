"use client";

import Link from "next/link";
import type { AppRouter } from "@repo/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

export function FormListCard({ form }: { form: FormListItem }) {
  const updatedAt = form.updatedAt ? new Date(form.updatedAt) : null;
  const summary = updatedAt
    ? updatedAt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently created";

  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const shareLink = `${window.location.origin}/forms/respond/${form.shareToken}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy link");
    }
  };

  return (
    <article className="forms-card">
      <div className="forms-card-topline">
        <span>Form #{String(form.id)}</span>
        <span className="forms-card-status">Active</span>
      </div>
      <h3 className="forms-card-title">{form.title}</h3>
      <p className="forms-card-description">
        {form.description || "No description yet."}
      </p>

      <footer className="forms-card-footer">
        <span>Updated {summary}</span>
        <div className="forms-card-actions">
          <Link
            href={`/forms/manage/${form.id}`}
            className="forms-card-link forms-card-primary-link"
          >
            Manage <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            className="forms-card-action-btn"
            onClick={handleCopyLink}
            title="Copy share link"
          >
            {copied ? "Copied!" : "Share"} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </footer>
    </article>
  );
}
