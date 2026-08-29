export declare const authRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../../context.js").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    createUserWithEmailAndPassword: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            email: string;
            password: string;
        };
        output: {
            id: number;
        };
        meta: object;
    }>;
    signInUserWithEmailAndPassword: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            email: string;
            password: string;
        };
        output: {
            id: number;
        };
        meta: object;
    }>;
    signOut: import("@trpc/server").TRPCMutationProcedure<{
        input: undefined;
        output: undefined;
        meta: object;
    }>;
    getLoggedInUserInfo: import("@trpc/server").TRPCQueryProcedure<{
        input: undefined;
        output: {
            id: number;
            email: string;
            fullName: string;
            profileImageUrl?: string | null | undefined;
        };
        meta: object;
    }>;
}>>;
