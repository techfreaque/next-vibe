import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Wyszukiwanie użytkowników",
  description: "Wyszukaj użytkowników",
  tag: "Wyszukiwanie użytkowników",
  container: {
    title: "Kontener wyszukiwania",
    description: "Kontener wyszukiwania użytkowników",
  },
  groups: {
    searchCriteria: {
      title: "Kryteria wyszukiwania",
      description: "Zdefiniuj parametry wyszukiwania",
    },
    filters: {
      title: "Zaawansowane filtry",
      description: "Dodatkowe opcje filtrowania",
    },
    pagination: {
      title: "Paginacja",
      description: "Kontroluj jak wyniki są paginowane",
    },
  },
  fields: {
    search: {
      label: "Zapytanie wyszukiwania",
      description: "Wprowadź terminy wyszukiwania",
      placeholder: "Szukaj użytkowników...",
      help: "Szukaj według nazwy, e-maila lub firmy",
      validation: {
        minLength: "Zapytanie wyszukiwania musi mieć co najmniej 2 znaki",
      },
    },
    roles: {
      label: "Role użytkowników",
      description: "Filtruj według ról użytkowników",
      placeholder: "Wybierz role...",
      help: "Wybierz jedną lub więcej ról do filtrowania",
    },
    status: {
      label: "Status użytkownika",
      description: "Filtruj według statusu użytkownika",
      placeholder: "Wybierz status...",
      help: "Filtruj według aktywnych, nieaktywnych lub wszystkich użytkowników",
    },
    limit: {
      label: "Limit",
      description: "Maksymalna liczba wyników",
      help: "Określ ile wyników zwrócić (domyślnie: 10)",
    },
    offset: {
      label: "Przesunięcie",
      description: "Liczba wyników do pominięcia",
      help: "Określ przesunięcie paginacji (domyślnie: 0)",
    },
  },
  status: {
    active: "Aktywny",
    inactive: "Nieaktywny",
    all: "Wszystkie",
  },
  response: {
    title: "Wyniki wyszukiwania",
    description: "Wyniki wyszukiwania użytkowników",
    success: {
      badge: "Sukces",
    },
    message: {
      content: "Komunikat wyniku wyszukiwania",
    },
    searchInfo: {
      title: "Informacje o wyszukiwaniu",
      description: "Szczegóły operacji wyszukiwania",
      searchTerm: "Termin wyszukiwania",
      appliedFilters: "Zastosowane filtry",
      searchTime: "Czas wyszukiwania",
      totalResults: "Całkowite wyniki",
    },
    pagination: {
      title: "Informacje o paginacji",
      description: "Informacje o nawigacji stron",
      currentPage: "Bieżąca strona",
      totalPages: "Całkowite strony",
      itemsPerPage: "Elementy na stronę",
      totalItems: "Całkowite elementy",
      hasMore: "Ma więcej",
      hasPrevious: "Ma poprzednie",
    },
    actions: {
      title: "Dostępne akcje",
      description: "Akcje, które możesz wykonać na wynikach",
      type: "Typ akcji",
      label: "Akcja",
      href: "Link",
    },
    users: {
      label: "Znalezieni użytkownicy",
      description: "Lista pasujących użytkowników",
      item: {
        title: "Użytkownik",
        description: "Informacje o koncie użytkownika",
      },
      id: "ID użytkownika",
      leadId: "ID lead",
      isPublic: "Publiczny",
      firstName: "Imię",
      lastName: "Nazwisko",
      company: "Firma",
      email: "E-mail",
      imageUrl: "Awatar",
      isActive: "Aktywny",
      emailVerified: "E-mail zweryfikowany",
      requireTwoFactor: "Wymagane 2FA",
      marketingConsent: "Zgoda marketingowa",
      userRoles: {
        item: {
          title: "Rola",
          description: "Przypisanie roli użytkownika",
        },
        id: "ID roli",
        role: "Rola",
      },
      createdAt: "Utworzono",
      updatedAt: "Zaktualizowano",
    },
  },
  columns: {
    firstName: "Imię",
    lastName: "Nazwisko",
    email: "E-mail",
    company: "Firma",
    userRoles: "Role",
  },
  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe parametry wyszukiwania",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wyszukiwanie nieautoryzowane",
    },
    internal: {
      title: "Błąd wewnętrzny",
      description: "Wewnętrzny błąd serwera",
    },
    unknown: {
      title: "Błąd nieznany",
      description: "Wystąpił nieznany błąd",
    },
    network: {
      title: "Błąd sieci",
      description: "Błąd połączenia sieciowego",
    },
    forbidden: {
      title: "Zabronione",
      description: "Dostęp zabroniony",
    },
    notFound: {
      title: "Nie znaleziono",
      description: "Nie znaleziono użytkowników",
    },
    conflict: {
      title: "Konflikt",
      description: "Wystąpił konflikt wyszukiwania",
    },
    unsavedChanges: {
      title: "Niezapisane zmiany",
      description: "Zmiany nie zostały zapisane",
    },
  },
  success: {
    title: "Wyszukiwanie pomyślne",
    description: "Wyszukiwanie zakończone pomyślnie",
  },
  post: {
    title: "Wyszukiwanie",
    description: "Endpoint wyszukiwania",
    form: {
      title: "Konfiguracja wyszukiwania",
      description: "Skonfiguruj parametry wyszukiwania",
    },
    response: {
      title: "Odpowiedź",
      description: "Dane odpowiedzi wyszukiwania",
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
};
