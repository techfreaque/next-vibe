CREATE TABLE "account_email_challenges" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"code_hash" text NOT NULL,
	"sent_at" timestamp NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"message_id" text,
	"delivery_failed" boolean DEFAULT false NOT NULL,
	"bounced" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_email_challenges" ADD CONSTRAINT "account_email_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;