import { translations as generateTranslations } from "../../generate/i18n/en";
import { translations as migrateTranslations } from "../../migrate/i18n/en";
import { translations as pingTranslations } from "../../ping/i18n/en";
import { translations as seedTranslations } from "../../seed/i18n/en";
import { translations as sqlTranslations } from "../../sql/i18n/en";
import { translations as studioTranslations } from "../../studio/i18n/en";
import { translations as utilsTranslations } from "../../utils/i18n/en";

export const translations = {
  category: "Database Operations",
  generate: generateTranslations,
  migrate: migrateTranslations,
  ping: pingTranslations,
  seed: seedTranslations,
  sql: sqlTranslations,
  studio: studioTranslations,
  utils: utilsTranslations,
};
