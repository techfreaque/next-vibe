import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista stron",
  description: "Pobierz listę stron otwartych w przeglądarce",
  form: {
    label: "Lista stron",
    description: "Pobierz wszystkie otwarte strony przeglądarki",
    fields: {},
  },
  response: {
    success: "Operacja listowania stron pomyślna",
    result: "Wynik listowania stron",
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
      description: "Wystąpił błąd sieci podczas listowania stron",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do listowania stron",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja listowania stron jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas listowania stron",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas listowania stron",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas listowania stron",
    },
  },
  success: {
    title: "Strony pomyślnie wylistowane",
    description: "Otwarte strony zostały pomyślnie wylistowane",
  },
};
