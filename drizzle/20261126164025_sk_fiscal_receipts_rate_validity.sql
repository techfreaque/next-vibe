CREATE TABLE "pos_fiscal_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"adapter" text NOT NULL,
	"device_kind" text DEFAULT 'enums.deviceKind.orp' NOT NULL,
	"cash_register_code" text NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"certified_until" date,
	"settings" jsonb DEFAULT '{"credentialRef":null,"offlineDeadlineHours":96}'::jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_pos_fiscal_providers_company" UNIQUE("company_id")
);
--> statement-breakpoint
CREATE TABLE "pos_fiscal_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"status" text DEFAULT 'enums.receiptStatus.pending' NOT NULL,
	"receipt_number" integer NOT NULL,
	"issued_at" timestamp NOT NULL,
	"payload" jsonb NOT NULL,
	"uid" text,
	"pkp" text,
	"okp" text,
	"qr_data" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"send_deadline" timestamp,
	"deadline_missed_at" timestamp,
	"registered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_pos_fiscal_receipts_order" UNIQUE("order_id"),
	CONSTRAINT "uq_pos_fiscal_receipts_company_number" UNIQUE("company_id","receipt_number")
);
--> statement-breakpoint
ALTER TABLE "tax_rates" ADD COLUMN "valid_from" date;--> statement-breakpoint
ALTER TABLE "tax_rates" ADD COLUMN "valid_to" date;--> statement-breakpoint
ALTER TABLE "pos_fiscal_providers" ADD CONSTRAINT "pos_fiscal_providers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_fiscal_providers" ADD CONSTRAINT "pos_fiscal_providers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_fiscal_receipts" ADD CONSTRAINT "pos_fiscal_receipts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_fiscal_receipts" ADD CONSTRAINT "pos_fiscal_receipts_order_id_pos_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pos_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_fiscal_receipts" ADD CONSTRAINT "pos_fiscal_receipts_provider_id_pos_fiscal_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."pos_fiscal_providers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pos_fiscal_receipts_company_status" ON "pos_fiscal_receipts" USING btree ("company_id","status");