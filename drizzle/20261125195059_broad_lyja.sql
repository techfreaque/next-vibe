CREATE TABLE "bank_statement_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"transaction_id" text NOT NULL,
	"booked_date" date NOT NULL,
	"amount" numeric(14, 4) NOT NULL,
	"currency" text NOT NULL,
	"imported_by_user_id" uuid,
	"imported_at" timestamp DEFAULT now() NOT NULL,
	"matched_journal_line_id" uuid,
	"matched_by_user_id" uuid,
	"matched_at" timestamp,
	CONSTRAINT "uq_bank_statement_line_transaction" UNIQUE("company_id","account_id","transaction_id"),
	CONSTRAINT "uq_bank_statement_line_journal_leg" UNIQUE("matched_journal_line_id")
);
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_account_id_account_nodes_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account_nodes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_imported_by_user_id_users_id_fk" FOREIGN KEY ("imported_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_matched_journal_line_id_journal_entry_lines_id_fk" FOREIGN KEY ("matched_journal_line_id") REFERENCES "public"."journal_entry_lines"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_matched_by_user_id_users_id_fk" FOREIGN KEY ("matched_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bank_statement_lines_open" ON "bank_statement_lines" USING btree ("company_id","account_id","matched_at","booked_date");