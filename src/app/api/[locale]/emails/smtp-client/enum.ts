/**
 * SMTP Configuration Enums
 * Enums for SMTP account configuration and management
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * SMTP Account Status
 * Defines the current status of an SMTP account
 */
export const {
  enum: SmtpAccountStatus,
  options: SmtpAccountStatusOptions,
  Value: SmtpAccountStatusValue,
} = createEnumOptions({
  ACTIVE: "app.api.emails.enums.smtpAccountStatus.active",
  INACTIVE: "app.api.emails.enums.smtpAccountStatus.inactive",
  ERROR: "app.api.emails.enums.smtpAccountStatus.error",
  TESTING: "app.api.emails.enums.smtpAccountStatus.testing",
});

// Create DB enum array for Drizzle
export const SmtpAccountStatusDB = [
  SmtpAccountStatus.ACTIVE,
  SmtpAccountStatus.INACTIVE,
  SmtpAccountStatus.ERROR,
  SmtpAccountStatus.TESTING,
] as const;

/**
 * SMTP Security Type
 * Defines the security/encryption method for SMTP connection
 */
export const {
  enum: SmtpSecurityType,
  options: SmtpSecurityTypeOptions,
  Value: SmtpSecurityTypeValue,
} = createEnumOptions({
  NONE: "app.api.emails.enums.smtpSecurityType.none",
  TLS: "app.api.emails.enums.smtpSecurityType.tls",
  SSL: "app.api.emails.enums.smtpSecurityType.ssl",
  STARTTLS: "app.api.emails.enums.smtpSecurityType.starttls",
});

// Create DB enum array for Drizzle
export const SmtpSecurityTypeDB = [
  SmtpSecurityType.NONE,
  SmtpSecurityType.TLS,
  SmtpSecurityType.SSL,
  SmtpSecurityType.STARTTLS,
] as const;

/**
 * SMTP Account Status Filter
 * For filtering SMTP accounts by status (includes ALL option)
 */
export const {
  enum: SmtpAccountStatusFilter,
  options: SmtpAccountStatusFilterOptions,
  Value: SmtpAccountStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.smtpStatusFilter.all",
  ACTIVE: "app.api.emails.enums.smtpAccountStatus.active",
  INACTIVE: "app.api.emails.enums.smtpAccountStatus.inactive",
  ERROR: "app.api.emails.enums.smtpAccountStatus.error",
  TESTING: "app.api.emails.enums.smtpAccountStatus.testing",
});

// Create DB enum array for Drizzle
export const SmtpAccountStatusFilterDB = [
  SmtpAccountStatusFilter.ALL,
  SmtpAccountStatusFilter.ACTIVE,
  SmtpAccountStatusFilter.INACTIVE,
  SmtpAccountStatusFilter.ERROR,
  SmtpAccountStatusFilter.TESTING,
] as const;

/**
 * SMTP Health Status
 * Defines the health status of an SMTP account
 */
export const {
  enum: SmtpHealthStatus,
  options: SmtpHealthStatusOptions,
  Value: SmtpHealthStatusValue,
} = createEnumOptions({
  HEALTHY: "app.api.emails.enums.smtpHealthStatus.healthy",
  DEGRADED: "app.api.emails.enums.smtpHealthStatus.degraded",
  UNHEALTHY: "app.api.emails.enums.smtpHealthStatus.unhealthy",
  UNKNOWN: "app.api.emails.enums.smtpHealthStatus.unknown",
});

// Create DB enum array for Drizzle
export const SmtpHealthStatusDB = [
  SmtpHealthStatus.HEALTHY,
  SmtpHealthStatus.DEGRADED,
  SmtpHealthStatus.UNHEALTHY,
  SmtpHealthStatus.UNKNOWN,
] as const;

/**
 * SMTP Health Status Filter
 * For filtering SMTP accounts by health status (includes ALL option)
 */
export const {
  enum: SmtpHealthStatusFilter,
  options: SmtpHealthStatusFilterOptions,
  Value: SmtpHealthStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.smtpHealthStatusFilter.all",
  HEALTHY: "app.api.emails.enums.smtpHealthStatus.healthy",
  DEGRADED: "app.api.emails.enums.smtpHealthStatus.degraded",
  UNHEALTHY: "app.api.emails.enums.smtpHealthStatus.unhealthy",
  UNKNOWN: "app.api.emails.enums.smtpHealthStatus.unknown",
});

// Create DB enum array for Drizzle
export const SmtpHealthStatusFilterDB = [
  SmtpHealthStatusFilter.ALL,
  SmtpHealthStatusFilter.HEALTHY,
  SmtpHealthStatusFilter.DEGRADED,
  SmtpHealthStatusFilter.UNHEALTHY,
  SmtpHealthStatusFilter.UNKNOWN,
] as const;

/**
 * SMTP Account Sort Field
 * Defines the fields that can be used for sorting SMTP accounts
 */
export const {
  enum: SmtpAccountSortField,
  options: SmtpAccountSortFieldOptions,
  Value: SmtpAccountSortFieldValue,
} = createEnumOptions({
  NAME: "app.api.emails.enums.smtpSortField.name",
  STATUS: "app.api.emails.enums.smtpSortField.status",
  CREATED_AT: "app.api.emails.enums.smtpSortField.createdAt",
  UPDATED_AT: "app.api.emails.enums.smtpSortField.updatedAt",
  PRIORITY: "app.api.emails.enums.smtpSortField.priority",
  TOTAL_EMAILS_SENT: "app.api.emails.enums.smtpSortField.totalEmailsSent",
  LAST_USED_AT: "app.api.emails.enums.smtpSortField.lastUsedAt",
});

/**
 * Campaign Type
 * Defines the type of campaign for SMTP mapping
 */
export const {
  enum: CampaignType,
  options: CampaignTypeOptions,
  Value: CampaignTypeValue,
} = createEnumOptions({
  LEAD_CAMPAIGN: "app.api.emails.enums.smtpCampaignType.leadCampaign",
  NEWSLETTER: "app.api.emails.enums.smtpCampaignType.newsletter",
  TRANSACTIONAL: "app.api.emails.enums.smtpCampaignType.transactional",
  NOTIFICATION: "app.api.emails.enums.smtpCampaignType.notification",
  SYSTEM: "app.api.emails.enums.smtpCampaignType.system",
});

/**
 * Campaign Type Filter
 * Includes all campaign types plus an "all" option for filtering
 */
export const {
  enum: CampaignTypeFilter,
  options: CampaignTypeFilterOptions,
  Value: CampaignTypeFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.smtpCampaignTypeFilter.all",
  LEAD_CAMPAIGN: "app.api.emails.enums.smtpCampaignType.leadCampaign",
  NEWSLETTER: "app.api.emails.enums.smtpCampaignType.newsletter",
  TRANSACTIONAL: "app.api.emails.enums.smtpCampaignType.transactional",
  NOTIFICATION: "app.api.emails.enums.smtpCampaignType.notification",
  SYSTEM: "app.api.emails.enums.smtpCampaignType.system",
});

/**
 * SMTP Selection Rule Sort Field
 * Defines the fields that can be used for sorting SMTP selection rules
 */
export const {
  enum: SmtpSelectionRuleSortField,
  options: SmtpSelectionRuleSortFieldOptions,
  Value: SmtpSelectionRuleSortFieldValue,
} = createEnumOptions({
  NAME: "app.api.emails.enums.selectionRuleSortField.name",
  PRIORITY: "app.api.emails.enums.selectionRuleSortField.priority",
  CAMPAIGN_TYPE: "app.api.emails.enums.selectionRuleSortField.campaignType",
  JOURNEY_VARIANT: "app.api.emails.enums.selectionRuleSortField.journeyVariant",
  CAMPAIGN_STAGE: "app.api.emails.enums.selectionRuleSortField.campaignStage",
  COUNTRY: "app.api.emails.enums.selectionRuleSortField.country",
  LANGUAGE: "app.api.emails.enums.selectionRuleSortField.language",
  CREATED_AT: "app.api.emails.enums.selectionRuleSortField.createdAt",
  UPDATED_AT: "app.api.emails.enums.selectionRuleSortField.updatedAt",
  EMAILS_SENT: "app.api.emails.enums.selectionRuleSortField.emailsSent",
  SUCCESS_RATE: "app.api.emails.enums.selectionRuleSortField.successRate",
  LAST_USED_AT: "app.api.emails.enums.selectionRuleSortField.lastUsedAt",
});

/**
 * SMTP Selection Rule Status Filter
 * Defines status filters for SMTP selection rules
 */
export const {
  enum: SmtpSelectionRuleStatusFilter,
  options: SmtpSelectionRuleStatusFilterOptions,
  Value: SmtpSelectionRuleStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.emails.enums.selectionRuleStatusFilter.all",
  ACTIVE: "app.api.emails.enums.selectionRuleStatusFilter.active",
  INACTIVE: "app.api.emails.enums.selectionRuleStatusFilter.inactive",
  DEFAULT: "app.api.emails.enums.selectionRuleStatusFilter.default",
  FAILOVER: "app.api.emails.enums.selectionRuleStatusFilter.failover",
});

/**
 * Map campaign type filter to actual campaign type
 */
export function mapCampaignTypeFilter(
  filter:
    | (typeof CampaignTypeFilter)[keyof typeof CampaignTypeFilter]
    | undefined,
): (typeof CampaignType)[keyof typeof CampaignType] | null {
  switch (filter) {
    case CampaignTypeFilter.LEAD_CAMPAIGN:
      return CampaignType.LEAD_CAMPAIGN;
    case CampaignTypeFilter.NEWSLETTER:
      return CampaignType.NEWSLETTER;
    case CampaignTypeFilter.TRANSACTIONAL:
      return CampaignType.TRANSACTIONAL;
    case CampaignTypeFilter.NOTIFICATION:
      return CampaignType.NOTIFICATION;
    case CampaignTypeFilter.SYSTEM:
      return CampaignType.SYSTEM;
    case CampaignTypeFilter.ALL:
    case undefined:
      return null;
    default:
      return null;
  }
}

/**
 * Load Balancing Strategy
 * Defines how to distribute emails across multiple SMTP accounts
 */
export const {
  enum: LoadBalancingStrategy,
  options: LoadBalancingStrategyOptions,
  Value: LoadBalancingStrategyValue,
} = createEnumOptions({
  ROUND_ROBIN: "app.api.emails.enums.loadBalancingStrategy.roundRobin",
  WEIGHTED: "app.api.emails.enums.loadBalancingStrategy.weighted",
  PRIORITY: "app.api.emails.enums.loadBalancingStrategy.priority",
  LEAST_USED: "app.api.emails.enums.loadBalancingStrategy.leastUsed",
});

/**
 * SMTP Connection Test Result
 * Result of testing an SMTP connection
 */
export const {
  enum: SmtpTestResult,
  options: SmtpTestResultOptions,
  Value: SmtpTestResultValue,
} = createEnumOptions({
  SUCCESS: "app.api.emails.enums.testResult.success",
  AUTH_FAILED: "app.api.emails.enums.testResult.authFailed",
  CONNECTION_FAILED: "app.api.emails.enums.testResult.connectionFailed",
  TIMEOUT: "app.api.emails.enums.testResult.timeout",
  UNKNOWN_ERROR: "app.api.emails.enums.testResult.unknownError",
});

/**
 * Map status filter to actual status
 */
export function mapStatusFilter(
  filter:
    | (typeof SmtpAccountStatusFilter)[keyof typeof SmtpAccountStatusFilter]
    | undefined,
): (typeof SmtpAccountStatus)[keyof typeof SmtpAccountStatus] | null {
  switch (filter) {
    case SmtpAccountStatusFilter.ACTIVE:
      return SmtpAccountStatus.ACTIVE;
    case SmtpAccountStatusFilter.INACTIVE:
      return SmtpAccountStatus.INACTIVE;
    case SmtpAccountStatusFilter.ERROR:
      return SmtpAccountStatus.ERROR;
    case SmtpAccountStatusFilter.TESTING:
      return SmtpAccountStatus.TESTING;
    case SmtpAccountStatusFilter.ALL:
    default:
      return null;
  }
}

// Additional DB enum exports for Drizzle
export const SmtpAccountSortFieldDB = [
  SmtpAccountSortField.NAME,
  SmtpAccountSortField.STATUS,
  SmtpAccountSortField.CREATED_AT,
  SmtpAccountSortField.UPDATED_AT,
  SmtpAccountSortField.PRIORITY,
  SmtpAccountSortField.TOTAL_EMAILS_SENT,
  SmtpAccountSortField.LAST_USED_AT,
] as const;

export const CampaignTypeDB = [
  CampaignType.LEAD_CAMPAIGN,
  CampaignType.NEWSLETTER,
  CampaignType.TRANSACTIONAL,
  CampaignType.NOTIFICATION,
  CampaignType.SYSTEM,
] as const;

export const CampaignTypeFilterDB = [
  CampaignTypeFilter.ALL,
  CampaignTypeFilter.LEAD_CAMPAIGN,
  CampaignTypeFilter.NEWSLETTER,
  CampaignTypeFilter.TRANSACTIONAL,
  CampaignTypeFilter.NOTIFICATION,
  CampaignTypeFilter.SYSTEM,
] as const;

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

export const SmtpSelectionRuleStatusFilterDB = [
  SmtpSelectionRuleStatusFilter.ALL,
  SmtpSelectionRuleStatusFilter.ACTIVE,
  SmtpSelectionRuleStatusFilter.INACTIVE,
  SmtpSelectionRuleStatusFilter.DEFAULT,
  SmtpSelectionRuleStatusFilter.FAILOVER,
] as const;

export const LoadBalancingStrategyDB = [
  LoadBalancingStrategy.ROUND_ROBIN,
  LoadBalancingStrategy.WEIGHTED,
  LoadBalancingStrategy.PRIORITY,
  LoadBalancingStrategy.LEAST_USED,
] as const;

export const SmtpTestResultDB = [
  SmtpTestResult.SUCCESS,
  SmtpTestResult.AUTH_FAILED,
  SmtpTestResult.CONNECTION_FAILED,
  SmtpTestResult.TIMEOUT,
  SmtpTestResult.UNKNOWN_ERROR,
] as const;
