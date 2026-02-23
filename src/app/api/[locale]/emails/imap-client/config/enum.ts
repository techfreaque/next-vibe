import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: ImapLoggingLevel,
  options: ImapLoggingLevelOptions,
  Value: ImapLoggingLevelValue,
} = createEnumOptions(scopedTranslation, {
  ERROR: "loggingLevel.error",
  WARN: "loggingLevel.warn",
  INFO: "loggingLevel.info",
  DEBUG: "loggingLevel.debug",
});

// DB enum export for Drizzle
export const ImapLoggingLevelDB = [
  ImapLoggingLevel.ERROR,
  ImapLoggingLevel.WARN,
  ImapLoggingLevel.INFO,
  ImapLoggingLevel.DEBUG,
] as const;
