ALTER TABLE "forms" ADD COLUMN "share_token" uuid NOT NULL UNIQUE DEFAULT gen_random_uuid();
