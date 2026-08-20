import {z} from 'zod';

export const createFormInputModel = z.object({
    title: z.string().trim().min(1).max(55).describe('Title of the form'),
    description: z.string().trim().max(300).optional().describe('Description of the form'),
})

export const createFormOutputModel = z.object({
    id: z.string().uuid().describe('Share token of the created form'),
})

export const listFormsOutputModel = z.array(
    z.object({
        id: z.any().describe('ID of the form'),
        shareToken: z.string().uuid().describe('Public-safe form token'),
        title: z.string().describe('Title of the form'),
        description: z.string().nullable().optional().describe('Description of the form'),
        createdAt: z.date().nullable().describe('Creation timestamp'),
        updatedAt: z.date().nullable().describe('Last updated timestamp'),
    })
)

const fieldTypeEnum = z.enum(['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD'])

const formFieldObject = z.object({
    id: z.any().describe('ID of the field'),
    label: z.string().describe('Display label'),
    labelKey: z.string().describe('Immutable slug key'),
    type: fieldTypeEnum,
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean(),
    index: z.string().describe('Fractional index for ordering'),
})
export const createFieldInputModel = z.object({
    formId: z.number().int().describe('ID of the form'),
    label: z.string().trim().min(1).max(100).describe('Display label for the field'),
    type: fieldTypeEnum.describe('Type of the field'),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional().default(false),
})

export const createFieldOutputModel = z.object({
    id: z.any(),
    labelKey: z.string(),
    index: z.string(),
})

export const updateFieldInputModel = z.object({
    fieldId: z.number().int().describe('ID of the field to update'),
    label: z.string().trim().min(1).max(100).optional(),
    type: fieldTypeEnum.optional(),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    isRequired: z.boolean().optional(),
})

export const updateFieldOutputModel = z.object({
    id: z.any(),
})

export const deleteFieldInputModel = z.object({
    fieldId: z.number().int().describe('ID of the field to delete'),
})

export const deleteFieldOutputModel = z.object({
    id: z.any(),
})

export const getFieldsInputModel = z.object({
    formId: z.number().int().describe('ID of the form'),
})

export const getFieldsOutputModel = z.array(formFieldObject)

export const getFormInputModel = z.object({
    formId: z.number().int().describe('ID of the form'),
})

export const getFormByShareTokenInputModel = z.object({
    shareToken: z.string().uuid(),
})

const formOutputModel = z.object({
    id: z.any(),
    shareToken: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable().optional(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    fields: z.array(formFieldObject),
})

export const getFormOutputModel = formOutputModel.nullable()

export const getPublicFormOutputModel = formOutputModel.omit({ shareToken: true }).nullable()

export const submitFormInputModel = z.object({
    formId: z.number().int().describe('ID of the form being submitted'),
    values: z.array(z.object({
        formFieldId: z.number().int().describe('ID of the form field'),
        value: z.string().describe('Answer value for this field'),
    })).min(1),
})

export const submitFormOutputModel = z.object({
    id: z.any().describe('ID of the created submission'),
})

export const getFormSubmissionsInputModel = z.object({
    formId: z.number().int().describe('ID of the form'),
})

export const getFormSubmissionsOutputModel = z.array(
    z.object({
        id: z.any(),
        createdAt: z.date().nullable(),
        values: z.array(z.object({
            formFieldId: z.number().int(),
            value: z.string(),
        })).nullable(),
    })
)
