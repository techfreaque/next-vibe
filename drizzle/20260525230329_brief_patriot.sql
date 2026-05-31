CREATE TABLE "payment_bill_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" uuid NOT NULL,
	"description" text NOT NULL,
	"product_id" uuid,
	"expense_account_id" uuid,
	"quantity" numeric(12, 4) DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_rate" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"line_total" numeric(12, 4) DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"supplier_name" text NOT NULL,
	"supplier_vat_number" text,
	"bill_number" text,
	"bill_date" timestamp NOT NULL,
	"due_date" timestamp,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"subtotal" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"total" numeric(12, 4) DEFAULT 0 NOT NULL,
	"notes" text,
	"journal_entry_id" uuid,
	"paid_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_estimate_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"estimate_id" uuid NOT NULL,
	"description" text NOT NULL,
	"product_id" uuid,
	"quantity" numeric(12, 4) DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_rate" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"line_total" numeric(12, 4) DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_estimates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"estimate_number" text NOT NULL,
	"status" text DEFAULT 'enums.estimateStatus.DRAFT' NOT NULL,
	"customer_id" uuid,
	"customer_email" text,
	"customer_name" text,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"valid_until" timestamp,
	"title" text,
	"notes" text,
	"terms" text,
	"subtotal" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"total" numeric(12, 4) DEFAULT 0 NOT NULL,
	"sent_at" timestamp,
	"accepted_at" timestamp,
	"declined_at" timestamp,
	"invoice_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_invoice_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" text NOT NULL,
	"product_id" uuid,
	"quantity" numeric(12, 4) DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_rate" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"line_total" numeric(12, 4) DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"label" text NOT NULL,
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
CREATE TABLE "user_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"type" text,
	"content" text NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD COLUMN "journal_entry_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD COLUMN "invoice_sequence_number" integer;--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD COLUMN "journal_entry_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_bill_lines" ADD CONSTRAINT "payment_bill_lines_bill_id_payment_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."payment_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_bills" ADD CONSTRAINT "payment_bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_estimate_lines" ADD CONSTRAINT "payment_estimate_lines_estimate_id_payment_estimates_id_fk" FOREIGN KEY ("estimate_id") REFERENCES "public"."payment_estimates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_estimates" ADD CONSTRAINT "payment_estimates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_invoice_lines" ADD CONSTRAINT "payment_invoice_lines_invoice_id_payment_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."payment_invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD CONSTRAINT "payment_invoices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;