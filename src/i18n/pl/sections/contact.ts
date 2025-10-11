import type { contactTranslations as EnglishContactTranslations } from "../../en/sections/contact";

export const contactTranslations: typeof EnglishContactTranslations = {
  subjects: {
    HELP_SUPPORT: "Pomoc i Wsparcie",
    GENERAL_INQUIRY: "Ogólne Zapytanie",
    TECHNICAL_SUPPORT: "Wsparcie Techniczne",
    ACCOUNT_QUESTION: "Pytanie o Konto",
    BILLING_QUESTION: "Pytanie o Rozliczenia",
    SALES_INQUIRY: "Zapytanie Sprzedażowe",
    FEATURE_REQUEST: "Prośba o Funkcję",
    BUG_REPORT: "Zgłoszenie Błędu",
    FEEDBACK: "Opinia",
    COMPLAINT: "Skarga",
    PARTNERSHIP: "Partnerstwo",
    OTHER: "Inne",
  },
  errors: {
    submission_failed:
      "Nie udało się przetworzyć przesłania formularza kontaktowego: {{error}}",
    email_sending_failed:
      "Nie udało się wysłać e-maili potwierdzających formularz kontaktowy",
    missing_required_fields: "Brakuje wymaganych pól w formularzu kontaktowym",
    invalid_email_format:
      "Nieprawidłowy format e-maila w formularzu kontaktowym",
    create_failed: "Nie udało się utworzyć zlecenia kontaktowego",
    repositoryCreateFailed: "Nie udało się utworzyć żądania kontaktu",
    repositoryCreateDetails:
      "Nie można obecnie przetworzyć Twojego formularza kontaktowego. Spróbuj ponownie później.",
  },
};
