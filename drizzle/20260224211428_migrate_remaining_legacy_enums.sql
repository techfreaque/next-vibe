-- Migration: Fix all remaining legacy app.api.* enum keys across all tables

-- ============================================================
-- CHAT FAVORITES: model_selection JSONB
-- Step 1: specific sort prefix first (sort.* lives under modelSelection.sort.*)
-- Step 2: strip remaining app.api.agent.chat.favorites.* prefix
-- ============================================================
UPDATE chat_favorites
SET model_selection = REPLACE(
  model_selection::text,
  'app.api.agent.chat.favorites.modelSelection.sort.',
  'sort.'
)::jsonb
WHERE model_selection::text LIKE '%app.api.agent.chat.favorites.modelSelection.sort.%';

UPDATE chat_favorites
SET model_selection = REPLACE(
  model_selection::text,
  'app.api.agent.chat.favorites.',
  ''
)::jsonb
WHERE model_selection::text LIKE '%app.api.agent.chat.favorites.%';

-- ============================================================
-- CHAT FAVORITES: voice
-- app.api.agent.textToSpeech.voices.* → voices.*
-- ============================================================
UPDATE chat_favorites
SET voice = REPLACE(voice, 'app.api.agent.textToSpeech.voices.', 'voices.')
WHERE voice LIKE 'app.api.agent.textToSpeech.voices.%';

-- ============================================================
-- CUSTOM CHARACTERS: voice
-- app.api.agent.textToSpeech.voices.* → voices.*
-- ============================================================
UPDATE custom_characters
SET voice = REPLACE(voice, 'app.api.agent.textToSpeech.voices.', 'voices.')
WHERE voice LIKE 'app.api.agent.textToSpeech.voices.%';

-- ============================================================
-- CUSTOM CHARACTERS: category
-- app.api.agent.chat.characters.enums.category.* → enums.category.*
-- ============================================================
UPDATE custom_characters
SET category = REPLACE(category, 'app.api.agent.chat.characters.enums.category.', 'enums.category.')
WHERE category LIKE 'app.api.agent.chat.characters.enums.category.%';

-- ============================================================
-- CUSTOM CHARACTERS: ownership_type
-- app.api.agent.chat.characters.enums.ownershipType.* → enums.ownershipType.*
-- ============================================================
UPDATE custom_characters
SET ownership_type = REPLACE(ownership_type, 'app.api.agent.chat.characters.enums.ownershipType.', 'enums.ownershipType.')
WHERE ownership_type LIKE 'app.api.agent.chat.characters.enums.ownershipType.%';

-- ============================================================
-- CUSTOM CHARACTERS: model_selection JSONB (same prefix pattern as favorites)
-- ============================================================
UPDATE custom_characters
SET model_selection = REPLACE(
  model_selection::text,
  'app.api.agent.chat.favorites.modelSelection.sort.',
  'sort.'
)::jsonb
WHERE model_selection::text LIKE '%app.api.agent.chat.favorites.modelSelection.sort.%';

UPDATE custom_characters
SET model_selection = REPLACE(
  model_selection::text,
  'app.api.agent.chat.favorites.',
  ''
)::jsonb
WHERE model_selection::text LIKE '%app.api.agent.chat.favorites.%';

-- ============================================================
-- CRON TASK EXECUTIONS: priority (was missed in previous migration)
-- app.api.system.unifiedInterface.tasks.priority.* → priority.*
-- ============================================================
UPDATE cron_task_executions
SET priority = REPLACE(priority, 'app.api.system.unifiedInterface.tasks.priority.', 'priority.')
WHERE priority LIKE 'app.api.system.unifiedInterface.tasks.priority.%';

UPDATE cron_task_executions
SET priority = REPLACE(priority, 'app.api.system.unifiedInterface.tasks.cronTaskPriority.', 'priority.')
WHERE priority LIKE 'app.api.system.unifiedInterface.tasks.cronTaskPriority.%';

-- ============================================================
-- CHAT SETTINGS: view_mode JSONB
-- app.api.agent.chat.enums.viewMode.* → enums.viewMode.*
-- ============================================================
UPDATE chat_settings
SET view_mode = REPLACE(
  view_mode::text,
  'app.api.agent.chat.enums.viewMode.',
  'enums.viewMode.'
)::jsonb
WHERE view_mode::text LIKE '%app.api.agent.chat.enums.viewMode.%';

-- ============================================================
-- CREDIT PACKS: type
-- app.api.credits.enums.packType.* → enums.packType.*
-- ============================================================
UPDATE credit_packs
SET type = REPLACE(type, 'app.api.credits.enums.packType.', 'enums.packType.')
WHERE type LIKE 'app.api.credits.enums.packType.%';

-- ============================================================
-- EMAIL CAMPAIGNS: campaign_type
-- app.api.emails.enums.smtpCampaignType.* → enums.campaignType.*
-- ============================================================
UPDATE email_campaigns
SET campaign_type = REPLACE(campaign_type, 'app.api.emails.enums.smtpCampaignType.', 'enums.campaignType.')
WHERE campaign_type LIKE 'app.api.emails.enums.smtpCampaignType.%';

-- ============================================================
-- EMAIL CAMPAIGNS: journey_variant
-- app.api.leads.enums.emailJourneyVariant.* → enums.emailJourneyVariant.*
-- ============================================================
UPDATE email_campaigns
SET journey_variant = REPLACE(journey_variant, 'app.api.leads.enums.emailJourneyVariant.', 'enums.emailJourneyVariant.')
WHERE journey_variant LIKE 'app.api.leads.enums.emailJourneyVariant.%';

-- ============================================================
-- EMAIL CAMPAIGNS: stage
-- app.api.leads.enums.emailCampaignStage.* → enums.emailCampaignStage.*
-- ============================================================
UPDATE email_campaigns
SET stage = REPLACE(stage, 'app.api.leads.enums.emailCampaignStage.', 'enums.emailCampaignStage.')
WHERE stage LIKE 'app.api.leads.enums.emailCampaignStage.%';

-- ============================================================
-- EMAIL CAMPAIGNS: status
-- app.api.emails.enums.emailStatus.* → enums.status.*
-- ============================================================
UPDATE email_campaigns
SET status = REPLACE(status, 'app.api.emails.enums.emailStatus.', 'enums.status.')
WHERE status LIKE 'app.api.emails.enums.emailStatus.%';

-- ============================================================
-- EMAILS: sync_status
-- app.api.emails.enums.imapSyncStatus.* → enums.syncStatus.*
-- ============================================================
UPDATE emails
SET sync_status = REPLACE(sync_status, 'app.api.emails.enums.imapSyncStatus.', 'enums.syncStatus.')
WHERE sync_status LIKE 'app.api.emails.enums.imapSyncStatus.%';

-- ============================================================
-- PULSE EXECUTIONS: health_status
-- app.api.system.unifiedInterface.tasks.pulse.health.* → pulse.health.*
-- ============================================================
UPDATE pulse_executions
SET health_status = REPLACE(health_status, 'app.api.system.unifiedInterface.tasks.pulse.health.', 'pulse.health.')
WHERE health_status LIKE 'app.api.system.unifiedInterface.tasks.pulse.health.%';

-- ============================================================
-- SMTP ACCOUNTS: status
-- app.api.emails.enums.smtpAccountStatus.* → enums.status.*
-- ============================================================
UPDATE smtp_accounts
SET status = REPLACE(status, 'app.api.emails.enums.smtpAccountStatus.', 'enums.status.')
WHERE status LIKE 'app.api.emails.enums.smtpAccountStatus.%';

-- ============================================================
-- SMTP ACCOUNTS: security_type
-- app.api.emails.enums.smtpSecurityType.* → enums.securityType.*
-- ============================================================
UPDATE smtp_accounts
SET security_type = REPLACE(security_type, 'app.api.emails.enums.smtpSecurityType.', 'enums.securityType.')
WHERE security_type LIKE 'app.api.emails.enums.smtpSecurityType.%';

-- ============================================================
-- SMTP ACCOUNTS: health_check_status
-- app.api.emails.enums.smtpHealthStatus.* → enums.healthStatus.*
-- ============================================================
UPDATE smtp_accounts
SET health_check_status = REPLACE(health_check_status, 'app.api.emails.enums.smtpHealthStatus.', 'enums.healthStatus.')
WHERE health_check_status LIKE 'app.api.emails.enums.smtpHealthStatus.%';

-- ============================================================
-- SMTP ACCOUNTS: campaign_types JSONB (array of campaign type strings)
-- app.api.emails.enums.smtpCampaignType.* → enums.campaignType.*
-- ============================================================
UPDATE smtp_accounts
SET campaign_types = REPLACE(
  campaign_types::text,
  'app.api.emails.enums.smtpCampaignType.',
  'enums.campaignType.'
)::jsonb
WHERE campaign_types::text LIKE '%app.api.emails.enums.smtpCampaignType.%';
