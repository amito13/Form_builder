import {publicProcedure, router} from "./trpc";
import {z} from "zod";
import {db} from "@repo/database"
import * as schema from "@repo/database"
import { TRPCError } from "@trpc/server/unstable-core-do-not-import";
export const appRouter = router({
    health:publicProcedure.query(() => {
        return{
            message:"health check ok"
        }
    })
});

export type AppRouter = typeof appRouter;
