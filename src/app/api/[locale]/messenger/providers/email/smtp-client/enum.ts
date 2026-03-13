/**
 * SMTP-specific Enums
 * Only SMTP-specific sort/filter enums live here.
 * Channel/status/security/health/campaign enums are in ../accounts/enum.
 */
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * SMTP Account Sort Field
 * Defines the fields that can be used for sorting SMTP accounts
 */
export const {
  enum: SmtpAccountSortField,
  options: SmtpAccountSortFieldOptions,
  Value: SmtpAccountSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  NAME: "enums.sortField.name",
  STATUS: "enums.sortField.status",
  CREATED_AT: "enums.sortField.createdAt",
  UPDATED_AT: "enums.sortField.updatedAt",
  PRIORITY: "enums.sortField.priority",
  TOTAL_EMAILS_SENT: "enums.sortField.totalEmailsSent",
  LAST_USED_AT: "enums.sortField.lastUsedAt",
});

export const SmtpAccountSortFieldDB = [
  SmtpAccountSortField.NAME,
  SmtpAccountSortField.STATUS,
  SmtpAccountSortField.CREATED_AT,
  SmtpAccountSortField.UPDATED_AT,
  SmtpAccountSortField.PRIORITY,
  SmtpAccountSortField.TOTAL_EMAILS_SENT,
  SmtpAccountSortField.LAST_USED_AT,
] as const;

/**
 * SMTP Selection Rule Sort Field
 * Defines the fields that can be used for sorting SMTP selection rules
 */
export const {
  enum: SmtpSelectionRuleSortField,
  options: SmtpSelectionRuleSortFieldOptions,
  Value: SmtpSelectionRuleSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  NAME: "enums.selectionRuleSortField.name",
  PRIORITY: "enums.selectionRuleSortField.priority",
  CAMPAIGN_TYPE: "enums.selectionRuleSortField.campaignType",
  JOURNEY_VARIANT: "enums.selectionRuleSortField.journeyVariant",
  CAMPAIGN_STAGE: "enums.selectionRuleSortField.campaignStage",
  COUNTRY: "enums.selectionRuleSortField.country",
  LANGUAGE: "enums.selectionRuleSortField.language",
  CREATED_AT: "enums.selectionRuleSortField.createdAt",
  UPDATED_AT: "enums.selectionRuleSortField.updatedAt",
  EMAILS_SENT: "enums.selectionRuleSortField.emailsSent",
  SUCCESS_RATE: "enums.selectionRuleSortField.successRate",
  LAST_USED_AT: "enums.selectionRuleSortField.lastUsedAt",
});

export const SmtpSelectionRuleSortFieldDB = [
  SmtpSelectionRuleSortField.NAME,
  SmtpSelectionRuleSortField.PRIORITY,
  SmtpSelectionRuleSortField.CAMPAIGN_TYPE,
  SmtpSelectionRuleSortField.JOURNEY_VARIANT,
  SmtpSelectionRuleSortField.CAMPAIGN_STAGE,
  SmtpSelectionRuleSortField.COUNTRY,
  SmtpSelectionRuleSortField.LANGUAGE,
  SmtpSelectionRuleSortField.CREATED_AT,
  SmtpSelectionRuleSortField.UPDATED_AT,
  SmtpSelectionRuleSortField.EMAILS_SENT,
  SmtpSelectionRuleSortField.SUCCESS_RATE,
  SmtpSelectionRuleSortField.LAST_USED_AT,
] as const;

/**
 * SMTP Selection Rule Status Filter
 * Defines status filters for SMTP selection rules
 */
export const {
  enum: SmtpSelectionRuleStatusFilter,
  options: SmtpSelectionRuleStatusFilterOptions,
  Value: SmtpSelectionRuleStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.selectionRuleStatusFilter.all",
  ACTIVE: "enums.selectionRuleStatusFilter.active",
  INACTIVE: "enums.selectionRuleStatusFilter.inactive",
  DEFAULT: "enums.selectionRuleStatusFilter.default",
  FAILOVER: "enums.selectionRuleStatusFilter.failover",
});

export const SmtpSelectionRuleStatusFilterDB = [
  SmtpSelectionRuleStatusFilter.ANY,
  SmtpSelectionRuleStatusFilter.ACTIVE,
  SmtpSelectionRuleStatusFilter.INACTIVE,
  SmtpSelectionRuleStatusFilter.DEFAULT,
  SmtpSelectionRuleStatusFilter.FAILOVER,
] as const;

/**
 * SMTP Connection Test Result
 * Result of testing an SMTP connection
 */
export const {
  enum: SmtpTestResult,
  options: SmtpTestResultOptions,
  Value: SmtpTestResultValue,
} = createEnumOptions(scopedTranslation, {
  SUCCESS: "enums.testResult.success",
  AUTH_FAILED: "enums.testResult.authFailed",
  CONNECTION_FAILED: "enums.testResult.connectionFailed",
  TIMEOUT: "enums.testResult.timeout",
  UNKNOWN_ERROR: "enums.testResult.unknownError",
});

export const SmtpTestResultDB = [
  SmtpTestResult.SUCCESS,
  SmtpTestResult.AUTH_FAILED,
  SmtpTestResult.CONNECTION_FAILED,
  SmtpTestResult.TIMEOUT,
  SmtpTestResult.UNKNOWN_ERROR,
] as const;
