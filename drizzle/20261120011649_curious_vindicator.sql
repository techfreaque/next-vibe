CREATE TABLE "growth_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"visited_at" timestamp NOT NULL,
	"source" text,
	"medium" text,
	"campaign" text,
	"referrer_host" text,
	"ref_code" text
);
--> statement-breakpoint
ALTER TABLE "growth_visits" ADD CONSTRAINT "growth_visits_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_growth_visits_visited_at" ON "growth_visits" USING btree ("visited_at");--> statement-breakpoint
CREATE INDEX "idx_growth_visits_ref_code" ON "growth_visits" USING btree ("ref_code");--> statement-breakpoint
CREATE INDEX "idx_growth_visits_lead_id" ON "growth_visits" USING btree ("lead_id");
--> statement-breakpoint
-- A landing path is evidence of a page touch. Signup-created placeholder
-- journeys have no path. Recover the first and last distinct observed touches.
INSERT INTO growth_visits (lead_id, visited_at, source, medium, campaign, referrer_host, ref_code)
SELECT lead_id, first_touch_at, first_source, first_medium, first_campaign, first_referrer_host, first_ref_code
FROM growth_journeys
WHERE first_landing_path IS NOT NULL
UNION ALL
SELECT lead_id, last_touch_at, last_source, last_medium, last_campaign, last_referrer_host, last_ref_code
FROM growth_journeys
WHERE last_landing_path IS NOT NULL AND last_touch_at > first_touch_at;
--> statement-breakpoint
-- Recover older external arrivals from the lead creation record. Extract only
-- the hostname and skip crawlers, our own site and leads with a recorded first landing.
INSERT INTO growth_visits (lead_id, visited_at, referrer_host)
SELECT l.id, l.created_at, host.domain
FROM leads l
CROSS JOIN LATERAL (
  SELECT regexp_replace(lower(substring(l.metadata->>'referer' FROM '^https?://([a-zA-Z0-9.-]+)(?=[:/?#]|$)')), '^www\.', '') AS domain
) host
WHERE l.metadata->>'createdFromTracking' = 'true'
  AND nullif(l.metadata->>'userAgent', '') IS NOT NULL
  AND l.metadata->>'userAgent' !~* 'bot|crawler|spider|slurp|crawling|facebookexternalhit|embedly|uptime'
  AND host.domain NOT IN ('unbottled.ai', 'localhost', '127.0.0.1')
  AND host.domain NOT LIKE '%.unbottled.ai'
  AND NOT EXISTS (
    SELECT 1 FROM growth_journeys j
    WHERE j.lead_id = l.id AND j.first_landing_path IS NOT NULL
  );
