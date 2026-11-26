CREATE TABLE "pos_refund_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"refund_id" uuid NOT NULL,
	"order_item_id" uuid NOT NULL,
	"quantity" numeric(12, 4) NOT NULL,
	"line_total" numeric(12, 4) NOT NULL,
	"tax_amount" numeric(12, 4) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pos_refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"session_id" uuid,
	"refund_number" text NOT NULL,
	"method" text NOT NULL,
	"currency" text NOT NULL,
	"subtotal" numeric(12, 4) NOT NULL,
	"tax_amount" numeric(12, 4) NOT NULL,
	"total" numeric(12, 4) NOT NULL,
	"reason" text NOT NULL,
	"journal_entry_id" uuid,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pos_refund_lines" ADD CONSTRAINT "pos_refund_lines_refund_id_pos_refunds_id_fk" FOREIGN KEY ("refund_id") REFERENCES "public"."pos_refunds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_refund_lines" ADD CONSTRAINT "pos_refund_lines_order_item_id_pos_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."pos_order_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_refunds" ADD CONSTRAINT "pos_refunds_order_id_pos_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pos_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_refunds" ADD CONSTRAINT "pos_refunds_session_id_pos_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."pos_sessions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_refunds" ADD CONSTRAINT "pos_refunds_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_pos_refund_lines_refund" ON "pos_refund_lines" USING btree ("refund_id");--> statement-breakpoint
CREATE INDEX "idx_pos_refund_lines_item" ON "pos_refund_lines" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "idx_pos_refunds_order" ON "pos_refunds" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_pos_refunds_session" ON "pos_refunds" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_pos_refunds_created_at" ON "pos_refunds" USING btree ("created_at");