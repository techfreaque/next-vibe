import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Konto",
  tags: {
    remoteConnection: "Połączenie zdalne",
  },
  widget: {
    title: "Sync zwrotny",
    description:
      "Endpoint systemowy. Wywoływany przez instancję inicjującą w celu synchronizacji zmian syncScope po drugiej stronie.",
    note: "Niewidoczne dla użytkownika — wywoływane automatycznie przy aktualizacji ustawień połączenia.",
  },
  patch: {
    title: "Aktualizuj połączenie zwrotne",
    titleShort: "Aktualizuj zwrotne",
    description:
      "Wywoływane przez inicjującą instancję w celu synchronizacji ustawień połączenia po drugiej stronie",
    syncScope: {
      label: "Zakres synchronizacji",
      description: "Które domeny danych synchronizować przez to połączenie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Sprawdź dane i spróbuj ponownie",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie udało się połączyć z serwerem",
      },
      unauthorized: {
        title: "Nie zalogowany",
        description: "Musisz być zalogowany, aby zaktualizować połączenie",
      },
      forbidden: {
        title: "Brak dostępu",
        description: "Nie masz uprawnień do aktualizacji tego połączenia",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono połączenia zwrotnego dla tej instancji",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji połączenia",
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
        description: "Wystąpił konflikt podczas aktualizacji połączenia",
      },
    },
    success: {
      title: "Połączenie zaktualizowane",
      description: "Ustawienia połączenia zwrotnego zostały zaktualizowane",
    },
  },
};
