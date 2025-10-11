/**
 * Agent API Enums with Translation Options
 * Defines enumeration values with automatic translation option generation
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Email Agent Processing Status
 */
export const {
  enum: EmailAgentStatus,
  options: EmailAgentStatusOptions,
  Value: EmailAgentStatusValue,
} = createEnumOptions({
  PENDING: "app.api.v1.core.agent.enums.emailAgentStatus.pending",
  PROCESSING: "app.api.v1.core.agent.enums.emailAgentStatus.processing",
  HARD_RULES_COMPLETE:
    "app.api.v1.core.agent.enums.emailAgentStatus.hardRulesComplete",
  AI_PROCESSING: "app.api.v1.core.agent.enums.emailAgentStatus.aiProcessing",
  AWAITING_CONFIRMATION:
    "app.api.v1.core.agent.enums.emailAgentStatus.awaitingConfirmation",
  COMPLETED: "app.api.v1.core.agent.enums.emailAgentStatus.completed",
  FAILED: "app.api.v1.core.agent.enums.emailAgentStatus.failed",
  SKIPPED: "app.api.v1.core.agent.enums.emailAgentStatus.skipped",
});

// Create DB enum array for Drizzle
export const EmailAgentStatusDB = [
  EmailAgentStatus.PENDING,
  EmailAgentStatus.PROCESSING,
  EmailAgentStatus.HARD_RULES_COMPLETE,
  EmailAgentStatus.AI_PROCESSING,
  EmailAgentStatus.AWAITING_CONFIRMATION,
  EmailAgentStatus.COMPLETED,
  EmailAgentStatus.FAILED,
  EmailAgentStatus.SKIPPED,
] as const;

/**
 * Email Agent Action Types
 */
export const {
  enum: EmailAgentActionType,
  options: EmailAgentActionTypeOptions,
  Value: EmailAgentActionTypeValue,
} = createEnumOptions({
  // Hard rule actions
  MARK_BOUNCED: "app.api.v1.core.agent.enums.emailAgentActionType.markBounced",
  MARK_SPAM: "app.api.v1.core.agent.enums.emailAgentActionType.markSpam",
  CLASSIFY_DELIVERY_FAILURE:
    "app.api.v1.core.agent.enums.emailAgentActionType.classifyDeliveryFailure",

  // AI-powered actions
  RESPOND_TO_EMAIL:
    "app.api.v1.core.agent.enums.emailAgentActionType.respondToEmail",
  DELETE_EMAIL: "app.api.v1.core.agent.enums.emailAgentActionType.deleteEmail",
  SEARCH_KNOWLEDGE_BASE:
    "app.api.v1.core.agent.enums.emailAgentActionType.searchKnowledgeBase",
  WEB_SEARCH: "app.api.v1.core.agent.enums.emailAgentActionType.webSearch",
  ESCALATE_TO_HUMAN:
    "app.api.v1.core.agent.enums.emailAgentActionType.escalateToHuman",

  // System actions
  NO_ACTION: "app.api.v1.core.agent.enums.emailAgentActionType.noAction",
  CHAIN_ANALYSIS:
    "app.api.v1.core.agent.enums.emailAgentActionType.chainAnalysis",
});

// Create DB enum array for Drizzle
export const EmailAgentActionTypeDB = [
  EmailAgentActionType.MARK_BOUNCED,
  EmailAgentActionType.MARK_SPAM,
  EmailAgentActionType.CLASSIFY_DELIVERY_FAILURE,
  EmailAgentActionType.RESPOND_TO_EMAIL,
  EmailAgentActionType.DELETE_EMAIL,
  EmailAgentActionType.SEARCH_KNOWLEDGE_BASE,
  EmailAgentActionType.WEB_SEARCH,
  EmailAgentActionType.ESCALATE_TO_HUMAN,
  EmailAgentActionType.NO_ACTION,
  EmailAgentActionType.CHAIN_ANALYSIS,
] as const;

/**
 * Email Agent Tool Types
 */
export const {
  enum: EmailAgentToolType,
  options: EmailAgentToolTypeOptions,
  Value: EmailAgentToolTypeValue,
} = createEnumOptions({
  KNOWLEDGE_BASE_SEARCH:
    "app.api.v1.core.agent.enums.emailAgentToolType.knowledgeBaseSearch",
  EMAIL_RESPONSE:
    "app.api.v1.core.agent.enums.emailAgentToolType.emailResponse",
  EMAIL_DELETE: "app.api.v1.core.agent.enums.emailAgentToolType.emailDelete",
  WEB_SEARCH: "app.api.v1.core.agent.enums.emailAgentToolType.webSearch",
});

// Create DB enum array for Drizzle
export const EmailAgentToolTypeDB = [
  EmailAgentToolType.KNOWLEDGE_BASE_SEARCH,
  EmailAgentToolType.EMAIL_RESPONSE,
  EmailAgentToolType.EMAIL_DELETE,
  EmailAgentToolType.WEB_SEARCH,
] as const;

/**
 * Bounce Category Types
 */
export const {
  enum: BounceCategory,
  options: BounceCategoryOptions,
  Value: BounceCategoryValue,
} = createEnumOptions({
  HARD_BOUNCE: "app.api.v1.core.agent.enums.bounceCategory.hardBounce",
  SOFT_BOUNCE: "app.api.v1.core.agent.enums.bounceCategory.softBounce",
  SPAM_COMPLAINT: "app.api.v1.core.agent.enums.bounceCategory.spamComplaint",
  UNSUBSCRIBE: "app.api.v1.core.agent.enums.bounceCategory.unsubscribe",
  BLOCK_BOUNCE: "app.api.v1.core.agent.enums.bounceCategory.blockBounce",
  INVALID_ADDRESS: "app.api.v1.core.agent.enums.bounceCategory.invalidAddress",
  MAILBOX_FULL: "app.api.v1.core.agent.enums.bounceCategory.mailboxFull",
  CONTENT_REJECTED:
    "app.api.v1.core.agent.enums.bounceCategory.contentRejected",
});

// Create DB enum array for Drizzle
export const BounceCategoryDB = [
  BounceCategory.HARD_BOUNCE,
  BounceCategory.SOFT_BOUNCE,
  BounceCategory.SPAM_COMPLAINT,
  BounceCategory.UNSUBSCRIBE,
  BounceCategory.BLOCK_BOUNCE,
  BounceCategory.INVALID_ADDRESS,
  BounceCategory.MAILBOX_FULL,
  BounceCategory.CONTENT_REJECTED,
] as const;

/**
 * Human Confirmation Status
 */
export const {
  enum: ConfirmationStatus,
  options: ConfirmationStatusOptions,
  Value: ConfirmationStatusValue,
} = createEnumOptions({
  PENDING: "app.api.v1.core.agent.enums.confirmationStatus.pending",
  APPROVED: "app.api.v1.core.agent.enums.confirmationStatus.approved",
  REJECTED: "app.api.v1.core.agent.enums.confirmationStatus.rejected",
  EXPIRED: "app.api.v1.core.agent.enums.confirmationStatus.expired",
});

// Create DB enum array for Drizzle
export const ConfirmationStatusDB = [
  ConfirmationStatus.PENDING,
  ConfirmationStatus.APPROVED,
  ConfirmationStatus.REJECTED,
  ConfirmationStatus.EXPIRED,
] as const;

/**
 * Email Agent Processing Priority
 */
export const {
  enum: ProcessingPriority,
  options: ProcessingPriorityOptions,
  Value: ProcessingPriorityValue,
} = createEnumOptions({
  LOW: "app.api.v1.core.agent.enums.processingPriority.low",
  NORMAL: "app.api.v1.core.agent.enums.processingPriority.normal",
  HIGH: "app.api.v1.core.agent.enums.processingPriority.high",
  URGENT: "app.api.v1.core.agent.enums.processingPriority.urgent",
});

// Create DB enum array for Drizzle
export const ProcessingPriorityDB = [
  ProcessingPriority.LOW,
  ProcessingPriority.NORMAL,
  ProcessingPriority.HIGH,
  ProcessingPriority.URGENT,
] as const;

/**
 * Sort order enumeration
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions({
  ASC: "app.api.v1.core.agent.enums.sortOrder.asc",
  DESC: "app.api.v1.core.agent.enums.sortOrder.desc",
});

// Create DB enum array for Drizzle
export const SortOrderDB = [SortOrder.ASC, SortOrder.DESC] as const;

/**
 * Email Agent Sort Fields
 */
export const {
  enum: EmailAgentSortField,
  options: EmailAgentSortFieldOptions,
  Value: EmailAgentSortFieldValue,
} = createEnumOptions({
  EMAIL_ID: "app.api.v1.core.agent.enums.emailAgentSortField.emailId",
  STATUS: "app.api.v1.core.agent.enums.emailAgentSortField.status",
  LAST_PROCESSED_AT:
    "app.api.v1.core.agent.enums.emailAgentSortField.lastProcessedAt",
  CREATED_AT: "app.api.v1.core.agent.enums.emailAgentSortField.createdAt",
  PRIORITY: "app.api.v1.core.agent.enums.emailAgentSortField.priority",
});

// Create DB enum array for Drizzle
export const EmailAgentSortFieldDB = [
  EmailAgentSortField.EMAIL_ID,
  EmailAgentSortField.STATUS,
  EmailAgentSortField.LAST_PROCESSED_AT,
  EmailAgentSortField.CREATED_AT,
  EmailAgentSortField.PRIORITY,
] as const;

/**
 * Email Agent Status Filter (includes "all" option)
 */
export const {
  enum: EmailAgentStatusFilter,
  options: EmailAgentStatusFilterOptions,
  Value: EmailAgentStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.agent.enums.emailAgentStatusFilter.all",
  PENDING: "app.api.v1.core.agent.enums.emailAgentStatusFilter.pending",
  PROCESSING: "app.api.v1.core.agent.enums.emailAgentStatusFilter.processing",
  HARD_RULES_COMPLETE:
    "app.api.v1.core.agent.enums.emailAgentStatusFilter.hardRulesComplete",
  AI_PROCESSING:
    "app.api.v1.core.agent.enums.emailAgentStatusFilter.aiProcessing",
  AWAITING_CONFIRMATION:
    "app.api.v1.core.agent.enums.emailAgentStatusFilter.awaitingConfirmation",
  COMPLETED: "app.api.v1.core.agent.enums.emailAgentStatusFilter.completed",
  FAILED: "app.api.v1.core.agent.enums.emailAgentStatusFilter.failed",
  SKIPPED: "app.api.v1.core.agent.enums.emailAgentStatusFilter.skipped",
});

// Create DB enum array for Drizzle
export const EmailAgentStatusFilterDB = [
  EmailAgentStatusFilter.ALL,
  EmailAgentStatusFilter.PENDING,
  EmailAgentStatusFilter.PROCESSING,
  EmailAgentStatusFilter.HARD_RULES_COMPLETE,
  EmailAgentStatusFilter.AI_PROCESSING,
  EmailAgentStatusFilter.AWAITING_CONFIRMATION,
  EmailAgentStatusFilter.COMPLETED,
  EmailAgentStatusFilter.FAILED,
  EmailAgentStatusFilter.SKIPPED,
] as const;

/**
 * Email Agent Action Type Filter (includes "all" option)
 */
export const {
  enum: EmailAgentActionTypeFilter,
  options: EmailAgentActionTypeFilterOptions,
  Value: EmailAgentActionTypeFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.all",
  MARK_BOUNCED:
    "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.markBounced",
  MARK_SPAM: "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.markSpam",
  CLASSIFY_DELIVERY_FAILURE:
    "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.classifyDeliveryFailure",
  RESPOND_TO_EMAIL:
    "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.respondToEmail",
  DELETE_EMAIL:
    "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.deleteEmail",
  SEARCH_KNOWLEDGE_BASE:
    "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.searchKnowledgeBase",
  WEB_SEARCH:
    "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.webSearch",
  ESCALATE_TO_HUMAN:
    "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.escalateToHuman",
  NO_ACTION: "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.noAction",
  CHAIN_ANALYSIS:
    "app.api.v1.core.agent.enums.emailAgentActionTypeFilter.chainAnalysis",
});

// Create DB enum array for Drizzle
export const EmailAgentActionTypeFilterDB = [
  EmailAgentActionTypeFilter.ALL,
  EmailAgentActionTypeFilter.MARK_BOUNCED,
  EmailAgentActionTypeFilter.MARK_SPAM,
  EmailAgentActionTypeFilter.CLASSIFY_DELIVERY_FAILURE,
  EmailAgentActionTypeFilter.RESPOND_TO_EMAIL,
  EmailAgentActionTypeFilter.DELETE_EMAIL,
  EmailAgentActionTypeFilter.SEARCH_KNOWLEDGE_BASE,
  EmailAgentActionTypeFilter.WEB_SEARCH,
  EmailAgentActionTypeFilter.ESCALATE_TO_HUMAN,
  EmailAgentActionTypeFilter.NO_ACTION,
  EmailAgentActionTypeFilter.CHAIN_ANALYSIS,
] as const;

/**
 * Confirmation Status Filter (includes "all" option)
 */
export const {
  enum: ConfirmationStatusFilter,
  options: ConfirmationStatusFilterOptions,
  Value: ConfirmationStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.agent.enums.confirmationStatusFilter.all",
  PENDING: "app.api.v1.core.agent.enums.confirmationStatusFilter.pending",
  APPROVED: "app.api.v1.core.agent.enums.confirmationStatusFilter.approved",
  REJECTED: "app.api.v1.core.agent.enums.confirmationStatusFilter.rejected",
  EXPIRED: "app.api.v1.core.agent.enums.confirmationStatusFilter.expired",
});

// Create DB enum array for Drizzle
export const ConfirmationStatusFilterDB = [
  ConfirmationStatusFilter.ALL,
  ConfirmationStatusFilter.PENDING,
  ConfirmationStatusFilter.APPROVED,
  ConfirmationStatusFilter.REJECTED,
  ConfirmationStatusFilter.EXPIRED,
] as const;

/**
 * Processing Priority Filter (includes "all" option)
 */
export const {
  enum: ProcessingPriorityFilter,
  options: ProcessingPriorityFilterOptions,
  Value: ProcessingPriorityFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.agent.enums.processingPriorityFilter.all",
  LOW: "app.api.v1.core.agent.enums.processingPriorityFilter.low",
  NORMAL: "app.api.v1.core.agent.enums.processingPriorityFilter.normal",
  HIGH: "app.api.v1.core.agent.enums.processingPriorityFilter.high",
  URGENT: "app.api.v1.core.agent.enums.processingPriorityFilter.urgent",
});

// Create DB enum array for Drizzle
export const ProcessingPriorityFilterDB = [
  ProcessingPriorityFilter.ALL,
  ProcessingPriorityFilter.LOW,
  ProcessingPriorityFilter.NORMAL,
  ProcessingPriorityFilter.HIGH,
  ProcessingPriorityFilter.URGENT,
] as const;

/**
 * Confirmation Response Action
 */
export const {
  enum: ConfirmationResponseAction,
  options: ConfirmationResponseActionOptions,
  Value: ConfirmationResponseActionValue,
} = createEnumOptions({
  APPROVE: "app.api.v1.core.agent.enums.confirmationResponseAction.approve",
  REJECT: "app.api.v1.core.agent.enums.confirmationResponseAction.reject",
});

// Create DB enum array for Drizzle
export const ConfirmationResponseActionDB = [
  ConfirmationResponseAction.APPROVE,
  ConfirmationResponseAction.REJECT,
] as const;
