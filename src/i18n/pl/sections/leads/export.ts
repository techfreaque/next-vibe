import type { exportTranslations as EnglishExportTranslations } from "../../../en/sections/leads/export";

export const exportTranslations: typeof EnglishExportTranslations = {
  headers: {
    email: "E-mail",
    businessName: "Nazwa firmy",
    contactName: "Imię i nazwisko kontaktu",
    phone: "Telefon",
    website: "Strona internetowa",
    country: "Kraj",
    language: "Język",
    status: "Status",
    source: "Źródło",
    notes: "Notatki",
    createdAt: "Utworzono",
    updatedAt: "Zaktualizowano",
    emailsSent: "Wysłane e-maile",
    emailsOpened: "Otwarte e-maile",
    emailsClicked: "Kliknięte e-maile",
    lastEmailSent: "Ostatni wysłany e-mail",
    lastEngagement: "Ostatnie zaangażowanie",
    unsubscribedAt: "Wypisano",
    metadata: "Metadane",
  },
  fileName: {
    prefix: "leads_export_",
    suffix: {
      csv: ".csv",
      excel: ".xlsx",
    },
  },
};
