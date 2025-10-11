import type { campaignTranslations as EnglishCampaignTranslations } from "../../../en/sections/leads/campaign";

export const campaignTranslations: typeof EnglishCampaignTranslations = {
  title: "E-Mail-Kampagnensystem",
  description: "Verwalten Sie Ihre E-Mail-Kampagnen",
  starter: {
    title: "Starter-Kampagne",
    description: "Beginnen Sie mit einer einfachen Kampagne",
    schedule: "Täglich um 9:00 Uhr",
  },
  emails: {
    title: "E-Mail-Kampagne",
    description: "Senden Sie personalisierte E-Mails",
    schedule: "Täglich um 10:00 Uhr",
  },
  cleanup: {
    title: "Bereinigung",
    description: "Bereinigen Sie alte Kampagnen",
    schedule: "Wöchentlich am Sonntag",
  },
  info: "Die Kampagnenverwaltung wird automatisch vom Cron-System durchgeführt. Besuchen Sie die Cron-Admin-Seite für detaillierte Überwachung.",
};
