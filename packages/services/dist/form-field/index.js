import { db, eq, asc, max } from '@repo/database';
import { formFieldsTable } from '@repo/database';
import { createFieldInput, updateFieldInput, getFieldInput, deleteFieldInput } from './model.js';
function toLabelKey(label) {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
}
class FormFieldService {
    async getNextIndex(formId) {
        const result = await db
            .select({ maxIndex: max(formFieldsTable.index) })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId));
        const current = result[0]?.maxIndex;
        const next = current ? parseFloat(current) + 1 : 1;
        return next.toFixed(2);
    }
    async createField(payload) {
        const { label, type, formId, description, placeholder, isRequired } = await createFieldInput.parseAsync(payload);
        const labelKey = toLabelKey(label);
        const index = await this.getNextIndex(formId);
        const result = await db
            .insert(formFieldsTable)
            .values({ label, labelKey, type, formId, description, placeholder, isRequired, index })
            .returning({ id: formFieldsTable.id });
        if (result.length === 0 || !result || !result[0]?.id) {
            throw new Error('Failed to create field');
        }
        return { id: result[0].id, labelKey, index };
    }
    async updateField(payload) {
        const { fieldId, ...updates } = await updateFieldInput.parseAsync(payload);
        const patch = {};
        if (updates.label !== undefined)
            patch.label = updates.label;
        if (updates.type !== undefined)
            patch.type = updates.type;
        if ('description' in updates)
            patch.description = updates.description;
        if ('placeholder' in updates)
            patch.placeholder = updates.placeholder;
        if ('isRequired' in updates)
            patch.isRequired = updates.isRequired;
        if (Object.keys(patch).length === 0)
            throw new Error('No valid fields to update');
        const result = await db
            .update(formFieldsTable)
            .set(patch)
            .where(eq(formFieldsTable.id, fieldId))
            .returning({ id: formFieldsTable.id });
        if (result.length === 0 || !result)
            throw new Error(`Failed to update field with ID ${fieldId}`);
        return { id: result[0].id };
    }
    async getFields(payload) {
        const { formId } = await getFieldInput.parseAsync(payload);
        return db
            .select({
            id: formFieldsTable.id,
            label: formFieldsTable.label,
            labelKey: formFieldsTable.labelKey,
            type: formFieldsTable.type,
            description: formFieldsTable.description,
            placeholder: formFieldsTable.placeholder,
            isRequired: formFieldsTable.isRequired,
            index: formFieldsTable.index
        })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(asc(formFieldsTable.index));
    }
    async getFieldsById(fieldId) {
        const result = await db
            .select({ formId: formFieldsTable.formId })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.id, fieldId));
        const field = result[0];
        if (!field?.formId)
            throw new Error(`Field with ID ${fieldId} was not found`);
        return { formId: field.formId };
    }
    async deleteField(payload) {
        const { fieldId } = await deleteFieldInput.parseAsync(payload);
        const result = await db
            .delete(formFieldsTable)
            .where(eq(formFieldsTable.id, fieldId))
            .returning({ id: formFieldsTable.id });
        if (result.length === 0 || !result)
            throw new Error(`Failed to delete field with ID ${fieldId}`);
        return { id: result[0].id };
    }
}
export default FormFieldService;
