CREATE TABLE "thread_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"message_id" uuid,
	"reporter_key" text NOT NULL,
	"reporter_user_id" uuid,
	"reporter_lead_id" uuid,
	"ip_hash" text,
	"reason" text NOT NULL,
	"note" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_threads" ADD COLUMN "moderation_status" text DEFAULT 'enums.threadModerationStatus.visible' NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD COLUMN "report_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "thread_reports" ADD CONSTRAINT "thread_reports_thread_id_chat_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_reports" ADD CONSTRAINT "thread_reports_message_id_chat_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_reports" ADD CONSTRAINT "thread_reports_reporter_user_id_users_id_fk" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "thread_reports_thread_reporter_idx" ON "thread_reports" USING btree ("thread_id","reporter_key");--> statement-breakpoint
CREATE INDEX "thread_reports_lead_idx" ON "thread_reports" USING btree ("reporter_lead_id","created_at");--> statement-breakpoint
CREATE INDEX "thread_reports_ip_idx" ON "thread_reports" USING btree ("ip_hash","created_at");