CREATE TABLE "lead_lead_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id_1" uuid NOT NULL,
	"lead_id_2" uuid NOT NULL,
	"link_reason" text NOT NULL,
	"linked_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_lead_lead_link" UNIQUE("lead_id_1","lead_id_2")
);
--> statement-breakpoint
ALTER TABLE "lead_lead_links" ADD CONSTRAINT "lead_lead_links_lead_id_1_leads_id_fk" FOREIGN KEY ("lead_id_1") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_lead_links" ADD CONSTRAINT "lead_lead_links_lead_id_2_leads_id_fk" FOREIGN KEY ("lead_id_2") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_lead_lead_links_lead1" ON "lead_lead_links" USING btree ("lead_id_1");--> statement-breakpoint
CREATE INDEX "idx_lead_lead_links_lead2" ON "lead_lead_links" USING btree ("lead_id_2");--> statement-breakpoint
ALTER TABLE "user_lead_links" DROP COLUMN "metadata";