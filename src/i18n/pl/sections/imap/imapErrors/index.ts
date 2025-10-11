import type { imapErrorsTranslations as EnglishImapErrorsTranslations } from "../../../../en/sections/imap/imapErrors";
import { connectionTranslations } from "./connection";
import { syncTranslations } from "./sync";

export const imapErrorsTranslations: typeof EnglishImapErrorsTranslations = {
  connection: connectionTranslations,
  sync: syncTranslations,
};
