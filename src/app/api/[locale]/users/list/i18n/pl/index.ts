import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "Lista użytkowników",
    description: "Wyszukaj i filtruj użytkowników",
    form: {
      title: "Zarządzanie użytkownikami",
      description: "Zarządzaj i filtruj użytkowników",
    },
    actions: {
      refresh: "Odśwież",
      refreshing: "Odświeżanie...",
    },
    // Search & Filters section
    searchFilters: {
      title: "Wyszukiwanie i filtry",
      description: "Wyszukaj i filtruj użytkowników według kryteriów",
    },
    search: {
      label: "Wyszukaj",
      description: "Wyszukaj użytkowników po nazwie lub e-mailu",
      placeholder: "Wyszukaj użytkowników...",
    },
    status: {
      label: "Status",
      description: "Filtruj użytkowników według statusu",
      placeholder: "Wybierz status...",
    },
    role: {
      label: "Rola",
      description: "Filtruj użytkowników według roli",
      placeholder: "Wybierz rolę...",
    },
    // Sorting section
    sortingOptions: {
      title: "Sortowanie",
      description: "Skonfiguruj sortowanie wyników",
    },
    sortBy: {
      label: "Sortuj według",
      description: "Pole do sortowania",
      placeholder: "Wybierz pole sortowania...",
    },
    sortOrder: {
      label: "Kolejność sortowania",
      description: "Kierunek sortowania",
      placeholder: "Wybierz kolejność sortowania...",
    },
    // Response section
    response: {
      title: "Użytkownicy",
      description: "Lista użytkowników spełniających kryteria",
      users: {
        id: "ID użytkownika",
        email: "E-mail",
        privateName: "Nazwa prywatna",
        publicName: "Nazwa publiczna",
        isActive: "Aktywny",
        emailVerified: "Zweryfikowany",
        createdAt: "Utworzono",
        updatedAt: "Zaktualizowano",
      },
      totalCount: "Łączna liczba użytkowników",
      pageCount: "Łączna liczba stron",
    },
    // Pagination section
    page: {
      label: "Strona",
    },
    limit: {
      label: "Na stronę",
    },
    // Error messages
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Musisz być zalogowany, aby przeglądać użytkowników",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Podano nieprawidłowe parametry",
      },
      forbidden: {
        title: "Dostęp zabroniony",
        description: "Nie masz uprawnień do przeglądania użytkowników",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie można pobrać użytkowników",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieoczekiwany błąd",
      },
      conflict: {
        title: "Błąd konfliktu",
        description: "Nie można wyświetlić użytkowników z powodu konfliktów",
      },
      network: {
        title: "Błąd sieci",
        description: "Nie można połączyć się z serwerem",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Nie znaleziono użytkowników",
      },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Masz niezapisane zmiany",
      },
    },
    success: {
      title: "Sukces",
      description: "Użytkownicy zostali pomyślnie pobrani",
    },
  },
  // Legacy keys for backward compatibility
  title: "Lista użytkowników",
  description: "Lista i wyszukiwanie użytkowników z filtrowaniem",
  category: "Użytkownicy",
  tag: "Lista",
  container: {
    title: "Lista użytkowników",
    description: "Wyszukaj i filtruj użytkowników",
  },
  response: {
    summary: {
      title: "Podsumowanie użytkowników",
      description: "Statystyki podsumowujące listę użytkowników",
    },
    users: {
      title: "Użytkownicy",
    },
    user: {
      title: "Użytkownik",
      id: "ID użytkownika",
      email: "E-mail",
      privateName: "Nazwa prywatna",
      publicName: "Nazwa publiczna",
      firstName: "Imię",
      lastName: "Nazwisko",
      company: "Firma",
      phone: "Telefon",
      isActive: "Aktywny",
      emailVerified: "E-mail zweryfikowany",
      role: "Rola",
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
    total: {
      content: "Łączna liczba użytkowników",
    },
    page: {
      content: "Bieżąca strona",
    },
    limit: {
      content: "Użytkowników na stronę",
    },
    totalPages: {
      content: "Łączna liczba stron",
    },
  },
  errors: {
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagane uwierzytelnienie",
    },
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry żądania",
    },
    forbidden: {
      title: "Dostęp zabroniony",
      description: "Dostęp zabroniony",
    },
    server: {
      title: "Błąd serwera",
      description: "Wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Nieznany błąd",
      description: "Wystąpił nieznany błąd",
    },
    network: {
      title: "Błąd sieci",
      description: "Wystąpił błąd sieci",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono zasobu",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt danych",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Masz niezapisane zmiany, które zostaną utracone",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wystąpił błąd wewnętrzny podczas listowania użytkowników",
    },
  },
  post: {
    title: "Lista",
    description: "Endpoint listy",
    form: {
      title: "Konfiguracja listy",
      description: "Skonfiguruj parametry listy",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi listy",
    },
    errors: {
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Wymagana autoryzacja",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Nieprawidłowe parametry żądania",
      },
      server: {
        title: "Błąd serwera",
        description: "Wystąpił wewnętrzny błąd serwera",
      },
      unknown: {
        title: "Nieznany błąd",
        description: "Wystąpił nieznany błąd",
      },
      network: {
        title: "Błąd sieci",
        description: "Wystąpił błąd sieci",
      },
      forbidden: {
        title: "Zabronione",
        description: "Dostęp zabroniony",
      },
      notFound: {
        title: "Nie znaleziono",
        description: "Zasób nie został znaleziony",
      },
      conflict: {
        title: "Konflikt",
        description: "Wystąpił konflikt danych",
      },
    },
    success: {
      title: "Sukces",
      description: "Operacja zakończona pomyślnie",
    },
  },
  enums: {
    userSortField: {
      createdAt: "Data utworzenia",
      updatedAt: "Data aktualizacji",
      email: "E-mail",
      privateName: "Nazwa prywatna",
      publicName: "Nazwa publiczna",
      firstName: "Imię",
      lastName: "Nazwisko",
      company: "Firma",
      lastLogin: "Ostatnie logowanie",
    },
    sortOrder: {
      asc: "Rosnąco",
      desc: "Malejąco",
    },
    userStatusFilter: {
      all: "Wszystkie",
      active: "Aktywny",
      inactive: "Nieaktywny",
      pending: "Oczekujący",
      suspended: "Zawieszony",
      emailVerified: "E-mail zweryfikowany",
      emailUnverified: "E-mail niezweryfikowany",
    },
    userStatus: {
      active: "Aktywny",
      inactive: "Nieaktywny",
      pending: "Oczekujący",
      suspended: "Zawieszony",
    },
    userRoleFilter: {
      all: "Wszystkie",
      user: "Użytkownik",
      public: "Publiczny",
      customer: "Klient",
      moderator: "Moderator",
      partnerAdmin: "Administrator Partnera",
      partnerEmployee: "Pracownik Partnera",
      admin: "Administrator",
      superAdmin: "Super Administrator",
    },
  },
};
