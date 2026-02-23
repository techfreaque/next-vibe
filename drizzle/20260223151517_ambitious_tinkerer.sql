ALTER TABLE "chat_threads" ALTER COLUMN "status" SET DEFAULT 'enums.threadStatus.active';--> statement-breakpoint
ALTER TABLE "imap_configurations" ALTER COLUMN "logging_level" SET DEFAULT 'loggingLevel.info';--> statement-breakpoint
ALTER TABLE "imap_accounts" ALTER COLUMN "auth_method" SET DEFAULT 'enums.authMethod.plain';--> statement-breakpoint
ALTER TABLE "imap_accounts" ALTER COLUMN "sync_status" SET DEFAULT 'enums.syncStatus.pending';--> statement-breakpoint
ALTER TABLE "imap_folders" ALTER COLUMN "sync_status" SET DEFAULT 'enums.syncStatus.pending';--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "status" SET DEFAULT 'enums.status.pending';--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "email_provider" SET DEFAULT 'enums.provider.smtp';--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "channel" SET DEFAULT 'enums.channel.email';--> statement-breakpoint
ALTER TABLE "emails" ALTER COLUMN "sync_status" SET DEFAULT 'enums.syncStatus.pending';--> statement-breakpoint
ALTER TABLE "imap_server_configs" ALTER COLUMN "log_level" SET DEFAULT 'loggingLevel.info';--> statement-breakpoint
ALTER TABLE "messaging_accounts" ALTER COLUMN "status" SET DEFAULT 'enums.accountStatus.active';--> statement-breakpoint
ALTER TABLE "smtp_accounts" ALTER COLUMN "security_type" SET DEFAULT 'enums.securityType.starttls';--> statement-breakpoint
ALTER TABLE "smtp_accounts" ALTER COLUMN "status" SET DEFAULT 'enums.status.active';--> statement-breakpoint
ALTER TABLE "email_campaigns" ALTER COLUMN "campaign_type" SET DEFAULT 'enums.campaignType.leadCampaign';--> statement-breakpoint
ALTER TABLE "email_campaigns" ALTER COLUMN "status" SET DEFAULT 'enums.status.pending';--> statement-breakpoint
ALTER TABLE "email_campaigns" ALTER COLUMN "email_provider" SET DEFAULT 'enums.emailProvider.smtp';--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "status" SET DEFAULT 'enums.leadStatus.new';--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "current_campaign_stage" SET DEFAULT 'enums.emailCampaignStage.notStarted';--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ALTER COLUMN "default_status" SET DEFAULT 'enums.leadStatus.new';--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ALTER COLUMN "default_campaign_stage" SET DEFAULT 'enums.emailCampaignStage.notStarted';--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ALTER COLUMN "default_source" SET DEFAULT 'enums.leadSource.csvImport';--> statement-breakpoint
ALTER TABLE "csv_import_jobs" ALTER COLUMN "status" SET DEFAULT 'enums.csvImportJobStatus.pending';--> statement-breakpoint
ALTER TABLE "newsletter_subscriptions" ALTER COLUMN "status" SET DEFAULT 'enum.status.subscribed';--> statement-breakpoint
ALTER TABLE "payment_invoices" ALTER COLUMN "status" SET DEFAULT 'enums.invoiceStatus.draft';--> statement-breakpoint
ALTER TABLE "payment_refunds" ALTER COLUMN "status" SET DEFAULT 'enums.refundStatus.pending';--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "status" SET DEFAULT 'enums.paymentStatus.pending';--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "provider" SET DEFAULT 'enums.paymentProvider.stripe';--> statement-breakpoint
ALTER TABLE "payment_transactions" ALTER COLUMN "mode" SET DEFAULT 'enums.checkoutMode.payment';--> statement-breakpoint
ALTER TABLE "payout_requests" ALTER COLUMN "status" SET DEFAULT 'enums.payoutStatus.pending';--> statement-breakpoint
ALTER TABLE "referral_earnings" ALTER COLUMN "status" SET DEFAULT 'enums.earningStatus.pending';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'enums.status.incomplete';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "billing_interval" SET DEFAULT 'enums.billing.monthly';--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "provider" SET DEFAULT 'enums.paymentProvider.stripe';--> statement-breakpoint
ALTER TABLE "cron_tasks" ALTER COLUMN "output_mode" SET DEFAULT 'outputMode.storeOnly';--> statement-breakpoint
-- Migrate existing rows: strip old path-scoped enum prefixes using LIKE '%new_value%'
-- chat_threads
UPDATE "chat_threads" SET "status" = 'enums.threadStatus.active' WHERE "status" LIKE '%enums.threadStatus.active%' AND "status" != 'enums.threadStatus.active';--> statement-breakpoint
UPDATE "chat_threads" SET "status" = 'enums.threadStatus.archived' WHERE "status" LIKE '%enums.threadStatus.archived%' AND "status" != 'enums.threadStatus.archived';--> statement-breakpoint
UPDATE "chat_threads" SET "status" = 'enums.threadStatus.deleted' WHERE "status" LIKE '%enums.threadStatus.deleted%' AND "status" != 'enums.threadStatus.deleted';--> statement-breakpoint
-- imap_accounts
UPDATE "imap_accounts" SET "auth_method" = 'enums.authMethod.plain' WHERE "auth_method" LIKE '%enums.authMethod.plain%' AND "auth_method" != 'enums.authMethod.plain';--> statement-breakpoint
UPDATE "imap_accounts" SET "sync_status" = 'enums.syncStatus.pending' WHERE "sync_status" LIKE '%enums.syncStatus.pending%' AND "sync_status" != 'enums.syncStatus.pending';--> statement-breakpoint
UPDATE "imap_accounts" SET "sync_status" = 'enums.syncStatus.syncing' WHERE "sync_status" LIKE '%enums.syncStatus.syncing%' AND "sync_status" != 'enums.syncStatus.syncing';--> statement-breakpoint
UPDATE "imap_accounts" SET "sync_status" = 'enums.syncStatus.synced' WHERE "sync_status" LIKE '%enums.syncStatus.synced%' AND "sync_status" != 'enums.syncStatus.synced';--> statement-breakpoint
UPDATE "imap_accounts" SET "sync_status" = 'enums.syncStatus.failed' WHERE "sync_status" LIKE '%enums.syncStatus.failed%' AND "sync_status" != 'enums.syncStatus.failed';--> statement-breakpoint
-- imap_folders
UPDATE "imap_folders" SET "sync_status" = 'enums.syncStatus.pending' WHERE "sync_status" LIKE '%enums.syncStatus.pending%' AND "sync_status" != 'enums.syncStatus.pending';--> statement-breakpoint
UPDATE "imap_folders" SET "sync_status" = 'enums.syncStatus.syncing' WHERE "sync_status" LIKE '%enums.syncStatus.syncing%' AND "sync_status" != 'enums.syncStatus.syncing';--> statement-breakpoint
UPDATE "imap_folders" SET "sync_status" = 'enums.syncStatus.synced' WHERE "sync_status" LIKE '%enums.syncStatus.synced%' AND "sync_status" != 'enums.syncStatus.synced';--> statement-breakpoint
UPDATE "imap_folders" SET "sync_status" = 'enums.syncStatus.failed' WHERE "sync_status" LIKE '%enums.syncStatus.failed%' AND "sync_status" != 'enums.syncStatus.failed';--> statement-breakpoint
-- imap_configurations
UPDATE "imap_configurations" SET "logging_level" = 'loggingLevel.info' WHERE "logging_level" LIKE '%loggingLevel.info%' AND "logging_level" != 'loggingLevel.info';--> statement-breakpoint
UPDATE "imap_configurations" SET "logging_level" = 'loggingLevel.debug' WHERE "logging_level" LIKE '%loggingLevel.debug%' AND "logging_level" != 'loggingLevel.debug';--> statement-breakpoint
UPDATE "imap_configurations" SET "logging_level" = 'loggingLevel.warn' WHERE "logging_level" LIKE '%loggingLevel.warn%' AND "logging_level" != 'loggingLevel.warn';--> statement-breakpoint
UPDATE "imap_configurations" SET "logging_level" = 'loggingLevel.error' WHERE "logging_level" LIKE '%loggingLevel.error%' AND "logging_level" != 'loggingLevel.error';--> statement-breakpoint
-- imap_server_configs
UPDATE "imap_server_configs" SET "log_level" = 'loggingLevel.info' WHERE "log_level" LIKE '%loggingLevel.info%' AND "log_level" != 'loggingLevel.info';--> statement-breakpoint
UPDATE "imap_server_configs" SET "log_level" = 'loggingLevel.debug' WHERE "log_level" LIKE '%loggingLevel.debug%' AND "log_level" != 'loggingLevel.debug';--> statement-breakpoint
UPDATE "imap_server_configs" SET "log_level" = 'loggingLevel.warn' WHERE "log_level" LIKE '%loggingLevel.warn%' AND "log_level" != 'loggingLevel.warn';--> statement-breakpoint
UPDATE "imap_server_configs" SET "log_level" = 'loggingLevel.error' WHERE "log_level" LIKE '%loggingLevel.error%' AND "log_level" != 'loggingLevel.error';--> statement-breakpoint
-- emails
UPDATE "emails" SET "status" = 'enums.status.pending' WHERE "status" LIKE '%enums.status.pending%' AND "status" != 'enums.status.pending';--> statement-breakpoint
UPDATE "emails" SET "status" = 'enums.status.sent' WHERE "status" LIKE '%enums.status.sent%' AND "status" != 'enums.status.sent';--> statement-breakpoint
UPDATE "emails" SET "status" = 'enums.status.delivered' WHERE "status" LIKE '%enums.status.delivered%' AND "status" != 'enums.status.delivered';--> statement-breakpoint
UPDATE "emails" SET "status" = 'enums.status.failed' WHERE "status" LIKE '%enums.status.failed%' AND "status" != 'enums.status.failed';--> statement-breakpoint
UPDATE "emails" SET "status" = 'enums.status.bounced' WHERE "status" LIKE '%enums.status.bounced%' AND "status" != 'enums.status.bounced';--> statement-breakpoint
UPDATE "emails" SET "channel" = 'enums.channel.email' WHERE "channel" LIKE '%enums.channel.email%' AND "channel" != 'enums.channel.email';--> statement-breakpoint
UPDATE "emails" SET "channel" = 'enums.channel.sms' WHERE "channel" LIKE '%enums.channel.sms%' AND "channel" != 'enums.channel.sms';--> statement-breakpoint
UPDATE "emails" SET "email_provider" = 'enums.provider.smtp' WHERE "email_provider" LIKE '%enums.provider.smtp%' AND "email_provider" != 'enums.provider.smtp';--> statement-breakpoint
UPDATE "emails" SET "sync_status" = 'enums.syncStatus.pending' WHERE "sync_status" LIKE '%enums.syncStatus.pending%' AND "sync_status" != 'enums.syncStatus.pending';--> statement-breakpoint
UPDATE "emails" SET "sync_status" = 'enums.syncStatus.syncing' WHERE "sync_status" LIKE '%enums.syncStatus.syncing%' AND "sync_status" != 'enums.syncStatus.syncing';--> statement-breakpoint
UPDATE "emails" SET "sync_status" = 'enums.syncStatus.synced' WHERE "sync_status" LIKE '%enums.syncStatus.synced%' AND "sync_status" != 'enums.syncStatus.synced';--> statement-breakpoint
UPDATE "emails" SET "sync_status" = 'enums.syncStatus.failed' WHERE "sync_status" LIKE '%enums.syncStatus.failed%' AND "sync_status" != 'enums.syncStatus.failed';--> statement-breakpoint
-- messaging_accounts
UPDATE "messaging_accounts" SET "status" = 'enums.accountStatus.active' WHERE "status" LIKE '%enums.accountStatus.active%' AND "status" != 'enums.accountStatus.active';--> statement-breakpoint
UPDATE "messaging_accounts" SET "status" = 'enums.accountStatus.inactive' WHERE "status" LIKE '%enums.accountStatus.inactive%' AND "status" != 'enums.accountStatus.inactive';--> statement-breakpoint
-- smtp_accounts
UPDATE "smtp_accounts" SET "security_type" = 'enums.securityType.starttls' WHERE "security_type" LIKE '%enums.securityType.starttls%' AND "security_type" != 'enums.securityType.starttls';--> statement-breakpoint
UPDATE "smtp_accounts" SET "security_type" = 'enums.securityType.ssl' WHERE "security_type" LIKE '%enums.securityType.ssl%' AND "security_type" != 'enums.securityType.ssl';--> statement-breakpoint
UPDATE "smtp_accounts" SET "security_type" = 'enums.securityType.none' WHERE "security_type" LIKE '%enums.securityType.none%' AND "security_type" != 'enums.securityType.none';--> statement-breakpoint
UPDATE "smtp_accounts" SET "status" = 'enums.status.active' WHERE "status" LIKE '%enums.status.active%' AND "status" != 'enums.status.active';--> statement-breakpoint
UPDATE "smtp_accounts" SET "status" = 'enums.status.inactive' WHERE "status" LIKE '%enums.status.inactive%' AND "status" != 'enums.status.inactive';--> statement-breakpoint
-- email_campaigns
UPDATE "email_campaigns" SET "campaign_type" = 'enums.campaignType.leadCampaign' WHERE "campaign_type" LIKE '%enums.campaignType.leadCampaign%' AND "campaign_type" != 'enums.campaignType.leadCampaign';--> statement-breakpoint
UPDATE "email_campaigns" SET "campaign_type" = 'enums.campaignType.newsletter' WHERE "campaign_type" LIKE '%enums.campaignType.newsletter%' AND "campaign_type" != 'enums.campaignType.newsletter';--> statement-breakpoint
UPDATE "email_campaigns" SET "status" = 'enums.status.pending' WHERE "status" LIKE '%enums.status.pending%' AND "status" != 'enums.status.pending';--> statement-breakpoint
UPDATE "email_campaigns" SET "status" = 'enums.status.sent' WHERE "status" LIKE '%enums.status.sent%' AND "status" != 'enums.status.sent';--> statement-breakpoint
UPDATE "email_campaigns" SET "status" = 'enums.status.failed' WHERE "status" LIKE '%enums.status.failed%' AND "status" != 'enums.status.failed';--> statement-breakpoint
UPDATE "email_campaigns" SET "email_provider" = 'enums.emailProvider.smtp' WHERE "email_provider" LIKE '%enums.emailProvider.smtp%' AND "email_provider" != 'enums.emailProvider.smtp';--> statement-breakpoint
UPDATE "email_campaigns" SET "email_provider" = 'enums.emailProvider.resend' WHERE "email_provider" LIKE '%enums.emailProvider.resend%' AND "email_provider" != 'enums.emailProvider.resend';--> statement-breakpoint
-- leads
UPDATE "leads" SET "status" = 'enums.leadStatus.new' WHERE "status" LIKE '%enums.leadStatus.new%' AND "status" != 'enums.leadStatus.new';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.pending' WHERE "status" LIKE '%enums.leadStatus.pending%' AND "status" != 'enums.leadStatus.pending';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.campaignRunning' WHERE "status" LIKE '%enums.leadStatus.campaignRunning%' AND "status" != 'enums.leadStatus.campaignRunning';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.websiteUser' WHERE "status" LIKE '%enums.leadStatus.websiteUser%' AND "status" != 'enums.leadStatus.websiteUser';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.newsletterSubscriber' WHERE "status" LIKE '%enums.leadStatus.newsletterSubscriber%' AND "status" != 'enums.leadStatus.newsletterSubscriber';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.inContact' WHERE "status" LIKE '%enums.leadStatus.inContact%' AND "status" != 'enums.leadStatus.inContact';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.signedUp' WHERE "status" LIKE '%enums.leadStatus.signedUp%' AND "status" != 'enums.leadStatus.signedUp';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.subscriptionConfirmed' WHERE "status" LIKE '%enums.leadStatus.subscriptionConfirmed%' AND "status" != 'enums.leadStatus.subscriptionConfirmed';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.unsubscribed' WHERE "status" LIKE '%enums.leadStatus.unsubscribed%' AND "status" != 'enums.leadStatus.unsubscribed';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.bounced' WHERE "status" LIKE '%enums.leadStatus.bounced%' AND "status" != 'enums.leadStatus.bounced';--> statement-breakpoint
UPDATE "leads" SET "status" = 'enums.leadStatus.invalid' WHERE "status" LIKE '%enums.leadStatus.invalid%' AND "status" != 'enums.leadStatus.invalid';--> statement-breakpoint
UPDATE "leads" SET "current_campaign_stage" = 'enums.emailCampaignStage.notStarted' WHERE "current_campaign_stage" LIKE '%enums.emailCampaignStage.notStarted%' AND "current_campaign_stage" != 'enums.emailCampaignStage.notStarted';--> statement-breakpoint
UPDATE "leads" SET "current_campaign_stage" = 'enums.emailCampaignStage.initial' WHERE "current_campaign_stage" LIKE '%enums.emailCampaignStage.initial%' AND "current_campaign_stage" != 'enums.emailCampaignStage.initial';--> statement-breakpoint
UPDATE "leads" SET "current_campaign_stage" = 'enums.emailCampaignStage.followup1' WHERE "current_campaign_stage" LIKE '%enums.emailCampaignStage.followup1%' AND "current_campaign_stage" != 'enums.emailCampaignStage.followup1';--> statement-breakpoint
UPDATE "leads" SET "current_campaign_stage" = 'enums.emailCampaignStage.followup2' WHERE "current_campaign_stage" LIKE '%enums.emailCampaignStage.followup2%' AND "current_campaign_stage" != 'enums.emailCampaignStage.followup2';--> statement-breakpoint
UPDATE "leads" SET "current_campaign_stage" = 'enums.emailCampaignStage.followup3' WHERE "current_campaign_stage" LIKE '%enums.emailCampaignStage.followup3%' AND "current_campaign_stage" != 'enums.emailCampaignStage.followup3';--> statement-breakpoint
UPDATE "leads" SET "current_campaign_stage" = 'enums.emailCampaignStage.nurture' WHERE "current_campaign_stage" LIKE '%enums.emailCampaignStage.nurture%' AND "current_campaign_stage" != 'enums.emailCampaignStage.nurture';--> statement-breakpoint
UPDATE "leads" SET "current_campaign_stage" = 'enums.emailCampaignStage.reactivation' WHERE "current_campaign_stage" LIKE '%enums.emailCampaignStage.reactivation%' AND "current_campaign_stage" != 'enums.emailCampaignStage.reactivation';--> statement-breakpoint
-- csv_import_jobs
UPDATE "csv_import_jobs" SET "default_status" = 'enums.leadStatus.new' WHERE "default_status" LIKE '%enums.leadStatus.new%' AND "default_status" != 'enums.leadStatus.new';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "default_campaign_stage" = 'enums.emailCampaignStage.notStarted' WHERE "default_campaign_stage" LIKE '%enums.emailCampaignStage.notStarted%' AND "default_campaign_stage" != 'enums.emailCampaignStage.notStarted';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "default_source" = 'enums.leadSource.csvImport' WHERE "default_source" LIKE '%enums.leadSource.csvImport%' AND "default_source" != 'enums.leadSource.csvImport';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "status" = 'enums.csvImportJobStatus.pending' WHERE "status" LIKE '%enums.csvImportJobStatus.pending%' AND "status" != 'enums.csvImportJobStatus.pending';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "status" = 'enums.csvImportJobStatus.processing' WHERE "status" LIKE '%enums.csvImportJobStatus.processing%' AND "status" != 'enums.csvImportJobStatus.processing';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "status" = 'enums.csvImportJobStatus.completed' WHERE "status" LIKE '%enums.csvImportJobStatus.completed%' AND "status" != 'enums.csvImportJobStatus.completed';--> statement-breakpoint
UPDATE "csv_import_jobs" SET "status" = 'enums.csvImportJobStatus.failed' WHERE "status" LIKE '%enums.csvImportJobStatus.failed%' AND "status" != 'enums.csvImportJobStatus.failed';--> statement-breakpoint
-- newsletter_subscriptions
UPDATE "newsletter_subscriptions" SET "status" = 'enum.status.subscribed' WHERE "status" LIKE '%enum.status.subscribed%' AND "status" != 'enum.status.subscribed';--> statement-breakpoint
UPDATE "newsletter_subscriptions" SET "status" = 'enum.status.unsubscribed' WHERE "status" LIKE '%enum.status.unsubscribed%' AND "status" != 'enum.status.unsubscribed';--> statement-breakpoint
UPDATE "newsletter_subscriptions" SET "status" = 'enum.status.pending' WHERE "status" LIKE '%enum.status.pending%' AND "status" != 'enum.status.pending';--> statement-breakpoint
-- payment_transactions
UPDATE "payment_transactions" SET "status" = 'enums.paymentStatus.pending' WHERE "status" LIKE '%enums.paymentStatus.pending%' AND "status" != 'enums.paymentStatus.pending';--> statement-breakpoint
UPDATE "payment_transactions" SET "status" = 'enums.paymentStatus.succeeded' WHERE "status" LIKE '%enums.paymentStatus.succeeded%' AND "status" != 'enums.paymentStatus.succeeded';--> statement-breakpoint
UPDATE "payment_transactions" SET "status" = 'enums.paymentStatus.failed' WHERE "status" LIKE '%enums.paymentStatus.failed%' AND "status" != 'enums.paymentStatus.failed';--> statement-breakpoint
UPDATE "payment_transactions" SET "provider" = 'enums.paymentProvider.stripe' WHERE "provider" LIKE '%enums.paymentProvider.stripe%' AND "provider" != 'enums.paymentProvider.stripe';--> statement-breakpoint
UPDATE "payment_transactions" SET "provider" = 'enums.paymentProvider.nowpayments' WHERE "provider" LIKE '%enums.paymentProvider.nowpayments%' AND "provider" != 'enums.paymentProvider.nowpayments';--> statement-breakpoint
UPDATE "payment_transactions" SET "mode" = 'enums.checkoutMode.payment' WHERE "mode" LIKE '%enums.checkoutMode.payment%' AND "mode" != 'enums.checkoutMode.payment';--> statement-breakpoint
UPDATE "payment_transactions" SET "mode" = 'enums.checkoutMode.subscription' WHERE "mode" LIKE '%enums.checkoutMode.subscription%' AND "mode" != 'enums.checkoutMode.subscription';--> statement-breakpoint
-- payment_invoices
UPDATE "payment_invoices" SET "status" = 'enums.invoiceStatus.draft' WHERE "status" LIKE '%enums.invoiceStatus.draft%' AND "status" != 'enums.invoiceStatus.draft';--> statement-breakpoint
UPDATE "payment_invoices" SET "status" = 'enums.invoiceStatus.open' WHERE "status" LIKE '%enums.invoiceStatus.open%' AND "status" != 'enums.invoiceStatus.open';--> statement-breakpoint
UPDATE "payment_invoices" SET "status" = 'enums.invoiceStatus.paid' WHERE "status" LIKE '%enums.invoiceStatus.paid%' AND "status" != 'enums.invoiceStatus.paid';--> statement-breakpoint
UPDATE "payment_invoices" SET "status" = 'enums.invoiceStatus.void' WHERE "status" LIKE '%enums.invoiceStatus.void%' AND "status" != 'enums.invoiceStatus.void';--> statement-breakpoint
UPDATE "payment_invoices" SET "status" = 'enums.invoiceStatus.uncollectible' WHERE "status" LIKE '%enums.invoiceStatus.uncollectible%' AND "status" != 'enums.invoiceStatus.uncollectible';--> statement-breakpoint
-- payment_refunds
UPDATE "payment_refunds" SET "status" = 'enums.refundStatus.pending' WHERE "status" LIKE '%enums.refundStatus.pending%' AND "status" != 'enums.refundStatus.pending';--> statement-breakpoint
UPDATE "payment_refunds" SET "status" = 'enums.refundStatus.succeeded' WHERE "status" LIKE '%enums.refundStatus.succeeded%' AND "status" != 'enums.refundStatus.succeeded';--> statement-breakpoint
UPDATE "payment_refunds" SET "status" = 'enums.refundStatus.failed' WHERE "status" LIKE '%enums.refundStatus.failed%' AND "status" != 'enums.refundStatus.failed';--> statement-breakpoint
UPDATE "payment_refunds" SET "status" = 'enums.refundStatus.cancelled' WHERE "status" LIKE '%enums.refundStatus.cancelled%' AND "status" != 'enums.refundStatus.cancelled';--> statement-breakpoint
-- payout_requests
UPDATE "payout_requests" SET "status" = 'enums.payoutStatus.pending' WHERE "status" LIKE '%enums.payoutStatus.pending%' AND "status" != 'enums.payoutStatus.pending';--> statement-breakpoint
UPDATE "payout_requests" SET "status" = 'enums.payoutStatus.approved' WHERE "status" LIKE '%enums.payoutStatus.approved%' AND "status" != 'enums.payoutStatus.approved';--> statement-breakpoint
UPDATE "payout_requests" SET "status" = 'enums.payoutStatus.paid' WHERE "status" LIKE '%enums.payoutStatus.paid%' AND "status" != 'enums.payoutStatus.paid';--> statement-breakpoint
UPDATE "payout_requests" SET "status" = 'enums.payoutStatus.rejected' WHERE "status" LIKE '%enums.payoutStatus.rejected%' AND "status" != 'enums.payoutStatus.rejected';--> statement-breakpoint
-- referral_earnings
UPDATE "referral_earnings" SET "status" = 'enums.earningStatus.pending' WHERE "status" LIKE '%enums.earningStatus.pending%' AND "status" != 'enums.earningStatus.pending';--> statement-breakpoint
UPDATE "referral_earnings" SET "status" = 'enums.earningStatus.confirmed' WHERE "status" LIKE '%enums.earningStatus.confirmed%' AND "status" != 'enums.earningStatus.confirmed';--> statement-breakpoint
UPDATE "referral_earnings" SET "status" = 'enums.earningStatus.paid' WHERE "status" LIKE '%enums.earningStatus.paid%' AND "status" != 'enums.earningStatus.paid';--> statement-breakpoint
UPDATE "referral_earnings" SET "status" = 'enums.earningStatus.rejected' WHERE "status" LIKE '%enums.earningStatus.rejected%' AND "status" != 'enums.earningStatus.rejected';--> statement-breakpoint
-- subscriptions
UPDATE "subscriptions" SET "status" = 'enums.status.incomplete' WHERE "status" LIKE '%enums.status.incomplete%' AND "status" != 'enums.status.incomplete';--> statement-breakpoint
UPDATE "subscriptions" SET "status" = 'enums.status.incompleteExpired' WHERE "status" LIKE '%enums.status.incompleteExpired%' AND "status" != 'enums.status.incompleteExpired';--> statement-breakpoint
UPDATE "subscriptions" SET "status" = 'enums.status.trialing' WHERE "status" LIKE '%enums.status.trialing%' AND "status" != 'enums.status.trialing';--> statement-breakpoint
UPDATE "subscriptions" SET "status" = 'enums.status.active' WHERE "status" LIKE '%enums.status.active%' AND "status" != 'enums.status.active';--> statement-breakpoint
UPDATE "subscriptions" SET "status" = 'enums.status.pastDue' WHERE "status" LIKE '%enums.status.pastDue%' AND "status" != 'enums.status.pastDue';--> statement-breakpoint
UPDATE "subscriptions" SET "status" = 'enums.status.canceled' WHERE "status" LIKE '%enums.status.canceled%' AND "status" != 'enums.status.canceled';--> statement-breakpoint
UPDATE "subscriptions" SET "status" = 'enums.status.unpaid' WHERE "status" LIKE '%enums.status.unpaid%' AND "status" != 'enums.status.unpaid';--> statement-breakpoint
UPDATE "subscriptions" SET "billing_interval" = 'enums.billing.monthly' WHERE "billing_interval" LIKE '%enums.billing.monthly%' AND "billing_interval" != 'enums.billing.monthly';--> statement-breakpoint
UPDATE "subscriptions" SET "billing_interval" = 'enums.billing.yearly' WHERE "billing_interval" LIKE '%enums.billing.yearly%' AND "billing_interval" != 'enums.billing.yearly';--> statement-breakpoint
UPDATE "subscriptions" SET "provider" = 'enums.paymentProvider.stripe' WHERE "provider" LIKE '%enums.paymentProvider.stripe%' AND "provider" != 'enums.paymentProvider.stripe';--> statement-breakpoint
UPDATE "subscriptions" SET "provider" = 'enums.paymentProvider.nowpayments' WHERE "provider" LIKE '%enums.paymentProvider.nowpayments%' AND "provider" != 'enums.paymentProvider.nowpayments';--> statement-breakpoint
-- contact
UPDATE "contact" SET "status" = 'status.new' WHERE "status" LIKE '%status.new%' AND "status" != 'status.new';--> statement-breakpoint
UPDATE "contact" SET "status" = 'status.inProgress' WHERE "status" LIKE '%status.inProgress%' AND "status" != 'status.inProgress';--> statement-breakpoint
UPDATE "contact" SET "status" = 'status.resolved' WHERE "status" LIKE '%status.resolved%' AND "status" != 'status.resolved';--> statement-breakpoint
UPDATE "contact" SET "status" = 'status.closed' WHERE "status" LIKE '%status.closed%' AND "status" != 'status.closed';--> statement-breakpoint
-- cron_tasks
UPDATE "cron_tasks" SET "output_mode" = 'outputMode.storeOnly' WHERE "output_mode" LIKE '%outputMode.storeOnly%' AND "output_mode" != 'outputMode.storeOnly';--> statement-breakpoint
UPDATE "cron_tasks" SET "output_mode" = 'outputMode.notifyOnFailure' WHERE "output_mode" LIKE '%outputMode.notifyOnFailure%' AND "output_mode" != 'outputMode.notifyOnFailure';--> statement-breakpoint
UPDATE "cron_tasks" SET "output_mode" = 'outputMode.notifyAlways' WHERE "output_mode" LIKE '%outputMode.notifyAlways%' AND "output_mode" != 'outputMode.notifyAlways';