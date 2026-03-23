import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Narzędzia AI",
  tags: {
    skills: "umiejętności",
  },
  post: {
    title: "Zgłoś umiejętność",
    description:
      "Zgłoś umiejętność społeczności do moderacji. Idempotentne - jedno zgłoszenie na użytkownika.",
    dynamicTitle: "Zgłoszenie: {{name}}",
    reason: {
      label: "Powód",
      description: "Dlaczego zgłaszasz tę umiejętność?",
      placeholder: "Opisz problem...",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podaj powód zgłoszenia",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany aby zgłosić",
      },
      forbidden: {
        title: "Zabronione",
        description: "Nie możesz zgłosić tej umiejętności",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Umiejętność nie znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas przesyłania zgłoszenia",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Już zgłoszone",
        description: "Ta umiejętność została już przez ciebie zgłoszona",
      },
    },
    success: {
      title: "Zgłoszenie wysłane",
      description: "Dziękujemy za pomoc w utrzymaniu bezpiecznej społeczności",
    },
    response: {
      reported: { content: "Zgłoszono" },
      reportCount: { content: "Liczba zgłoszeń" },
    },
    button: {
      submit: "Wyślij zgłoszenie",
      loading: "Wysyłanie...",
    },
  },
};
