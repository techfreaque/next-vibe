import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Wypełnij formularz",
  description: "Wypełnij wiele elementów formularza jednocześnie",

  form: {
    label: "Wypełnij elementy formularza",
    description: "Wypełnij wiele elementów formularza jednocześnie",
    fields: {
      elements: {
        label: "Elementy formularza",
        description: "Tablica elementów z migawki do wypełnienia",
        placeholder: "Wprowadź elementy formularza (tablica JSON)",
      },
    },
  },

  response: {
    success: "Operacja wypełniania formularza pomyślna",
    result: "Wynik operacji wypełniania formularza",
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
      description: "Wystąpił błąd sieci podczas wypełniania formularza",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description:
        "Nie masz uprawnień do wykonywania operacji wypełniania formularza",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja wypełniania formularza jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas wypełniania formularza",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas wypełniania formularza",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas wypełniania formularza",
    },
  },

  success: {
    title: "Wypełnianie formularza pomyślne",
    description: "Wszystkie elementy formularza zostały pomyślnie wypełnione",
  },
};
