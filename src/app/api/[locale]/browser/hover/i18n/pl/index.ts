import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Najedź",
  description: "Najedź na podany element",

  form: {
    label: "Najedź na element",
    description: "Przesuń kursor myszy nad element",
    fields: {
      uid: {
        label: "UID elementu",
        description: "UID elementu na stronie z migawki treści strony",
        placeholder: "Wprowadź UID elementu",
      },
    },
  },

  response: {
    success: "Operacja najechania pomyślna",
    result: "Wynik operacji najechania",
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
      description: "Wystąpił błąd sieci podczas operacji najechania",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do wykonywania operacji najechania",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja najechania jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description: "Wystąpił wewnętrzny błąd serwera podczas operacji najechania",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas operacji najechania",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas operacji najechania",
    },
  },

  success: {
    title: "Operacja najechania pomyślna",
    description: "Element został pomyślnie najechany",
  },
};
