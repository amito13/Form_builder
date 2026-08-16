"use client";

import { useState } from "react";
import { trpc } from "@/trpc/trpc";

export default function Home() {
    const { data } = trpc.health.useQuery();



  

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-zinc-500 mb-2">
            API Status : {data?.message ?? "Loading..."}
          </p>
        
        </div>
      
      </div>
    </main>
  );
}