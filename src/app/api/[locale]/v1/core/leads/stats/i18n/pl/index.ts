import type { translations as enTranslations } from "../en";

/**
*

* Leads Stats subdomain translations for Polish
*/

export const translations: typeof enTranslations = {
  title: "Statystyki leadów",
  description: "Kompleksowe statystyki i analizy leadów z danymi historycznymi",
  category: "Zarządzanie leadami",
  tags: {
    leads: "Leady",
    statistics: "Statystyki",
    analytics: "Analizy",
  },
  errors: {
    unauthorized: {
      title: "Nieautoryzowany dostęp",
      description: "Autoryzacja wymagana do przeglądania statystyk leadów",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry żądania statystyk",
    },
    server: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas pobierania statystyk leadów",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd podczas pobierania statystyk",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas pobierania statystyk",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp do statystyk leadów zabroniony",
    },
    notFound: {
      title: "Brak danych",
      description: "Nie znaleziono danych statystycznych dla określonych kryteriów",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych podczas generowania statystyk",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Są niezapisane zmiany w filtrach statystyk",
    },
  },
  success: {
    title: "Statystyki wygenerowane",
    description: "Statystyki leadów pobrane pomyślnie",
  },
};
