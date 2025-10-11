import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Lista użytkowników",
  description: "Lista i wyszukiwanie użytkowników z filtrowaniem",
  category: "Użytkownicy",
  tag: "Lista",
  container: {
    title: "Lista użytkowników",
    description: "Wyszukaj i filtruj użytkowników",
  },
  fields: {
    limit: {
      label: "Limit",
      description: "Liczba użytkowników do zwrócenia",
      placeholder: "Wprowadź limit...",
    },
    page: {
      label: "Strona",
      description: "Numer strony dla paginacji",
      placeholder: "Wprowadź numer strony...",
    },
    offset: {
      label: "Przesunięcie",
      description: "Liczba użytkowników do pominięcia",
    },
    search: {
      label: "Wyszukaj",
      description: "Wyszukaj użytkowników po nazwie lub e-mailu",
      placeholder: "Wprowadź wyszukiwany termin...",
    },
    status: {
      label: "Filtr statusu",
      description: "Filtruj użytkowników według statusu",
      placeholder: "Wybierz status...",
    },
    role: {
      label: "Filtr ról",
      description: "Filtruj użytkowników według roli",
      placeholder: "Wybierz rolę...",
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
    title: "Tytuł",
    description: "Opis endpointu",
    form: {
      title: "Konfiguracja",
      description: "Skonfiguruj parametry",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi",
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
