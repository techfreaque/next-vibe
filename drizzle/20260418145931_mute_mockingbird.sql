CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
ALTER TABLE "cortex_nodes" ADD COLUMN "embedding" vector(3072);