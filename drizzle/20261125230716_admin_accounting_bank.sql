CREATE TABLE "finance_bank_feed_checkpoints" (
	"company_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"feed_identifier" text NOT NULL,
	"through" date NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "finance_bank_feed_checkpoints_company_id_account_id_feed_identifier_pk" PRIMARY KEY("company_id","account_id","feed_identifier")
);
--> statement-breakpoint
CREATE TABLE "bank_account_reconciliation_settings" (
	"account_id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"booked_currency" text NOT NULL,
	"foreign_currency" text,
	"max_fx_difference" numeric(14, 4),
	"max_fx_bps" integer,
	"max_date_distance_days" integer DEFAULT 7 NOT NULL,
	"gain_account_id" uuid,
	"loss_account_id" uuid,
	"fee_account_id" uuid,
	"configured_by_user_id" uuid NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_evidence_records" (
	"id" uuid PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"source_scope" text NOT NULL,
	"provider" text,
	"external_reference" text NOT NULL,
	"digest" text NOT NULL,
	"invoice_reference" text,
	"service_period_start" timestamp,
	"service_period_end" timestamp,
	"kind" text NOT NULL,
	"date" timestamp NOT NULL,
	"gross_amount" text NOT NULL,
	"tax_amount" text NOT NULL,
	"currency" text NOT NULL,
	"description" text NOT NULL,
	"debit_account_id" uuid NOT NULL,
	"credit_account_id" uuid,
	"journal_entry_id" uuid,
	"bill_id" uuid,
	"recorded_by_user_id" uuid NOT NULL,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_supplier_evidence_source_ref" UNIQUE("source_scope","external_reference"),
	CONSTRAINT "uq_supplier_evidence_vendor_invoice" UNIQUE("company_id","vendor_id","invoice_reference")
);
--> statement-breakpoint
CREATE TABLE "supplier_provider_bindings" (
	"provider" text PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"configured_at" timestamp DEFAULT now() NOT NULL,
	"configured_by_user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bill_mailbox_review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"namespace" text NOT NULL,
	"uid_validity" text NOT NULL,
	"uid" text NOT NULL,
	"company_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"debit_account_id" uuid NOT NULL,
	"status" text NOT NULL,
	"reference" text,
	"document_date" text,
	"currency" text,
	"gross_amount" text,
	"tax_amount" text,
	"issue" text,
	"ai_review_requested" boolean DEFAULT false NOT NULL,
	"evidence" text NOT NULL,
	"file_count" integer NOT NULL,
	"bill_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_accounting_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"merchant_id" text NOT NULL,
	"source_kind" text NOT NULL,
	"external_id" text NOT NULL,
	"checkout_id" text,
	"invoice_reference" text,
	"payment_intent_id" text,
	"offer_id" text,
	"currency" text NOT NULL,
	"gross_minor" bigint NOT NULL,
	"tax_minor" bigint,
	"fee_minor" bigint,
	"source_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_accounting_evidence_identity" UNIQUE("provider","merchant_id","source_kind","external_id")
);
--> statement-breakpoint
CREATE TABLE "payment_accounting_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"merchant_id" text NOT NULL,
	"offer_id" text NOT NULL,
	"currency" text NOT NULL,
	"recognition" text NOT NULL,
	"receivable_account_id" uuid NOT NULL,
	"clearing_account_id" uuid NOT NULL,
	"consideration_account_id" uuid NOT NULL,
	"vat_account_id" uuid,
	"expense_account_id" uuid,
	"allow_unstated_zero_tax" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_accounting_offer_identity" UNIQUE("provider","merchant_id","offer_id","currency")
);
--> statement-breakpoint
CREATE TABLE "payment_accounting_postings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"mapping_id" uuid NOT NULL,
	"transaction_id" uuid,
	"invoice_id" uuid,
	"journal_entry_id" uuid NOT NULL,
	"receipt_entry_id" uuid,
	"provider" text NOT NULL,
	"merchant_id" text NOT NULL,
	"source_kind" text NOT NULL,
	"external_id" text NOT NULL,
	"currency" text NOT NULL,
	"gross_minor" bigint NOT NULL,
	"net_minor" bigint NOT NULL,
	"tax_minor" bigint NOT NULL,
	"fee_minor" bigint,
	"source_date" timestamp NOT NULL,
	"evidence_digest" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_accounting_posting_identity" UNIQUE("provider","merchant_id","source_kind","external_id")
);
--> statement-breakpoint
CREATE TABLE "payment_accounting_recognition_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mapping_id" uuid NOT NULL,
	"effective_from" date NOT NULL,
	"revenue_account_id" uuid NOT NULL,
	"recognize_expiry" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_accounting_recognition_policy_day" UNIQUE("mapping_id","effective_from")
);
--> statement-breakpoint
CREATE TABLE "payment_accounting_recognitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"posting_id" uuid NOT NULL,
	"policy_id" uuid NOT NULL,
	"credit_transaction_id" uuid NOT NULL,
	"credits_atomic" text NOT NULL,
	"net_minor" bigint NOT NULL,
	"journal_entry_id" uuid,
	"source_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_accounting_recognition_credit_transaction" UNIQUE("credit_transaction_id")
);
--> statement-breakpoint
CREATE TABLE "company_tax_regimes" (
	"company_id" uuid NOT NULL,
	"effective_from" date NOT NULL,
	"regime" text NOT NULL,
	"recorded_by" uuid,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_tax_regimes_company_id_effective_from_pk" PRIMARY KEY("company_id","effective_from")
);
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "value_date" date;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "native_amount" numeric(14, 4);
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "native_currency" text;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "fee_amount" numeric(14, 4);
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "fee_currency" text;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "source_format" text;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "source_feed" text;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "source_reference" text;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "stable_fingerprint" text;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "description" text;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "counterparty" text;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "adjustment_journal_entry_id" uuid;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "adjustment_reversal_entry_id" uuid;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "supplier_bill_id" uuid;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD COLUMN "match_kind" text;
--> statement-breakpoint
ALTER TABLE "finance_provider_snapshots" ADD COLUMN "spend_evidence" text;
--> statement-breakpoint
ALTER TABLE "pos_orders" ADD COLUMN "tax_exemption_notice" text;
--> statement-breakpoint
ALTER TABLE "finance_bank_feed_checkpoints" ADD CONSTRAINT "finance_bank_feed_checkpoints_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "finance_bank_feed_checkpoints" ADD CONSTRAINT "finance_bank_feed_checkpoints_account_id_account_nodes_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account_nodes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_account_reconciliation_settings" ADD CONSTRAINT "bank_account_reconciliation_settings_account_id_account_nodes_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account_nodes"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_account_reconciliation_settings" ADD CONSTRAINT "bank_account_reconciliation_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_account_reconciliation_settings" ADD CONSTRAINT "bank_account_reconciliation_settings_gain_account_id_account_nodes_id_fk" FOREIGN KEY ("gain_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_account_reconciliation_settings" ADD CONSTRAINT "bank_account_reconciliation_settings_loss_account_id_account_nodes_id_fk" FOREIGN KEY ("loss_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_account_reconciliation_settings" ADD CONSTRAINT "bank_account_reconciliation_settings_fee_account_id_account_nodes_id_fk" FOREIGN KEY ("fee_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_account_reconciliation_settings" ADD CONSTRAINT "bank_account_reconciliation_settings_configured_by_user_id_users_id_fk" FOREIGN KEY ("configured_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "supplier_evidence_records" ADD CONSTRAINT "supplier_evidence_records_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "supplier_evidence_records" ADD CONSTRAINT "supplier_evidence_records_vendor_id_purchasing_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."purchasing_vendors"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "supplier_evidence_records" ADD CONSTRAINT "supplier_evidence_records_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "supplier_evidence_records" ADD CONSTRAINT "supplier_evidence_records_bill_id_payment_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."payment_bills"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "supplier_provider_bindings" ADD CONSTRAINT "supplier_provider_bindings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "supplier_provider_bindings" ADD CONSTRAINT "supplier_provider_bindings_vendor_id_purchasing_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."purchasing_vendors"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bill_mailbox_review" ADD CONSTRAINT "bill_mailbox_review_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bill_mailbox_review" ADD CONSTRAINT "bill_mailbox_review_vendor_id_purchasing_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."purchasing_vendors"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bill_mailbox_review" ADD CONSTRAINT "bill_mailbox_review_debit_account_id_account_nodes_id_fk" FOREIGN KEY ("debit_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bill_mailbox_review" ADD CONSTRAINT "bill_mailbox_review_bill_id_payment_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."payment_bills"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_offers" ADD CONSTRAINT "payment_accounting_offers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_offers" ADD CONSTRAINT "payment_accounting_offers_product_id_catalog_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."catalog_products"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_offers" ADD CONSTRAINT "payment_accounting_offers_receivable_account_id_account_nodes_id_fk" FOREIGN KEY ("receivable_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_offers" ADD CONSTRAINT "payment_accounting_offers_clearing_account_id_account_nodes_id_fk" FOREIGN KEY ("clearing_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_offers" ADD CONSTRAINT "payment_accounting_offers_consideration_account_id_account_nodes_id_fk" FOREIGN KEY ("consideration_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_offers" ADD CONSTRAINT "payment_accounting_offers_vat_account_id_account_nodes_id_fk" FOREIGN KEY ("vat_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_offers" ADD CONSTRAINT "payment_accounting_offers_expense_account_id_account_nodes_id_fk" FOREIGN KEY ("expense_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_postings" ADD CONSTRAINT "payment_accounting_postings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_postings" ADD CONSTRAINT "payment_accounting_postings_mapping_id_payment_accounting_offers_id_fk" FOREIGN KEY ("mapping_id") REFERENCES "public"."payment_accounting_offers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_postings" ADD CONSTRAINT "payment_accounting_postings_transaction_id_payment_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."payment_transactions"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_postings" ADD CONSTRAINT "payment_accounting_postings_invoice_id_payment_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."payment_invoices"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_postings" ADD CONSTRAINT "payment_accounting_postings_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_postings" ADD CONSTRAINT "payment_accounting_postings_receipt_entry_id_journal_entries_id_fk" FOREIGN KEY ("receipt_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_recognition_policies" ADD CONSTRAINT "payment_accounting_recognition_policies_mapping_id_payment_accounting_offers_id_fk" FOREIGN KEY ("mapping_id") REFERENCES "public"."payment_accounting_offers"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_recognition_policies" ADD CONSTRAINT "payment_accounting_recognition_policies_revenue_account_id_account_nodes_id_fk" FOREIGN KEY ("revenue_account_id") REFERENCES "public"."account_nodes"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_recognitions" ADD CONSTRAINT "payment_accounting_recognitions_posting_id_payment_accounting_postings_id_fk" FOREIGN KEY ("posting_id") REFERENCES "public"."payment_accounting_postings"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_recognitions" ADD CONSTRAINT "payment_accounting_recognitions_policy_id_payment_accounting_recognition_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."payment_accounting_recognition_policies"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_recognitions" ADD CONSTRAINT "payment_accounting_recognitions_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "company_tax_regimes" ADD CONSTRAINT "company_tax_regimes_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "company_tax_regimes" ADD CONSTRAINT "company_tax_regimes_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_bank_reconciliation_settings_company" ON "bank_account_reconciliation_settings" USING btree ("company_id");
--> statement-breakpoint
CREATE INDEX "idx_supplier_evidence_company_date" ON "supplier_evidence_records" USING btree ("company_id","date");
--> statement-breakpoint
CREATE INDEX "idx_supplier_provider_company" ON "supplier_provider_bindings" USING btree ("company_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "bill_mailbox_review_imap_uid" ON "bill_mailbox_review" USING btree ("namespace","uid_validity","uid");
--> statement-breakpoint
CREATE INDEX "bill_mailbox_review_company_created" ON "bill_mailbox_review" USING btree ("company_id","created_at");
--> statement-breakpoint
CREATE UNIQUE INDEX "payment_accounting_sale_per_transaction" ON "payment_accounting_postings" USING btree ("transaction_id") WHERE "payment_accounting_postings"."source_kind" = 'sale';
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_adjustment_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("adjustment_journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_adjustment_reversal_entry_id_journal_entries_id_fk" FOREIGN KEY ("adjustment_reversal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_supplier_bill_id_payment_bills_id_fk" FOREIGN KEY ("supplier_bill_id") REFERENCES "public"."payment_bills"("id") ON DELETE restrict ON UPDATE no action;
