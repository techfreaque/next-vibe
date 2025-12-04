import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Poczekaj na",
  description: "Poczekaj, aż określony tekst pojawi się na wybranej stronie",

  form: {
    label: "Poczekaj na tekst",
    description: "Poczekaj, aż określony tekst pojawi się na stronie",
    fields: {
      text: {
        label: "Tekst",
        description: "Tekst, który ma pojawić się na stronie",
        placeholder: "Wprowadź tekst, na który czekać",
      },
      timeout: {
        label: "Limit czasu",
        description: "Maksymalny czas oczekiwania w milisekundach. Jeśli ustawione na 0, zostanie użyty domyślny limit",
        placeholder: "Wprowadź limit czasu (ms)",
      },
    },
  },

  response: {
    success: "Operacja oczekiwania pomyślna",
    result: "Wynik operacji oczekiwania",
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
      description: "Wystąpił błąd sieci podczas operacji oczekiwania",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania operacji oczekiwania",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja oczekiwania jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas operacji oczekiwania",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas operacji oczekiwania",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas operacji oczekiwania",
    },
  },

  success: {
    title: "Operacja oczekiwania pomyślna",
    description: "Określony tekst pojawił się na stronie",
  },
};
