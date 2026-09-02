"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  description?: string;
  placeholder?: string;
  isRequired: boolean;
}

function renderFormPreviewField(field: FormField) {
  const renderInput = () => {
    switch (field.type) {
      case "EMAIL":
        return (
          <input
            type="email"
            className="form-preview-field-input"
            placeholder={field.placeholder || "your@email.com"}
            disabled
          />
        );
      case "NUMBER":
        return (
          <input
            type="number"
            className="form-preview-field-input"
            placeholder={field.placeholder || "Enter a number"}
            disabled
          />
        );
      case "PASSWORD":
        return (
          <input
            type="password"
            className="form-preview-field-input"
            placeholder={field.placeholder || "••••••••"}
            disabled
          />
        );
      case "YES_NO":
        return (
          <div
            className="form-preview-field-input"
            style={{ display: "flex", gap: "1rem", alignItems: "center" }}
          >
            <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer" }}>
              <input type="radio" disabled /> Yes
            </label>
            <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer" }}>
              <input type="radio" disabled /> No
            </label>
          </div>
        );
      default:
        return (
          <input
            type="text"
            className="form-preview-field-input"
            placeholder={field.placeholder || "Your answer"}
            disabled
          />
        );
    }
  };

  return (
    <div key={field.id} className="form-preview-field">
      <label className="form-preview-field-label">
        {field.label}
        {field.isRequired && <span className="form-preview-field-required">*</span>}
      </label>
      {field.description && <p className="form-preview-field-hint">{field.description}</p>}
      {renderInput()}
    </div>
  );
}

export default function CreateFormPage() {
  const router = useRouter();
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("TEXT");
  const [newFieldDescription, setNewFieldDescription] = useState("");
  const [newFieldPlaceholder, setNewFieldPlaceholder] = useState("");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [error, setError] = useState("");

  const createField = trpc.form.createField.useMutation({
    onError: (error) => {
      setError(error.message || "Failed to add field");
    },
  });

  const createForm = trpc.form.createForm.useMutation({
    onSuccess: async (data) => {
      try {
        for (const field of fields) {
          await createField.mutateAsync({
            formId: data.formId,
            label: field.label,
            type: field.type,
            description: field.description,
            placeholder: field.placeholder,
            isRequired: field.isRequired,
          });
        }
      } catch (fieldError) {
        setError(
          fieldError instanceof Error
            ? fieldError.message
            : "Form was created, but some fields failed to save."
        );
        return;
      }
      router.push(`/forms/${data.id}`);
    },
    onError: (error) => {
      setError(error.message || "Failed to create form");
    },
  });

  function addField(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newFieldLabel.trim()) {
      setError("Field label is required");
      return;
    }

    const newField: FormField = {
      id: Date.now().toString(),
      label: newFieldLabel.trim(),
      type: newFieldType,
      description: newFieldDescription || undefined,
      placeholder: newFieldPlaceholder || undefined,
      isRequired: newFieldRequired,
    };

    setFields([...fields, newField]);
    setNewFieldLabel("");
    setNewFieldType("TEXT");
    setNewFieldDescription("");
    setNewFieldPlaceholder("");
    setNewFieldRequired(false);
    setError("");
  }

  function removeField(id: string) {
    setFields(fields.filter((field) => field.id !== id));
  }

  async function handleCreateForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!formTitle.trim()) {
      setError("Form title is required");
      return;
    }

    createForm.mutate({
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
    });
  }

  return (
    <main className="builder-page">
      {/* Header Section */}
      <header className="builder-header">
        <div className="builder-section-wrapper">
          <Link href="/forms" className="new-form-back">
            ← All forms
          </Link>
          <div className="builder-heading">
            <div>
              <p className="forms-section-label">Create new form</p>
              <h1>Build Your Form</h1>
              <p>Add form details and fields to start collecting responses.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Builder Layout Section */}
      <section
        className="builder-section-wrapper"
        style={{ paddingTop: "2.5rem", borderBottom: "1px solid var(--border)", marginBottom: "0" }}
      >
        <section className="builder-layout">
          {/* Left Panel: Field Addition */}
          <aside className="builder-add-panel">
            <p className="forms-section-label">Add Fields</p>
            <h2>Build your question set</h2>
            <form onSubmit={addField} className="builder-add-form">
              <label>
                <span>Question label</span>
                <input
                  value={newFieldLabel}
                  onChange={(event) => setNewFieldLabel(event.target.value)}
                  className="form-input"
                  maxLength={55}
                  placeholder="e.g. What is your name?"
                  required
                />
              </label>
              <label>
                <span>Response type</span>
                <select
                  value={newFieldType}
                  onChange={(event) => setNewFieldType(event.target.value as FieldType)}
                  className="form-input"
                >
                  {fieldTypes.map((type) => (
                    <option key={type} value={type}>
                      {fieldTypeLabels[type]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Description (optional)</span>
                <input
                  value={newFieldDescription}
                  onChange={(event) => setNewFieldDescription(event.target.value)}
                  className="form-input"
                  maxLength={300}
                  placeholder="Help text for respondents"
                />
              </label>
              <label>
                <span>Placeholder (optional)</span>
                <input
                  value={newFieldPlaceholder}
                  onChange={(event) => setNewFieldPlaceholder(event.target.value)}
                  className="form-input"
                  maxLength={100}
                  placeholder="e.g. John Doe"
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={(event) => setNewFieldRequired(event.target.checked)}
                />
                <span>Required field</span>
              </label>
              <button
                type="submit"
                className="btn-primary builder-add-button"
                disabled={!newFieldLabel.trim() || createField.isPending}
              >
                {createField.isPending ? "Adding…" : "Add field"} <span aria-hidden="true">+</span>
              </button>
            </form>
          </aside>

          {/* Right Panel: Form Details */}
          <section className="builder-fields" aria-labelledby="builder-fields-title">
            <div className="builder-fields-heading">
              <div>
                <p className="forms-section-label">Form Details</p>
                <h2 id="builder-fields-title">Your Form</h2>
              </div>
            </div>

            <form onSubmit={handleCreateForm} className="new-form-details">
              {error && (
                <p className="new-form-error" role="alert">
                  {error}
                </p>
              )}

              {/* Form Information Section */}
              <fieldset className="form-fieldset">
                <legend className="forms-section-label">Form Information</legend>

                <label>
                  <span>Form name *</span>
                  <input
                    value={formTitle}
                    onChange={(event) => setFormTitle(event.target.value)}
                    className="form-input"
                    maxLength={55}
                    placeholder="e.g. Customer Feedback"
                    required
                  />
                </label>

                <label>
                  <span>Description (optional)</span>
                  <textarea
                    value={formDescription}
                    onChange={(event) => setFormDescription(event.target.value)}
                    className="form-input"
                    maxLength={300}
                    placeholder="Tell respondents what this form is about"
                    rows={3}
                  />
                </label>
              </fieldset>

              {/* Fields List Section */}
              <fieldset className="form-fieldset">
                <legend className="forms-section-label">Fields ({fields.length})</legend>

                {fields.length === 0 ? (
                  <div className="builder-empty">
                    <span aria-hidden="true">+</span>
                    <h3>No fields yet</h3>
                    <p>Add your first field from the panel to the left.</p>
                  </div>
                ) : (
                  <div className="builder-field-list">
                    {fields.map((field, index) => (
                      <div key={field.id} className="builder-field-item">
                        <div className="builder-field-content">
                          <div className="builder-field-number">{index + 1}</div>
                          <div className="builder-field-details">
                            <h4>{field.label}</h4>
                            <p className="builder-field-type">{fieldTypeLabels[field.type]}</p>
                            {field.description && (
                              <p className="builder-field-meta">{field.description}</p>
                            )}
                            {field.isRequired && (
                              <span className="builder-field-required">Required</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-ghost builder-field-delete"
                          onClick={() => removeField(field.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>

              {/* Action Buttons */}
              <div className="new-form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!formTitle.trim() || createForm.isPending || createField.isPending}
                >
                  {createForm.isPending || createField.isPending ? "Creating form…" : "Create form"}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </section>
        </section>
      </section>

      {/* Live Preview Section — Signature Element */}
      <section className="builder-preview-section">
        <div className="builder-section-wrapper" style={{ width: "100%", margin: "0" }}>
          <div className="builder-preview-header">
            <span className="builder-preview-label">Live Preview</span>
            <h2 className="builder-preview-title">How respondents will see your form</h2>
          </div>

          <div className="form-preview">
            {!formTitle.trim() && fields.length === 0 ? (
              <div className="form-preview-empty">
                <div className="form-preview-empty-icon">👀</div>
                <p className="form-preview-empty-text">
                  Add a form title and at least one field to see the live preview
                </p>
              </div>
            ) : (
              <>
                {formTitle.trim() && (
                  <>
                    <h1 className="form-preview-title">{formTitle}</h1>
                    {formDescription.trim() && (
                      <p className="form-preview-description">{formDescription}</p>
                    )}
                  </>
                )}
                {fields.length > 0 && (
                  <div className="form-preview-field-group">
                    {fields.map((field) => renderFormPreviewField(field))}
                  </div>
                )}
                {fields.length > 0 && (
                  <button
                    type="button"
                    style={{
                      minHeight: "3rem",
                      marginTop: "1.5rem",
                      padding: "0.75rem 2rem",
                      borderRadius: "var(--radius-lg)",
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontWeight: 600,
                      cursor: "not-allowed",
                      opacity: 0.7,
                      border: "none",
                    }}
                    disabled
                  >
                    Submit (Preview disabled)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
