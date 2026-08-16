<<<<<<< HEAD
=======
"use client";

import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/trpc/trpc";

const tabs = [
  { id: "auth", label: "Auth" },
  { id: "forms", label: "Forms" },
  { id: "fields", label: "Fields" },
  { id: "submit", label: "Submit" },
  { id: "submissions", label: "Submissions" },
] as const;

type TabId = (typeof tabs)[number]["id"];
type Theme = "light" | "dark";

const fieldTypes = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;
type FieldType = (typeof fieldTypes)[number];

type FieldDraft = {
  label: string;
  type: FieldType;
  description: string;
  placeholder: string;
  isRequired: boolean;
};

function toFieldDraft(field: {
  label: string;
  type: FieldType;
  description?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
}): FieldDraft {
  return {
    label: field.label,
    type: field.type,
    description: field.description ?? "",
    placeholder: field.placeholder ?? "",
    isRequired: field.isRequired,
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("auth");
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const [newField, setNewField] = useState<FieldDraft>({
    label: "",
    type: "TEXT",
    description: "",
    placeholder: "",
    isRequired: false,
  });
  const [fieldEdits, setFieldEdits] = useState<Record<string, FieldDraft>>({});
  const [submissionValues, setSubmissionValues] = useState<Record<string, string>>(
    {},
  );

  const utils = trpc.useUtils();
  const healthQuery = trpc.health.useQuery();
  const userQuery = trpc.auth.getLoggedInUserInfo.useQuery(undefined, {
    retry: false,
  });
  const listFormsQuery = trpc.form.listForms.useQuery(undefined, {
    enabled: userQuery.isSuccess,
    retry: false,
  });
  const firstFormId = listFormsQuery.data?.[0]
    ? Number(listFormsQuery.data[0].id)
    : null;
  const activeFormId = useMemo(() => {
    if (!listFormsQuery.data || listFormsQuery.data.length === 0) return null;
    if (
      selectedFormId !== null &&
      listFormsQuery.data.some((form) => Number(form.id) === selectedFormId)
    ) {
      return selectedFormId;
    }
    return firstFormId;
  }, [firstFormId, listFormsQuery.data, selectedFormId]);

  const fieldsQuery = trpc.form.getFields.useQuery(
    { formId: activeFormId ?? -1 },
    {
      enabled: activeFormId !== null && userQuery.isSuccess,
    },
  );
  const submissionsQuery = trpc.form.getFormSubmissions.useQuery(
    { formId: activeFormId ?? -1 },
    {
      enabled: activeFormId !== null && userQuery.isSuccess,
    },
  );

  const signUpMutation = trpc.auth.createUserWithEmailAndPassword.useMutation({
    onSuccess: () => {
      void userQuery.refetch();
    },
  });
  const signInMutation = trpc.auth.signInUserWithEmailAndPassword.useMutation({
    onSuccess: () => {
      void userQuery.refetch();
    },
  });
  const createFormMutation = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      setFormTitle("");
      setFormDescription("");
      await utils.form.listForms.invalidate();
    },
  });
  const createFieldMutation = trpc.form.createField.useMutation({
    onSuccess: async () => {
      setNewField({
        label: "",
        type: "TEXT",
        description: "",
        placeholder: "",
        isRequired: false,
      });
      await utils.form.getFields.invalidate();
    },
  });
  const updateFieldMutation = trpc.form.updateField.useMutation({
    onSuccess: async () => {
      await utils.form.getFields.invalidate();
    },
  });
  const deleteFieldMutation = trpc.form.deleteField.useMutation({
    onSuccess: async () => {
      await utils.form.getFields.invalidate();
    },
  });
  const submitFormMutation = trpc.form.submitForm.useMutation({
    onSuccess: async () => {
      setSubmissionValues({});
      await utils.form.getFormSubmissions.invalidate();
    },
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const selectedForm = useMemo(() => {
    if (!listFormsQuery.data || activeFormId === null) return null;
    return (
      listFormsQuery.data.find((form) => Number(form.id) === activeFormId) ?? null
    );
  }, [activeFormId, listFormsQuery.data]);

  const isAuthenticated = userQuery.isSuccess;

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Form Builder UI</h1>
            <p className="text-sm text-[var(--muted)]">
              Backend: {healthQuery.data?.message ?? "Checking API..."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "border border-[var(--border)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        {activeTab === "auth" && (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] p-4">
              <h2 className="mb-3 text-lg font-semibold">Create account</h2>
              <div className="space-y-2">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Name"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() =>
                    signUpMutation.mutate({ name, email, password })
                  }
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
                >
                  Sign up
                </button>
                {signUpMutation.error && (
                  <p className="text-sm text-red-500">{signUpMutation.error.message}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] p-4">
              <h2 className="mb-3 text-lg font-semibold">Sign in</h2>
              <div className="space-y-2">
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => signInMutation.mutate({ email, password })}
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
                >
                  Sign in
                </button>
                {signInMutation.error && (
                  <p className="text-sm text-red-500">{signInMutation.error.message}</p>
                )}
                <button
                  type="button"
                  onClick={() => void userQuery.refetch()}
                  className="block rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
                >
                  Refresh profile
                </button>
              </div>
              <div className="mt-4 rounded-lg border border-[var(--border)] p-3 text-sm">
                {isAuthenticated ? (
                  <p>
                    Logged in as <strong>{userQuery.data.fullName}</strong> (
                    {userQuery.data.email})
                  </p>
                ) : (
                  <p className="text-[var(--muted)]">
                    Not authenticated yet. Sign in to continue.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "forms" && (
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] p-4">
              <h2 className="mb-3 text-lg font-semibold">Create form</h2>
              <div className="space-y-2">
                <input
                  value={formTitle}
                  onChange={(event) => setFormTitle(event.target.value)}
                  placeholder="Form title"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                />
                <textarea
                  value={formDescription}
                  onChange={(event) => setFormDescription(event.target.value)}
                  placeholder="Description"
                  className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                />
                <button
                  type="button"
                  disabled={!isAuthenticated}
                  onClick={() =>
                    createFormMutation.mutate({
                      title: formTitle,
                      description: formDescription || undefined,
                    })
                  }
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)] disabled:opacity-50"
                >
                  Create form
                </button>
                {createFormMutation.error && (
                  <p className="text-sm text-red-500">{createFormMutation.error.message}</p>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-[var(--border)] p-4">
              <h2 className="mb-3 text-lg font-semibold">Your forms</h2>
              {!isAuthenticated && (
                <p className="text-sm text-[var(--muted)]">
                  Sign in from the Auth tab to load forms.
                </p>
              )}
              <div className="space-y-2">
                {listFormsQuery.data?.map((form) => {
                  const isSelected = Number(form.id) === activeFormId;
                  return (
                    <button
                      key={String(form.id)}
                      type="button"
                      onClick={() => setSelectedFormId(Number(form.id))}
                      className={`block w-full rounded-lg border px-3 py-2 text-left ${
                        isSelected
                          ? "border-[var(--accent)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      <p className="font-medium">{form.title}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {form.description || "No description"}
                      </p>
                    </button>
                  );
                })}
                {listFormsQuery.data?.length === 0 && (
                  <p className="text-sm text-[var(--muted)]">No forms yet.</p>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "fields" && (
          <section className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] p-4">
              <h2 className="mb-3 text-lg font-semibold">Add field</h2>
              {!selectedForm && (
                <p className="text-sm text-[var(--muted)]">
                  Select a form from the Forms tab first.
                </p>
              )}
              {selectedForm && (
                <div className="grid gap-2 md:grid-cols-2">
                  <input
                    value={newField.label}
                    onChange={(event) =>
                      setNewField((prev) => ({ ...prev, label: event.target.value }))
                    }
                    placeholder="Field label"
                    className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                  />
                  <select
                    value={newField.type}
                    onChange={(event) =>
                      setNewField((prev) => ({
                        ...prev,
                        type: event.target.value as FieldType,
                      }))
                    }
                    className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    value={newField.description}
                    onChange={(event) =>
                      setNewField((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Description"
                    className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                  />
                  <input
                    value={newField.placeholder}
                    onChange={(event) =>
                      setNewField((prev) => ({
                        ...prev,
                        placeholder: event.target.value,
                      }))
                    }
                    placeholder="Placeholder"
                    className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newField.isRequired}
                      onChange={(event) =>
                        setNewField((prev) => ({
                          ...prev,
                          isRequired: event.target.checked,
                        }))
                      }
                    />
                    Required field
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      createFieldMutation.mutate({
                    formId: activeFormId ?? -1,
                        label: newField.label,
                        type: newField.type,
                        description: newField.description || undefined,
                        placeholder: newField.placeholder || undefined,
                        isRequired: newField.isRequired,
                      })
                    }
                    className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
                  >
                    Add field
                  </button>
                </div>
              )}
              {createFieldMutation.error && (
                <p className="mt-2 text-sm text-red-500">
                  {createFieldMutation.error.message}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-[var(--border)] p-4">
              <h2 className="mb-3 text-lg font-semibold">Edit fields</h2>
              <div className="space-y-3">
                {fieldsQuery.data?.map((field) => {
                  const key = String(field.id);
                  const draft = fieldEdits[key] ?? toFieldDraft(field);
                  return (
                    <div key={key} className="rounded-lg border border-[var(--border)] p-3">
                      <div className="grid gap-2 md:grid-cols-2">
                        <input
                          value={draft.label}
                          onChange={(event) =>
                            setFieldEdits((prev) => ({
                              ...prev,
                              [key]: { ...draft, label: event.target.value },
                            }))
                          }
                          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                        />
                        <select
                          value={draft.type}
                          onChange={(event) =>
                            setFieldEdits((prev) => ({
                              ...prev,
                              [key]: {
                                ...draft,
                                type: event.target.value as FieldType,
                              },
                            }))
                          }
                          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <input
                          value={draft.description}
                          onChange={(event) =>
                            setFieldEdits((prev) => ({
                              ...prev,
                              [key]: { ...draft, description: event.target.value },
                            }))
                          }
                          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                        />
                        <input
                          value={draft.placeholder}
                          onChange={(event) =>
                            setFieldEdits((prev) => ({
                              ...prev,
                              [key]: { ...draft, placeholder: event.target.value },
                            }))
                          }
                          className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={draft.isRequired}
                            onChange={(event) =>
                              setFieldEdits((prev) => ({
                                ...prev,
                                [key]: {
                                  ...draft,
                                  isRequired: event.target.checked,
                                },
                              }))
                            }
                          />
                          Required
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateFieldMutation.mutate({
                              fieldId: Number(field.id),
                              label: draft.label,
                              type: draft.type,
                              description: draft.description || undefined,
                              placeholder: draft.placeholder || undefined,
                              isRequired: draft.isRequired,
                            })
                          }
                          className="rounded-lg border border-[var(--border)] px-3 py-1 text-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            deleteFieldMutation.mutate({
                              fieldId: Number(field.id),
                            })
                          }
                          className="rounded-lg border border-red-400 px-3 py-1 text-sm text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
                {fieldsQuery.data?.length === 0 && (
                  <p className="text-sm text-[var(--muted)]">No fields yet.</p>
                )}
              </div>
              {(updateFieldMutation.error || deleteFieldMutation.error) && (
                <p className="mt-2 text-sm text-red-500">
                  {updateFieldMutation.error?.message ||
                    deleteFieldMutation.error?.message}
                </p>
              )}
            </div>
          </section>
        )}

        {activeTab === "submit" && (
          <section className="rounded-xl border border-[var(--border)] p-4">
            <h2 className="mb-3 text-lg font-semibold">Submit selected form</h2>
            {!selectedForm && (
              <p className="text-sm text-[var(--muted)]">
                Select a form from the Forms tab first.
              </p>
            )}
            {selectedForm && (
              <div className="space-y-3">
                <p className="text-sm text-[var(--muted)]">
                  Form: <strong>{selectedForm.title}</strong>
                </p>
                {fieldsQuery.data?.map((field) => {
                  const key = String(field.id);
                  return (
                    <div key={key} className="space-y-1">
                      <label className="block text-sm font-medium">
                        {field.label}
                        {field.isRequired ? " *" : ""}
                      </label>
                      {field.type === "YES_NO" ? (
                        <select
                          value={submissionValues[key] ?? ""}
                          onChange={(event) =>
                            setSubmissionValues((prev) => ({
                              ...prev,
                              [key]: event.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      ) : (
                        <input
                          type={
                            field.type === "PASSWORD"
                              ? "password"
                              : field.type === "EMAIL"
                                ? "email"
                                : field.type === "NUMBER"
                                  ? "number"
                                  : "text"
                          }
                          value={submissionValues[key] ?? ""}
                          onChange={(event) =>
                            setSubmissionValues((prev) => ({
                              ...prev,
                              [key]: event.target.value,
                            }))
                          }
                          placeholder={field.placeholder ?? undefined}
                          className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
                        />
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() =>
                    submitFormMutation.mutate({
                      formId: activeFormId ?? -1,
                      values:
                        fieldsQuery.data?.map((field) => ({
                          formFieldId: Number(field.id),
                          value: submissionValues[String(field.id)] ?? "",
                        })) ?? [],
                    })
                  }
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-foreground)]"
                >
                  Submit
                </button>
                {submitFormMutation.data && (
                  <p className="text-sm text-green-600">
                    Submission created: {String(submitFormMutation.data.id)}
                  </p>
                )}
                {submitFormMutation.error && (
                  <p className="text-sm text-red-500">
                    {submitFormMutation.error.message}
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "submissions" && (
          <section className="rounded-xl border border-[var(--border)] p-4">
            <h2 className="mb-3 text-lg font-semibold">Submission history</h2>
            {!selectedForm && (
              <p className="text-sm text-[var(--muted)]">
                Select a form from the Forms tab first.
              </p>
            )}
            {selectedForm && (
              <div className="space-y-3">
                {submissionsQuery.data?.map((submission) => (
                  <div
                    key={String(submission.id)}
                    className="rounded-lg border border-[var(--border)] p-3"
                  >
                    <p className="text-sm font-medium">
                      Submission #{String(submission.id)}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {submission.createdAt
                        ? new Date(submission.createdAt).toLocaleString()
                        : "No timestamp"}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                      {submission.values?.map((value) => (
                        <li key={`${submission.id}-${value.formFieldId}`}>
                          Field {value.formFieldId}: {value.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {submissionsQuery.data?.length === 0 && (
                  <p className="text-sm text-[var(--muted)]">No submissions yet.</p>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
>>>>>>> 58c2d21143823d025f0f47587162265d64eb7746
