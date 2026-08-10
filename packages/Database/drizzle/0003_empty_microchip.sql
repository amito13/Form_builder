ALTER TABLE "form_fields" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;