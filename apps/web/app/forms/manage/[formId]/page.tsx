"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/trpc/trpc";
import type { AppRouter } from "@repo/trpc";
import type { inferRouterOutputs } from "@trpc/server";

type FormData = inferRouterOutputs<AppRouter>["form"]["getForm"];
type FormSubmission = inferRouterOutputs<AppRouter>["form"]["getFormSubmissions"][number];

type TabType = "overview" | "responses" | "settings" | "share";

const fieldTypeLabels: Record<string, string> = {
  TEXT: "Short text",
  NUMBER: "Number",
  EMAIL: "Email address",
  YES_NO: "Yes / no",
  PASSWORD: "Password",
};

export default function FormManagementPage() {
  const params = useParams<{ formId: string }>();
  const router = useRouter();
  const formId = useMemo(() => Number(params.formId), [params.formId]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copied, setCopied] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const formQuery = trpc.form.getForm.useQuery(
    { formId },
    { enabled: formId > 0, retry: false }
  );

  const responsesQuery = trpc.form.getFormSubmissions.useQuery(
    { formId },
    { enabled: formId > 0 && activeTab === "responses", retry: false }
  );

  const form = formQuery.data;

  // Initialize edit fields when form loads
  useMemo(() => {
    if (form && !isEditing) {
      setEditTitle(form.title);
      setEditDescription(form.description || "");
    }
  }, [form, isEditing]);

  const handleCopyShareLink = async () => {
    if (!form?.shareToken) return;
    const shareLink = `${window.location.origin}/forms/respond/${form.shareToken}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Could not copy link");
    }
  };

  if (!formId || formId <= 0) {
    return (
      <main className="form-management-page">
        <div className="form-management-error">
          <h1>Invalid form ID</h1>
          <p>Please select a valid form from your dashboard.</p>
          <Link href="/forms" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (formQuery.isPending) {
    return (
      <main className="form-management-page">
        <div className="form-management-loading">
          <div className="spinner"></div>
          <p>Loading form details...</p>
        </div>
      </main>
    );
  }

  if (formQuery.isError || !form) {
    return (
      <main className="form-management-page">
        <div className="form-management-error">
          <h1>Form not found</h1>
          <p>
            {formQuery.error?.message ||
              "This form could not be loaded. It may have been deleted."}
          </p>
          <Link href="/forms" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const responseCount = responsesQuery.data?.length || 0;
  const shareLink = form.shareToken
    ? `${window.location.origin}/forms/respond/${form.shareToken}`
    : "";

  return (
    <main className="form-management-page">
      {/* Header */}
      <header className="form-management-header">
        <div className="form-management-header-content">
          <Link href="/forms" className="form-management-back">
            ← Back to dashboard
          </Link>
          <div className="form-management-title-section">
            <h1>{form.title}</h1>
            <p className="form-management-meta">
              Form #{formId} • {form.fields.length} fields •{" "}
              {responseCount} responses
            </p>
          </div>
        </div>
        <div className="form-management-header-actions">
          <button
            className="btn-secondary"
            onClick={handleCopyShareLink}
            title="Copy share link"
          >
            {copied ? "Link copied!" : "Copy share link"} <span>↗</span>
          </button>
          <Link
            href={`/forms/${form.shareToken}`}
            className="btn-primary"
            target="_blank"
          >
            Preview form <span>→</span>
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <nav className="form-management-tabs" role="tablist">
        {(["overview", "responses", "settings", "share"] as TabType[]).map(
          (tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`form-management-tab ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" && "Overview"}
              {tab === "responses" && `Responses (${responseCount})`}
              {tab === "settings" && "Settings"}
              {tab === "share" && "Share"}
            </button>
          )
        )}
      </nav>

      {/* Content */}
      <div className="form-management-content">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <section className="form-management-section">
            <h2>Form Overview</h2>

            <div className="form-overview-grid">
              {/* Form Information */}
              <div className="form-overview-card">
                <h3>Form Information</h3>
                <div className="form-overview-info">
                  <div>
                    <label>Title</label>
                    <p>{form.title}</p>
                  </div>
                  <div>
                    <label>Description</label>
                    <p>{form.description || "No description provided"}</p>
                  </div>
                  <div>
                    <label>Created</label>
                    <p>
                      {form.createdAt
                        ? new Date(form.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="form-overview-card">
                <h3>Form Statistics</h3>
                <div className="form-overview-stats">
                  <div className="stat-item">
                    <span className="stat-number">{form.fields.length}</span>
                    <span className="stat-label">Fields</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{responseCount}</span>
                    <span className="stat-label">Responses</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {form.shareToken ? "Active" : "Inactive"}
                    </span>
                    <span className="stat-label">Status</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields Preview */}
            <div className="form-overview-fields">
              <h3>Form Fields</h3>
              {form.fields.length === 0 ? (
                <p className="empty-state">No fields added yet</p>
              ) : (
                <ul className="fields-list">
                  {form.fields.map((field, idx) => (
                    <li key={String(field.id)} className="field-item">
                      <span className="field-number">{idx + 1}</span>
                      <div className="field-info">
                        <strong>{field.label}</strong>
                        <span className="field-type">
                          {fieldTypeLabels[field.type] || field.type}
                        </span>
                      </div>
                      {field.isRequired && (
                        <span className="field-required">Required</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <Link href={`/forms/${form.shareToken}`} className="btn-secondary">
                Edit form fields →
              </Link>
            </div>
          </section>
        )}

        {/* Responses Tab */}
        {activeTab === "responses" && (
          <section className="form-management-section">
            <h2>Form Responses</h2>

            {responsesQuery.isPending && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading responses...</p>
              </div>
            )}

            {responsesQuery.isError && (
              <div className="error-state">
                <p>Error loading responses</p>
              </div>
            )}

            {responsesQuery.data?.length === 0 && (
              <div className="empty-state-box">
                <p>No responses yet</p>
                <small>
                  Share your form link to start collecting feedback
                </small>
              </div>
            )}

            {responsesQuery.data && responsesQuery.data.length > 0 && (
              <div className="responses-container">
                <div className="responses-stats">
                  <strong>Total Responses: {responsesQuery.data.length}</strong>
                </div>

                {responsesQuery.data.map((response, idx) => (
                  <ResponseCard
                    key={String(response.id)}
                    response={response}
                    number={idx + 1}
                    fields={form.fields}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <section className="form-management-section">
            <h2>Form Settings</h2>

            <div className="form-settings">
              {!isEditing ? (
                <div className="settings-view">
                  <div className="setting-item">
                    <label>Form Title</label>
                    <p>{form.title}</p>
                  </div>
                  <div className="setting-item">
                    <label>Description</label>
                    <p>{form.description || "No description"}</p>
                  </div>
                  <button
                    className="btn-secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Settings
                  </button>
                </div>
              ) : (
                <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label>Form Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description (optional)</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="form-input"
                      rows={4}
                    ></textarea>
                  </div>
                  <div className="form-actions">
                    <button className="btn-primary" disabled>
                      Save Changes (Coming soon)
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        )}

        {/* Share Tab */}
        {activeTab === "share" && (
          <section className="form-management-section">
            <h2>Share Your Form</h2>

            <div className="share-section">
              <div className="share-link-box">
                <label>Share Link</label>
                <div className="share-link-container">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="form-input share-link-input"
                  />
                  <button
                    className="btn-primary"
                    onClick={handleCopyShareLink}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              <div className="share-methods">
                <h3>Share Via</h3>
                <div className="share-methods-grid">
                  <a
                    href={`mailto:?subject=Please fill out this form&body=${encodeURIComponent(
                      `Check out this form: ${shareLink}`
                    )}`}
                    className="share-method-btn"
                  >
                    <span>📧</span>
                    Email
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-method-btn"
                  >
                    <span>f</span>
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      shareLink
                    )}&text=${encodeURIComponent(
                      `Fill out this form: ${form.title}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-method-btn"
                  >
                    <span>𝕏</span>
                    Twitter/X
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      shareLink
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-method-btn"
                  >
                    <span>in</span>
                    LinkedIn
                  </a>
                </div>
              </div>

              <div className="share-info-box">
                <h3>About Sharing</h3>
                <ul>
                  <li>The share link allows anyone to fill out your form</li>
                  <li>No login required for respondents</li>
                  <li>Responses are saved automatically</li>
                  <li>You can regenerate the link anytime</li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

type FormField = {
  id: unknown;
  label: string;
  type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
  isRequired: boolean;
  description?: string | null;
  placeholder?: string | null;
  labelKey?: string;
  index?: string;
};

interface ResponseCardProps {
  response: FormSubmission;
  number: number;
  fields: FormField[];
}

function ResponseCard({ response, number, fields }: ResponseCardProps) {
  const fieldsById = new Map(fields.map((f) => [Number(f.id), f]));

  return (
    <div className="response-card">
      <div className="response-header">
        <strong>Response #{number}</strong>
        <span className="response-date">
          {response.createdAt
            ? new Date(response.createdAt).toLocaleString()
            : "Unknown date"}
        </span>
      </div>
      <div className="response-content">
        <dl>
          {response.values?.map((answer) => {
            const field = fieldsById.get(answer.formFieldId);
            return (
              <div key={answer.formFieldId} className="response-answer">
                <dt className="answer-label">
                  {field?.label || "Deleted field"}
                </dt>
                <dd className="answer-value">
                  {field?.type === "PASSWORD"
                    ? "••••••••"
                    : answer.value || "—"}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
