import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  error: {
    title: "Błąd",
    unknown: "Wystąpił nieznany błąd",
    tryAgain: "Spróbuj ponownie",
    boundary: {
      componentStack: "Stos komponentów",
      stackTrace: "Ślad stosu",
      componentStackFull: "Stos komponentów (pełny)",
      errorDetails: "Szczegóły błędu",
      name: "Nazwa:",
      errorMessage: "Wiadomość:",
      cause: "Przyczyna:",
    },
  },
  themeToggle: {
    enableLightMode: "Włącz tryb jasny",
    enableDarkMode: "Włącz tryb ciemny",
    lightMode: "Tryb jasny",
    darkMode: "Tryb ciemny",
  },
  contact: {
    subjects: {
      HELP_SUPPORT: "Pomoc i wsparcie",
      GENERAL_INQUIRY: "Ogólne zapytanie",
      TECHNICAL_SUPPORT: "Wsparcie techniczne",
      ACCOUNT_QUESTION: "Pytanie o konto",
      BILLING_QUESTION: "Pytanie o rozliczenia",
      SALES_INQUIRY: "Zapytanie sprzedażowe",
      FEATURE_REQUEST: "Prośba o funkcję",
      BUG_REPORT: "Zgłoszenie błędu",
      FEEDBACK: "Opinia",
      COMPLAINT: "Skarga",
      PARTNERSHIP: "Partnerstwo",
      OTHER: "Inne",
    },
    priority: {
      low: "Niski",
      medium: "Średni",
      high: "Wysoki",
      urgent: "Pilny",
    },
    status: {
      new: "Nowy",
      open: "Otwarty",
      inProgress: "W trakcie",
      resolved: "Rozwiązany",
      closed: "Zamknięty",
    },
  },
};
