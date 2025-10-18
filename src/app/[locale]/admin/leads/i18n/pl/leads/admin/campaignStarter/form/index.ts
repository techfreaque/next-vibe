import type { translations as enTranslations } from "../../../../en/leads/admin/campaignStarter/form";
import { translations as cronSettingsTranslations } from "./cronSettings";
import { translations as dryRunTranslations } from "./dryRun";
import { translations as enabledDaysTranslations } from "./enabledDays";
import { translations as enabledHoursTranslations } from "./enabledHours";
import { translations as leadsPerWeekTranslations } from "./leadsPerWeek";
import { translations as minAgeHoursTranslations } from "./minAgeHours";
import { translations as sectionsTranslations } from "./sections";

export const translations: typeof enTranslations = {
  cronSettings: cronSettingsTranslations,
  dryRun: dryRunTranslations,
  enabledDays: enabledDaysTranslations,
  enabledHours: enabledHoursTranslations,
  leadsPerWeek: leadsPerWeekTranslations,
  minAgeHours: minAgeHoursTranslations,
  sections: sectionsTranslations,
  save: "Zapisz Konfigurację",
  success: "Konfiguracja Zapisana",
};
