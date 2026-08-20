"use client";

import Link from "next/link";
import type { AppRouter } from "@repo/trpc";
import type { inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { trpc } from "@/trpc/trpc";

type FormListItem = inferRouterOutputs<AppRouter>["form"]["listForms"][number];

export function FormListCard({ form }: { form: FormListItem }) {
  const updatedAt = form.updatedAt ? new Date(form.updatedAt) : null;
  const summary = updatedAt
    ? updatedAt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Recently created";
  
  const [showResponses, setShowResponses] = useState(false);
  const [copied, setCopied] = useState(false);
  const formId = Number(form.id);
  
  const responsesQuery = trpc.form.getFormSubmissions.useQuery(
    { formId },
    { enabled: showResponses, retry: false }
  );

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
      <p className="forms-card-description">{form.description || "No description yet."}</p>
      
      <footer className="forms-card-footer">
        <span>Updated {summary}</span>
        <div className="forms-card-actions">
          <button
            type="button"
            className="forms-card-action-btn"
            onClick={() => setShowResponses(!showResponses)}
            title={showResponses ? "Hide responses" : "View responses"}
          >
            {showResponses ? "Hide" : "Responses"} <span aria-hidden="true">📊</span>
          </button>
          <button
            type="button"
            className="forms-card-action-btn"
            onClick={handleCopyLink}
            title="Copy share link"
          >
            {copied ? "Copied!" : "Share"} <span aria-hidden="true">↗</span>
          </button>
          <Link href={`/forms/${form.shareToken}`} className="forms-card-link">
            Edit <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
      
      {showResponses && (
        <div className="forms-card-responses">
          <div className="forms-card-responses-header">
            <h4>Submitted Responses</h4>
            <span className="forms-response-count">
              {responsesQuery.isPending ? "Loading..." : `${responsesQuery.data?.length || 0} submitted`}
            </span>
          </div>
          
          {responsesQuery.isPending && (
            <p className="forms-response-loading">Loading responses...</p>
          )}
          
          {responsesQuery.isError && (
            <p className="forms-response-error">Error loading responses</p>
          )}
          
          {!responsesQuery.isPending && responsesQuery.data?.length === 0 && (
            <p className="forms-response-empty">No responses yet. Share the form to collect feedback!</p>
          )}
          
          {responsesQuery.data && responsesQuery.data.length > 0 && (
            <div className="forms-responses-list">
              {responsesQuery.data.slice(0, 3).map((response, idx) => (
                <div key={String(response.id)} className="forms-response-item">
                  <div className="forms-response-meta">
                    <strong>Response #{idx + 1}</strong>
                    <span>{response.createdAt ? new Date(response.createdAt).toLocaleDateString() : "Just now"}</span>
                  </div>
                  <div className="forms-response-values">
                    {response.values?.slice(0, 2).map((answer) => (
                      <div key={answer.formFieldId} className="forms-response-value">
                        <span className="forms-value-label">→</span>
                        <span className="forms-value-text">{answer.value}</span>
                      </div>
                    ))}
                    {response.values && response.values.length > 2 && (
                      <span className="forms-response-more">+{response.values.length - 2} more</span>
                    )}
                  </div>
                </div>
              ))}
              {responsesQuery.data.length > 3 && (
                <p className="forms-responses-view-all">
                  <Link href={`/forms/${form.shareToken}`}>
                    View all {responsesQuery.data.length} responses →
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
