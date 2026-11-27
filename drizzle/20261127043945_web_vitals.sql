CREATE TABLE "web_vitals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	"metric" text NOT NULL,
	"value" double precision NOT NULL,
	"rating" text NOT NULL,
	"page_type" text NOT NULL,
	"path" text NOT NULL,
	"locale" text NOT NULL,
	"device" text NOT NULL,
	"navigation_type" text
);
--> statement-breakpoint
CREATE INDEX "idx_web_vitals_recorded_at" ON "web_vitals" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX "idx_web_vitals_page_metric" ON "web_vitals" USING btree ("page_type","metric","recorded_at");