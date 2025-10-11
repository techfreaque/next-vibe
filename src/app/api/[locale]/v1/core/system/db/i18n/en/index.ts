import { translations as migrateTranslations } from "../../migrate/i18n/en";
import { translations as migrateProdTranslations } from "../../migrate-prod/i18n/en";
import { translations as migrateRepairTranslations } from "../../migrate-repair/i18n/en";
import { translations as migrateSyncTranslations } from "../../migrate-sync/i18n/en";
import { translations as pingTranslations } from "../../ping/i18n/en";
import { translations as resetTranslations } from "../../reset/i18n/en";
import { translations as schemaVerifyTranslations } from "../../schema-verify/i18n/en";
import { translations as seedTranslations } from "../../seed/i18n/en";
import { translations as sqlTranslations } from "../../sql/i18n/en";
import { translations as studioTranslations } from "../../studio/i18n/en";
import { translations as utilsTranslations } from "../../utils/i18n/en";

export const translations = {
  category: "Database Operations",
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
