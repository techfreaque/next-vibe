CREATE TABLE "finance_bank_feed_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"consent_account_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"start_day" date NOT NULL,
	"daily" boolean DEFAULT false NOT NULL,
	CONSTRAINT "uq_finance_bank_consent_mapping" UNIQUE("company_id","consent_account_id")
);
--> statement-breakpoint
CREATE TABLE "finance_enable_banking_attempts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nonce_digest" text NOT NULL,
	"actor_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"ledger_account_id" uuid NOT NULL,
	"bank_name" text NOT NULL,
	"bank_country" text NOT NULL,
	"personal" boolean NOT NULL,
	"callback_origin" text NOT NULL,
	"requested_until" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"consumed_at" timestamp with time zone,
	CONSTRAINT "finance_enable_banking_attempts_nonce_digest_unique" UNIQUE("nonce_digest")
);
--> statement-breakpoint
CREATE TABLE "finance_enable_banking_consent_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"consent_id" uuid NOT NULL,
	"ordinal" integer NOT NULL,
	"currency" text,
	"identifiers_encrypted" text NOT NULL,
	CONSTRAINT "uq_enable_banking_consent_account_ordinal" UNIQUE("consent_id","ordinal")
);
--> statement-breakpoint
CREATE TABLE "finance_enable_banking_consents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"attempt_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"bank_name" text NOT NULL,
	"bank_country" text NOT NULL,
	"session_encrypted" text NOT NULL,
	"consent_until" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"reminded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "finance_enable_banking_consents_attempt_id_unique" UNIQUE("attempt_id")
);
--> statement-breakpoint
CREATE TABLE "finance_bank_privacy_review" (
	"mapping_id" uuid NOT NULL,
	"source_identity" text NOT NULL,
	"state" text DEFAULT 'review' NOT NULL,
	"booked_date" date,
	"signed_amount" text,
	"currency" text,
	"evidence_encrypted" text,
	"expires_at" timestamp with time zone,
	"decided_at" timestamp with time zone,
	CONSTRAINT "finance_bank_privacy_review_mapping_id_source_identity_pk" PRIMARY KEY("mapping_id","source_identity")
);
--> statement-breakpoint
CREATE TABLE "finance_bank_privacy_settings" (
	"mapping_id" uuid PRIMARY KEY NOT NULL,
	"mode" text DEFAULT 'mixed' NOT NULL,
	"retention_days" integer DEFAULT 30 NOT NULL,
	"rules_encrypted" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "finance_bank_feed_mappings" ADD CONSTRAINT "finance_bank_feed_mappings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_bank_feed_mappings" ADD CONSTRAINT "finance_bank_feed_mappings_account_id_account_nodes_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account_nodes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_bank_feed_mappings" ADD CONSTRAINT "finance_bank_feed_mappings_consent_account_id_finance_enable_banking_consent_accounts_id_fk" FOREIGN KEY ("consent_account_id") REFERENCES "public"."finance_enable_banking_consent_accounts"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_bank_feed_mappings" ADD CONSTRAINT "finance_bank_feed_mappings_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_enable_banking_attempts" ADD CONSTRAINT "finance_enable_banking_attempts_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_enable_banking_attempts" ADD CONSTRAINT "finance_enable_banking_attempts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_enable_banking_attempts" ADD CONSTRAINT "finance_enable_banking_attempts_ledger_account_id_account_nodes_id_fk" FOREIGN KEY ("ledger_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_enable_banking_consent_accounts" ADD CONSTRAINT "finance_enable_banking_consent_accounts_consent_id_finance_enable_banking_consents_id_fk" FOREIGN KEY ("consent_id") REFERENCES "public"."finance_enable_banking_consents"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_enable_banking_consents" ADD CONSTRAINT "finance_enable_banking_consents_attempt_id_finance_enable_banking_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."finance_enable_banking_attempts"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_enable_banking_consents" ADD CONSTRAINT "finance_enable_banking_consents_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_enable_banking_consents" ADD CONSTRAINT "finance_enable_banking_consents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_bank_privacy_review" ADD CONSTRAINT "finance_bank_privacy_review_mapping_id_finance_bank_feed_mappings_id_fk" FOREIGN KEY ("mapping_id") REFERENCES "public"."finance_bank_feed_mappings"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_bank_privacy_settings" ADD CONSTRAINT "finance_bank_privacy_settings_mapping_id_finance_bank_feed_mappings_id_fk" FOREIGN KEY ("mapping_id") REFERENCES "public"."finance_bank_feed_mappings"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_enable_banking_attempt_expiry" ON "finance_enable_banking_attempts" USING btree ("expires_at");
--> statement-breakpoint
CREATE INDEX "idx_enable_banking_consent_company" ON "finance_enable_banking_consents" USING btree ("company_id","actor_id");
--> statement-breakpoint
CREATE INDEX "idx_enable_banking_consent_expiry" ON "finance_enable_banking_consents" USING btree ("consent_until");
--> statement-breakpoint
CREATE INDEX "finance_bank_privacy_review_expiry" ON "finance_bank_privacy_review" USING btree ("expires_at");
