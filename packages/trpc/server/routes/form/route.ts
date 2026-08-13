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
import {authenticatedProcedure, publicProcedure, router} from "../../trpc";
import {generatePath} from "../../utils/path-generator";
import {formFieldService, formService} from "../../services/index";

const getPath = generatePath("/form");

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
        .query(async ({input}) => {
            return formFieldService.getFields({formId: input.formId})
        }),
    createField: authenticatedProcedure
        .input(createFieldInputModel)
        .output(createFieldOutputModel)
        .mutation(async ({input}) => {
            return formFieldService.createField(input)
        })
    
    
})
