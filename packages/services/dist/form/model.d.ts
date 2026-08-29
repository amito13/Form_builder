import { z } from "zod";
export declare const createFormInput: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodAny;
}, z.core.$strip>;
export type CreateFormInputType = z.infer<typeof createFormInput>;
export declare const listFormByUserIdInput: z.ZodObject<{
    userId: z.ZodAny;
}, z.core.$strip>;
export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;
export declare const getFormByIdInput: z.ZodObject<{
    formId: z.ZodAny;
}, z.core.$strip>;
export declare const deleteFormByIdInput: z.ZodObject<{
    formId: z.ZodAny;
}, z.core.$strip>;
export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;
export type DeleteFormByIdInputType = z.infer<typeof deleteFormByIdInput>;
