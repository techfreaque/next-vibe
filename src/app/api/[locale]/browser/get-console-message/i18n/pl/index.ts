import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Pobierz wiadomość konsoli",
  description: "Pobierz wiadomość konsoli według jej ID",
  form: {
    label: "Pobierz wiadomość konsoli",
    description: "Pobierz określoną wiadomość konsoli",
    fields: {
      msgid: {
        label: "ID wiadomości",
        description: "ID wiadomości konsoli z wylistowanych wiadomości konsoli",
        placeholder: "Wprowadź ID wiadomości",
      },
    },
  },
  response: {
    success: "Operacja pobierania wiadomości konsoli pomyślna",
    result: "Wynik pobierania wiadomości konsoli",
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
      description: "Wystąpił błąd sieci podczas pobierania wiadomości konsoli",
    },
    unauthorized: {
      title: "Nieautoryzowany",
      description: "Nie masz uprawnień do pobierania wiadomości konsoli",
    },
    forbidden: {
      title: "Zabronione",
      description: "Operacja pobierania wiadomości konsoli jest zabroniona",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Żądany zasób nie został znaleziony",
    },
    serverError: {
      title: "Błąd serwera",
      description:
        "Wystąpił wewnętrzny błąd serwera podczas pobierania wiadomości konsoli",
    },
    unknown: {
      title: "Nieznany błąd",
      description:
        "Wystąpił nieznany błąd podczas pobierania wiadomości konsoli",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które mogą zostać utracone",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt podczas pobierania wiadomości konsoli",
    },
  },
  success: {
    title: "Wiadomość konsoli pomyślnie pobrana",
    description: "Wiadomość konsoli została pomyślnie pobrana",
  },
};
