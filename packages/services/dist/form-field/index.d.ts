import { type CreateFieldInputType, type UpdateFieldInputType, type GetFieldInputType, type DeleteFieldInputType } from './model.js';
declare class FormFieldService {
    private getNextIndex;
    createField(payload: CreateFieldInputType): Promise<{
        id: number;
        labelKey: string;
        index: string;
    }>;
    updateField(payload: UpdateFieldInputType): Promise<{
        id: number;
    }>;
    getFields(payload: GetFieldInputType): Promise<{
        id: number;
        label: string;
        labelKey: string;
        type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
        description: string | null;
        placeholder: string | null;
        isRequired: boolean;
        index: string;
    }[]>;
    getFieldsById(fieldId: number): Promise<{
        formId: number;
    }>;
    deleteField(payload: DeleteFieldInputType): Promise<{
        id: number;
    }>;
}
export default FormFieldService;
