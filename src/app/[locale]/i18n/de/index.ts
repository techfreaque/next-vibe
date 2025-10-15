import { translations as componentsTranslations } from "../../_components/i18n/de";
import { translations as notFoundTranslations } from "../../[...notFound]/i18n/de";
import { translations as adminTranslations } from "../../admin/i18n/de";
import { translations as siteTranslations } from "../../story/i18n/de";
import { translations as trackTranslations } from "../../track/i18n/de";
import { translations as userTranslations } from "../../user/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  components: componentsTranslations,
  site: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  track: trackTranslations,
  user: userTranslations,
};
