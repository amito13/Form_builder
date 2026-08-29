import {z} from "zod";
import { createFormInput } from "../form/model.js";

const fieldTypeEnum = z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD'])

export const createFieldInput = z.object({
    label: z.string().min(1).max(55).describe("Field Label"),
    type: fieldTypeEnum.describe("Field Type"),
    formId: z.any().describe("Form ID"),
    description: z.string().max(300).optional().describe("Field Description"),
    placeholder: z.string().max(100).optional().describe("Field Placeholder"),
    isRequired: z.boolean().describe("Is Field Required")
})

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const updateFieldInput = z.object({
    fieldId: z.any().describe("Field ID"),
    label: z.string().min(1).max(55).optional().describe("Field Label"),
    type: fieldTypeEnum.optional().describe("Field Type"),
    description: z.string().max(300).optional().describe("Field Description"),
    placeholder: z.string().max(100).optional().describe("Field Placeholder"),
    isRequired: z.boolean().optional().describe("Is Field Required")
})

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const getFieldInput = z.object({
    formId: z.any().describe("Form ID"),
})
export type GetFieldInputType = z.infer<typeof getFieldInput>;

export const deleteFieldInput = z.object({
    fieldId: z.number().int().describe("Field ID"),
})
export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;
