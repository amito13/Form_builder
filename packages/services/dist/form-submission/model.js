import { z } from "zod";
export const submitFormInput = z.object({
    formId: z.any().describe("Form ID"),
    values: z.array(z.object({
        formFieldId: z.number().int().describe("Form Field ID"),
        value: z.string().describe("Field Value")
    })).min(1).describe("Field Values")
});
export const getFormSubmissionsInput = z.object({
    formId: z.any().describe("Form ID"),
});
