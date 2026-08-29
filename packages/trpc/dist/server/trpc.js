import { TRPCError, initTRPC } from '@trpc/server';
import { getAuthenticationCookie } from './utils/cookie.js';
import { userService } from './services/index.js';
export const tRPCContext = initTRPC
    .context()
    .create({});
export const router = tRPCContext.router;
export const publicProcedure = tRPCContext.procedure;
export const authenticatedProcedure = tRPCContext.procedure.use(async (options) => {
    const { ctx } = options;
    const userToken = getAuthenticationCookie(ctx);
    if (!userToken) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Sign in to continue." });
    }
    try {
        const { id } = await userService.verifyAndDecodeUserToken(userToken);
        return options.next({
            ctx: {
                ...ctx,
                user: { id }
            }
        });
    }
    catch {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Your session is invalid or has expired." });
    }
});
