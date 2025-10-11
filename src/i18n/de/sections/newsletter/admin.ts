import type { adminTranslations as EnglishAdminTranslations } from "../../../en/sections/newsletter/admin";

export const adminTranslations: typeof EnglishAdminTranslations = {
  dashboard: {
    title: "Newsletter-Dashboard",
    totalSubscribers: "Gesamtabonnenten",
    activeSubscribers: "Aktive Abonnenten",
    openRate: "Öffnungsrate",
    clickRate: "Klickrate",
  },
  campaigns: {
    title: "Kampagnen",
    create: "Kampagne erstellen",
    name: "Kampagnenname",
    subject: "Betreffzeile",
    content: "Inhalt",
    schedule: "Planen",
    send: "Jetzt senden",
    preview: "Vorschau",
    test: "Test-E-Mail senden",
    success: "Kampagne erfolgreich erstellt",
    error: "Kampagne konnte nicht erstellt werden",
    sentSuccess: "Kampagne erfolgreich gesendet",
    sentError: "Kampagne konnte nicht gesendet werden",
  },
};
