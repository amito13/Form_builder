import { type SubmitFormInputType, type GetFormSubmissionsInputType } from './model.js';
declare class FormSubmissionService {
    submitForm(payload: SubmitFormInputType): Promise<{
        id: number;
    }>;
    getFormSubmissions(payload: GetFormSubmissionsInputType): Promise<{
        id: number;
        values: import("@repo/database").FormSubmissionValueRow;
        createdAt: Date | null;
    }[]>;
}
export default FormSubmissionService;
