import { translations as generateTranslations } from "../../generate/i18n/pl";
import { translations as migrateTranslations } from "../../migrate/i18n/pl";
import { translations as pingTranslations } from "../../ping/i18n/pl";
import { translations as seedTranslations } from "../../seed/i18n/pl";
import { translations as sqlTranslations } from "../../sql/i18n/pl";
import { translations as studioTranslations } from "../../studio/i18n/pl";
import { translations as utilsTranslations } from "../../utils/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operacje bazodanowe",
  generate: generateTranslations,
  migrate: migrateTranslations,
  ping: pingTranslations,
  seed: seedTranslations,
  sql: sqlTranslations,
  studio: studioTranslations,
  utils: utilsTranslations,
};
