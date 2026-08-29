export declare const tRPCContext: import("@trpc/server").TRPCRootObject<import("./context.js").TRPCContext, object, {}, {
    ctx: import("./context.js").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: import("./context.js").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context.js").TRPCContext, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const authenticatedProcedure: import("@trpc/server").TRPCProcedureBuilder<import("./context.js").TRPCContext, object, {
    user: {
        id: number;
    };
    getCookie: (name: string) => any;
    createCookie: (name: string, value: string, opts?: import("express").CookieOptions) => void;
    clearCookie: (name: string) => void;
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
