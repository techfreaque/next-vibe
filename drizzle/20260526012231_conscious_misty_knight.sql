ALTER TABLE "catalog_products" ADD COLUMN "is_subscription" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "catalog_products" ADD COLUMN "billing_interval" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "catalog_product_id" uuid;