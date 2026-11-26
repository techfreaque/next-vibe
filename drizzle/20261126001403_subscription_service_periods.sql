CREATE TABLE "payment_accounting_service_recognitions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"posting_id" uuid NOT NULL,
	"policy_id" uuid NOT NULL,
	"source_date" timestamp NOT NULL,
	"service_from" timestamp with time zone NOT NULL,
	"service_through" timestamp with time zone NOT NULL,
	"net_minor" bigint NOT NULL,
	"journal_entry_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_accounting_service_recognition_boundary" UNIQUE("posting_id","service_through")
);
--> statement-breakpoint
ALTER TABLE "payment_accounting_evidence" ADD COLUMN "service_period_start" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "payment_accounting_evidence" ADD COLUMN "service_period_end" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "payment_accounting_evidence" ADD COLUMN "service_net_minor" bigint;
--> statement-breakpoint
ALTER TABLE "payment_accounting_evidence" ADD COLUMN "service_period_conflict" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "payment_accounting_recognition_policies" ADD COLUMN "recognize_service_periods" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "payment_accounting_service_recognitions" ADD CONSTRAINT "payment_accounting_service_recognitions_posting_id_payment_accounting_postings_id_fk" FOREIGN KEY ("posting_id") REFERENCES "public"."payment_accounting_postings"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_service_recognitions" ADD CONSTRAINT "payment_accounting_service_recognitions_policy_id_payment_accounting_recognition_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."payment_accounting_recognition_policies"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_accounting_service_recognitions" ADD CONSTRAINT "payment_accounting_service_recognitions_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;
