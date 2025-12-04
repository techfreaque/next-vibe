import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Nowa strona",
  description: "Utwórz nową stronę",
  form: {
    label: "Nowa strona",
    description: "Utwórz nową stronę przeglądarki i załaduj URL",
    fields: {
      url: {
        label: "URL",
        description: "URL do załadowania na nowej stronie",
        placeholder: "Wprowadź URL",
      },
      timeout: {
        label: "Limit czasu",
        description: "Maksymalny czas oczekiwania w milisekundach (0 dla domyślnego)",
        placeholder: "Wprowadź limit czasu",
      },
    },
  },
  response: {
    success: "Operacja tworzenia nowej strony pomyślna",
    result: "Wynik tworzenia nowej strony",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: { title: "Błąd walidacji", description: "Sprawdź wprowadzone dane i spróbuj ponownie" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci podczas tworzenia nowej strony" },
    unauthorized: { title: "Nieautoryzowany", description: "Nie masz uprawnień do tworzenia nowych stron" },
    forbidden: { title: "Zabronione", description: "Operacja tworzenia nowej strony jest zabroniona" },
    notFound: { title: "Nie znaleziono", description: "Żądany zasób nie został znaleziony" },
    serverError: { title: "Błąd serwera", description: "Wystąpił wewnętrzny błąd serwera podczas tworzenia nowej strony" },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd podczas tworzenia nowej strony" },
    unsavedChanges: { title: "Niezapisane zmiany", description: "Masz niezapisane zmiany, które mogą zostać utracone" },
    conflict: { title: "Konflikt", description: "Wystąpił konflikt podczas tworzenia nowej strony" },
  },
  success: {
    title: "Nowa strona pomyślnie utworzona",
    description: "Nowa strona została pomyślnie utworzona",
  },
};
