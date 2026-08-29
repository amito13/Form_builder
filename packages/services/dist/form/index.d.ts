import { CreateFormInputType, DeleteFormByIdInputType, GetFormByIdInputType, ListFormByUserIdInputType } from "./model.js";
declare class FormService {
    createForm(payload: CreateFormInputType): Promise<{
        id: number;
        shareToken: string;
    }>;
    listFormsByUserId(payload: ListFormByUserIdInputType): Promise<{
        id: number;
        shareToken: string;
        title: string;
        description: string | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
    getFormById(payload: GetFormByIdInputType): Promise<{
        id: number;
        shareToken: string;
        title: string;
        description: string | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        fields: {
            id: number;
            label: string;
            labelKey: string;
            type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
            description: string | null;
            placeholder: string | null;
            isRequired: boolean;
            index: string;
        }[];
    } | null>;
    getFormByShareToken(shareToken: string): Promise<{
        id: number;
        shareToken: string;
        title: string;
        description: string | null;
        createdBy: number | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        fields: {
            id: number;
            label: string;
            labelKey: string;
            type: "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD";
            description: string | null;
            placeholder: string | null;
            isRequired: boolean;
            index: string;
        }[];
    } | null>;
    deleteFormById(payload: DeleteFormByIdInputType): Promise<{
        id: number;
    }>;
}
export default FormService;
