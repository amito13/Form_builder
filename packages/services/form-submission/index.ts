import {db,eq,asc} from "@repo/database"
import {formSubmissionsTable} from "@repo/database"
import {
   type SubmitFormInputType, submitFormInput,
    type GetFormSubmissionsInputType, getFormSubmissionsInput
} from './model'


function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
}

class FormFieldService {
    public async submitForm(payload: SubmitFormInputType) {
        const {formId,values} = await submitFormInput.parseAsync(payload)

        const result = await db
            .insert(formSubmissionsTable)
            .values({formId,values})
            .returning({id: formSubmissionsTable.id})
        
        if (result.length === 0||!result || !result[0]?.id) throw new Error('Failed to submit form')
        return {id: result[0].id}
    }

    public async getFormSubmissions(payload: GetFormSubmissionsInputType) {
        const {formId} = await getFormSubmissionsInput.parseAsync(payload)
        return await  db
            .select({
                id: formSubmissionsTable.id,
                values: formSubmissionsTable.values,
                createdAt: formSubmissionsTable.createdAt,
            })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId))
            .orderBy(asc(formSubmissionsTable.createdAt))
    }
}

export const formSubmissionService = new FormFieldService()