import type { translations as EnglishExportTranslations } from "../../en/leads/export";

export const translations: typeof EnglishExportTranslations = {
  headers: {
    email: "E-Mail",
    businessName: "Firmenname",
    contactName: "Kontaktname",
    phone: "Telefon",
    website: "Website",
    country: "Land",
    language: "Sprache",
    status: "Status",
    source: "Quelle",
    notes: "Notizen",
    createdAt: "Erstellt am",
    updatedAt: "Aktualisiert am",
    emailsSent: "E-Mails gesendet",
    emailsOpened: "E-Mails geöffnet",
    emailsClicked: "E-Mails geklickt",
    lastEmailSent: "Letzte E-Mail gesendet",
    lastEngagement: "Letztes Engagement",
    unsubscribedAt: "Abgemeldet am",
    metadata: "Metadaten",
  },
  fileName: {
    prefix: "leads_export_",
    suffix: {
      csv: ".csv",
      excel: ".xlsx",
    },
  },
};
