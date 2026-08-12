import { pgTable, serial, timestamp, varchar, uuid, text, boolean, numeric, pgEnum, integer, json } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull().unique(),
    salt: text('salt'),
    password: varchar("password", { length: 256 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});
export const fieldTypeEnum = pgEnum('field_type_enum', ['TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD']);
export const formsTable = pgTable("forms", {
    id: serial("id").primaryKey(),
    title: varchar('title', { length: 55 }).notNull(),
    description: varchar('description', { length: 300 }),
    createdBy: integer('created_by').references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
export const formFieldsTable = pgTable("form_fields", {
    id: serial("id").primaryKey(),
    label: varchar('label', { length: 100 }).notNull(),
    labelKey: varchar('label_key', { length: 100 }).notNull(),
    description: text('description'),
    placeholder: text('placeholder'),
    isRequired: boolean('is_required').default(false).notNull(),
    index: numeric('index', { scale: 2 }).notNull(),
    type: fieldTypeEnum('type').notNull(),
    formId: serial('form_id').references(() => formsTable.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
export const formSubmissionsTable = pgTable("form_submissions", {
    id: serial("id").primaryKey(),
    formId: serial('form_id').references(() => formsTable.id),
    values: json('values').$type().notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
