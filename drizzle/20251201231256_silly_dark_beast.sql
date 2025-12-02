ALTER TABLE "credit_packs" ALTER COLUMN "original_amount" SET DATA TYPE numeric(10, 6);--> statement-breakpoint
ALTER TABLE "credit_packs" ALTER COLUMN "remaining" SET DATA TYPE numeric(10, 6);--> statement-breakpoint
ALTER TABLE "credit_transactions" ALTER COLUMN "amount" SET DATA TYPE numeric(10, 6);--> statement-breakpoint
ALTER TABLE "credit_transactions" ALTER COLUMN "balance_after" SET DATA TYPE numeric(10, 6);--> statement-breakpoint
ALTER TABLE "credit_wallets" ALTER COLUMN "balance" SET DATA TYPE numeric(10, 6);--> statement-breakpoint
ALTER TABLE "credit_wallets" ALTER COLUMN "balance" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "credit_wallets" ALTER COLUMN "free_credits_remaining" SET DATA TYPE numeric(10, 6);--> statement-breakpoint
ALTER TABLE "credit_wallets" ALTER COLUMN "free_credits_remaining" SET DEFAULT '20';