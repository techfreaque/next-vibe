CREATE TABLE "thread_share_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"token" text NOT NULL,
	"label" text,
	"allow_posting" boolean DEFAULT false NOT NULL,
	"require_auth" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"last_accessed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "thread_share_links_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "payout_requests" ALTER COLUMN "status" SET DEFAULT 'app.api.referral.enums.payoutStatus.pending';--> statement-breakpoint
ALTER TABLE "referral_earnings" ALTER COLUMN "status" SET DEFAULT 'app.api.referral.enums.earningStatus.pending';--> statement-breakpoint
ALTER TABLE "custom_characters" ADD COLUMN "tagline" text NOT NULL;--> statement-breakpoint
ALTER TABLE "thread_share_links" ADD CONSTRAINT "thread_share_links_thread_id_chat_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "thread_share_links" ADD CONSTRAINT "thread_share_links_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "thread_share_links_thread_id_idx" ON "thread_share_links" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "thread_share_links_token_idx" ON "thread_share_links" USING btree ("token");--> statement-breakpoint
CREATE INDEX "thread_share_links_created_by_idx" ON "thread_share_links" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "thread_share_links_active_idx" ON "thread_share_links" USING btree ("active");