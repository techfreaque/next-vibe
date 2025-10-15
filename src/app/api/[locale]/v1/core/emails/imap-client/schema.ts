/**
 * IMAP Client Schema Exports
 * Central export point for IMAP-related types, enums, and schemas
 */

// Export all enums from enum.ts
export {
  ImapAccountFilter,
  ImapAccountFilterOptions,
  ImapAccountFilterValue,
  ImapAccountSortField,
  ImapAccountSortFieldOptions,
  ImapAccountSortFieldValue,
  ImapAccountStatusFilter,
  ImapAccountStatusFilterOptions,
  ImapAccountStatusFilterValue,
  ImapAuthMethod,
  ImapAuthMethodDB,
  ImapAuthMethodOptions,
  ImapAuthMethodValue,
  ImapConnectionStatus,
  ImapConnectionStatusOptions,
  ImapConnectionStatusValue,
  ImapFolderSortField,
  ImapFolderSortFieldOptions,
  ImapFolderSortFieldValue,
  ImapHealthStatus,
  ImapHealthStatusOptions,
  ImapHealthStatusValue,
  ImapMessageSortField,
  ImapMessageSortFieldOptions,
  ImapMessageSortFieldValue,
  ImapMessageStatusFilter,
  ImapMessageStatusFilterOptions,
  ImapMessageStatusFilterValue,
  ImapOverallSyncStatus,
  ImapOverallSyncStatusOptions,
  ImapOverallSyncStatusValue,
  ImapPerformanceStatus,
  ImapPerformanceStatusOptions,
  ImapPerformanceStatusValue,
  ImapSpecialUseType,
  ImapSpecialUseTypeDB,
  ImapSpecialUseTypeOptions,
  ImapSpecialUseTypeValue,
  ImapSyncStatus,
  ImapSyncStatusDB,
  ImapSyncStatusFilter,
  ImapSyncStatusFilterOptions,
  ImapSyncStatusFilterValue,
  ImapSyncStatusOptions,
  ImapSyncStatusValue,
  SortOrder,
  SortOrderOptions,
  SortOrderValue,
} from "./enum";

// Export account-related types
export type {
  ImapAccountDeleteRequestInput,
  ImapAccountDeleteRequestOutput,
  ImapAccountDeleteResponseInput,
  ImapAccountDeleteResponseOutput,
  ImapAccountGetRequestInput,
  ImapAccountGetRequestOutput,
  ImapAccountGetResponseInput,
  ImapAccountGetResponseOutput,
  ImapAccountPutRequestInput,
  ImapAccountPutRequestOutput,
  ImapAccountPutResponseInput,
  ImapAccountPutResponseOutput,
} from "./accounts/[id]/definition";
export type {
  ImapAccountCreatePostRequestInput,
  ImapAccountCreatePostRequestOutput,
  ImapAccountCreatePostResponseInput,
  ImapAccountCreatePostResponseOutput,
  ImapAccountCreateRequestInput,
  ImapAccountCreateRequestOutput,
  ImapAccountCreateResponseInput,
  ImapAccountCreateResponseOutput,
} from "./accounts/create/definition";
export type {
  ImapAccountsListRequestInput,
  ImapAccountsListRequestOutput,
  ImapAccountsListResponseInput,
  ImapAccountsListResponseOutput,
} from "./accounts/list/definition";

// Export folder-related types
export type {
  ImapFoldersListRequestInput,
  ImapFoldersListRequestOutput,
  ImapFoldersListResponseInput,
  ImapFoldersListResponseOutput,
} from "./folders/list/definition";

// Export message-related types
export type {
  ImapMessagesListGetRequestInput,
  ImapMessagesListGetRequestOutput,
  ImapMessagesListGetResponseInput,
  ImapMessagesListGetResponseOutput,
} from "./messages/list/definition";

// Export config types
export type {
  ConfigGetRequestOutput,
  ConfigGetResponseOutput,
  ConfigUpdateRequestOutput,
  ConfigUpdateResponseOutput,
  ImapConfigGetRequestInput,
  ImapConfigGetRequestOutput,
  ImapConfigGetResponseInput,
  ImapConfigGetResponseOutput,
  ImapConfigPostRequestInput,
  ImapConfigPostRequestOutput,
  ImapConfigPostResponseInput,
  ImapConfigPostResponseOutput,
} from "./config/definition";

// Export health types
export type {
  ImapHealthGetRequestOutput,
  ImapHealthGetResponseOutput,
  ImapHealthRequestInput,
  ImapHealthRequestOutput,
  ImapHealthResponseInput,
  ImapHealthResponseOutput,
} from "./health/definition";
