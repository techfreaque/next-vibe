import { translations as idTranslations } from "../../[id]/i18n/pl";
import { translations as bulkTranslations } from "../../bulk/i18n/pl";
import { translations as composeTranslations } from "../../compose/i18n/pl";
import { translations as listTranslations } from "../../list/i18n/pl";
import { translations as syncTranslations } from "../../sync/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Wiadomości",
  id: idTranslations,
  list: listTranslations,
  sync: syncTranslations,
  compose: composeTranslations,
  bulk: bulkTranslations,
};
