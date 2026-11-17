CREATE TABLE "v1_media_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"api_key_id" uuid,
	"kind" text NOT NULL,
	"model" text NOT NULL,
	"prompt" text NOT NULL,
	"params" jsonb NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"result_url" text,
	"duration_seconds" double precision,
	"credits_charged" double precision,
	"error_code" text,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "v1_media_jobs" ADD CONSTRAINT "v1_media_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "v1_media_jobs" ADD CONSTRAINT "v1_media_jobs_api_key_id_user_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."user_api_keys"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "v1_media_jobs_user_created_idx" ON "v1_media_jobs" USING btree ("user_id","created_at");