"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { trpc } from "@/trpc/trpc";

const fieldTypes = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;
type FieldType = (typeof fieldTypes)[number];

const fieldTypeLabels: Record<FieldType, string> = {
  TEXT: "Short text",
  NUMBER: "Number",
  EMAIL: "Email address",
  YES_NO: "Yes / no",
  PASSWORD: "Password",
};

export default function FormBuilderPage() {
  const params = useParams<{ formId: string }>();
  const formId = useMemo(() => {
    const value = Number(params.formId);
    return Number.isInteger(value) && value > 0 ? value : 0;
  }, [params.formId]);
  const utils = trpc.useUtils();
  const formQuery = trpc.form.getForm.useQuery({ formId }, { enabled: formId > 0, retry: false });
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("TEXT");
  const [shareMessage, setShareMessage] = useState("");
  const refreshForm = () => utils.form.getForm.invalidate({ formId });
  const createField = trpc.form.createField.useMutation({ onSuccess: () => { setNewFieldLabel(""); void refreshForm(); } });
  const updateField = trpc.form.updateField.useMutation({ onSuccess: () => { void refreshForm(); } });
  const deleteField = trpc.form.deleteField.useMutation({ onSuccess: () => { void refreshForm(); } });

  function addField(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newFieldLabel.trim() || createField.isPending) return;
    createField.mutate({ formId, label: newFieldLabel.trim(), type: newFieldType });
  }

  async function copyShareLink() {
    const shareLink = `${window.location.origin}/forms/respond/${formId}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareMessage("Link copied");
    } catch {
      setShareMessage("Copy this link: " + shareLink);
    }
  }

  if (!formId) return <BuilderFeedback title="Invalid form link" detail="Return to your workspace and choose a form to edit." />;
  if (formQuery.isPending) return <BuilderFeedback title="Loading form…" detail="Getting your form ready to edit." />;
  if (formQuery.isError || !formQuery.data) return <BuilderFeedback title="Form unavailable" detail={formQuery.error?.message || "This form could not be found."} />;

  const form = formQuery.data;
  const mutationError = createField.error || updateField.error || deleteField.error;

  return (
    <main className="builder-page">
      <header className="builder-header">
        <Link href="/forms" className="new-form-back">← All forms</Link>
        <div className="builder-heading"><div><p className="forms-section-label">Form builder</p><h1>{form.title}</h1><p>{form.description || "Add fields to begin collecting responses."}</p></div><div className="builder-heading-actions"><button type="button" className="btn-secondary builder-share-button" onClick={copyShareLink}>Share form <span aria-hidden="true">↗</span></button><span className="builder-field-count">{form.fields.length} {form.fields.length === 1 ? "field" : "fields"}</span></div></div>
        {shareMessage && <p className="builder-share-message" role="status">{shareMessage}</p>}
      </header>

      <section className="builder-layout">
        <aside className="builder-add-panel">
          <p className="forms-section-label">Add a field</p>
          <h2>Build your question set</h2>
          <form onSubmit={addField} className="builder-add-form">
            <label><span>Question label</span><input value={newFieldLabel} onChange={(event) => setNewFieldLabel(event.target.value)} className="form-input" maxLength={100} placeholder="e.g. What should we improve?" required /></label>
            <label><span>Response type</span><select value={newFieldType} onChange={(event) => setNewFieldType(event.target.value as FieldType)} className="form-input">{fieldTypes.map((type) => <option key={type} value={type}>{fieldTypeLabels[type]}</option>)}</select></label>
            <button type="submit" className="btn-primary builder-add-button" disabled={!newFieldLabel.trim() || createField.isPending}>{createField.isPending ? "Adding…" : "Add field"} <span aria-hidden="true">+</span></button>
          </form>
        </aside>

        <section className="builder-fields" aria-labelledby="builder-fields-title">
          <div className="builder-fields-heading"><div><p className="forms-section-label">Fields</p><h2 id="builder-fields-title">Your form</h2></div></div>
          {mutationError && <p className="new-form-error" role="alert">{mutationError.message || "Unable to save the field."}</p>}
          {form.fields.length === 0 ? <div className="builder-empty"><span aria-hidden="true">+</span><h3>Your form is empty</h3><p>Add the first field from the panel to the left.</p></div> : <div className="builder-field-list">{form.fields.map((field, index) => <EditableField key={String(field.id)} field={field} number={index + 1} isSaving={updateField.isPending || deleteField.isPending} onSave={(values) => updateField.mutate({ fieldId: Number(field.id), ...values })} onDelete={() => deleteField.mutate({ fieldId: Number(field.id) })} />)}</div>}
        </section>
      </section>
    </main>
  );
}

type EditableFieldProps = {
  field: { id: unknown; label: string; type: FieldType; description?: string | null; placeholder?: string | null; isRequired: boolean };
  number: number;
  isSaving: boolean;
  onSave: (values: { label: string; type: FieldType; description: string; placeholder: string; isRequired: boolean }) => void;
  onDelete: () => void;
};

function EditableField({ field, number, isSaving, onSave, onDelete }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(field.label);
  const [type, setType] = useState<FieldType>(field.type);
  const [description, setDescription] = useState(field.description || "");
  const [placeholder, setPlaceholder] = useState(field.placeholder || "");
  const [isRequired, setIsRequired] = useState(field.isRequired);

  function cancel() { setLabel(field.label); setType(field.type); setDescription(field.description || ""); setPlaceholder(field.placeholder || ""); setIsRequired(field.isRequired); setIsEditing(false); }
  function save() { if (!label.trim() || isSaving) return; onSave({ label: label.trim(), type, description: description.trim(), placeholder: placeholder.trim(), isRequired }); setIsEditing(false); }

  return <article className="builder-field-card">
    <div className="builder-field-topline"><span>Field {number}</span><span>{fieldTypeLabels[field.type]}</span></div>
    {isEditing ? <div className="builder-field-editor">
      <label><span>Question label</span><input className="form-input" value={label} onChange={(event) => setLabel(event.target.value)} maxLength={100} /></label>
      <div className="builder-field-row"><label><span>Response type</span><select className="form-input" value={type} onChange={(event) => setType(event.target.value as FieldType)}>{fieldTypes.map((option) => <option key={option} value={option}>{fieldTypeLabels[option]}</option>)}</select></label><label className="builder-required"><input type="checkbox" checked={isRequired} onChange={(event) => setIsRequired(event.target.checked)} /> Required</label></div>
      <label><span>Help text</span><input className="form-input" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={300} placeholder="Optional guidance" /></label>
      <label><span>Placeholder</span><input className="form-input" value={placeholder} onChange={(event) => setPlaceholder(event.target.value)} maxLength={200} placeholder="Optional example answer" /></label>
      <div className="builder-field-actions"><button type="button" className="btn-ghost" onClick={cancel}>Cancel</button><button type="button" className="btn-primary" onClick={save} disabled={!label.trim() || isSaving}>{isSaving ? "Saving…" : "Save field"}</button></div>
    </div> : <div className="builder-field-preview"><h3>{field.label}{field.isRequired && <span aria-label="Required"> *</span>}</h3>{field.description && <p>{field.description}</p>}<div className="builder-input-preview">{field.type === "YES_NO" ? <span>Yes / No</span> : field.placeholder || `Answer as ${fieldTypeLabels[field.type].toLowerCase()}`}</div><div className="builder-field-actions"><button type="button" className="btn-ghost" onClick={() => setIsEditing(true)}>Edit</button><button type="button" className="builder-delete" onClick={onDelete} disabled={isSaving}>Delete</button></div></div>}
  </article>;
}

function BuilderFeedback({ title, detail }: { title: string; detail: string }) {
  return <main className="builder-feedback-page"><section><Link href="/forms" className="new-form-back">← All forms</Link><h1>{title}</h1><p>{detail}</p></section></main>;
}
