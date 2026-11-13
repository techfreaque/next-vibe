import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "Newsletter",
  post: {
    title: "Wysyłka newslettera",
    titleShort: "Wysyłka",
    description:
      "Wyślij jednorazowy newsletter tylko do potwierdzonych subskrybentów. Próbny przebieg pokazuje liczby według języka. Wyślij teraz wysyła tylko ten newsletter, nic więcej.",
    container: {
      title: "Wysyłka newslettera",
      description:
        "Tylko potwierdzeni subskrybenci. Policz, zakolejkuj, wyślij.",
    },
    fields: {
      dryRun: {
        label: "Próbny przebieg",
        description:
          "Policz odbiorców ze zgodą według języka. Nic nie zapisuje, nic nie wysyła.",
      },
      send: {
        label: "Wyślij teraz",
        description:
          "Wyślij ten newsletter od razu do wszystkich odbiorców ze zgodą. Inne oczekujące kampanie zostają nietknięte.",
      },
    },
    response: {
      audience: "Odbiorcy ze zgodą",
      byLocale: "Odbiorcy według języka",
      scheduled: "Nowo zakolejkowane",
      alreadyPending: "Już w kolejce",
      cancelled: "Anulowane (brak zgody)",
      alreadySent: "Pominięte (już otrzymali)",
      duplicates: "Anulowane duplikaty",
      errors: "Błędy",
      sent: "Wysłane",
      sendSkipped: "Pominięte przy wysyłce (już otrzymali)",
      sendFailed: "Wysyłka nieudana",
    },
    success: {
      title: "Newsletter zakolejkowany",
      description:
        "Odbiorcy ze zgodą są w kolejce. Z opcją Wyślij teraz maile wychodzą w tym przebiegu.",
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
