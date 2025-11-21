CREATE TABLE "lead_referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referral_code_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lead_referrals_lead_id_unique" UNIQUE("lead_id")
);
--> statement-breakpoint
CREATE TABLE "referral_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"label" text,
	"max_uses" integer,
	"current_uses" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referral_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "referral_earnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"earner_user_id" uuid NOT NULL,
	"source_user_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"level" integer NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referral_earnings_transaction_id_earner_user_id_level_unique" UNIQUE("transaction_id","earner_user_id","level")
);
--> statement-breakpoint
CREATE TABLE "user_referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_user_id" uuid NOT NULL,
	"referred_user_id" uuid NOT NULL,
	"referral_code_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_referrals_referred_user_id_unique" UNIQUE("referred_user_id")
);
--> statement-breakpoint
ALTER TABLE "chat_folders" ALTER COLUMN "root_folder_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lead_referrals" ADD CONSTRAINT "lead_referrals_referral_code_id_referral_codes_id_fk" FOREIGN KEY ("referral_code_id") REFERENCES "public"."referral_codes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_referrals" ADD CONSTRAINT "lead_referrals_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_codes" ADD CONSTRAINT "referral_codes_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_earner_user_id_users_id_fk" FOREIGN KEY ("earner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_source_user_id_users_id_fk" FOREIGN KEY ("source_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_earnings" ADD CONSTRAINT "referral_earnings_transaction_id_payment_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."payment_transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referrer_user_id_users_id_fk" FOREIGN KEY ("referrer_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_referrals" ADD CONSTRAINT "user_referrals_referral_code_id_referral_codes_id_fk" FOREIGN KEY ("referral_code_id") REFERENCES "public"."referral_codes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_folders" DROP COLUMN "metadata";