CREATE TABLE "credit_packs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"original_amount" integer NOT NULL,
	"remaining" integer NOT NULL,
	"type" text NOT NULL,
	"expires_at" timestamp,
	"source" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "credit_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"lead_id" uuid,
	"balance" integer DEFAULT 0 NOT NULL,
	"free_credits_remaining" integer DEFAULT 20 NOT NULL,
	"free_period_start" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_wallet_user" UNIQUE("user_id"),
	CONSTRAINT "uq_wallet_lead" UNIQUE("lead_id")
);
--> statement-breakpoint
CREATE TABLE "user_lead_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
	"link_reason" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"linked_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_user_lead_link" UNIQUE("user_id","lead_id")
);
--> statement-breakpoint
ALTER TABLE "user_credits" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lead_credits" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lead_links" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_leads" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_credits" CASCADE;--> statement-breakpoint
DROP TABLE "lead_credits" CASCADE;--> statement-breakpoint
DROP TABLE "lead_links" CASCADE;--> statement-breakpoint
DROP TABLE "user_leads" CASCADE;--> statement-breakpoint
ALTER TABLE "credit_transactions" DROP CONSTRAINT "credit_transactions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transactions" DROP CONSTRAINT "credit_transactions_lead_id_leads_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD COLUMN "wallet_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD COLUMN "pack_id" uuid;--> statement-breakpoint
ALTER TABLE "credit_packs" ADD CONSTRAINT "credit_packs_wallet_id_credit_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."credit_wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_wallets" ADD CONSTRAINT "credit_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_wallets" ADD CONSTRAINT "credit_wallets_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lead_links" ADD CONSTRAINT "user_lead_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_lead_links" ADD CONSTRAINT "user_lead_links_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_packs_wallet_priority" ON "credit_packs" USING btree ("wallet_id","expires_at");--> statement-breakpoint
CREATE INDEX "idx_packs_wallet" ON "credit_packs" USING btree ("wallet_id");--> statement-breakpoint
CREATE INDEX "idx_wallet_user" ON "credit_wallets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_wallet_lead" ON "credit_wallets" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "idx_user_lead_links_user" ON "user_lead_links" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_lead_links_lead" ON "user_lead_links" USING btree ("lead_id");--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_wallet_id_credit_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."credit_wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_pack_id_credit_packs_id_fk" FOREIGN KEY ("pack_id") REFERENCES "public"."credit_packs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_transactions_wallet" ON "credit_transactions" USING btree ("wallet_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_transactions_type" ON "credit_transactions" USING btree ("type","created_at");--> statement-breakpoint
ALTER TABLE "credit_transactions" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "credit_transactions" DROP COLUMN "lead_id";