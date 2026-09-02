import { z } from 'zod';
export declare const createFormInputModel: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createFormOutputModel: z.ZodObject<{
    id: z.ZodString;
    formId: z.ZodNumber;
}, z.core.$strip>;
export declare const listFormsOutputModel: z.ZodArray<z.ZodObject<{
    id: z.ZodAny;
    shareToken: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodNullable<z.ZodDate>;
    updatedAt: z.ZodNullable<z.ZodDate>;
}, z.core.$strip>>;
export declare const createFieldInputModel: z.ZodObject<{
    formId: z.ZodNumber;
    label: z.ZodString;
    type: z.ZodEnum<{
        TEXT: "TEXT";
        NUMBER: "NUMBER";
        EMAIL: "EMAIL";
        YES_NO: "YES_NO";
        PASSWORD: "PASSWORD";
    }>;
    description: z.ZodOptional<z.ZodString>;
    placeholder: z.ZodOptional<z.ZodString>;
    isRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const createFieldOutputModel: z.ZodObject<{
    id: z.ZodAny;
    labelKey: z.ZodString;
    index: z.ZodString;
}, z.core.$strip>;
export declare const updateFieldInputModel: z.ZodObject<{
    fieldId: z.ZodNumber;
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
export declare const updateFieldOutputModel: z.ZodObject<{
    id: z.ZodAny;
}, z.core.$strip>;
export declare const deleteFieldInputModel: z.ZodObject<{
    fieldId: z.ZodNumber;
}, z.core.$strip>;
export declare const deleteFieldOutputModel: z.ZodObject<{
    id: z.ZodAny;
}, z.core.$strip>;
export declare const deleteFormInputModel: z.ZodObject<{
    formId: z.ZodNumber;
}, z.core.$strip>;
export declare const deleteFormOutputModel: z.ZodObject<{
    id: z.ZodAny;
}, z.core.$strip>;
export declare const getFieldsInputModel: z.ZodObject<{
    formId: z.ZodNumber;
}, z.core.$strip>;
export declare const getFieldsOutputModel: z.ZodArray<z.ZodObject<{
    id: z.ZodAny;
    label: z.ZodString;
    labelKey: z.ZodString;
    type: z.ZodEnum<{
        TEXT: "TEXT";
        NUMBER: "NUMBER";
        EMAIL: "EMAIL";
        YES_NO: "YES_NO";
        PASSWORD: "PASSWORD";
    }>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    placeholder: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isRequired: z.ZodBoolean;
    index: z.ZodString;
}, z.core.$strip>>;
export declare const getFormInputModel: z.ZodObject<{
    formId: z.ZodNumber;
}, z.core.$strip>;
export declare const getFormByShareTokenInputModel: z.ZodObject<{
    shareToken: z.ZodString;
}, z.core.$strip>;
export declare const getFormOutputModel: z.ZodNullable<z.ZodObject<{
    id: z.ZodAny;
    shareToken: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodNullable<z.ZodDate>;
    updatedAt: z.ZodNullable<z.ZodDate>;
    fields: z.ZodArray<z.ZodObject<{
        id: z.ZodAny;
        label: z.ZodString;
        labelKey: z.ZodString;
        type: z.ZodEnum<{
            TEXT: "TEXT";
            NUMBER: "NUMBER";
            EMAIL: "EMAIL";
            YES_NO: "YES_NO";
            PASSWORD: "PASSWORD";
        }>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        placeholder: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isRequired: z.ZodBoolean;
        index: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>>;
export declare const getPublicFormOutputModel: z.ZodNullable<z.ZodObject<{
    id: z.ZodAny;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodString;
    createdAt: z.ZodNullable<z.ZodDate>;
    updatedAt: z.ZodNullable<z.ZodDate>;
    fields: z.ZodArray<z.ZodObject<{
        id: z.ZodAny;
        label: z.ZodString;
        labelKey: z.ZodString;
        type: z.ZodEnum<{
            TEXT: "TEXT";
            NUMBER: "NUMBER";
            EMAIL: "EMAIL";
            YES_NO: "YES_NO";
            PASSWORD: "PASSWORD";
        }>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        placeholder: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isRequired: z.ZodBoolean;
        index: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>>;
export declare const submitFormInputModel: z.ZodObject<{
    formId: z.ZodNumber;
    values: z.ZodArray<z.ZodObject<{
        formFieldId: z.ZodNumber;
        value: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const submitFormOutputModel: z.ZodObject<{
    id: z.ZodAny;
}, z.core.$strip>;
export declare const getFormSubmissionsInputModel: z.ZodObject<{
    formId: z.ZodNumber;
}, z.core.$strip>;
export declare const getFormSubmissionsOutputModel: z.ZodArray<z.ZodObject<{
    id: z.ZodAny;
    createdAt: z.ZodNullable<z.ZodDate>;
    values: z.ZodNullable<z.ZodArray<z.ZodObject<{
        formFieldId: z.ZodNumber;
        value: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
