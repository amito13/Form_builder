import { z } from 'zod';
export const createUserWithEmailAndPasswordInput = z.object({
    name: z.string().describe('Full name of the user'),
    email: z.email().describe('email address of the user'),
    password: z.string().describe('password of the user')
});
export const generateUserTokenPayload = z.object({
    id: z.number().int().positive().describe('numeric user id'),
});
export const signInUserWithEmailAndPasswordInput = z.object({
    email: z.email().describe('email of the user'),
    password: z.string().describe('password of the user')
});
