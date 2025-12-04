import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Nawiguj stronę",
  description: "Nawiguj aktualnie wybraną stronę",
  form: {
    label: "Nawiguj stronę",
    description: "Nawiguj aktualnie wybraną stronę do URL lub przez historię",
    fields: {
      type: {
        label: "Typ nawigacji",
        description: "Nawiguj po URL, wstecz lub do przodu w historii, lub odśwież",
        placeholder: "Wybierz typ nawigacji",
        options: {
          url: "URL",
          back: "Wstecz",
          forward: "Do przodu",
          reload: "Odśwież",
        },
      },
      url: {
        label: "URL",
        description: "Docelowy URL (tylko dla type=url)",
        placeholder: "Wprowadź URL",
      },
      ignoreCache: {
        label: "Ignoruj cache",
        description: "Czy ignorować cache podczas odświeżania",
        placeholder: "Ignoruj cache",
      },
      timeout: {
        label: "Limit czasu",
        description: "Maksymalny czas oczekiwania w milisekundach (0 dla domyślnego)",
        placeholder: "Wprowadź limit czasu",
      },
    },
  },
  response: {
    success: "Operacja nawigacji pomyślna",
    result: "Wynik nawigacji",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: { title: "Błąd walidacji", description: "Sprawdź wprowadzone dane i spróbuj ponownie" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci podczas nawigacji" },
    unauthorized: { title: "Nieautoryzowany", description: "Nie masz uprawnień do nawigacji stron" },
    forbidden: { title: "Zabronione", description: "Operacja nawigacji strony jest zabroniona" },
    notFound: { title: "Nie znaleziono", description: "Żądany zasób nie został znaleziony" },
    serverError: { title: "Błąd serwera", description: "Wystąpił wewnętrzny błąd serwera podczas nawigacji" },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd podczas nawigacji" },
    unsavedChanges: { title: "Niezapisane zmiany", description: "Masz niezapisane zmiany, które mogą zostać utracone" },
    conflict: { title: "Konflikt", description: "Wystąpił konflikt podczas nawigacji" },
  },
  success: {
    title: "Nawigacja pomyślna",
    description: "Strona została pomyślnie znawigowana",
  },
};
