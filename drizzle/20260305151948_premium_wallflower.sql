ALTER TABLE "user_remote_connections" ALTER COLUMN "token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_remote_connections" ADD COLUMN "local_url" text;