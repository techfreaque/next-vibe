import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as cronTranslations } from "../../cron/i18n/de";
import { translations as emailsTranslations } from "../../emails/i18n/de";
import { translations as leadsTranslations } from "../../leads/i18n/de";
import { translations as usersTranslations } from "../../users/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  cron: cronTranslations,
  emails: emailsTranslations,
  leads: leadsTranslations,
  users: usersTranslations,
  dashboard: {
    title: "Admin-Dashboard",
    subtitle: "Verwalten Sie Ihre Anwendung von hier aus",
  },
};
