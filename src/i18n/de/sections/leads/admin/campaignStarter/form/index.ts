import type { formTranslations as EnglishFormTranslations } from "../../../../../../en/sections/leads/admin/campaignStarter/form";
import { cronSettingsTranslations } from "./cronSettings";
import { dryRunTranslations } from "./dryRun";
import { enabledDaysTranslations } from "./enabledDays";
import { enabledHoursTranslations } from "./enabledHours";
import { leadsPerWeekTranslations } from "./leadsPerWeek";
import { minAgeHoursTranslations } from "./minAgeHours";
import { sectionsTranslations } from "./sections";

export const formTranslations: typeof EnglishFormTranslations = {
  cronSettings: cronSettingsTranslations,
  dryRun: dryRunTranslations,
  enabledDays: enabledDaysTranslations,
  enabledHours: enabledHoursTranslations,
  leadsPerWeek: leadsPerWeekTranslations,
  minAgeHours: minAgeHoursTranslations,
  sections: sectionsTranslations,
  save: "Konfiguration speichern",
  success: "Konfiguration gespeichert",
};
