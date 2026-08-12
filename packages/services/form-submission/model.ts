import {z} from "zod";

export const submitFormInput = z.object({
    formId: z.number().int().describe("Form ID"),
    values: z.array(z.object({
        formFieldId: z.string().describe("Form Field ID"),
        value: z.string().describe("Field Value")
    })).min(1).describe("Field Values")
})

export type SubmitFormInputType = z.infer<typeof submitFormInput>;

export const getFormSubmissionsInput = z.object({
    formId: z.number().int().describe("Form ID"),
})
export type GetFormSubmissionsInputType = z.infer<typeof getFormSubmissionsInput>;