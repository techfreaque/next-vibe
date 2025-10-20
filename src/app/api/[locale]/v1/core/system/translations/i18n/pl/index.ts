import { translations as reorganizeTranslations } from "../../reorganize/i18n/pl";
import { translations as restoreBackupTranslations } from "../../restore-backup/i18n/pl";
import { translations as statsTranslations } from "../../stats/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Zarządzanie tłumaczeniami",
  tags: {
    reorganize: "Reorganizacja",
    maintenance: "Konserwacja",
    i18n: "Internacjonalizacja",
    stats: "Statystyki",
    analytics: "Analityka",
    backup: "Kopia zapasowa",
    restore: "Przywracanie",
  },
  reorganize: reorganizeTranslations,
  restoreBackup: restoreBackupTranslations,
  stats: statsTranslations,
};
