/**
 * SMTP Client Schema Exports
 * Central export point for SMTP-related types, enums, and schemas
 */

// Export all enums from enum.ts
export {
  CampaignType,
  CampaignTypeDB,
  CampaignTypeFilter,
  CampaignTypeFilterDB,
  CampaignTypeFilterOptions,
  CampaignTypeFilterValue,
  CampaignTypeOptions,
  type CampaignTypeValue,
  LoadBalancingStrategy,
  LoadBalancingStrategyDB,
  LoadBalancingStrategyOptions,
  LoadBalancingStrategyValue,
  mapCampaignTypeFilter,
  mapStatusFilter,
  SmtpAccountSortField,
  SmtpAccountSortFieldDB,
  SmtpAccountSortFieldOptions,
  SmtpAccountSortFieldValue,
  SmtpAccountStatus,
  SmtpAccountStatusDB,
  SmtpAccountStatusFilter,
  SmtpAccountStatusFilterDB,
  SmtpAccountStatusFilterOptions,
  SmtpAccountStatusFilterValue,
  SmtpAccountStatusOptions,
  SmtpAccountStatusValue,
  SmtpHealthStatus,
  SmtpHealthStatusDB,
  SmtpHealthStatusFilter,
  SmtpHealthStatusFilterDB,
  SmtpHealthStatusFilterOptions,
  SmtpHealthStatusFilterValue,
  SmtpHealthStatusOptions,
  SmtpHealthStatusValue,
  SmtpSecurityType,
  SmtpSecurityTypeDB,
  SmtpSecurityTypeOptions,
  SmtpSecurityTypeValue,
  SmtpSelectionRuleSortField,
  SmtpSelectionRuleSortFieldDB,
  SmtpSelectionRuleSortFieldOptions,
  SmtpSelectionRuleSortFieldValue,
  SmtpSelectionRuleStatusFilter,
  SmtpSelectionRuleStatusFilterDB,
  SmtpSelectionRuleStatusFilterOptions,
  SmtpSelectionRuleStatusFilterValue,
  SmtpTestResult,
  SmtpTestResultDB,
  SmtpTestResultOptions,
  SmtpTestResultValue,
} from "./enum";

// Export account-related types
export type {
  SmtpAccountCreateRequestInput,
  SmtpAccountCreateRequestOutput,
  SmtpAccountCreateResponseInput,
  SmtpAccountCreateResponseOutput,
} from "./create/definition";
export type {
  SmtpAccountEditGETRequestInput,
  SmtpAccountEditGETRequestOutput,
  SmtpAccountEditGETResponseInput,
  SmtpAccountEditGETResponseOutput,
  SmtpAccountEditPUTRequestInput,
  SmtpAccountEditPUTRequestOutput,
  SmtpAccountEditPUTResponseInput,
  SmtpAccountEditPUTResponseOutput,
} from "./edit/[id]/definition";
export type {
  SmtpAccountsListGETRequestInput,
  SmtpAccountsListGETRequestOutput,
  SmtpAccountsListGETResponseInput,
  SmtpAccountsListGETResponseOutput,
} from "./list/definition";
