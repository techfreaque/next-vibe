import type { contactTranslations as EnglishContactTranslations } from "../../en/sections/contact";

export const translations: typeof EnglishContactTranslations = {
  subjects: {
    HELP_SUPPORT: "Hilfe & Support",
    GENERAL_INQUIRY: "Allgemeine Anfrage",
    TECHNICAL_SUPPORT: "Technischer Support",
    ACCOUNT_QUESTION: "Konto-Frage",
    BILLING_QUESTION: "Abrechnungsfrage",
    SALES_INQUIRY: "Verkaufsanfrage",
    FEATURE_REQUEST: "Feature-Anfrage",
    BUG_REPORT: "Fehlerbericht",
    FEEDBACK: "Feedback",
    COMPLAINT: "Beschwerde",
    PARTNERSHIP: "Partnerschaft",
    OTHER: "Sonstiges",
  },
  errors: {
    submission_failed:
      "Fehler bei der Verarbeitung der Kontaktformular-Einreichung: {{error}}",
    email_sending_failed:
      "Fehler beim Senden der Kontaktformular-Bestätigungs-E-Mails",
    missing_required_fields: "Fehlende Pflichtfelder im Kontaktformular",
    invalid_email_format: "Ungültiges E-Mail-Format im Kontaktformular",
    create_failed: "Fehler beim Erstellen der Kontaktanfrage",
    repositoryCreateFailed: "Kontaktanfrage konnte nicht erstellt werden",
    repositoryCreateDetails:
      "Ihr Kontaktformular kann derzeit nicht bearbeitet werden. Bitte versuchen Sie es später erneut.",
  },
};
