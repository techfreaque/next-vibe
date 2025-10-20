// Parent aggregator for admin translations
// Imports from co-located child directory i18n folders
import { translations as componentsTranslations } from "../../_components/i18n/en";
import { translations as cronTranslations } from "../../cron/i18n/en";
import { translations as emailsTranslations } from "../../emails/i18n/en";
import { translations as leadsTranslations } from "../../leads/i18n/en";
import { translations as usersTranslations } from "../../users/i18n/en";

export const translations = {
  components: componentsTranslations,
  cron: cronTranslations,
  emails: emailsTranslations,
  leads: leadsTranslations,
  users: usersTranslations,
  dashboard: {
    title: "Admin Dashboard",
    subtitle: "Manage your application from here",
  },
};
