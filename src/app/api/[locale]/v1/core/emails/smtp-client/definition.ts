/**
 * SMTP Client API Endpoints Definition
 * Main definition file for SMTP client endpoints - aggregates all SMTP operations
 */

// Re-export all SMTP client endpoint definitions
export { default as createEndpoints } from "./create/definition";
export { default as editByIdEndpoints } from "./edit/[id]/definition";
export { default as listEndpoints } from "./list/definition";
// Note: email-handling, email-metadata, email-sending, sending definitions may not exist or export defaults

// Re-export all SMTP client types
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

// Note: Additional SMTP type exports would go here when those modules are properly defined
