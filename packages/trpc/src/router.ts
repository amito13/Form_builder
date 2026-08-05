import {publicProcedure, router} from "./trpc";


export const appRouter = router({
    health:publicProcedure.query(() => {
        return{
            message:"health check ok"
        }
    })
});

export type AppRouter = typeof appRouter;
