CREATE TABLE "payment_bill_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" uuid NOT NULL,
	"description" text NOT NULL,
	"product_id" uuid,
	"quantity" numeric(12, 4) DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 4) NOT NULL,
	"tax_rate" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"line_total" numeric(12, 4) NOT NULL,
	"expense_account_id" uuid,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"supplier_id" uuid,
	"supplier_name" text NOT NULL,
	"supplier_vat_number" text,
	"bill_number" text,
	"bill_date" timestamp NOT NULL,
	"due_date" timestamp,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"subtotal" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"total" numeric(12, 4) DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'enums.billStatus.DRAFT' NOT NULL,
	"notes" text,
	"journal_entry_id" uuid,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"label" text DEFAULT 'Default' NOT NULL,
	"full_name" text,
	"company" text,
	"phone" text,
	"vat_number" text,
	"tax_id" text,
	"address_line1" text NOT NULL,
	"address_line2" text,
	"city" text NOT NULL,
	"region" text,
	"postal_code" text,
	"country" text NOT NULL,
	"is_default_billing" boolean DEFAULT false NOT NULL,
	"is_default_delivery" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_bill_lines" ADD CONSTRAINT "payment_bill_lines_bill_id_payment_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."payment_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_bills" ADD CONSTRAINT "payment_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_payment_bills_company_status" ON "payment_bills" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_payment_bills_company_due_date" ON "payment_bills" USING btree ("company_id","due_date");--> statement-breakpoint
CREATE INDEX "idx_user_addresses_user" ON "user_addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_addresses_billing" ON "user_addresses" USING btree ("user_id","is_default_billing");--> statement-breakpoint
CREATE INDEX "idx_user_addresses_delivery" ON "user_addresses" USING btree ("user_id","is_default_delivery");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "vat_number";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "tax_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "address_line1";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "address_line2";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "region";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "postal_code";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "billing_country";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "default_currency";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "payment_terms_days";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "company_billing_name";