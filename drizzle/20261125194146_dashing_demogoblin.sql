CREATE TABLE "payment_invoice_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"scope_id" uuid NOT NULL,
	"is_company_scope" boolean NOT NULL,
	"receipt_key" text NOT NULL,
	"request_digest" text NOT NULL,
	"journal_entry_id" uuid,
	"response" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_payment_invoice_receipt_scope_key" UNIQUE("scope_id","is_company_scope","receipt_key")
);
--> statement-breakpoint
ALTER TABLE "payment_invoice_receipts" ADD CONSTRAINT "payment_invoice_receipts_invoice_id_payment_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."payment_invoices"("id") ON DELETE cascade ON UPDATE no action;