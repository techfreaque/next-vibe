import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  patch: {
    title: "Zmień nazwę połączenia",
    description: "Zaktualizuj nazwę wyświetlaną połączenia zdalnego",
    instanceId: {
      label: "ID instancji",
      description: "Instancja do zmiany nazwy",
      placeholder: "hermes",
    },
    newInstanceId: {
      label: "Nowe ID instancji",
      description: "Nowy identyfikator tego połączenia",
      placeholder: "hermes-praca",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany, aby zmienić nazwę",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do zmiany nazwy",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono połączenia",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas zmiany nazwy",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt",
      },
    },
    success: {
      title: "Zmieniono nazwę",
      description: "Nazwa połączenia zmieniona pomyślnie",
    },
  },
};
