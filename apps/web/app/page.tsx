"use client";

import { useState } from "react";
import { trpc } from "@/trpc/trpc";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const {data, isLoading,error} = trpc.getTodos.useQuery()
  const addTodo = trpc.addTodo.useMutation({
    onSuccess: (data) => {
      console.log("Todo created:", data);

      setTitle("");
      setDescription("");
    },

    onError: (error) => {
      console.error("Failed to create todo:", error);
    },
  });

  const handleAddTodo = () => {
    if (!title.trim()) return;

    addTodo.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-zinc-500 mb-2">
            tRPC + Drizzle
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Todo Tester
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Test your addTodo procedure.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          {/* Title */}
          <div className="mb-5">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleAddTodo}
            disabled={!title.trim() || addTodo.isPending}
            className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {addTodo.isPending ? "Adding Todo..." : "Add Todo"}
          </button>

          {/* Success */}
          {addTodo.isSuccess && (
            <div className="mt-4 rounded-xl border border-green-900 bg-green-950/40 px-4 py-3 text-sm text-green-400">
              Todo created successfully ✓
            </div>
          )}

          {/* Error */}
          {addTodo.isError && (
            <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
              {addTodo.error.message}
            </div>
          )}

          {/* Response */}
          {addTodo.data && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                API Response
              </p>

              <pre className="overflow-auto rounded-xl bg-black p-4 text-xs text-zinc-300">
                {JSON.stringify(addTodo.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
        <div>
          <h2 className="mt-8 mb-4 text-lg font-semibold tracking-tight">
            Todos List
          </h2>
          {isLoading && <p>Loading todos...</p>}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {data && data.length === 0 && <p>No todos found.</p>}
          {data && data.length > 0 && (
            <ul className="space-y-4">
              {data.map((todo) => (
                <li key={todo.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                  <h3 className="text-sm font-semibold text-white">{todo.title}</h3>
                  {todo.description && (
                    <p className="mt-1 text-sm text-zinc-400">{todo.description}</p>
                  )}  
                </li>
              ))}
            </ul>
          )}
          
        </div>
      </div>
    </main>
  );
}