"use client"
import {trpc} from "../../trpc/trpc"
export default function Health() {
    const healthQuery = trpc.health.useQuery();
    console.log("healthQuery", healthQuery)
    return <h1>Health Check</h1>
}

