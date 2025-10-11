import type { campaignTranslations as EnglishCampaignTranslations } from "../../../en/sections/leads/campaign";

export const campaignTranslations: typeof EnglishCampaignTranslations = {
  title: "System kampanii e-mailowych",
  description: "Zarządzaj swoimi kampaniami e-mailowymi",
  starter: {
    title: "Kampania startowa",
    description: "Rozpocznij od prostej kampanii",
    schedule: "Codziennie o 9:00",
  },
  emails: {
    title: "Kampania e-mailowa",
    description: "Wysyłaj spersonalizowane e-maile",
    schedule: "Codziennie o 10:00",
  },
  cleanup: {
    title: "Czyszczenie",
    description: "Wyczyść stare kampanie",
    schedule: "Co tydzień w niedzielę",
  },
  info: "Zarządzanie kampaniami jest obsługiwane automatycznie przez system cron. Odwiedź stronę administracyjną cron, aby uzyskać szczegółowe monitorowanie.",
};
