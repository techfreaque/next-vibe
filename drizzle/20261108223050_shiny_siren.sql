ALTER TABLE "public_free_tier_daily_cap" ALTER COLUMN "per_lead_cap" SET DEFAULT 70;--> statement-breakpoint
ALTER TABLE "public_free_tier_daily_cap" ALTER COLUMN "per_ip_cap" SET DEFAULT 130;--> statement-breakpoint
UPDATE "public_free_tier_daily_cap" SET "per_lead_cap" = 70 WHERE "per_lead_cap" < 70;--> statement-breakpoint
UPDATE "public_free_tier_daily_cap" SET "per_ip_cap" = 130 WHERE "per_ip_cap" < 130;
