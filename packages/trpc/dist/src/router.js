import { publicProcedure, router } from "../server/trpc.js";
import { authRouter } from "../server/routes/auth/route.js";
import { formRouter } from "../server/routes/form/route.js";
export const appRouter = router({
    health: publicProcedure.query(() => {
        return {
            message: "health check ok"
        };
    }),
    auth: authRouter,
    form: formRouter
});
