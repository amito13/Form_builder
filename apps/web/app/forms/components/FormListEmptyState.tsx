export function FormListEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xl font-semibold text-[var(--accent)]">
        +
      </div>
      <h2 className="text-xl font-semibold text-[var(--foreground)]">
        No forms yet
      </h2>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Create your first form from the builder to start collecting responses.
      </p>
    </div>
  );
}
