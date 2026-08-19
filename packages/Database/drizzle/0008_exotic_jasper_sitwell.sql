ALTER TABLE "form_fields" ALTER COLUMN "form_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "form_fields" ALTER COLUMN "form_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "form_submissions" ALTER COLUMN "form_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "form_submissions" ALTER COLUMN "form_id" DROP NOT NULL;