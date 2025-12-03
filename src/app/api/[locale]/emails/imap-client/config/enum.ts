import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

export const {
  enum: ImapLoggingLevel,
  options: ImapLoggingLevelOptions,
  Value: ImapLoggingLevelValue,
} = createEnumOptions({
  ERROR: "app.api.emails.enums.imapLoggingLevel.error",
  WARN: "app.api.emails.enums.imapLoggingLevel.warn",
  INFO: "app.api.emails.enums.imapLoggingLevel.info",
  DEBUG: "app.api.emails.enums.imapLoggingLevel.debug",
});

// DB enum export for Drizzle
export const ImapLoggingLevelDB = [
  ImapLoggingLevel.ERROR,
  ImapLoggingLevel.WARN,
  ImapLoggingLevel.INFO,
  ImapLoggingLevel.DEBUG,
] as const;
