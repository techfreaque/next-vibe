// Parent aggregator for admin/messenger translations
import { translations as campaignsTranslations } from "../../campaigns/_components/i18n/pl";
import { translations as componentsTranslations } from "../../_components/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import { translations as templatesTranslations } from "../../templates/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  campaigns: campaignsTranslations,
  stats: statsTranslations,
  templates: templatesTranslations,
};
