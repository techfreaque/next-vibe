ALTER TABLE "payment_bill_lines" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_bills" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_estimate_lines" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_estimates" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_invoice_lines" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_addresses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_notes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "payment_bill_lines" CASCADE;--> statement-breakpoint
DROP TABLE "payment_bills" CASCADE;--> statement-breakpoint
DROP TABLE "payment_estimate_lines" CASCADE;--> statement-breakpoint
DROP TABLE "payment_estimates" CASCADE;--> statement-breakpoint
DROP TABLE "payment_invoice_lines" CASCADE;--> statement-breakpoint
DROP TABLE "user_addresses" CASCADE;--> statement-breakpoint
DROP TABLE "user_notes" CASCADE;--> statement-breakpoint
ALTER TABLE "credit_wallets" DROP CONSTRAINT "credit_wallets_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "leads" DROP CONSTRAINT "leads_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_disputes" DROP CONSTRAINT "payment_disputes_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_invoices" DROP CONSTRAINT "payment_invoices_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_methods" DROP CONSTRAINT "payment_methods_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_refunds" DROP CONSTRAINT "payment_refunds_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_transactions" DROP CONSTRAINT "payment_transactions_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "referral_codes" DROP CONSTRAINT "referral_codes_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transactions" DROP COLUMN "journal_entry_id";--> statement-breakpoint
ALTER TABLE "credit_wallets" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "leads" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "payment_disputes" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "payment_invoices" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "payment_invoices" DROP COLUMN "journal_entry_id";--> statement-breakpoint
ALTER TABLE "payment_invoices" DROP COLUMN "invoice_sequence_number";--> statement-breakpoint
ALTER TABLE "payment_invoices" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "payment_methods" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "payment_refunds" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "payment_refunds" DROP COLUMN "journal_entry_id";--> statement-breakpoint
ALTER TABLE "payment_transactions" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "payment_transactions" DROP COLUMN "journal_entry_id";--> statement-breakpoint
ALTER TABLE "payment_transactions" DROP COLUMN "account_node_id";--> statement-breakpoint
ALTER TABLE "referral_codes" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "company_id";
