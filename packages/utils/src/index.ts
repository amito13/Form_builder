import {z} from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8),
})

export type CreateUserInput = z.infer<typeof createUserSchema>;