-- Migration: Update all enum values from v1.core structure to flat structure
-- Old format: app.api.v1.core.X
-- New format: app.api.X

-- Step 1: Migrate existing data

-- Agent/Chat tables
UPDATE "chat_threads" SET "status" = REPLACE("status", 'app.api.v1.core.agent.', 'app.api.agent.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "chat_messages" SET "role" = REPLACE("role", 'app.api.v1.core.agent.', 'app.api.agent.') WHERE "role" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "contact" SET "status" = REPLACE("status", 'app.api.v1.core.contact.', 'app.api.contact.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "imap_configurations" SET "logging_level" = REPLACE("logging_level", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "logging_level" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "imap_accounts" SET "auth_method" = REPLACE("auth_method", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "auth_method" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "imap_accounts" SET "sync_status" = REPLACE("sync_status", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "sync_status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "imap_folders" SET "sync_status" = REPLACE("sync_status", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "sync_status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "emails" SET "status" = REPLACE("status", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "emails" SET "email_provider" = REPLACE("email_provider", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "email_provider" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "emails" SET "sync_status" = REPLACE("sync_status", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "sync_status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "imap_server_configs" SET "log_level" = REPLACE("log_level", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "log_level" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "smtp_accounts" SET "security_type" = REPLACE("security_type", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "security_type" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "smtp_accounts" SET "status" = REPLACE("status", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "email_campaigns" SET "status" = REPLACE("status", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "email_campaigns" SET "email_provider" = REPLACE("email_provider", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "email_provider" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "email_campaigns" SET "stage" = REPLACE("stage", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "stage" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "emails" SET "type" = REPLACE("type", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "type" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "imap_folders" SET "special_use_type" = REPLACE("special_use_type", 'app.api.v1.core.emails.', 'app.api.emails.') WHERE "special_use_type" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "leads" SET "status" = REPLACE("status", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "leads" SET "current_campaign_stage" = REPLACE("current_campaign_stage", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "current_campaign_stage" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "leads" SET "source" = REPLACE("source", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "source" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "lead_engagements" SET "engagement_type" = REPLACE("engagement_type", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "engagement_type" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "email_campaigns" SET "journey_variant" = REPLACE("journey_variant", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "journey_variant" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "leads" SET "email_journey_variant" = REPLACE("email_journey_variant", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "email_journey_variant" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "default_status" = REPLACE("default_status", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "default_status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "default_campaign_stage" = REPLACE("default_campaign_stage", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "default_campaign_stage" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "default_source" = REPLACE("default_source", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "default_source" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "status" = REPLACE("status", 'app.api.v1.core.leads.', 'app.api.leads.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "newsletter_subscriptions" SET "status" = REPLACE("status", 'app.api.v1.core.newsletter.', 'app.api.newsletter.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "payment_invoices" SET "status" = REPLACE("status", 'app.api.v1.core.payment.', 'app.api.payment.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "payment_refunds" SET "status" = REPLACE("status", 'app.api.v1.core.payment.', 'app.api.payment.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "payment_transactions" SET "status" = REPLACE("status", 'app.api.v1.core.payment.', 'app.api.payment.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "payment_transactions" SET "provider" = REPLACE("provider", 'app.api.v1.core.payment.', 'app.api.payment.') WHERE "provider" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "payment_transactions" SET "mode" = REPLACE("mode", 'app.api.v1.core.payment.', 'app.api.payment.') WHERE "mode" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "subscriptions" SET "status" = REPLACE("status", 'app.api.v1.core.subscription.', 'app.api.subscription.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "subscriptions" SET "billing_interval" = REPLACE("billing_interval", 'app.api.v1.core.subscription.', 'app.api.subscription.') WHERE "billing_interval" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "subscriptions" SET "provider" = REPLACE("provider", 'app.api.v1.core.payment.', 'app.api.payment.') WHERE "provider" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "subscriptions" SET "plan_id" = REPLACE("plan_id", 'app.api.v1.core.subscription.', 'app.api.subscription.') WHERE "plan_id" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "subscriptions" SET "cancellation_reason" = REPLACE("cancellation_reason", 'app.api.v1.core.subscription.', 'app.api.subscription.') WHERE "cancellation_reason" LIKE 'app.api.v1.core.%';--> statement-breakpoint

-- User and roles
UPDATE "user_roles" SET "role" = REPLACE("role", 'app.api.v1.core.user.', 'app.api.user.') WHERE "role" LIKE 'app.api.v1.core.%';--> statement-breakpoint

-- Credits
UPDATE "credit_transactions" SET "type" = REPLACE("type", 'app.api.v1.core.credits.', 'app.api.credits.') WHERE "type" LIKE 'app.api.v1.core.%';--> statement-breakpoint

-- Referral
UPDATE "referral_earnings" SET "status" = REPLACE("status", 'app.api.v1.core.referral.', 'app.api.referral.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint

-- Payment methods and disputes
UPDATE "payment_methods" SET "type" = REPLACE("type", 'app.api.v1.core.payment.', 'app.api.payment.') WHERE "type" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "payment_disputes" SET "status" = REPLACE("status", 'app.api.v1.core.payment.', 'app.api.payment.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint

-- System tasks (cron, side-tasks, pulse)
UPDATE "cron_tasks" SET "priority" = REPLACE("priority", 'app.api.v1.core.system.', 'app.api.system.') WHERE "priority" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "cron_tasks" SET "last_execution_status" = REPLACE("last_execution_status", 'app.api.v1.core.system.', 'app.api.system.') WHERE "last_execution_status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "cron_task_executions" SET "priority" = REPLACE("priority", 'app.api.v1.core.system.', 'app.api.system.') WHERE "priority" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "cron_task_executions" SET "status" = REPLACE("status", 'app.api.v1.core.system.', 'app.api.system.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "side_tasks" SET "priority" = REPLACE("priority", 'app.api.v1.core.system.', 'app.api.system.') WHERE "priority" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "side_task_executions" SET "status" = REPLACE("status", 'app.api.v1.core.system.', 'app.api.system.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "task_runner_state" SET "status" = REPLACE("status", 'app.api.v1.core.system.', 'app.api.system.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "pulse_health" SET "status" = REPLACE("status", 'app.api.v1.core.system.', 'app.api.system.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "pulse_executions" SET "status" = REPLACE("status", 'app.api.v1.core.system.', 'app.api.system.') WHERE "status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "pulse_executions" SET "health_status" = REPLACE("health_status", 'app.api.v1.core.system.', 'app.api.system.') WHERE "health_status" LIKE 'app.api.v1.core.%';--> statement-breakpoint
UPDATE "pulse_notifications" SET "health_status" = REPLACE("health_status", 'app.api.v1.core.system.', 'app.api.system.') WHERE "health_status" LIKE 'app.api.v1.core.%';--> statement-breakpoint

-- Step 2: Update DEFAULT values for new rows
ALTER TABLE "chat_threads" ALTER COLUMN "status" SET DEFAULT 'app.api.agent.chat.enums.threadStatus.active';--> statement-breakpoint
ALTER TABLE "contact" ALTER COLUMN "status" SET DEFAULT 'app.api.contact.status.new';--> statement-breakpoint
ALTER TABLE "imap_configurations" ALTER COLUMN "logging_level" SET DEFAULT 'app.api.emails.enums.imapLoggingLevel.info';--> statement-breakpoint
ALTER TABLE "imap_accounts" ALTER COLUMN "auth_method" SET DEFAULT 'app.api.emails.enums.imapAuthMethod.plain';--> statement-breakpoint
ALTER TABLE "imap_accounts" ALTER COLUMN "sync_status" SET DEFAULT 'app.api.emails.enums.imapSyncStatus.pending';--> statement-breakpoint
ALTER TABLE "imap_folders" ALTER COLUMN "sync_status" SET DEFAULT 'app.api.emails.enums.imapSyncStatus.pending';--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "status" SET DEFAULT 'app.api.emails.enums.emailStatus.pending';--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "email_provider" SET DEFAULT 'app.api.emails.enums.emailProvider.smtp';--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "sync_status" SET DEFAULT 'app.api.emails.enums.imapSyncStatus.pending';--> statement-breakpoint
ALTER TABLE "imap_server_configs" ALTER COLUMN "log_level" SET DEFAULT 'app.api.emails.enums.imapLoggingLevel.info';--> statement-breakpoint
ALTER TABLE "smtp_accounts" ALTER COLUMN "security_type" SET DEFAULT 'app.api.emails.enums.smtpSecurityType.starttls';--> statement-breakpoint
ALTER TABLE "smtp_accounts" ALTER COLUMN "status" SET DEFAULT 'app.api.emails.enums.smtpAccountStatus.active';--> statement-breakpoint
ALTER TABLE "email_campaigns" ALTER COLUMN "status" SET DEFAULT 'app.api.emails.enums.emailStatus.pending';--> statement-breakpoint
ALTER TABLE "email_campaigns" ALTER COLUMN "email_provider" SET DEFAULT 'app.api.emails.enums.emailProvider.smtp';--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "status" SET DEFAULT 'app.api.leads.enums.leadStatus.new';--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "current_campaign_stage" SET DEFAULT 'app.api.leads.enums.emailCampaignStage.notStarted';--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ALTER COLUMN "default_status" SET DEFAULT 'app.api.leads.enums.leadStatus.new';--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ALTER COLUMN "default_campaign_stage" SET DEFAULT 'app.api.leads.enums.emailCampaignStage.notStarted';--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ALTER COLUMN "default_source" SET DEFAULT 'app.api.leads.enums.leadSource.csvImport';--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ALTER COLUMN "status" SET DEFAULT 'app.api.leads.import.enums.csvImportJobStatus.pending';--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ALTER COLUMN "status" SET DEFAULT 'app.api.newsletter.enum.status.subscribed';--> statement-breakpoint
ALTER TABLE "payment_invoices" ALTER COLUMN "status" SET DEFAULT 'app.api.payment.enums.invoiceStatus.draft';--> statement-breakpoint
ALTER TABLE "payment_refunds" ALTER COLUMN "status" SET DEFAULT 'app.api.payment.enums.refundStatus.pending';--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "status" SET DEFAULT 'app.api.payment.enums.paymentStatus.pending';--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "provider" SET DEFAULT 'app.api.payment.enums.paymentProvider.stripe';--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "mode" SET DEFAULT 'app.api.payment.enums.checkoutMode.payment';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'app.api.subscription.enums.status.incomplete';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "billing_interval" SET DEFAULT 'app.api.subscription.enums.billing.monthly';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "provider" SET DEFAULT 'app.api.payment.enums.paymentProvider.stripe';
