CREATE TABLE "form_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_id" serial NOT NULL,
	"values" json NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "salt" text;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;