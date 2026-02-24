-- Migration: Replace legacy app.api.* enum prefix with new short-key format
-- Run on prod after verifying on dev/preview first

-- ============================================================
-- USER ROLES
-- ============================================================
UPDATE user_roles
SET role = REPLACE(role, 'app.api.user.userRoles.enums.userRole.', 'enums.userRole.')
WHERE role LIKE 'app.api.user.userRoles.enums.userRole.%';

-- ============================================================
-- CRON TASKS
-- ============================================================
UPDATE cron_tasks
SET priority = REPLACE(priority, 'app.api.system.unifiedInterface.tasks.priority.', 'priority.')
WHERE priority LIKE 'app.api.system.unifiedInterface.tasks.priority.%';

-- Legacy cronTaskPriority prefix (different from tasks.priority)
UPDATE cron_tasks
SET priority = REPLACE(priority, 'app.api.system.unifiedInterface.tasks.cronTaskPriority.', 'priority.')
WHERE priority LIKE 'app.api.system.unifiedInterface.tasks.cronTaskPriority.%';

UPDATE cron_tasks
SET category = REPLACE(category, 'app.api.system.unifiedInterface.tasks.taskCategory.', 'taskCategory.')
WHERE category LIKE 'app.api.system.unifiedInterface.tasks.taskCategory.%';

-- Legacy tasks.category prefix (different from taskCategory)
UPDATE cron_tasks
SET category = REPLACE(category, 'app.api.system.unifiedInterface.tasks.category.', 'taskCategory.')
WHERE category LIKE 'app.api.system.unifiedInterface.tasks.category.%';

UPDATE cron_tasks
SET output_mode = REPLACE(output_mode, 'app.api.system.unifiedInterface.tasks.outputMode.', 'outputMode.')
WHERE output_mode LIKE 'app.api.system.unifiedInterface.tasks.outputMode.%';

UPDATE cron_tasks
SET last_execution_status = REPLACE(last_execution_status, 'app.api.system.unifiedInterface.tasks.status.', 'status.')
WHERE last_execution_status LIKE 'app.api.system.unifiedInterface.tasks.status.%';

-- ============================================================
-- CRON TASK EXECUTIONS
-- ============================================================
UPDATE cron_task_executions
SET status = REPLACE(status, 'app.api.system.unifiedInterface.tasks.status.', 'status.')
WHERE status LIKE 'app.api.system.unifiedInterface.tasks.status.%';

-- ============================================================
-- PULSE HEALTH
-- ============================================================
UPDATE pulse_health
SET status = REPLACE(status, 'app.api.system.unifiedInterface.tasks.pulse.health.', 'pulse.health.')
WHERE status LIKE 'app.api.system.unifiedInterface.tasks.pulse.health.%';

-- ============================================================
-- PULSE EXECUTIONS
-- ============================================================
UPDATE pulse_executions
SET status = REPLACE(status, 'app.api.system.unifiedInterface.tasks.pulse.execution.', 'pulse.execution.')
WHERE status LIKE 'app.api.system.unifiedInterface.tasks.pulse.execution.%';

-- ============================================================
-- CHAT THREADS
-- ============================================================
UPDATE chat_threads
SET status = REPLACE(status, 'app.api.agent.chat.enums.threadStatus.', 'enums.threadStatus.')
WHERE status LIKE 'app.api.agent.chat.enums.threadStatus.%';

-- ============================================================
-- CREDITS / TRANSACTIONS
-- ============================================================
UPDATE credit_transactions
SET type = REPLACE(type, 'app.api.credits.enums.transactionType.', 'enums.transactionType.')
WHERE type LIKE 'app.api.credits.enums.transactionType.%';

-- ============================================================
-- LEADS
-- ============================================================
UPDATE leads
SET source = REPLACE(source, 'app.api.leads.enums.leadSource.', 'enums.leadSource.')
WHERE source LIKE 'app.api.leads.enums.leadSource.%';

UPDATE leads
SET status = REPLACE(status, 'app.api.leads.enums.leadStatus.', 'enums.leadStatus.')
WHERE status LIKE 'app.api.leads.enums.leadStatus.%';

UPDATE leads
SET current_campaign_stage = REPLACE(current_campaign_stage, 'app.api.leads.enums.emailCampaignStage.', 'enums.emailCampaignStage.')
WHERE current_campaign_stage LIKE 'app.api.leads.enums.emailCampaignStage.%';

UPDATE leads
SET email_journey_variant = REPLACE(email_journey_variant, 'app.api.leads.enums.emailJourneyVariant.', 'enums.emailJourneyVariant.')
WHERE email_journey_variant LIKE 'app.api.leads.enums.emailJourneyVariant.%';

-- Lead engagements
UPDATE lead_engagements
SET engagement_type = REPLACE(engagement_type, 'app.api.leads.enums.engagementTypes.', 'enums.engagementTypes.')
WHERE engagement_type LIKE 'app.api.leads.enums.engagementTypes.%';

-- ============================================================
-- EMAILS
-- ============================================================
UPDATE emails
SET status = REPLACE(status, 'app.api.emails.enums.emailStatus.', 'enums.status.')
WHERE status LIKE 'app.api.emails.enums.emailStatus.%';

UPDATE emails
SET type = REPLACE(type, 'app.api.emails.enums.emailType.', 'enums.type.')
WHERE type LIKE 'app.api.emails.enums.emailType.%';

UPDATE emails
SET email_provider = REPLACE(email_provider, 'app.api.emails.enums.emailProvider.', 'enums.provider.')
WHERE email_provider LIKE 'app.api.emails.enums.emailProvider.%';

-- IMAP sync status
UPDATE imap_accounts
SET sync_status = REPLACE(sync_status, 'app.api.emails.enums.imapSyncStatus.', 'enums.syncStatus.')
WHERE sync_status LIKE 'app.api.emails.enums.imapSyncStatus.%';

UPDATE imap_folders
SET sync_status = REPLACE(sync_status, 'app.api.emails.enums.imapSyncStatus.', 'enums.syncStatus.')
WHERE sync_status LIKE 'app.api.emails.enums.imapSyncStatus.%';

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
UPDATE subscriptions
SET status = REPLACE(status, 'app.api.subscription.enums.plan.', 'enums.plan.')
WHERE status LIKE 'app.api.subscription.enums.plan.%';

UPDATE subscriptions
SET status = REPLACE(status, 'app.api.subscription.enums.status.', 'enums.status.')
WHERE status LIKE 'app.api.subscription.enums.status.%';

UPDATE subscriptions
SET billing_interval = REPLACE(billing_interval, 'app.api.subscription.enums.billing.', 'enums.billing.')
WHERE billing_interval LIKE 'app.api.subscription.enums.billing.%';

-- ============================================================
-- PAYMENTS
-- ============================================================
UPDATE payment_transactions
SET provider = REPLACE(provider, 'app.api.payment.enums.paymentProvider.', 'enums.paymentProvider.')
WHERE provider LIKE 'app.api.payment.enums.paymentProvider.%';

-- ============================================================
-- JSONB: chat_messages metadata (tool call error strings)
-- ============================================================
UPDATE chat_messages
SET metadata = REPLACE(metadata::text, 'app.api.agent.chat.aiStream.errors.', 'errors.')::jsonb
WHERE metadata::text LIKE '%app.api.agent.chat.aiStream.errors.%';
