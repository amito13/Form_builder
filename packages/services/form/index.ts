import {asc, db,eq} from "@repo/database";
// import { eq } from "drizzle-orm";
import {formsTable,formFieldsTable} from "@repo/database"
import { CreateFormInputType,createFormInput ,GetFormByIdInputType,ListFormByUserIdInputType,listFormByUserIdInput, getFormByIdInput} from "./model";

class FormService{

    public async createForm(payload: CreateFormInputType) {

        const  {title,description,createdBy} = await createFormInput.parseAsync(payload);

        const result = await db.insert(formsTable).values({
            title,
            description,
            createdBy
        }).returning({
            id: formsTable.id,
        })

        if(!result || result.length === 0 || !result[0].id) throw new Error("Failed to create form");
        return {id: result[0].id};
    }
    public async listFormsByUserId(payload: ListFormByUserIdInputType) {
        const { userId } = await listFormByUserIdInput.parseAsync(payload);
        
        const forms = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            createdBy: formsTable.createdBy,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt
        }).from(formsTable).where(eq(formsTable.createdBy, userId));
        return forms;
    }
    public async getFormById(payload: GetFormByIdInputType) {
        const { formId } = await getFormByIdInput.parseAsync(payload);

        const rows = await db.select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            createdBy: formsTable.createdBy,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt,
            field:{
                id: formFieldsTable.id,
                label: formFieldsTable.label,
                labelKey: formFieldsTable.labelKey,
                type: formFieldsTable.type,
                description: formFieldsTable.description,
                placeholder: formFieldsTable.placeholder,
                isRequired: formFieldsTable.isRequired,
                index:formFieldsTable.index,
            }
        }) .from(formsTable)
            .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
            .where(eq(formsTable.id, formId))
            .orderBy(asc(formFieldsTable.index))

            if (rows.length === 0) return null;
            
            const {id,title,description,createdBy,createdAt,updatedAt} = rows[0];
            const fields = rows.map(row => row.field).filter(field => field !== null);

            return {
                id,
                title,
                description,
                createdBy,
                createdAt,
                updatedAt,
                fields
            }

    }
}
export default FormService;