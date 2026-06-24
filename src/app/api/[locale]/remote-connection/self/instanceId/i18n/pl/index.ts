import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  get: {
    title: "ID tej instancji",
    titleShort: "ID instancji",
    description: "Odczytaj identyfikator własnej instancji na tym urządzeniu",
    instanceId: {
      label: "ID instancji",
      description: "Identyfikator tej instancji",
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
        description: "Musisz być zalogowany, aby odczytać ID instancji",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do odczytania ID instancji",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono tożsamości instancji",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas odczytywania ID instancji",
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
      title: "ID instancji",
      description: "Ustalono ID tej instancji",
    },
  },
};
