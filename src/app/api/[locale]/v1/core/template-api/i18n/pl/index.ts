import { translations as idTranslations } from "../../[id]/i18n/pl";
import { translations as enhancedStatsTranslations } from "../../enhanced-stats/i18n/pl";
import { translations as exportTranslations } from "../../export/i18n/pl";
import { translations as importTranslations } from "../../import/i18n/pl";
import { translations as notificationsTranslations } from "../../notifications/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enhancedStats: enhancedStatsTranslations,
  export: exportTranslations,
  id: idTranslations,
  import: importTranslations,
  notifications: notificationsTranslations,
  stats: statsTranslations,
};
