CREATE TABLE "payment_invoice_reminder_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"company_id" uuid,
	"prepared_by" uuid,
	"prepared_at" timestamp DEFAULT now() NOT NULL,
	"draft_day" date NOT NULL,
	"signature" text NOT NULL,
	"invoice_number" text NOT NULL,
	"issuer_name" text,
	"due_date" date NOT NULL,
	"currency" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"note" text,
	CONSTRAINT "uq_invoice_reminder_draft_snapshot" UNIQUE("invoice_id","draft_day","signature")
);
--> statement-breakpoint
ALTER TABLE "payment_invoice_reminder_drafts" ADD CONSTRAINT "payment_invoice_reminder_drafts_invoice_id_payment_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."payment_invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_invoice_reminder_drafts" ADD CONSTRAINT "payment_invoice_reminder_drafts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_invoice_reminder_drafts" ADD CONSTRAINT "payment_invoice_reminder_drafts_prepared_by_users_id_fk" FOREIGN KEY ("prepared_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_invoice_reminder_draft_history" ON "payment_invoice_reminder_drafts" USING btree ("invoice_id","prepared_at");