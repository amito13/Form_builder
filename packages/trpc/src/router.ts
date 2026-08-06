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
    }),
   addTodo: publicProcedure.input(z.object({
        title: z.string().min(1).max(256),
        description: z.string().max(1024).optional(),
    })).mutation(async ({input}) => {
       try{
            const result = await db.insert(schema.todos).values({
                
                title: input.title,
                description: input.description,
            }).returning();
            return result;
       } catch (error) 
       {
            console.error("DATABASE ERROR:");
            console.dir(error, { depth: null });

            throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : String(error),
            cause: error,
            }); 
       }
    
    })
});

export type AppRouter = typeof appRouter;
