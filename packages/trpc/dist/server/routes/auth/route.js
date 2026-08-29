import { userService } from "../../services/index.js";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc.js";
import { clearAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie.js";
import { generatePath } from "../../utils/path-generator.js";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, getLoggedInUserInfoInputModel, getLoggedInUserInfoOutputModel, signInUserWithEmailAndPasswordInputModel, signInUserWithEmailAndPasswordOutputModel, signOutInputModel, signOutOutputModel } from "./model.js";
const getPath = generatePath("/authentication");
export const authRouter = router({
    createUserWithEmailAndPassword: publicProcedure
        .input(createUserWithEmailAndPasswordInputModel)
        .output(createUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
        const { name, email, password } = input;
        const { id, token } = await userService.createUserWithEmailAndPassword({ name, email, password });
        setAuthenticationCookie(ctx, token);
        return { id };
    }),
    signInUserWithEmailAndPassword: publicProcedure
        .input(signInUserWithEmailAndPasswordInputModel)
        .output(signInUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
        const { email, password } = input;
        const { id, token } = await userService.signInUserWithEmailAndPassword({ email, password });
        setAuthenticationCookie(ctx, token);
        return { id };
    }),
    signOut: authenticatedProcedure
        .input(signOutInputModel)
        .output(signOutOutputModel)
        .mutation(({ ctx }) => {
        clearAuthenticationCookie(ctx);
        return undefined;
    }),
    getLoggedInUserInfo: authenticatedProcedure
        .input(getLoggedInUserInfoInputModel)
        .output(getLoggedInUserInfoOutputModel)
        .query(async ({ ctx }) => {
        const { id, email, name, } = await userService.getUserInfoById(ctx.user.id);
        return {
            id,
            email,
            fullName: name,
        };
    })
});
