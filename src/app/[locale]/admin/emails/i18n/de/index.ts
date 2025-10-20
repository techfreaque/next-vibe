// Parent aggregator for admin/emails translations
// Imports from co-located child directory i18n folders
import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as imapTranslations } from "../../imap/i18n/de";
import { translations as listTranslations } from "../../list/i18n/de";
import { translations as smtpTranslations } from "../../smtp/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  imap: imapTranslations,
  smtp: smtpTranslations,
  list: listTranslations,
  stats: statsTranslations,
};
