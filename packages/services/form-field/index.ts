import {db,eq,asc,max} from '@repo/database';
import {formFieldsTable} from '@repo/database';

import {
    type CreateFieldInputType, createFieldInput,
    type UpdateFieldInputType, updateFieldInput,
    type GetFieldInputType, getFieldInput,
    type DeleteFieldInputType, deleteFieldInput 
} from './model';

function toLabelKey(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
}

class FormFieldService {
    private async getNextIndex(formId: number): Promise<string> {
        const result = await db
            .select({ maxIndex: max(formFieldsTable.index) })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
        
        const current = result[0]?.maxIndex
        const next = current ? parseFloat(current) + 1 : 1
        return next.toFixed(2)
    }
}