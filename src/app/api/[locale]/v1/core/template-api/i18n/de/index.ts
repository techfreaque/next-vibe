import type { translations as enTranslations } from "../en";

import { translations as enhancedStatsTranslations } from "../../enhanced-stats/i18n/de";
import { translations as exportTranslations } from "../../export/i18n/de";
import { translations as idTranslations } from "../../[id]/i18n/de";
import { translations as importTranslations } from "../../import/i18n/de";
import { translations as notificationsTranslations } from "../../notifications/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";

export const translations: typeof enTranslations = {
  enhancedStats: enhancedStatsTranslations,
  export: exportTranslations,
  id: idTranslations,
  import: importTranslations,
  notifications: notificationsTranslations,
  stats: statsTranslations,
};
