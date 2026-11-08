CREATE TABLE "user_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"key_prefix" text NOT NULL,
	"hashed_key" text NOT NULL,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	"rate_limit_per_minute" integer DEFAULT 60 NOT NULL,
	CONSTRAINT "user_api_keys_hashed_key_unique" UNIQUE("hashed_key")
);
--> statement-breakpoint
ALTER TABLE "chat_folders" ADD COLUMN "instructions" text;--> statement-breakpoint
ALTER TABLE "user_api_keys" ADD CONSTRAINT "user_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_api_keys_user_id_idx" ON "user_api_keys" USING btree ("user_id");