CREATE TABLE "task_budget_caps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope" text NOT NULL,
	"key" text NOT NULL,
	"max_credits" double precision NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_task_budget_caps_scope_key" UNIQUE("scope","key")
);
--> statement-breakpoint
CREATE TABLE "task_incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" text NOT NULL,
	"task_name" text NOT NULL,
	"type" text NOT NULL,
	"reason" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "task_spend_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"task_id" text NOT NULL,
	"goal" text,
	"thread_id" text,
	"kind" text NOT NULL,
	"amount" double precision NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messenger_accounts" ADD COLUMN "is_system" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_tasks" ADD COLUMN "run_started_at" timestamp;--> statement-breakpoint
CREATE INDEX "idx_task_incidents_task" ON "task_incidents" USING btree ("task_id","type");--> statement-breakpoint
CREATE INDEX "idx_task_incidents_created" ON "task_incidents" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_task_incidents_unresolved" ON "task_incidents" USING btree ("resolved_at");--> statement-breakpoint
CREATE INDEX "idx_task_spend_task" ON "task_spend_ledger" USING btree ("task_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_task_spend_created" ON "task_spend_ledger" USING btree ("created_at");