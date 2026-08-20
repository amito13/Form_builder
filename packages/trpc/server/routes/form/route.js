import { createFormInputModel, createFormOutputModel, listFormsOutputModel, createFieldInputModel, createFieldOutputModel, updateFieldInputModel, updateFieldOutputModel, deleteFieldInputModel, deleteFieldOutputModel, getFieldsInputModel, getFieldsOutputModel, getFormInputModel, getFormOutputModel, getFormByShareTokenInputModel, getPublicFormOutputModel, submitFormInputModel, submitFormOutputModel, getFormSubmissionsInputModel, getFormSubmissionsOutputModel, } from "./model";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formFieldService, formService, formSubmissionService } from "../../services/index";
const getPath = generatePath("/form");
async function assertFormOwner(formId, userId) {
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
        .mutation(async ({ input, ctx }) => {
        const { title, description } = input;
        const { id, shareToken } = await formService.createForm({
            title,
            description,
            createdBy: ctx.user.id,
        });
        return { id: shareToken };
    }),
    listForms: authenticatedProcedure
        .input(z.undefined())
        .output(listFormsOutputModel)
        .query(async ({ ctx }) => {
        try {
            const forms = await formService.listFormsByUserId({ userId: ctx.user.id });
            return forms;
        }
        catch (error) {
            console.error("[FormRouter.listForms] Error fetching forms for user", ctx.user.id, ":", error);
            throw error;
        }
    }),
    getFields: authenticatedProcedure
        .input(getFieldsInputModel)
        .output(getFieldsOutputModel)
        .query(async ({ input, ctx }) => {
        await assertFormOwner(input.formId, ctx.user.id);
        return formFieldService.getFields({ formId: input.formId });
    }),
    createField: authenticatedProcedure
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({ input, ctx }) => {
        await assertFormOwner(input.formId, ctx.user.id);
        return formFieldService.createField(input);
    }),
    updateField: authenticatedProcedure
        .input(updateFieldInputModel)
        .output(updateFieldOutputModel)
        .mutation(async ({ input, ctx }) => {
        const fields = await formFieldService.getFieldsById(input.fieldId);
        await assertFormOwner(fields.formId, ctx.user.id);
        return formFieldService.updateField(input);
    }),
    deleteField: authenticatedProcedure
        .input(deleteFieldInputModel)
        .output(deleteFieldOutputModel)
        .mutation(async ({ input, ctx }) => {
        const fields = await formFieldService.getFieldsById(input.fieldId);
        await assertFormOwner(fields.formId, ctx.user.id);
        return formFieldService.deleteField(input);
    }),
    getForm: authenticatedProcedure
        .input(getFormInputModel)
        .output(getFormOutputModel)
        .query(async ({ input, ctx }) => {
        return assertFormOwner(input.formId, ctx.user.id);
    }),
    submitForm: authenticatedProcedure
        .input(submitFormInputModel)
        .output(submitFormOutputModel)
        .mutation(async ({ input, ctx }) => {
        await assertFormOwner(input.formId, ctx.user.id);
        const result = await formSubmissionService.submitForm(input);
        return result;
    }),
    getFormSubmissions: authenticatedProcedure
        .input(getFormSubmissionsInputModel)
        .output(getFormSubmissionsOutputModel)
        .query(async ({ input, ctx }) => {
        await assertFormOwner(input.formId, ctx.user.id);
        return formSubmissionService.getFormSubmissions({ formId: input.formId });
    }),
    getFormByShareToken: authenticatedProcedure
        .input(getFormByShareTokenInputModel)
        .output(getFormOutputModel)
        .query(async ({ input, ctx }) => {
        const form = await formService.getFormByShareToken(input.shareToken);
        if (!form) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Form not found." });
        }
        if (form.createdBy !== ctx.user.id) {
            throw new TRPCError({ code: "FORBIDDEN", message: "You do not have access to this form." });
        }
        return form;
    }),
    getPublicForm: publicProcedure
        .input(getFormByShareTokenInputModel)
        .output(getPublicFormOutputModel)
        .query(async ({ input }) => {
        const form = await formService.getFormByShareToken(input.shareToken);
        if (!form) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Form not found." });
        }
        return form;
    }),
    submitPublicForm: publicProcedure
        .input(submitFormInputModel)
        .output(submitFormOutputModel)
        .mutation(async ({ input }) => {
        const result = await formSubmissionService.submitForm(input);
        return result;
    }),
});
