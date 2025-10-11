import type { imapErrorsTranslations as EnglishImapErrorsTranslations } from "../../../en/sections/imapErrors";
import { accountsTranslations } from "./accounts";
import { agentTranslations } from "./agent";
import { configTranslations } from "./config";
import { connectionTranslations } from "./connection";
import { foldersTranslations } from "./folders";
import { healthTranslations } from "./health";
import { messagesTranslations } from "./messages";
import { syncTranslations } from "./sync";
import { validationTranslations } from "./validation";

export const imapErrorsTranslations: typeof EnglishImapErrorsTranslations = {
  accounts: accountsTranslations,
  agent: agentTranslations,
  config: configTranslations,
  connection: connectionTranslations,
  folders: foldersTranslations,
  health: healthTranslations,
  messages: messagesTranslations,
  sync: syncTranslations,
  validation: validationTranslations,
};
