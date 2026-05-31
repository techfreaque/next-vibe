CREATE INDEX "idx_accounting_periods_company" ON "accounting_periods" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_pos_order_items_order" ON "pos_order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_pos_orders_status" ON "pos_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_pos_payments_order" ON "pos_payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_catalog_products_company" ON "catalog_products" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_catalog_products_category" ON "catalog_products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_product_categories_owner" ON "product_categories" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "idx_product_categories_company" ON "product_categories" USING btree ("company_id");