CREATE INDEX IF NOT EXISTS "idx_company_leads_lead" ON "company_leads" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_transactions_pack" ON "credit_transactions" USING btree ("pack_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lead_referrals_lead" ON "lead_referrals" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pending_signups_lead_idx" ON "pending_signups" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_folders_lead_id_idx" ON "chat_folders" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_threads_lead_id_idx" ON "chat_threads" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "thread_reports_message_id_idx" ON "thread_reports" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_email_campaigns_lead" ON "email_campaigns" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_email_send_log_lead" ON "email_send_log" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lead_engagements_lead" ON "lead_engagements" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lead_engagements_campaign" ON "lead_engagements" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_frame_exchange_tokens_lead" ON "frame_exchange_tokens" USING btree ("lead_id");