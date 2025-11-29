ALTER TABLE "credit_transactions" ADD COLUMN "free_period_id" text;--> statement-breakpoint
ALTER TABLE "credit_wallets" ADD COLUMN "free_period_id" text DEFAULT to_char(NOW(), 'YYYY-MM') NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_messages" DROP COLUMN "collapsed";