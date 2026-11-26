ALTER TABLE "pos_terminals" ADD COLUMN "warehouse_id" uuid;
--> statement-breakpoint
ALTER TABLE "pos_terminals" ADD CONSTRAINT "pos_terminals_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_pos_terminals_warehouse" ON "pos_terminals" USING btree ("warehouse_id");
