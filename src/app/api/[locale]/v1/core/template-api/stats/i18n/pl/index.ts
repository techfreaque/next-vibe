import type { translations as enTranslations } from "../en";

/**
 * Template Stats API translations for Polish
 */

export const translations: typeof enTranslations = {
  // Common category and tags (shared from main template API)
  category: "API Szablonów",
  tags: {
    statistics: "Statystyki",
    analytics: "Analiza",
  },

  // Main stats endpoint
  title: "Pobierz Statystyki Szablonów",
  description: "Pobierz podstawowe statystyki i analizy szablonów",
  form: {
    title: "Parametry Statystyk",
    description: "Skonfiguruj filtry dla statystyk szablonów",
  },

  // Field labels
  status: {
    label: "Filtr Statusu",
    description: "Filtruj szablony według ich statusu",
    placeholder: "Wybierz jeden lub więcej statusów",
  },
  tagFilter: {
    label: "Filtr Tagów",
    description: "Filtruj szablony według tagów",
    placeholder: "Wybierz jeden lub więcej tagów",
  },
  dateFrom: {
    label: "Data Początkowa",
    description: "Data początkowa dla okresu statystyk",
    placeholder: "Wybierz datę początkową",
  },
  dateTo: {
    label: "Data Końcowa",
    description: "Data końcowa dla okresu statystyk",
    placeholder: "Wybierz datę końcową",
  },

  // Response
  response: {
    title: "Wyniki Statystyk",
    description: "Statystyki szablonów dla wybranego okresu",
  },

  // Errors
  errors: {
    validation: {
      title: "Nieprawidłowe Parametry",
      description: "Podane parametry filtrów są nieprawidłowe",
    },
    unauthorized: {
      title: "Brak Autoryzacji",
      description: "Nie masz uprawnień do przeglądania statystyk szablonów",
    },
    forbidden: {
      title: "Dostęp Zabroniony",
      description: "Dostęp do statystyk szablonów jest zabroniony",
    },
    notFound: {
      title: "Nie Znaleziono",
      description: "Żądane statystyki nie mogły zostać znalezione",
    },
    server: {
      title: "Błąd Serwera",
      description: "Wystąpił błąd podczas pobierania statystyk szablonów",
    },
    network: {
      title: "Błąd Sieci",
      description: "Nie można połączyć się z usługą statystyk",
    },
    unknown: {
      title: "Nieznany Błąd",
      description: "Wystąpił nieoczekiwany błąd",
    },
    unsavedChanges: {
      title: "Niezapisane Zmiany",
      description: "Masz niezapisane zmiany, które zostaną utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas przetwarzania żądania",
    },
  },

  // Success
  success: {
    title: "Statystyki Pobrane",
    description: "Statystyki szablonów pobrane pomyślnie",
  },
};
