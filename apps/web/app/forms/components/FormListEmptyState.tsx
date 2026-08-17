export function FormListEmptyState() {
  return (
    <div className="card rounded-3xl border-dashed p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
        +
      </div>
      <h2 className="text-xl font-semibold text-text-primary">
        No forms yet
      </h2>
      <p className="mt-3 text-sm text-text-muted">
        Create your first form from the builder to start collecting responses.
      </p>
    </div>
  );
}
