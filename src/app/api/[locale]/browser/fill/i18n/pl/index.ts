import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Wypełnij",
  description: "Wpisz tekst do pola wejściowego, obszaru tekstowego lub wybierz opcję z elementu select",

  form: {
    label: "Wypełnij element",
    description: "Wpisz tekst do elementu formularza",
    fields: {
      uid: {
        label: "UID elementu",
        description: "UID elementu na stronie z migawki treści strony",
        placeholder: "Wprowadź UID elementu",
      },
      value: {
        label: "Wartość",
        description: "Wartość do wpisania",
        placeholder: "Wprowadź wartość do wypełnienia",
      },
    },
  },

  response: {
    success: "Operacja wypełniania pomyślna",
    result: "Wynik operacji wypełniania",
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
      description: "Wystąpił błąd sieci podczas operacji wypełniania",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania operacji wypełniania",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja wypełniania jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas operacji wypełniania",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas operacji wypełniania",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas operacji wypełniania",
    },
  },

  success: {
    title: "Operacja wypełniania pomyślna",
    description: "Element został pomyślnie wypełniony",
  },
};
