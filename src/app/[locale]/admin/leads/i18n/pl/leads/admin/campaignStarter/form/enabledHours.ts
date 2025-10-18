import type { translations as EnglishEnabledHoursTranslations } from "../../../../en/leads/admin/campaignStarter/form/enabledHours";

export const translations: typeof EnglishEnabledHoursTranslations = {
  label: "Włączone Godziny",
  description: "Ustaw zakres czasowy, w którym starter kampanii ma działać",
  startHour: {
    label: "Godzina Rozpoczęcia",
    placeholder: "Godzina rozpoczęcia (0-23)",
  },
  endHour: {
    label: "Godzina Zakończenia",
    placeholder: "Godzina zakończenia (0-23)",
  },
};
