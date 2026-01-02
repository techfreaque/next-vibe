import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Pobierz żądanie sieciowe",
  description:
    "Pobiera żądanie sieciowe według opcjonalnego reqid, jeśli pominięto zwraca aktualnie wybrane żądanie w panelu DevTools Network",
  form: {
    label: "Pobierz żądanie sieciowe",
    description: "Pobierz określone żądanie sieciowe lub aktualnie wybrane",
    fields: {
      reqid: {
        label: "ID żądania",
        description:
          "Reqid żądania sieciowego (pomiń, aby pobrać aktualnie wybrane żądanie w DevTools)",
        placeholder: "Wprowadź ID żądania",
      },
    },
  },
  response: {
    success: "Żądanie sieciowe pobrane pomyślnie",
    result: "Wynik pobierania żądania sieciowego",
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
      description: "Wystąpił błąd sieci podczas pobierania żądania sieciowego",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do pobierania żądań sieciowych",
    },
    forbidden: {
      title: "Zabronione",
      description: "Pobieranie żądań sieciowych jest zabronione",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas pobierania żądania sieciowego",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas pobierania żądania sieciowego",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas pobierania żądania sieciowego",
    },
  },
  success: {
    title: "Żądanie sieciowe pobrane pomyślnie",
    description: "Żądanie sieciowe zostało pomyślnie pobrane",
  },
};
