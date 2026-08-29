import { z } from 'zod';
export declare const createUserWithEmailAndPasswordInput: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>;
export declare const generateUserTokenPayload: z.ZodObject<{
    id: z.ZodNumber;
}, z.core.$strip>;
export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;
export declare const signInUserWithEmailAndPasswordInput: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type SignInUserWithEmailAndPasswordInputType = z.infer<typeof signInUserWithEmailAndPasswordInput>;
