import { db, eq, asc } from "@repo/database";
import { formFieldsTable, formSubmissionsTable } from "@repo/database";
import { z } from "zod";
import { submitFormInput, getFormSubmissionsInput } from './model.js';
class FormSubmissionService {
    async submitForm(payload) {
        const { formId, values } = await submitFormInput.parseAsync(payload);
        const fields = await db
            .select({ id: formFieldsTable.id, type: formFieldsTable.type, isRequired: formFieldsTable.isRequired })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));
        const fieldsById = new Map(fields.map((field) => [field.id, field]));
        const submittedIds = new Set();
        for (const answer of values) {
            const field = fieldsById.get(answer.formFieldId);
            if (!field)
                throw new Error("A submitted field does not belong to this form");
            if (submittedIds.has(answer.formFieldId))
                throw new Error("Each field can only be submitted once");
            submittedIds.add(answer.formFieldId);
            if (field.isRequired && answer.value.trim() === "") {
                throw new Error(`Required field ${field.id} cannot be empty`);
            }
            if (field.type === "NUMBER" && answer.value !== "" && !Number.isFinite(Number(answer.value))) {
                throw new Error(`\"${field.id}\" must be a number`);
            }
            if (field.type === "EMAIL" && answer.value !== "" && !z.string().email().safeParse(answer.value).success) {
                throw new Error(`\"${field.id}\" must be a valid email address`);
            }
            if (field.type === "YES_NO" && answer.value !== "yes" && answer.value !== "no") {
                throw new Error(`\"${field.id}\" must be yes or no`);
            }
        }
        const missingRequired = fields.find((field) => field.isRequired && !submittedIds.has(field.id));
        if (missingRequired)
            throw new Error(`Required field ${missingRequired.id} is missing`);
        const result = await db
            .insert(formSubmissionsTable)
            .values({ formId, values })
            .returning({ id: formSubmissionsTable.id });
        if (result.length === 0 || !result || !result[0]?.id)
            throw new Error('Failed to submit form');
        return { id: result[0].id };
    }
    async getFormSubmissions(payload) {
        const { formId } = await getFormSubmissionsInput.parseAsync(payload);
        return await db
            .select({
            id: formSubmissionsTable.id,
            values: formSubmissionsTable.values,
            createdAt: formSubmissionsTable.createdAt,
        })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId))
            .orderBy(asc(formSubmissionsTable.createdAt));
    }
}
export default FormSubmissionService;
