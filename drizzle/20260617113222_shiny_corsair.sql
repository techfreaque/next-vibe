ALTER TABLE "remote_connections" ADD COLUMN "handles_model_providers" jsonb;--> statement-breakpoint
ALTER TABLE "remote_connections" ADD COLUMN "is_default" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "remote_connections" DROP COLUMN "routing_rules";