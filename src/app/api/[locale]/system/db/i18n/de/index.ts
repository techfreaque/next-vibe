import { translations as generateTranslations } from "../../generate/i18n/de";
import { translations as migrateTranslations } from "../../migrate/i18n/de";
import { translations as pingTranslations } from "../../ping/i18n/de";
import { translations as seedTranslations } from "../../seed/i18n/de";
import { translations as sqlTranslations } from "../../sql/i18n/de";
import { translations as studioTranslations } from "../../studio/i18n/de";
import { translations as utilsTranslations } from "../../utils/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Datenbankoperationen",
  generate: generateTranslations,
  migrate: migrateTranslations,
  ping: pingTranslations,
  seed: seedTranslations,
  sql: sqlTranslations,
  studio: studioTranslations,
  utils: utilsTranslations,
};
