// Parent aggregator for admin translations
// Imports from co-located child directory i18n folders
import { translations as componentsTranslations } from "../../_components/i18n/pl";
import { translations as cronTranslations } from "../../cron/i18n/pl";
import { translations as emailsTranslations } from "../../emails/i18n/pl";
import { translations as leadsTranslations } from "../../leads/i18n/pl";
import { translations as usersTranslations } from "../../users/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  cron: cronTranslations,
  emails: emailsTranslations,
  leads: leadsTranslations,
  users: usersTranslations,
};
