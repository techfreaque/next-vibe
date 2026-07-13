import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  error: {
    title: "Fehler",
    unknown: "Ein unbekannter Fehler ist aufgetreten",
    tryAgain: "Erneut versuchen",
    boundary: {
      componentStack: "Komponenten-Stack",
      stackTrace: "Stack-Trace",
      componentStackFull: "Komponenten-Stack (vollständig)",
      errorDetails: "Fehlerdetails",
      name: "Name:",
      errorMessage: "Nachricht:",
      cause: "Ursache:",
    },
  },
  themeToggle: {
    enableLightMode: "Helles Design aktivieren",
    enableDarkMode: "Dunkles Design aktivieren",
    lightMode: "Helles Design",
    darkMode: "Dunkles Design",
  },
  contact: {
    subjects: {
      HELP_SUPPORT: "Hilfe & Support",
      GENERAL_INQUIRY: "Allgemeine Anfrage",
      TECHNICAL_SUPPORT: "Technischer Support",
      ACCOUNT_QUESTION: "Kontofrage",
      BILLING_QUESTION: "Abrechnungsfrage",
      SALES_INQUIRY: "Vertriebsanfrage",
      FEATURE_REQUEST: "Funktionsanfrage",
      BUG_REPORT: "Fehlerbericht",
      FEEDBACK: "Feedback",
      COMPLAINT: "Beschwerde",
      PARTNERSHIP: "Partnerschaft",
      OTHER: "Sonstiges",
    },
    priority: {
      low: "Niedrig",
      medium: "Mittel",
      high: "Hoch",
      urgent: "Dringend",
    },
    status: {
      new: "Neu",
      open: "Offen",
      inProgress: "In Bearbeitung",
      resolved: "Gelöst",
      closed: "Geschlossen",
    },
  },
};
