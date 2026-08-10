import { z } from "zod";

export const createFormInput = z.object({
   title: z.string().min(1).max(55).describe("Form Title"),
   description: z.string().max(300).optional().describe("Form Description"),
   createdBy: z.number().int().describe("User ID"),
});
export type CreateFormInputType = z.infer<typeof createFormInput>;
// export interface CreateFormInputType {
//     title: string;
//     description?: string;
//     createdBy: number;
// }

export const listFormByUserIdInput = z.object({
    userId: z.number().int().describe("User ID"),
});
export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;
// export interface ListFormByUserIdInputType {
//     userId: number;
// }

export const getFormByIdInput = z.object({
    formId: z.number().int().describe("Form ID"),
});


export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;
// export interface GetFormByIdInputType {
//     formId: string;
// }