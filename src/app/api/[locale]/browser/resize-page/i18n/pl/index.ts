import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Zmień rozmiar strony",
  description: "Zmień rozmiar okna wybranej strony",
  form: {
    label: "Zmień rozmiar strony",
    description: "Zmień rozmiar strony do określonych wymiarów",
    fields: {
      width: {
        label: "Szerokość",
        description: "Szerokość strony w pikselach",
        placeholder: "Wprowadź szerokość",
      },
      height: {
        label: "Wysokość",
        description: "Wysokość strony w pikselach",
        placeholder: "Wprowadź wysokość",
      },
    },
  },
  response: {
    success: "Operacja zmiany rozmiaru strony pomyślna",
    result: "Wynik operacji zmiany rozmiaru strony",
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
      description: "Wystąpił błąd sieci podczas zmiany rozmiaru strony",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do zmiany rozmiaru stron",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja zmiany rozmiaru strony jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas zmiany rozmiaru strony",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd podczas zmiany rozmiaru strony",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas zmiany rozmiaru strony",
    },
  },
  success: {
    title: "Rozmiar strony pomyślnie zmieniony",
    description: "Rozmiar strony został pomyślnie zmieniony",
  },
};
