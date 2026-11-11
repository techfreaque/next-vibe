import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Newsletter",
  post: {
    title: "Wysyłka newslettera",
    titleShort: "Wysyłka",
    description:
      "Kolejkuje jednorazowy newsletter filtrowany zgodą do potwierdzonych subskrybentów. Dispatcher email-campaigns wysyła zakolejkowane wiersze.",
    container: {
      title: "Wysyłka newslettera",
      description: "Jednorazowe kolejkowanie filtrowane zgodą",
    },
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description:
          "Policz odbiorców, którzy wyrazili zgodę, bez kolejkowania e-maili.",
      },
    },
    response: {
      scheduled: "Zakolejkowane",
      skipped: "Pominięte",
      errors: "Błędy",
    },
    success: {
      title: "Newsletter zakolejkowany",
      description:
        "Odbiorcy filtrowani zgodą zostali zakolejkowani do następnego przebiegu dispatchera.",
    },
  },
  errors: {
    unauthorized: {
      title: "Nie zalogowano",
      description: "Zaloguj się, aby uruchomić wysyłkę newslettera.",
    },
    forbidden: {
      title: "Brak uprawnień",
      description: "Tylko administratorzy mogą uruchomić wysyłkę newslettera.",
    },
    server: {
      title: "Coś poszło nie tak",
      description:
        "Nie udało się uruchomić wysyłki newslettera. Spróbuj ponownie.",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieoczekiwany błąd.",
    },
    validation: {
      title: "Nieprawidłowe dane",
      description: "Sprawdź żądanie i spróbuj ponownie.",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono żądanego zasobu.",
    },
    conflict: {
      title: "Konflikt",
      description: "Ta akcja jest w konflikcie z bieżącym stanem.",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci. Spróbuj ponownie.",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany.",
    },
  },
};
