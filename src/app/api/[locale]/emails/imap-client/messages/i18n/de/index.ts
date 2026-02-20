import { translations as idTranslations } from "../../[id]/i18n/de";
import { translations as bulkTranslations } from "../../bulk/i18n/de";
import { translations as composeTranslations } from "../../compose/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as syncTranslations } from "../../sync/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Nachrichten",
  id: idTranslations,
  list: listTranslations,
  sync: syncTranslations,
  compose: composeTranslations,
  bulk: bulkTranslations,
};
