import { translations as reorganizeTranslations } from "../../reorganize/i18n/de";
import { translations as restoreBackupTranslations } from "../../restore-backup/i18n/de";
import { translations as statsTranslations } from "../../stats/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  reorganize: reorganizeTranslations,
  restoreBackup: restoreBackupTranslations,
  stats: statsTranslations,
};
