import { translations as migrateTranslations } from "../../migrate/i18n/pl";
import { translations as migrateProdTranslations } from "../../migrate-prod/i18n/pl";
import { translations as migrateRepairTranslations } from "../../migrate-repair/i18n/pl";
import { translations as migrateSyncTranslations } from "../../migrate-sync/i18n/pl";
import { translations as pingTranslations } from "../../ping/i18n/pl";
import { translations as resetTranslations } from "../../reset/i18n/pl";
import { translations as schemaVerifyTranslations } from "../../schema-verify/i18n/pl";
import { translations as seedTranslations } from "../../seed/i18n/pl";
import { translations as sqlTranslations } from "../../sql/i18n/pl";
import { translations as studioTranslations } from "../../studio/i18n/pl";
import { translations as utilsTranslations } from "../../utils/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Operacje bazodanowe",
  migrate: migrateTranslations,
  migrateRepair: migrateRepairTranslations,
  migrateProd: migrateProdTranslations,
  migrateSync: migrateSyncTranslations,
  ping: pingTranslations,
  reset: resetTranslations,
  schemaVerify: schemaVerifyTranslations,
  seed: seedTranslations,
  sql: sqlTranslations,
  studio: studioTranslations,
  utils: utilsTranslations,
};
