CREATE TABLE IF NOT EXISTS "crawler_visits" (
	"bucket_hour" timestamp NOT NULL,
	"bot_family" text NOT NULL,
	"visit_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "crawler_visits_bucket_hour_bot_family_pk" PRIMARY KEY("bucket_hour","bot_family")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_crawler_visits_bucket_hour" ON "crawler_visits" USING btree ("bucket_hour");
