CREATE TABLE "stock_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity_on_hand" numeric(12, 4) DEFAULT 0 NOT NULL,
	"quantity_reserved" numeric(12, 4) DEFAULT 0 NOT NULL,
	"quantity_on_order" numeric(12, 4) DEFAULT 0 NOT NULL,
	"reorder_point" numeric(12, 4),
	"reorder_quantity" numeric(12, 4),
	"unit_cost" numeric(12, 4),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_stock_level_warehouse_product" UNIQUE("warehouse_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"type" text NOT NULL,
	"quantity" numeric(12, 4) NOT NULL,
	"unit_cost" numeric(12, 4),
	"reference" text,
	"source_id" uuid,
	"source_type" text,
	"notes" text,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouse_transfer_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transfer_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity_requested" numeric(12, 4) NOT NULL,
	"quantity_received" numeric(12, 4) DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouse_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"from_warehouse_id" uuid NOT NULL,
	"to_warehouse_id" uuid NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"reference" text,
	"notes" text,
	"created_by_user_id" uuid NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"address" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_warehouse_company_code" UNIQUE("company_id","code")
);
--> statement-breakpoint
CREATE TABLE "payment_estimate_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"estimate_id" uuid NOT NULL,
	"product_id" uuid,
	"description" text NOT NULL,
	"quantity" numeric(12, 4) NOT NULL,
	"unit_price" numeric(12, 4) NOT NULL,
	"tax_rate" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"line_total" numeric(12, 4) NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_estimates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"estimate_number" text NOT NULL,
	"status" text DEFAULT 'enums.estimateStatus.DRAFT' NOT NULL,
	"customer_id" uuid,
	"customer_email" text,
	"customer_name" text,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"valid_until" timestamp,
	"title" text,
	"notes" text,
	"terms" text,
	"subtotal" numeric(14, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(14, 4) DEFAULT 0 NOT NULL,
	"total" numeric(14, 4) DEFAULT 0 NOT NULL,
	"invoice_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_payment_estimates_company_number" UNIQUE("company_id","estimate_number")
);
--> statement-breakpoint
CREATE TABLE "purchase_order_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"po_id" uuid NOT NULL,
	"product_id" uuid,
	"description" text NOT NULL,
	"quantity" numeric(12, 4) NOT NULL,
	"unit_price" numeric(12, 4) NOT NULL,
	"tax_rate" numeric(12, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(12, 4) DEFAULT 0 NOT NULL,
	"line_total" numeric(12, 4) NOT NULL,
	"quantity_received" numeric(12, 4) DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"po_number" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"currency" text NOT NULL,
	"expected_delivery_date" timestamp,
	"delivery_warehouse_id" uuid,
	"notes" text,
	"subtotal" numeric(14, 4) DEFAULT 0 NOT NULL,
	"tax_amount" numeric(14, 4) DEFAULT 0 NOT NULL,
	"total" numeric(14, 4) DEFAULT 0 NOT NULL,
	"bill_id" uuid,
	"created_by_user_id" uuid NOT NULL,
	"confirmed_at" timestamp,
	"received_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_purchase_orders_company_number" UNIQUE("company_id","po_number")
);
--> statement-breakpoint
CREATE TABLE "purchase_receipt_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"receipt_id" uuid NOT NULL,
	"po_line_id" uuid NOT NULL,
	"quantity_received" numeric(12, 4) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"po_id" uuid NOT NULL,
	"warehouse_id" uuid,
	"received_by_user_id" uuid NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "purchasing_vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"email" text,
	"phone" text,
	"website" text,
	"vat_number" text,
	"tax_id" text,
	"address_line1" text,
	"address_line2" text,
	"city" text,
	"region" text,
	"postal_code" text,
	"country" text,
	"default_currency" text DEFAULT 'EUR' NOT NULL,
	"default_payment_terms_days" integer DEFAULT 30,
	"default_tax_rate_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_purchasing_vendors_company_code" UNIQUE("company_id","code")
);
--> statement-breakpoint
ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_product_id_catalog_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."catalog_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_catalog_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."catalog_products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_transfer_items" ADD CONSTRAINT "warehouse_transfer_items_transfer_id_warehouse_transfers_id_fk" FOREIGN KEY ("transfer_id") REFERENCES "public"."warehouse_transfers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_transfer_items" ADD CONSTRAINT "warehouse_transfer_items_product_id_catalog_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."catalog_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_from_warehouse_id_warehouses_id_fk" FOREIGN KEY ("from_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_to_warehouse_id_warehouses_id_fk" FOREIGN KEY ("to_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouse_transfers" ADD CONSTRAINT "warehouse_transfers_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_estimate_lines" ADD CONSTRAINT "payment_estimate_lines_estimate_id_payment_estimates_id_fk" FOREIGN KEY ("estimate_id") REFERENCES "public"."payment_estimates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_estimates" ADD CONSTRAINT "payment_estimates_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendor_id_purchasing_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."purchasing_vendors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_receipt_lines" ADD CONSTRAINT "purchase_receipt_lines_receipt_id_purchase_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."purchase_receipts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_receipt_lines" ADD CONSTRAINT "purchase_receipt_lines_po_line_id_purchase_order_lines_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."purchase_order_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_receipts" ADD CONSTRAINT "purchase_receipts_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_receipts" ADD CONSTRAINT "purchase_receipts_received_by_user_id_users_id_fk" FOREIGN KEY ("received_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchasing_vendors" ADD CONSTRAINT "purchasing_vendors_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_stock_levels_warehouse" ON "stock_levels" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "idx_stock_levels_product" ON "stock_levels" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_stock_movements_warehouse" ON "stock_movements" USING btree ("warehouse_id");--> statement-breakpoint
CREATE INDEX "idx_stock_movements_product" ON "stock_movements" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_stock_movements_warehouse_product" ON "stock_movements" USING btree ("warehouse_id","product_id");--> statement-breakpoint
CREATE INDEX "idx_stock_movements_created_at" ON "stock_movements" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_transfer_items_transfer" ON "warehouse_transfer_items" USING btree ("transfer_id");--> statement-breakpoint
CREATE INDEX "idx_warehouse_transfers_company" ON "warehouse_transfers" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_warehouse_transfers_from" ON "warehouse_transfers" USING btree ("from_warehouse_id");--> statement-breakpoint
CREATE INDEX "idx_warehouse_transfers_to" ON "warehouse_transfers" USING btree ("to_warehouse_id");--> statement-breakpoint
CREATE INDEX "idx_warehouse_transfers_status" ON "warehouse_transfers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_warehouses_company" ON "warehouses" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_payment_estimates_company_status" ON "payment_estimates" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_purchase_orders_company_status" ON "purchase_orders" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_purchase_orders_company_vendor" ON "purchase_orders" USING btree ("company_id","vendor_id");--> statement-breakpoint
CREATE INDEX "idx_purchase_orders_vendor" ON "purchase_orders" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "idx_purchase_receipts_po" ON "purchase_receipts" USING btree ("po_id");--> statement-breakpoint
CREATE INDEX "idx_purchasing_vendors_company" ON "purchasing_vendors" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_purchasing_vendors_company_active" ON "purchasing_vendors" USING btree ("company_id","is_active");