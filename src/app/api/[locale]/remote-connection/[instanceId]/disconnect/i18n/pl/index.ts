import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  delete: {
    title: "Rozłącz",
    description: "Rozłącz się ze swoją zdalną instancją",
    instanceId: {
      label: "ID instancji",
      description: "Instancja do rozłączenia",
      placeholder: "hermes",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe żądanie",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nie zalogowano",
        description: "Musisz być zalogowany, aby się rozłączyć",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do rozłączenia",
      },
      notFound: {
        title: "Niepołączono",
        description: "Brak połączenia zdalnego do rozłączenia",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas rozłączania",
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
      title: "Rozłączono",
      description: "Twoje połączenie zdalne zostało usunięte",
    },
  },
};
