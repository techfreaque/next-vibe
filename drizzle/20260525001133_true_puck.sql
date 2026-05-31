CREATE TABLE "payment_invoice_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"description" text NOT NULL,
	"product_id" uuid,
	"quantity" numeric(12, 4) DEFAULT 1 NOT NULL,
	"unit_price" numeric(12, 4) NOT NULL,
	"tax_rate" numeric(12, 4) DEFAULT 0,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"line_total" numeric(12, 4) NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"owner_user_id" uuid NOT NULL,
	"category_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"sku" text,
	"type" text NOT NULL,
	"unit" text,
	"base_price" numeric(16, 6) DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"default_tax_rate" numeric(16, 6) DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"owner_user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"parent_id" uuid,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"currency" text NOT NULL,
	"price" numeric(16, 6) NOT NULL,
	"tier_name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_product_price_tier" UNIQUE("product_id","currency","tier_name")
);
--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD COLUMN "journal_entry_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD COLUMN "invoice_sequence_number" integer;--> statement-breakpoint
ALTER TABLE "payment_invoices" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "payment_refunds" ADD COLUMN "journal_entry_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD COLUMN "journal_entry_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD COLUMN "account_node_id" uuid;--> statement-breakpoint
ALTER TABLE "payment_invoice_lines" ADD CONSTRAINT "payment_invoice_lines_invoice_id_payment_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."payment_invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_products" ADD CONSTRAINT "catalog_products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_id_catalog_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."catalog_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_catalog_products_company_owner" ON "catalog_products" USING btree ("company_id","owner_user_id");--> statement-breakpoint
CREATE INDEX "idx_catalog_products_owner" ON "catalog_products" USING btree ("owner_user_id");