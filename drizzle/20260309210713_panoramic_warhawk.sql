CREATE TABLE "pipeline_backtest_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"run_id" uuid NOT NULL,
	"node_id" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"value" text NOT NULL,
	"fired" boolean,
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE "pipeline_backtest_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"graph_id" uuid NOT NULL,
	"graph_version_id" uuid NOT NULL,
	"range_from" timestamp NOT NULL,
	"range_to" timestamp NOT NULL,
	"resolution" text NOT NULL,
	"action_mode" text DEFAULT 'simulate' NOT NULL,
	"eligible" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_datapoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"node_id" text NOT NULL,
	"graph_id" uuid,
	"timestamp" timestamp NOT NULL,
	"value" text NOT NULL,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_graphs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"owner_type" text NOT NULL,
	"owner_id" uuid,
	"parent_version_id" uuid,
	"config" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_retention_config" (
	"node_id" text PRIMARY KEY NOT NULL,
	"max_rows" integer,
	"max_age_days" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluator_id" text NOT NULL,
	"graph_id" uuid NOT NULL,
	"timestamp" timestamp NOT NULL,
	"fired" boolean NOT NULL,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"node_id" text NOT NULL,
	"cache_key" text NOT NULL,
	"data" jsonb NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pipeline_snapshots_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
ALTER TABLE "pipeline_backtest_results" ADD CONSTRAINT "pipeline_backtest_results_run_id_pipeline_backtest_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."pipeline_backtest_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_backtest_runs" ADD CONSTRAINT "pipeline_backtest_runs_graph_id_pipeline_graphs_id_fk" FOREIGN KEY ("graph_id") REFERENCES "public"."pipeline_graphs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_backtest_runs" ADD CONSTRAINT "pipeline_backtest_runs_graph_version_id_pipeline_graphs_id_fk" FOREIGN KEY ("graph_version_id") REFERENCES "public"."pipeline_graphs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_datapoints" ADD CONSTRAINT "pipeline_datapoints_graph_id_pipeline_graphs_id_fk" FOREIGN KEY ("graph_id") REFERENCES "public"."pipeline_graphs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_graphs" ADD CONSTRAINT "pipeline_graphs_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_signals" ADD CONSTRAINT "pipeline_signals_graph_id_pipeline_graphs_id_fk" FOREIGN KEY ("graph_id") REFERENCES "public"."pipeline_graphs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pipeline_backtest_results_run" ON "pipeline_backtest_results" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "idx_pipeline_backtest_results_node_ts" ON "pipeline_backtest_results" USING btree ("node_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_pipeline_backtest_runs_graph" ON "pipeline_backtest_runs" USING btree ("graph_id");--> statement-breakpoint
CREATE INDEX "idx_pipeline_datapoints_node_ts" ON "pipeline_datapoints" USING btree ("node_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_pipeline_datapoints_graph" ON "pipeline_datapoints" USING btree ("graph_id");--> statement-breakpoint
CREATE INDEX "idx_pipeline_graphs_slug" ON "pipeline_graphs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_pipeline_graphs_owner" ON "pipeline_graphs" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_pipeline_graphs_active" ON "pipeline_graphs" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_pipeline_signals_evaluator_ts" ON "pipeline_signals" USING btree ("evaluator_id","timestamp");--> statement-breakpoint
CREATE INDEX "idx_pipeline_signals_graph" ON "pipeline_signals" USING btree ("graph_id");--> statement-breakpoint
CREATE INDEX "idx_pipeline_snapshots_key" ON "pipeline_snapshots" USING btree ("cache_key");--> statement-breakpoint
CREATE INDEX "idx_pipeline_snapshots_expires" ON "pipeline_snapshots" USING btree ("expires_at");