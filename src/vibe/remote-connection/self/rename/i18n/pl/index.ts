import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  patch: {
    title: "Zmień nazwę tej instancji",
    titleShort: "Zmień nazwę",
    description: "Zaktualizuj nazwę wyświetlaną tej instancji",
    renaming: "Zmieniam nazwę…",
    newInstanceId: {
      label: "Nowa nazwa instancji",
      description:
        "Pod tą nazwą połączone instancje widzą ten serwer. Musi być unikalna, maks. 32 znaki.",
      placeholder: "hermes",
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
        description: "Nie znaleziono tożsamości instancji",
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
      description: "Nazwa instancji zmieniona pomyślnie",
    },
  },
};
