import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz uprawnienia wątku",
    description: "Pobierz listę moderatorów dla konkretnego wątku",
    container: {
      title: "Uprawnienia wątku",
    },
    threadId: {
      label: "ID wątku",
      description: "Unikalny identyfikator wątku",
    },
    response: {
      title: "Uprawnienia wątku",
      moderatorIds: {
        title: "ID moderatorów",
        description:
          "Lista identyfikatorów użytkowników, którzy mogą moderować ten wątek",
        content: "ID użytkownika",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane dane są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas pobierania uprawnień wątku",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby wyświetlić uprawnienia wątku",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do wyświetlania uprawnień tego wątku",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany wątek nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania uprawnień wątku",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt z bieżącym stanem",
      },
    },
    success: {
      title: "Sukces",
      description: "Uprawnienia wątku zostały pomyślnie pobrane",
    },
  },
  patch: {
    title: "Aktualizuj uprawnienia wątku",
    description: "Aktualizuj listę moderatorów dla konkretnego wątku",
    container: {
      title: "Aktualizuj uprawnienia wątku",
    },
    threadId: {
      label: "ID wątku",
      description: "Unikalny identyfikator wątku do aktualizacji",
    },
    permissions: {
      title: "Aktualizacja uprawnień",
      moderatorIds: {
        label: "ID moderatorów",
        description:
          "Lista identyfikatorów użytkowników, którzy mogą moderować ten wątek",
        item: {
          label: "ID użytkownika",
        },
      },
    },
    response: {
      title: "Zaktualizowane uprawnienia",
      message: {
        content: "Uprawnienia wątku zostały pomyślnie zaktualizowane",
      },
      moderatorIds: {
        title: "Obecni moderatorzy",
        description: "Zaktualizowana lista moderatorów tego wątku",
        content: "ID użytkownika",
      },
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Podane ID moderatorów są nieprawidłowe",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci podczas aktualizacji uprawnień wątku",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description:
          "Musisz być zalogowany, aby aktualizować uprawnienia wątku",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do aktualizacji uprawnień tego wątku",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany wątek nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji uprawnień wątku",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      unsaved: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt z bieżącym stanem",
      },
    },
    success: {
      title: "Sukces",
      description: "Uprawnienia wątku zostały pomyślnie zaktualizowane",
    },
  },
};
