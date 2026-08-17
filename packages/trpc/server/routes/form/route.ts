import {
    createFormInputModel, createFormOutputModel, listFormsOutputModel,
    createFieldInputModel, createFieldOutputModel,
    updateFieldInputModel, updateFieldOutputModel,
    deleteFieldInputModel, deleteFieldOutputModel,
    getFieldsInputModel, getFieldsOutputModel,
    getFormInputModel, getFormOutputModel,
    submitFormInputModel, submitFormOutputModel,
    getFormSubmissionsInputModel, getFormSubmissionsOutputModel,
} from "./model";
import {z}  from "zod";
import { TRPCError } from "@trpc/server";
import {authenticatedProcedure, router} from "../../trpc";
import {generatePath} from "../../utils/path-generator";
import {formFieldService, formService,formSubmissionService} from "../../services/index";

const getPath = generatePath("/form");

async function assertFormOwner(formId: number, userId: number) {
    const form = await formService.getFormById({ formId });
    if (!form) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Form not found." });
    }
    if (form.createdBy !== userId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not have access to this form." });
    }
    return form;
}

export const formRouter = router({
    createForm: authenticatedProcedure
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({input, ctx}) => {
            const {title, description} = input;
            const {id} = await formService.createForm({
                title,
                description,
                createdBy: ctx.user.id,
            })
            return {id}
        }),
    listForms: authenticatedProcedure
        .input(z.undefined())
        .output(listFormsOutputModel)
        .query(async ({ctx}) => {
            const forms = await formService.listFormsByUserId({ userId: ctx.user.id });//check if user is authenticated and get the forms created by the user
            return forms
        }),
    
    getFields: authenticatedProcedure
        .input(getFieldsInputModel)
        .output(getFieldsOutputModel)
        .query(async ({input, ctx}) => {
            await assertFormOwner(input.formId, ctx.user.id)
            return formFieldService.getFields({formId: input.formId})
        }),
    createField: authenticatedProcedure
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({input, ctx}) => {
            await assertFormOwner(input.formId, ctx.user.id)
            return formFieldService.createField(input)
        }),
    updateField: authenticatedProcedure
        .input(updateFieldInputModel)
        .output(updateFieldOutputModel)
        .mutation(async ({input, ctx}) => {
            const fields = await formFieldService.getFieldsById(input.fieldId)
            await assertFormOwner(fields.formId, ctx.user.id)
            return formFieldService.updateField(input)
        }),
    deleteField: authenticatedProcedure
        .input(deleteFieldInputModel)
        .output(deleteFieldOutputModel)
        .mutation(async ({input, ctx}) => {
            const fields = await formFieldService.getFieldsById(input.fieldId)
            await assertFormOwner(fields.formId, ctx.user.id)
            return formFieldService.deleteField(input)
        }),
    getForm: authenticatedProcedure
        .input(getFormInputModel)
        .output(getFormOutputModel)
        .query(async ({input, ctx}) => {
            return assertFormOwner(input.formId, ctx.user.id)
        }),
    submitForm: authenticatedProcedure
        .input(submitFormInputModel)
        .output(submitFormOutputModel)
        .mutation(async ({input, ctx}) => {
            await assertFormOwner(input.formId, ctx.user.id)
            const result = await formSubmissionService.submitForm(input)
            return result
        }),
    getFormSubmissions: authenticatedProcedure
        .input(getFormSubmissionsInputModel)
        .output(getFormSubmissionsOutputModel)
        .query(async ({input, ctx}) => {
            await assertFormOwner(input.formId, ctx.user.id)
            return formSubmissionService.getFormSubmissions({formId: input.formId})
        })
    
})
