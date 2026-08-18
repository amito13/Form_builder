"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/trpc";

export default function NewFormPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createForm = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.listForms.invalidate();
      router.push("/forms");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || createForm.isPending) return;

    createForm.mutate({
      title: cleanTitle,
      ...(description.trim() ? { description: description.trim() } : {}),
    });
  }

  return (
    <main className="new-form-page">
      <section className="new-form-shell" aria-labelledby="new-form-title">
        <Link href="/forms" className="new-form-back">← Back to forms</Link>
        <div className="new-form-heading">
          <p className="forms-section-label">New form</p>
          <h1 id="new-form-title">Start with a clear question.</h1>
          <p>Name your form and add enough context for the people who will respond.</p>
        </div>

        <form className="new-form-card" onSubmit={handleSubmit}>
          <label className="new-form-field">
            <span>Form title <em>*</em></span>
            <input
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="form-input"
              maxLength={55}
              placeholder="e.g. Product feedback"
              required
            />
            <small>{title.length}/55</small>
          </label>
          <label className="new-form-field">
            <span>Description <i>Optional</i></span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="form-input new-form-textarea"
              maxLength={300}
              placeholder="What would you like people to share?"
            />
            <small>{description.length}/300</small>
          </label>
          {createForm.error && <p className="new-form-error" role="alert">{createForm.error.message || "Unable to create your form."}</p>}
          <div className="new-form-actions">
            <Link href="/forms" className="btn-ghost new-form-cancel">Cancel</Link>
            <button className="btn-primary new-form-submit" type="submit" disabled={!title.trim() || createForm.isPending}>
              {createForm.isPending ? "Creating form…" : "Create form"} <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
