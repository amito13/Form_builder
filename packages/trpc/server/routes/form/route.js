import { createFormInputModel, createFormOutputModel, listFormsOutputModel, createFieldInputModel, createFieldOutputModel, updateFieldInputModel, updateFieldOutputModel, deleteFieldInputModel, deleteFieldOutputModel, getFieldsInputModel, getFieldsOutputModel, getFormInputModel, getFormOutputModel, submitFormInputModel, submitFormOutputModel, getFormSubmissionsInputModel, getFormSubmissionsOutputModel, } from "./model";
import { z } from "zod";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formFieldService, formService, formSubmissionService } from "../../services/index";
const getPath = generatePath("/form");
export const formRouter = router({
    createForm: authenticatedProcedure
        .input(createFormInputModel)
        .output(createFormOutputModel)
        .mutation(async ({ input, ctx }) => {
        const { title, description } = input;
        const { id } = await formService.createForm({
            title,
            description,
            createdBy: ctx.user.id,
        });
        return { id };
    }),
    listForms: authenticatedProcedure
        .input(z.undefined())
        .output(listFormsOutputModel)
        .query(async ({ ctx }) => {
        const forms = await formService.listFormsByUserId({ userId: ctx.user.id }); //check if user is authenticated and get the forms created by the user
        return forms;
    }),
    getFields: authenticatedProcedure
        .input(getFieldsInputModel)
        .output(getFieldsOutputModel)
        .query(async ({ input }) => {
        return formFieldService.getFields({ formId: input.formId });
    }),
    createField: authenticatedProcedure
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({ input }) => {
        return formFieldService.createField(input);
    }),
    updateField: authenticatedProcedure
        .input(updateFieldInputModel)
        .output(updateFieldOutputModel)
        .mutation(async ({ input }) => {
        return formFieldService.updateField(input);
    }),
    deleteField: authenticatedProcedure
        .input(deleteFieldInputModel)
        .output(deleteFieldOutputModel)
        .mutation(async ({ input }) => {
        return formFieldService.deleteField(input);
    }),
    getForm: authenticatedProcedure
        .input(getFormInputModel)
        .output(getFormOutputModel)
        .query(async ({ input }) => {
        return formService.getFormById({ formId: input.formId });
    }),
    submitForm: publicProcedure
        .input(submitFormInputModel)
        .output(submitFormOutputModel)
        .mutation(async ({ input }) => {
        const result = await formSubmissionService.submitForm(input);
        return { ...result, id: String(result.id) }; //attenttion needed
    }),
    getFormSubmissions: authenticatedProcedure
        .input(getFormSubmissionsInputModel)
        .output(getFormSubmissionsOutputModel)
        .query(async ({ input }) => {
        return formSubmissionService.getFormSubmissions({ formId: input.formId });
    })
});
