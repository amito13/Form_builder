import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, getLoggedInUserInfoInputModel, getLoggedInUserInfoOutputModel, signInUserWithEmailAndPasswordInputModel, signInUserWithEmailAndPasswordOutputModel } from "./model";
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
