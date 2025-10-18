import type { translations as EnglishEnabledHoursTranslations } from "../../../../en/leads/admin/campaignStarter/form/enabledHours";

export const translations: typeof EnglishEnabledHoursTranslations = {
  label: "Aktivierte Stunden",
  description:
    "Stellen Sie den Zeitbereich ein, in dem der Kampagnen-Starter laufen soll",
  startHour: {
    label: "Startstunde",
    placeholder: "Startstunde (0-23)",
  },
  endHour: {
    label: "Endstunde",
    placeholder: "Endstunde (0-23)",
  },
};
