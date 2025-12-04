import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Wybierz stronę",
  description: "Wybierz stronę jako kontekst dla przyszłych wywołań narzędzi",
  form: {
    label: "Wybierz stronę",
    description: "Wybierz stronę według jej indeksu",
    fields: {
      pageIdx: {
        label: "Indeks strony",
        description: "Indeks strony do wybrania (wywołaj list_pages aby wylistować strony)",
        placeholder: "Wprowadź indeks strony",
      },
    },
  },
  response: {
    success: "Operacja wyboru strony pomyślna",
    result: "Wynik wyboru strony",
    error: "Komunikat błędu",
    executionId: "ID wykonania do śledzenia",
  },
  errors: {
    validation: { title: "Błąd walidacji", description: "Sprawdź wprowadzone dane i spróbuj ponownie" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci podczas wybierania strony" },
    unauthorized: { title: "Nieautoryzowany", description: "Nie masz uprawnień do wybierania stron" },
    forbidden: { title: "Zabronione", description: "Operacja wyboru strony jest zabroniona" },
    notFound: { title: "Nie znaleziono", description: "Żądany zasób nie został znaleziony" },
    serverError: { title: "Błąd serwera", description: "Wystąpił wewnętrzny błąd serwera podczas wybierania strony" },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd podczas wybierania strony" },
    unsavedChanges: { title: "Niezapisane zmiany", description: "Masz niezapisane zmiany, które mogą zostać utracone" },
    conflict: { title: "Konflikt", description: "Wystąpił konflikt podczas wybierania strony" },
  },
  success: {
    title: "Strona pomyślnie wybrana",
    description: "Strona została pomyślnie wybrana",
  },
};
