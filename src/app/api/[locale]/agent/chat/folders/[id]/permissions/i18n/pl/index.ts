import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Pobierz uprawnienia folderu",
    description: "Pobierz listę moderatorów dla konkretnego folderu",
    container: {
      title: "Uprawnienia folderu",
      description: "Wyświetl i zarządzaj uprawnieniami dostępu do folderu",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu",
    },
    response: {
      title: "Uprawnienia folderu",
      rolesView: {
        label: "Role wyświetlania",
        description: "Role, które mogą wyświetlać ten folder",
      },
      rolesManage: {
        label: "Role zarządzania",
        description: "Role, które mogą zarządzać ustawieniami folderu",
      },
      rolesCreateThread: {
        label: "Role tworzenia wątków",
        description: "Role, które mogą tworzyć wątki w tym folderze",
      },
      rolesPost: {
        label: "Role publikowania",
        description: "Role, które mogą publikować wiadomości",
      },
      rolesModerate: {
        label: "Role moderacyjne",
        description: "Role, które mogą moderować treści",
      },
      rolesAdmin: {
        label: "Role administratora",
        description: "Role z pełnym dostępem administracyjnym",
      },
      moderatorIds: {
        title: "ID moderatorów",
        description: "Lista identyfikatorów użytkowników, którzy mogą moderować ten folder",
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
        description: "Wystąpił błąd sieci podczas pobierania uprawnień folderu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby wyświetlić uprawnienia folderu",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do wyświetlania uprawnień tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas pobierania uprawnień folderu",
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
      description: "Uprawnienia folderu zostały pomyślnie pobrane",
    },
  },
  patch: {
    title: "Aktualizuj uprawnienia folderu",
    description: "Aktualizuj listę moderatorów dla konkretnego folderu",
    container: {
      title: "Aktualizuj uprawnienia folderu",
      description: "Modyfikuj uprawnienia dostępu do folderu",
    },
    id: {
      label: "ID folderu",
      description: "Unikalny identyfikator folderu do aktualizacji",
    },
    rolesView: {
      label: "Role wyświetlania",
      description: "Role, które mogą wyświetlać ten folder",
    },
    rolesManage: {
      label: "Role zarządzania",
      description: "Role, które mogą zarządzać ustawieniami folderu",
    },
    rolesCreateThread: {
      label: "Role tworzenia wątków",
      description: "Role, które mogą tworzyć wątki w tym folderze",
    },
    rolesPost: {
      label: "Role publikowania",
      description: "Role, które mogą publikować wiadomości",
    },
    rolesModerate: {
      label: "Role moderacyjne",
      description: "Role, które mogą moderować treści",
    },
    rolesAdmin: {
      label: "Role administratora",
      description: "Role z pełnym dostępem administracyjnym",
    },
    permissions: {
      title: "Aktualizacja uprawnień",
      moderatorIds: {
        label: "ID moderatorów",
        description: "Lista identyfikatorów użytkowników, którzy mogą moderować ten folder",
      },
    },
    response: {
      title: "Zaktualizowane uprawnienia",
      rolesView: {
        label: "Role wyświetlania",
        description: "Role, które mogą wyświetlać ten folder",
      },
      rolesManage: {
        label: "Role zarządzania",
        description: "Role, które mogą zarządzać ustawieniami folderu",
      },
      rolesCreateThread: {
        label: "Role tworzenia wątków",
        description: "Role, które mogą tworzyć wątki w tym folderze",
      },
      rolesPost: {
        label: "Role publikowania",
        description: "Role, które mogą publikować wiadomości",
      },
      rolesModerate: {
        label: "Role moderacyjne",
        description: "Role, które mogą moderować treści",
      },
      rolesAdmin: {
        label: "Role administratora",
        description: "Role z pełnym dostępem administracyjnym",
      },
      message: {
        content: "Uprawnienia folderu zostały pomyślnie zaktualizowane",
      },
      moderatorIds: {
        title: "Obecni moderatorzy",
        description: "Zaktualizowana lista moderatorów tego folderu",
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
        description: "Wystąpił błąd sieci podczas aktualizacji uprawnień folderu",
      },
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby aktualizować uprawnienia folderu",
      },
      forbidden: {
        title: "Zabroniony",
        description: "Nie masz uprawnień do aktualizacji uprawnień tego folderu",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Żądany folder nie został znaleziony",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił błąd podczas aktualizacji uprawnień folderu",
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
      description: "Uprawnienia folderu zostały pomyślnie zaktualizowane",
    },
  },
};
