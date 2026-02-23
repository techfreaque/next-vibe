/**
 * SMTP Configuration Enums
 * Enums for SMTP account configuration and management
 */
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * SMTP Account Status
 * Defines the current status of an SMTP account
 */
export const {
  enum: SmtpAccountStatus,
  options: SmtpAccountStatusOptions,
  Value: SmtpAccountStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "enums.status.active",
  INACTIVE: "enums.status.inactive",
  ERROR: "enums.status.error",
  TESTING: "enums.status.testing",
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
} = createEnumOptions(scopedTranslation, {
  NONE: "enums.securityType.none",
  TLS: "enums.securityType.tls",
  SSL: "enums.securityType.ssl",
  STARTTLS: "enums.securityType.starttls",
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
 * For filtering SMTP accounts by status (includes ANY option)
 */
export const {
  enum: SmtpAccountStatusFilter,
  options: SmtpAccountStatusFilterOptions,
  Value: SmtpAccountStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.statusFilter.all",
  ACTIVE: "enums.status.active",
  INACTIVE: "enums.status.inactive",
  ERROR: "enums.status.error",
  TESTING: "enums.status.testing",
});

// Create DB enum array for Drizzle
export const SmtpAccountStatusFilterDB = [
  SmtpAccountStatusFilter.ANY,
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
} = createEnumOptions(scopedTranslation, {
  HEALTHY: "enums.healthStatus.healthy",
  DEGRADED: "enums.healthStatus.degraded",
  UNHEALTHY: "enums.healthStatus.unhealthy",
  UNKNOWN: "enums.healthStatus.unknown",
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
 * For filtering SMTP accounts by health status (includes ANY option)
 */
export const {
  enum: SmtpHealthStatusFilter,
  options: SmtpHealthStatusFilterOptions,
  Value: SmtpHealthStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.healthStatusFilter.all",
  HEALTHY: "enums.healthStatus.healthy",
  DEGRADED: "enums.healthStatus.degraded",
  UNHEALTHY: "enums.healthStatus.unhealthy",
  UNKNOWN: "enums.healthStatus.unknown",
});

// Create DB enum array for Drizzle
export const SmtpHealthStatusFilterDB = [
  SmtpHealthStatusFilter.ANY,
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
} = createEnumOptions(scopedTranslation, {
  NAME: "enums.sortField.name",
  STATUS: "enums.sortField.status",
  CREATED_AT: "enums.sortField.createdAt",
  UPDATED_AT: "enums.sortField.updatedAt",
  PRIORITY: "enums.sortField.priority",
  TOTAL_EMAILS_SENT: "enums.sortField.totalEmailsSent",
  LAST_USED_AT: "enums.sortField.lastUsedAt",
});

/**
 * Campaign Type
 * Defines the type of campaign for SMTP mapping
 */
export const {
  enum: CampaignType,
  options: CampaignTypeOptions,
  Value: CampaignTypeValue,
} = createEnumOptions(scopedTranslation, {
  LEAD_CAMPAIGN: "enums.campaignType.leadCampaign",
  NEWSLETTER: "enums.campaignType.newsletter",
  SIGNUP_NURTURE: "enums.campaignType.signupNurture",
  RETENTION: "enums.campaignType.retention",
  WINBACK: "enums.campaignType.winback",
  TRANSACTIONAL: "enums.campaignType.transactional",
  NOTIFICATION: "enums.campaignType.notification",
  SYSTEM: "enums.campaignType.system",
});

/**
 * Campaign Type Filter
 * Includes all campaign types plus an "any" option for filtering
 */
export const {
  enum: CampaignTypeFilter,
  options: CampaignTypeFilterOptions,
  Value: CampaignTypeFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.campaignTypeFilter.all",
  LEAD_CAMPAIGN: "enums.campaignType.leadCampaign",
  NEWSLETTER: "enums.campaignType.newsletter",
  SIGNUP_NURTURE: "enums.campaignType.signupNurture",
  RETENTION: "enums.campaignType.retention",
  WINBACK: "enums.campaignType.winback",
  TRANSACTIONAL: "enums.campaignType.transactional",
  NOTIFICATION: "enums.campaignType.notification",
  SYSTEM: "enums.campaignType.system",
});

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
    case CampaignTypeFilter.SIGNUP_NURTURE:
      return CampaignType.SIGNUP_NURTURE;
    case CampaignTypeFilter.RETENTION:
      return CampaignType.RETENTION;
    case CampaignTypeFilter.WINBACK:
      return CampaignType.WINBACK;
    case CampaignTypeFilter.TRANSACTIONAL:
      return CampaignType.TRANSACTIONAL;
    case CampaignTypeFilter.NOTIFICATION:
      return CampaignType.NOTIFICATION;
    case CampaignTypeFilter.SYSTEM:
      return CampaignType.SYSTEM;
    case CampaignTypeFilter.ANY:
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
} = createEnumOptions(scopedTranslation, {
  ROUND_ROBIN: "enums.loadBalancingStrategy.roundRobin",
  WEIGHTED: "enums.loadBalancingStrategy.weighted",
  PRIORITY: "enums.loadBalancingStrategy.priority",
  LEAST_USED: "enums.loadBalancingStrategy.leastUsed",
});

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
    case SmtpAccountStatusFilter.ANY:
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
  CampaignType.SIGNUP_NURTURE,
  CampaignType.RETENTION,
  CampaignType.WINBACK,
  CampaignType.TRANSACTIONAL,
  CampaignType.NOTIFICATION,
  CampaignType.SYSTEM,
] as const;

export const CampaignTypeFilterDB = [
  CampaignTypeFilter.ANY,
  CampaignTypeFilter.LEAD_CAMPAIGN,
  CampaignTypeFilter.NEWSLETTER,
  CampaignTypeFilter.SIGNUP_NURTURE,
  CampaignTypeFilter.RETENTION,
  CampaignTypeFilter.WINBACK,
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
  SmtpSelectionRuleStatusFilter.ANY,
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
