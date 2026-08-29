import { z } from "zod";
export declare const createUserWithEmailAndPasswordInputModel: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const createUserWithEmailAndPasswordOutputModel: z.ZodObject<{
    id: z.ZodNumber;
}, z.core.$strip>;
export declare const signInUserWithEmailAndPasswordInputModel: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const signInUserWithEmailAndPasswordOutputModel: z.ZodObject<{
    id: z.ZodNumber;
}, z.core.$strip>;
export declare const getLoggedInUserInfoInputModel: z.ZodUndefined;
export declare const signOutInputModel: z.ZodUndefined;
export declare const signOutOutputModel: z.ZodUndefined;
export declare const getLoggedInUserInfoOutputModel: z.ZodObject<{
    id: z.ZodNumber;
    email: z.ZodEmail;
    fullName: z.ZodString;
    profileImageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
