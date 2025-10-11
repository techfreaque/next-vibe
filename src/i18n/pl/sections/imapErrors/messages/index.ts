import type { messagesTranslations as EnglishMessagesTranslations } from "../../../../en/sections/imapErrors/messages";
import { getTranslations } from "./get";
import { listTranslations } from "./list";
import { syncTranslations } from "./sync";
import { updateTranslations } from "./update";

export const messagesTranslations: typeof EnglishMessagesTranslations = {
  get: getTranslations,
  list: listTranslations,
  sync: syncTranslations,
  update: updateTranslations,
};
