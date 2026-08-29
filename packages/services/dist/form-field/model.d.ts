import { z } from "zod";
export declare const createFieldInput: z.ZodObject<{
    label: z.ZodString;
    type: z.ZodEnum<{
        TEXT: "TEXT";
        NUMBER: "NUMBER";
        EMAIL: "EMAIL";
        YES_NO: "YES_NO";
        PASSWORD: "PASSWORD";
    }>;
    formId: z.ZodAny;
    description: z.ZodOptional<z.ZodString>;
    placeholder: z.ZodOptional<z.ZodString>;
    isRequired: z.ZodBoolean;
}, z.core.$strip>;
export type CreateFieldInputType = z.infer<typeof createFieldInput>;
export declare const updateFieldInput: z.ZodObject<{
    fieldId: z.ZodAny;
    label: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<{
        TEXT: "TEXT";
        NUMBER: "NUMBER";
        EMAIL: "EMAIL";
        YES_NO: "YES_NO";
        PASSWORD: "PASSWORD";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    placeholder: z.ZodOptional<z.ZodString>;
    isRequired: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;
export declare const getFieldInput: z.ZodObject<{
    formId: z.ZodAny;
}, z.core.$strip>;
export type GetFieldInputType = z.infer<typeof getFieldInput>;
export declare const deleteFieldInput: z.ZodObject<{
    fieldId: z.ZodNumber;
}, z.core.$strip>;
export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;
