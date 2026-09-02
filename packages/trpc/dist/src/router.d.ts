export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../server/context.js").TRPCContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    health: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            message: string;
        };
        meta: object;
    }>;
    auth: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../server/context.js").TRPCContext;
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
    form: import("@trpc/server").TRPCBuiltRouter<{
        ctx: import("../server/context.js").TRPCContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        createForm: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                title: string;
                description?: string | undefined;
            };
            output: {
                id: string;
                formId: number;
            };
            meta: object;
        }>;
        listForms: import("@trpc/server").TRPCQueryProcedure<{
            input: undefined;
            output: {
                id: any;
                shareToken: string;
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                description?: string | null | undefined;
            }[];
            meta: object;
        }>;
        getFields: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                formId: number;
            };
            output: {
                id: any;
                label: string;
                labelKey: string;
                type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
                isRequired: boolean;
                index: string;
                description?: string | null | undefined;
                placeholder?: string | null | undefined;
            }[];
            meta: object;
        }>;
        createField: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                formId: number;
                label: string;
                type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
                description?: string | undefined;
                placeholder?: string | undefined;
                isRequired?: boolean | undefined;
            };
            output: {
                id: any;
                labelKey: string;
                index: string;
            };
            meta: object;
        }>;
        updateField: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                fieldId: number;
                label?: string | undefined;
                type?: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD" | undefined;
                description?: string | undefined;
                placeholder?: string | undefined;
                isRequired?: boolean | undefined;
            };
            output: {
                id: any;
            };
            meta: object;
        }>;
        deleteField: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                fieldId: number;
            };
            output: {
                id: any;
            };
            meta: object;
        }>;
        deleteForm: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                formId: number;
            };
            output: {
                id: any;
            };
            meta: object;
        }>;
        getForm: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                formId: number;
            };
            output: {
                id: any;
                shareToken: string;
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                fields: {
                    id: any;
                    label: string;
                    labelKey: string;
                    type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
                    isRequired: boolean;
                    index: string;
                    description?: string | null | undefined;
                    placeholder?: string | null | undefined;
                }[];
                description?: string | null | undefined;
            } | null;
            meta: object;
        }>;
        submitForm: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                formId: number;
                values: {
                    formFieldId: number;
                    value: string;
                }[];
            };
            output: {
                id: any;
            };
            meta: object;
        }>;
        getFormSubmissions: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                formId: number;
            };
            output: {
                id: any;
                createdAt: Date | null;
                values: {
                    formFieldId: number;
                    value: string;
                }[] | null;
            }[];
            meta: object;
        }>;
        getFormByShareToken: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                shareToken: string;
            };
            output: {
                id: any;
                shareToken: string;
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                fields: {
                    id: any;
                    label: string;
                    labelKey: string;
                    type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
                    isRequired: boolean;
                    index: string;
                    description?: string | null | undefined;
                    placeholder?: string | null | undefined;
                }[];
                description?: string | null | undefined;
            } | null;
            meta: object;
        }>;
        getPublicForm: import("@trpc/server").TRPCQueryProcedure<{
            input: {
                shareToken: string;
            };
            output: {
                id: any;
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                fields: {
                    id: any;
                    label: string;
                    labelKey: string;
                    type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
                    isRequired: boolean;
                    index: string;
                    description?: string | null | undefined;
                    placeholder?: string | null | undefined;
                }[];
                description?: string | null | undefined;
            } | null;
            meta: object;
        }>;
        submitPublicForm: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                formId: number;
                values: {
                    formFieldId: number;
                    value: string;
                }[];
            };
            output: {
                id: any;
            };
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
