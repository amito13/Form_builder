import { publicProcedure, router } from "../server/trpc";
import { authRouter } from "../server/routes/auth/route";
import { formRouter } from "../server/routes/form/route";
export const appRouter = router({
    health: publicProcedure.query(() => {
        return {
            message: "health check ok"
        };
    }),
    auth: authRouter,
    form: formRouter
});
