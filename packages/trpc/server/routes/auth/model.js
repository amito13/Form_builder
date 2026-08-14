import { z } from "zod";
export const createUserWithEmailAndPasswordInputModel = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().describe("email address of the user"),
    password: z.string().min(6, "Password must be at least 6 characters long").describe("The password of the user")
});
export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.number().describe("The unique identifier of the user")
});
export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.string().email().describe("email address of the user"),
    password: z.string().describe("The password of the user")
});
export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.number().describe('id of the user created')
});
export const getLoggedInUserInfoInputModel = z.undefined();
export const getLoggedInUserInfoOutputModel = z.object({
    id: z.number().describe('id of the user created'),
    email: z.email().describe('email of the user'),
    fullName: z.string().describe('name of the user'),
    profileImageUrl: z.string().describe('image of the user').optional().nullable(),
});
