import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicCap: "public-cap",
    admin: "admin",
  },
  get: {
    title: "Pobierz publiczny dzienny limit",
    description:
      "Wyświetl dzisiejsze globalne wydatki i limit darmowych kredytów",
    container: {
      title: "Publiczny dzienny limit darmowych kredytów",
      description:
        "Globalny dzienny limit wydatków dla użytkowników niepłacących",
    },
    spendToday: {
      content: "Wydano dziś",
    },
    capAmount: {
      content: "Dzienny limit",
    },
    remainingToday: {
      content: "Pozostało dziś",
    },
    percentUsed: {
      content: "Procent wykorzystania",
    },
    lastResetAt: {
      content: "Ostatni reset",
    },
    capExceeded: {
      content: "Limit przekroczony",
    },
    success: {
      title: "Status limitu pobrany",
      description:
        "Status dziennego limitu darmowych kredytów pobrany pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konfiguracja limitu nie została znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się pobrać statusu limitu",
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
        description: "Wystąpił konflikt zasobów",
      },
    },
  },
  post: {
    title: "Zaktualizuj publiczny dzienny limit",
    description:
      "Zaktualizuj globalny dzienny limit kredytów dla użytkowników niepłacących",
    capAmount: {
      label: "Dzienny limit (kredyty)",
      description:
        "Maksymalna liczba kredytów, które użytkownicy niepłacący mogą łącznie wydać dziennie",
      placeholder: "np. 500",
    },
    message: {
      content: "Wynik",
    },
    success: {
      title: "Limit zaktualizowany",
      description: "Dzienny limit zaktualizowany pomyślnie",
    },
    errors: {
      validation: {
        title: "Błąd walidacji",
        description: "Limit musi być liczbą dodatnią",
      },
      network: {
        title: "Błąd sieci",
        description: "Połączenie sieciowe nie powiodło się",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagane uwierzytelnienie",
      },
      forbidden: {
        title: "Zabronione",
        description: "Wymagany dostęp administratora",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Konfiguracja limitu nie została znaleziona",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się zaktualizować limitu",
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
        description: "Wystąpił konflikt zasobów",
      },
    },
  },
  repository: {
    capExceeded:
      "Osiągnięto dzienny limit darmowych kredytów. Zarejestruj się lub spróbuj ponownie jutro.",
    getCapFailed: "Nie udało się pobrać konfiguracji limitu darmowych kredytów",
    updateCapFailed: "Nie udało się zaktualizować limitu darmowych kredytów",
    incrementFailed: "Nie udało się zarejestrować wydatków darmowych kredytów",
  },
};
