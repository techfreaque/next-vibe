ALTER TABLE "emails" ADD COLUMN "template_id" text;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "template_version" text;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "props_snapshot" json;--> statement-breakpoint
ALTER TABLE "emails" ADD COLUMN "locale" text;--> statement-breakpoint
CREATE INDEX "emails_template_id_idx" ON "emails" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "emails_template_version_idx" ON "emails" USING btree ("template_version");--> statement-breakpoint
CREATE INDEX "emails_locale_idx" ON "emails" USING btree ("locale");