"use client";

import { useState } from "react";
import { trpc } from "../../trpc/trpc";
export default function TodoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTodo = trpc.addTodo.useMutation({
    onSuccess: (data) => {
      console.log("Created:", data);
      alert("Todo created successfully!");

      setTitle("");
      setDescription("");
    },

    onError: (err) => {
      console.error(err);
      alert(err.message);
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">
          Test tRPC Todo API
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <textarea
            placeholder="Todo description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <button
            onClick={() =>
              addTodo.mutate({
                title,
                description,
              })
            }
            disabled={addTodo.isPending}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addTodo.isPending ? "Adding..." : "Add Todo"}
          </button>
        </div>

        {/* {addTodo.data && (
          <pre className="mt-6 overflow-auto rounded-lg bg-zinc-950 p-4 text-xs text-green-400">
            {JSON.stringify(addTodo.data, null, 2)}
          </pre>
        )} */}

        {addTodo.error && (
          <pre className="mt-6 overflow-auto rounded-lg bg-zinc-950 p-4 text-xs text-red-400">
            {addTodo.error.message}
          </pre>
        )}
      </div>
    </main>
  );
}