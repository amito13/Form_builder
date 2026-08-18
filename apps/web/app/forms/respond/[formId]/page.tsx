"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/trpc/trpc";

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";

export default function PublicFormPage() {
  const params = useParams<{ formId: string }>();
  const formId = useMemo(() => {
    const value = Number(params.formId);
    return Number.isInteger(value) && value > 0 ? value : 0;
  }, [params.formId]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);
  const formQuery = trpc.form.getPublicForm.useQuery({ formId }, { enabled: formId > 0, retry: false });
  const submitForm = trpc.form.submitPublicForm.useMutation({ onSuccess: () => setIsComplete(true) });

  if (!formId) return <PublicFeedback title="Invalid form link" detail="Check the link and try again." />;
  if (formQuery.isPending) return <PublicFeedback title="Loading form…" detail="One moment while we prepare it." />;
  if (formQuery.isError || !formQuery.data) return <PublicFeedback title="Form unavailable" detail={formQuery.error?.message || "This form may no longer be available."} />;
  if (isComplete) return <PublicFeedback title="Thank you" detail="Your response has been recorded." />;

  const form = formQuery.data;
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitForm.isPending) return;
    submitForm.mutate({ formId, values: form.fields.map((field) => ({ formFieldId: Number(field.id), value: values[String(field.id)] || "" })) });
  }

  return <main className="public-form-page"><section className="public-form-shell">
    <header className="public-form-heading"><span className="forms-brand-mark" aria-hidden="true">F</span><p className="forms-section-label">Shared with you</p><h1>{form.title}</h1>{form.description && <p>{form.description}</p>}</header>
    {form.fields.length === 0 ? <PublicFeedback title="This form is not ready yet" detail="The form owner has not added any questions." embedded /> : <form className="public-form-card" onSubmit={submit}>{form.fields.map((field) => <ResponseField key={String(field.id)} field={field} value={values[String(field.id)] || ""} onChange={(value) => setValues((current) => ({ ...current, [String(field.id)]: value }))} />)}{submitForm.error && <p className="new-form-error" role="alert">{submitForm.error.message || "Unable to submit your response."}</p>}<button className="btn-primary public-form-submit" type="submit" disabled={submitForm.isPending}>{submitForm.isPending ? "Sending response…" : "Submit response"} <span aria-hidden="true">→</span></button></form>}
  </section></main>;
}

function ResponseField({ field, value, onChange }: { field: { id: unknown; label: string; type: FieldType; description?: string | null; placeholder?: string | null; isRequired: boolean }; value: string; onChange: (value: string) => void }) {
  const inputType = field.type === "EMAIL" ? "email" : field.type === "NUMBER" ? "number" : field.type === "PASSWORD" ? "password" : "text";
  return <label className="public-form-field"><span>{field.label}{field.isRequired && <em> *</em>}</span>{field.description && <small>{field.description}</small>}{field.type === "YES_NO" ? <select className="form-input" value={value} onChange={(event) => onChange(event.target.value)} required={field.isRequired}><option value="">Select an answer</option><option value="yes">Yes</option><option value="no">No</option></select> : <input className="form-input" type={inputType} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder || "Your answer"} required={field.isRequired} />}</label>;
}

function PublicFeedback({ title, detail, embedded = false }: { title: string; detail: string; embedded?: boolean }) {
  const content = <section className="public-form-feedback"><span className="forms-brand-mark" aria-hidden="true">F</span><h1>{title}</h1><p>{detail}</p></section>;
  return embedded ? content : <main className="public-form-page">{content}</main>;
}
