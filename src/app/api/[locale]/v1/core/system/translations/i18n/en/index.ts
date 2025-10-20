import { translations as reorganizeTranslations } from "../../reorganize/i18n/en";
import { translations as restoreBackupTranslations } from "../../restore-backup/i18n/en";
import { translations as statsTranslations } from "../../stats/i18n/en";

export const translations = {
  category: "Translation Management",
  tags: {
    reorganize: "Reorganize",
    maintenance: "Maintenance",
    i18n: "Internationalization",
    stats: "Statistics",
    analytics: "Analytics",
    backup: "Backup",
    restore: "Restore",
  },
  reorganize: reorganizeTranslations,
  restoreBackup: restoreBackupTranslations,
  stats: statsTranslations,
};
