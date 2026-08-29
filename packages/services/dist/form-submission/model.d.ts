import { z } from "zod";
export declare const submitFormInput: z.ZodObject<{
    formId: z.ZodAny;
    values: z.ZodArray<z.ZodObject<{
        formFieldId: z.ZodNumber;
        value: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SubmitFormInputType = z.infer<typeof submitFormInput>;
export declare const getFormSubmissionsInput: z.ZodObject<{
    formId: z.ZodAny;
}, z.core.$strip>;
export type GetFormSubmissionsInputType = z.infer<typeof getFormSubmissionsInput>;
