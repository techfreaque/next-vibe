import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Oceniaj skrypt",
  description: "Oceń funkcję JavaScript wewnątrz aktualnie wybranej strony",
  form: {
    label: "Oceniaj skrypt",
    description: "Wykonaj JavaScript na stronie przeglądarki",
    fields: {
      function: {
        label: "Funkcja",
        description: "Deklaracja funkcji JavaScript do wykonania",
        placeholder: "() => { return document.title; }",
      },
      args: {
        label: "Argumenty",
        description:
          "Opcjonalna lista argumentów (UID elementów) do przekazania do funkcji",
        placeholder: '[{"uid": "element-uid"}]',
      },
    },
  },
  response: {
    success: "Operacja oceny skryptu pomyślna",
    result: "Wynik oceny skryptu",
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
      description: "Wystąpił błąd sieci podczas oceny skryptu",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do oceny skryptów",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja oceny skryptu jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas oceny skryptu",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas oceny skryptu",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas oceny skryptu",
    },
  },
  success: {
    title: "Skrypt pomyślnie oceniony",
    description: "JavaScript został pomyślnie wykonany",
  },
};
