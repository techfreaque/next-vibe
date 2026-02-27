CREATE TABLE "error_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"endpoint" text,
	"error_type" text,
	"error_code" text,
	"stack_trace" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "error_logs_created_at_idx" ON "error_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "error_logs_source_idx" ON "error_logs" USING btree ("source");--> statement-breakpoint
CREATE INDEX "error_logs_endpoint_idx" ON "error_logs" USING btree ("endpoint");--> statement-breakpoint
CREATE INDEX "error_logs_error_type_idx" ON "error_logs" USING btree ("error_type");