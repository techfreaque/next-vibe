CREATE TABLE "pipeline_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"graph_id" uuid NOT NULL,
	"graph_version_id" uuid NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"status" text DEFAULT 'running' NOT NULL,
	"error_count" integer DEFAULT 0 NOT NULL,
	"node_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pipeline_graphs" ADD COLUMN "archived_at" timestamp;--> statement-breakpoint
ALTER TABLE "pipeline_runs" ADD CONSTRAINT "pipeline_runs_graph_id_pipeline_graphs_id_fk" FOREIGN KEY ("graph_id") REFERENCES "public"."pipeline_graphs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_runs" ADD CONSTRAINT "pipeline_runs_graph_version_id_pipeline_graphs_id_fk" FOREIGN KEY ("graph_version_id") REFERENCES "public"."pipeline_graphs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pipeline_runs_graph" ON "pipeline_runs" USING btree ("graph_id");--> statement-breakpoint
CREATE INDEX "idx_pipeline_runs_started" ON "pipeline_runs" USING btree ("started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_pipeline_datapoints_unique" ON "pipeline_datapoints" USING btree ("node_id","graph_id","timestamp");