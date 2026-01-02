/**
 * Close Page Tool translations (Polish)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zamknij stronę",
  description: "Zamyka stronę według jej indeksu. Ostatnia otwarta strona nie może być zamknięta",

  form: {
    label: "Zamknij stronę",
    description: "Zamknij stronę przeglądarki według jej indeksu",
    fields: {
      pageIdx: {
        label: "Indeks strony",
        description: "Indeks strony do zamknięcia. Wywołaj list_pages, aby wyświetlić strony",
        placeholder: "Wprowadź indeks strony (np. 0)",
      },
    },
  },

  response: {
    success: "Strona pomyślnie zamknięta",
    result: "Wynik operacji zamykania strony",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Sprawdź wprowadzone dane i spróbuj ponownie",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci podczas zamykania strony",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do zamykania stron",
    },
    forbidden: {
      title: "Zabronione",
      description: "Zamykanie strony jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądana strona nie została znaleziona",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas zamykania strony",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas zamykania strony",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas zamykania strony",
    },
  },

  success: {
    title: "Strona pomyślnie zamknięta",
    description: "Strona została pomyślnie zamknięta",
  },
};
