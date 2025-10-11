import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

export const {
  enum: ImapLoggingLevel,
  options: ImapLoggingLevelOptions,
  Value: ImapLoggingLevelValue,
} = createEnumOptions({
  ERROR: "app.api.v1.core.emails.enums.imapLoggingLevel.error",
  WARN: "app.api.v1.core.emails.enums.imapLoggingLevel.warn",
  INFO: "app.api.v1.core.emails.enums.imapLoggingLevel.info",
  DEBUG: "app.api.v1.core.emails.enums.imapLoggingLevel.debug",
});

// DB enum export for Drizzle
export const ImapLoggingLevelDB = [
  ImapLoggingLevel.ERROR,
  ImapLoggingLevel.WARN,
  ImapLoggingLevel.INFO,
  ImapLoggingLevel.DEBUG,
] as const;
