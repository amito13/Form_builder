ALTER TABLE "form_fields" ALTER COLUMN "form_id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "form_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "created_by" SET DATA TYPE integer;