CREATE TABLE IF NOT EXISTS "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_currency" text NOT NULL,
	"quote_currency" text NOT NULL,
	"rate" numeric(16, 8) NOT NULL,
	"rate_date" date NOT NULL,
	"source" text DEFAULT 'ECB' NOT NULL,
	"created_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_exchange_rate_pair_date_source" UNIQUE("base_currency","quote_currency","rate_date","source")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bank_statement_line_splits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bank_statement_line_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"journal_line_id" uuid,
	"invoice_id" uuid,
	"bill_id" uuid,
	"account_id" uuid,
	"amount" numeric(14, 4) NOT NULL,
	"description" text,
	"created_journal_entry_id" uuid,
	"created_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_bank_split_journal_line" UNIQUE("journal_line_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "company_payment_settings" (
	"company_id" uuid PRIMARY KEY NOT NULL,
	"bank_account_holder" text,
	"bank_iban" text,
	"bank_bic" text,
	"stripe_enabled" boolean DEFAULT false NOT NULL,
	"stripe_account_label" text,
	"stripe_clearing_account_id" uuid,
	"auto_book_stripe_payments" boolean DEFAULT true NOT NULL,
	"recurring_invoices_enabled" boolean DEFAULT false NOT NULL,
	"updated_by_user_id" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "document_email_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"document_type" text NOT NULL,
	"document_id" uuid NOT NULL,
	"document_number" text NOT NULL,
	"recipient_email" text NOT NULL,
	"sender_email" text NOT NULL,
	"subject" text NOT NULL,
	"attachment_filename" text,
	"status" text NOT NULL,
	"message_id" text,
	"error_message" text,
	"is_resend" boolean DEFAULT false NOT NULL,
	"sent_by_user_id" uuid,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recurring_invoice_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" text NOT NULL,
	"customer_id" uuid,
	"customer_name" text NOT NULL,
	"customer_email" text,
	"frequency" text NOT NULL,
	"next_run_date" date NOT NULL,
	"end_date" date,
	"due_days" integer DEFAULT 14 NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"notes" text,
	"line_templates" jsonb NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"auto_issue" boolean DEFAULT true NOT NULL,
	"auto_send_email" boolean DEFAULT false NOT NULL,
	"last_run_at" timestamp,
	"last_invoice_id" uuid,
	"created_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "journal_entry_lines" ADD COLUMN IF NOT EXISTS "functional_amount" numeric(14, 4);--> statement-breakpoint
ALTER TABLE "journal_entry_lines" ADD COLUMN IF NOT EXISTS "functional_currency" text;--> statement-breakpoint
ALTER TABLE "journal_entry_lines" ADD COLUMN IF NOT EXISTS "exchange_rate" numeric(16, 8);--> statement-breakpoint
ALTER TABLE "warehouses" ADD COLUMN IF NOT EXISTS "negative_stock_policy" text DEFAULT 'BLOCK' NOT NULL;--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_line_splits" ADD CONSTRAINT "bank_statement_line_splits_bank_statement_line_id_bank_statement_lines_id_fk" FOREIGN KEY ("bank_statement_line_id") REFERENCES "public"."bank_statement_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_line_splits" ADD CONSTRAINT "bank_statement_line_splits_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_line_splits" ADD CONSTRAINT "bank_statement_line_splits_journal_line_id_journal_entry_lines_id_fk" FOREIGN KEY ("journal_line_id") REFERENCES "public"."journal_entry_lines"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_line_splits" ADD CONSTRAINT "bank_statement_line_splits_invoice_id_payment_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."payment_invoices"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_line_splits" ADD CONSTRAINT "bank_statement_line_splits_bill_id_payment_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."payment_bills"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_line_splits" ADD CONSTRAINT "bank_statement_line_splits_account_id_account_nodes_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account_nodes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_line_splits" ADD CONSTRAINT "bank_statement_line_splits_created_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("created_journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_line_splits" ADD CONSTRAINT "bank_statement_line_splits_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_payment_settings" ADD CONSTRAINT "company_payment_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_payment_settings" ADD CONSTRAINT "company_payment_settings_updated_by_user_id_users_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_email_deliveries" ADD CONSTRAINT "document_email_deliveries_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_email_deliveries" ADD CONSTRAINT "document_email_deliveries_sent_by_user_id_users_id_fk" FOREIGN KEY ("sent_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_invoice_schedules" ADD CONSTRAINT "recurring_invoice_schedules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recurring_invoice_schedules" ADD CONSTRAINT "recurring_invoice_schedules_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_exchange_rates_pair_date" ON "exchange_rates" USING btree ("base_currency","quote_currency","rate_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_bank_splits_line" ON "bank_statement_line_splits" USING btree ("bank_statement_line_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_bank_splits_company" ON "bank_statement_line_splits" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_doc_email_deliveries_doc" ON "document_email_deliveries" USING btree ("document_type","document_id","sent_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_doc_email_deliveries_company" ON "document_email_deliveries" USING btree ("company_id","sent_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_recurring_schedules_company" ON "recurring_invoice_schedules" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_recurring_schedules_due" ON "recurring_invoice_schedules" USING btree ("is_enabled","next_run_date");