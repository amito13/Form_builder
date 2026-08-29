import { z } from "zod";
export const createFormInput = z.object({
    title: z.string().min(1).max(55).describe("Form Title"),
    description: z.string().max(300).optional().describe("Form Description"),
    createdBy: z.any().describe("User ID"),
});
// export interface CreateFormInputType {
//     title: string;
//     description?: string;
//     createdBy: number;
// }
export const listFormByUserIdInput = z.object({
    userId: z.any().describe("User ID"),
});
// export interface ListFormByUserIdInputType {
//     userId: number;
// }
export const getFormByIdInput = z.object({
    formId: z.any().describe("Form ID"),
});
export const deleteFormByIdInput = z.object({
    formId: z.any().describe("Form ID"),
});
// export interface GetFormByIdInputType {
//     formId: string;
// }
